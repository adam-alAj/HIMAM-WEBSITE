/**
 * Contact submission routes — the public API exposes exactly one endpoint:
 * POST /api/contact-submissions, handled by the custom `submit` action
 * (validation + honeypot + rate limiting). `auth: false` makes the route
 * public by design; the handler is the only gatekeeper.
 *
 * There are intentionally NO public GET routes — submissions contain lead
 * PII and are read only through the Strapi admin (Content Manager).
 */
export default {
  routes: [
    {
      method: 'POST',
      path: '/contact-submissions',
      handler: 'contact-submission.submit',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
