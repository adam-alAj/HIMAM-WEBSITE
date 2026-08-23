/**
 * General API rate-limiting middleware (SRS §7.2: 100 requests/minute/IP).
 *
 * Protects public find/findOne endpoints. Does NOT apply to admin routes,
 * the contact-submission endpoint (which has its own stricter 5/hour/IP
 * limit), or authenticated requests.
 *
 * Uses in-memory sliding-window per IP. For a single Render instance this
 * is sufficient; if scaling to multiple instances, swap for a Redis-backed
 * store.
 */
import type { Core } from '@strapi/strapi';

const RATE_LIMIT = { max: 100, windowMs: 60 * 1000 }; // 100 per minute
const ipHits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (ipHits.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT.windowMs,
  );
  if (recent.length >= RATE_LIMIT.max) {
    ipHits.set(ip, recent);
    return true;
  }
  recent.push(now);
  ipHits.set(ip, recent);
  return false;
}

export default (config: Record<string, unknown>, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx: any, next: () => Promise<void>) => {
    // Skip rate limiting for admin routes, contact-submission (has its own limit),
    // and authenticated requests.
    const path = ctx.request.path ?? '';
    if (
      path.startsWith('/admin') ||
      path.includes('contact-submission') ||
      path.includes('content-type-builder') ||
      path.includes('users-permissions') ||
      (ctx.state as Record<string, unknown>)?.auth
    ) {
      return next();
    }

    const ip = ctx.request.ip ?? 'unknown';
    if (isRateLimited(ip)) {
      ctx.status = 429;
      ctx.body = {
        error: {
          message: 'Too many requests — please try again in a minute.',
        },
      };
      return;
    }

    await next();
  };
};
