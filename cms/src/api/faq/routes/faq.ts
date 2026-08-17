/**
 * FAQ content API routes. Write routes exist but are protected — only
 * `find`/`findOne` are granted to the public role (see src/seed), so the
 * frontend can read published FAQs without auth.
 */
export default {
  routes: [
    {
      method: 'GET',
      path: '/faqs',
      handler: 'faq.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/faqs/:id',
      handler: 'faq.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/faqs',
      handler: 'faq.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/faqs/:id',
      handler: 'faq.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/faqs/:id',
      handler: 'faq.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
