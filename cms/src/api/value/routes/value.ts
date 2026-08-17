/**
 * Value content API routes. Write routes exist but are protected — only
 * `find`/`findOne` are granted to the public role (see src/seed), so the
 * frontend can read values without auth.
 */
export default {
  routes: [
    {
      method: 'GET',
      path: '/values',
      handler: 'value.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/values/:id',
      handler: 'value.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/values',
      handler: 'value.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/values/:id',
      handler: 'value.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/values/:id',
      handler: 'value.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
