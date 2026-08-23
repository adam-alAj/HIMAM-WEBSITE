import type { Core } from '@strapi/strapi';

const config: Core.Config.Middlewares = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  // General API rate limiting: 100 requests/minute/IP (SRS §7.2).
  // Skips admin routes, contact-submission (has its own 5/hour/IP limit),
  // and authenticated requests.
  {
    name: 'global::rate-limit',
    config: {},
  },
];

export default config;
