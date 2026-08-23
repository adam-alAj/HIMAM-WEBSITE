import type { Core } from '@strapi/strapi';

/**
 * Strapi admin configuration.
 *
 * Security posture per SRS §7.1–§7.3:
 * - JWT auth via ADMIN_JWT_SECRET (§7.3)
 * - API token salt (§7.3)
 * - Transfer token salt (§7.3)
 * - Encryption key for encrypted fields (§7.1)
 * - Session timeout: 30 minutes via ADMIN_JWT_EXPIRATION env var (§7.3)
 * - Password policy: Strapi 5 default enforces strong passwords;
 *   the team should also enforce 12+ char minimum in the admin panel
 *   (Settings → Administration Panel → Registration) before launch.
 *
 * Admin JWT expiration is controlled by the ADMIN_JWT_EXPIRATION env var
 * (in seconds). Set to 1800 (= 30 minutes) in cms/.env. If unset,
 * Strapi defaults to 24h — override for production.
 */
const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Admin => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET')!,
  },
  apiToken: {
    salt: env('API_TOKEN_SALT')!,
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT')!,
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY')!,
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
    docLinks: env.bool('FLAG_DOC_LINKS', true),
  },
});

export default config;
