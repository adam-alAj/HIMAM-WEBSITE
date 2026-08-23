/**
 * Contact submission controller.
 *
 * The public form endpoint (`POST /api/contact-submissions`) is the one place
 * the site accepts untrusted input, so it owns its own defense-in-depth:
 *
 *   1. Honeypot — if the hidden field is non-empty the request is dropped
 *      (we still return success so bots learn nothing).
 *   2. Rate limiting — simple in-memory per-IP window (fine for a single
 *      instance; swap for a Redis-backed limiter behind a proxy in prod).
 *   3. Server-side validation — required fields, email format, enum/budget
 *      and service checks, mirroring the client-side rules.
 *   4. Storage — the validated payload is created via the entity service and
 *      never exposed back through the public API (no public GET routes).
 *   5. Email notification — see `notifyTeam` below for the integration point.
 */
import { factories, type Core } from '@strapi/strapi';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


/** In-memory rate limit: max 5 submissions per IP per hour (SRS §6.3 / SEC-CNT-002). */
const RATE_LIMIT = { max: 5, windowMs: 60 * 60 * 1000 };
const ipHits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (ipHits.get(ip) ?? []).filter((timestamp) => now - timestamp < RATE_LIMIT.windowMs);
  if (recent.length >= RATE_LIMIT.max) {
    ipHits.set(ip, recent);
    return true;
  }
  recent.push(now);
  ipHits.set(ip, recent);
  return false;
}

/** Trim a string value; null when absent, empty, or over the length cap. */
function cleanString(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLength) return null;
  return trimmed;
}

/**
 * Email notification integration point.
 *
 * The submission is always stored in Strapi (admin → Content Manager →
 * Contact Submission), so no lead is ever lost. To additionally email the
 * team when a lead lands:
 *
 *   1. Install a provider SDK in cms/ — e.g. `npm --prefix cms install resend`
 *      (or nodemailer for SMTP, @sendgrid/mail, postmark, …).
 *   2. Set these in cms/.env (see cms/.env.example):
 *        CONTACT_NOTIFY_EMAIL=team@himam.dev      # recipient(s), comma-separated ok
 *        EMAIL_FROM=no-reply@himam.dev            # sender address
 *        EMAIL_PROVIDER_API_KEY=...               # provider secret
 *   3. Replace the TODO below with a real send, e.g. for Resend:
 *        import { Resend } from 'resend';
 *        const resend = new Resend(process.env.EMAIL_PROVIDER_API_KEY);
 *        await resend.emails.send({
 *          from: process.env.EMAIL_FROM,
 *          to: process.env.CONTACT_NOTIFY_EMAIL,
 *          subject: `New enquiry from ${entry.name}`,
 *          text: `${entry.name} (${entry.email}${entry.company ? `, ${entry.company}` : ''}) — ${entry.message}`,
 *        });
 *   4. Remove the "not configured" log.
 */
async function notifyTeam(strapi: Core.Strapi, entry: { id: number | string; name: string }): Promise<void> {
  if (process.env.CONTACT_NOTIFY_EMAIL && process.env.EMAIL_PROVIDER_API_KEY) {
    strapi.log.info(
      `[contact] notification for submission #${entry.id} queued — provider SDK not wired up yet (see notifyTeam).`
    );
    // TODO: send the email here (see doc comment above).
    return;
  }
  strapi.log.info(
    '[contact] email notification not configured — set CONTACT_NOTIFY_EMAIL and EMAIL_PROVIDER_API_KEY in cms/.env.'
  );
}

export default factories.createCoreController(
  'api::contact-submission.contact-submission',
  ({ strapi }) => ({
    /** Public form endpoint — see the module doc comment. */
    async submit(ctx) {
      const body = (ctx.request.body ?? {}) as Record<string, unknown>;

      // 1. Honeypot — silently pretend success, store nothing.
      if (body.honeypot) {
        return ctx.send({ ok: true });
      }

      // 2. Rate limit per IP.
      if (isRateLimited(ctx.request.ip ?? 'unknown')) {
        ctx.status = 429;
        ctx.body = {
          error: { message: 'Too many messages — please wait a few minutes and try again.' },
        };
        return;
      }

      // 3. Server-side validation (mirrors the client rules).
      const errors: Record<string, string> = {};

      const name = cleanString(body.name, 120);
      if (!name) {
        errors.name = 'Name is required.';
      } else if (name.length < 2) {
        errors.name = 'Name must be at least 2 characters.';
      }

      const email = cleanString(body.email, 254);
      if (!email) {
        errors.email = 'Email is required.';
      } else if (!EMAIL_RE.test(email)) {
        errors.email = 'Please provide a valid email address.';
      }

      const message = cleanString(body.message, 5000);
      if (!message) {
        errors.message = 'Message is required.';
      } else if (message.length < 10) {
        errors.message = 'Message must be at least 10 characters.';
      }

      const company = cleanString(body.company, 200);

      let budgetMax: number | null = null;
      if (body.budgetMax != null && body.budgetMax !== '') {
        const raw = Number(body.budgetMax);
        if (!Number.isFinite(raw) || !Number.isInteger(raw) || raw < 0) {
          errors.budgetMax = 'Please provide a valid maximum budget (a non-negative whole number).';
        } else {
          budgetMax = raw;
        }
      }

      let service: number | null = null;
      if (body.service != null && body.service !== '') {
        const raw = Number(body.service);
        if (!Number.isInteger(raw) || raw <= 0) {
          errors.service = 'Please choose a valid service.';
        } else {
          service = raw;
        }
      }

      if (Object.keys(errors).length > 0) {
        return ctx.badRequest('Please fix the highlighted fields.', { errors });
      }

      // Validate the service relation points at something real.
      if (service != null) {
        const existing = await strapi
          .query('api::service.service')
          .findOne({ where: { id: service } });
        if (!existing) {
          return ctx.badRequest('Please choose a valid service.', {
            errors: { service: 'That service is no longer available.' },
          });
        }
      }

      // 4. Store the validated submission.
      try {
        const entry = await strapi.entityService.create(
          'api::contact-submission.contact-submission',
          {
            data: {
              name: name as string,
              email: (email as string).toLowerCase(),
              company: company ?? undefined,
              service,
              budgetMax: budgetMax ?? undefined,
              message: message as string,
              source: ctx.request.headers.referer ?? undefined,
            },
          }
        );

        // 5. Optional email notification to the team.
        await notifyTeam(strapi, { id: entry.id, name: name as string });

        strapi.log.info(`[contact] stored submission #${entry.id} from ${email}.`);
        return ctx.created({ ok: true });
      } catch (error) {
        strapi.log.error('[contact] failed to store submission', error);
        return ctx.internalServerError(
          'Something went wrong storing your message. Please try again.'
        );
      }
    },
  })
);
