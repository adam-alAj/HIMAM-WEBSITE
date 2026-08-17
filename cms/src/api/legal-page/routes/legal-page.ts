/**
 * Legal page content API routes. Write routes exist but are protected — only
 * `find`/`findOne` are granted to the public role (see src/seed), so the
 * frontend can read published legal pages without auth.
 */
export default {
  routes: [
    {
      method: 'GET',
      path: '/legal-pages',
      handler: 'legal-page.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/legal-pages/:id',
      handler: 'legal-page.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/legal-pages',
      handler: 'legal-page.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/legal-pages/:id',
      handler: 'legal-page.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/legal-pages/:id',
      handler: 'legal-page.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
