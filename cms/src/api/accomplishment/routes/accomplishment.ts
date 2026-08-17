/**
 * Accomplishment content API routes. Write routes exist but are protected — only
 * `find`/`findOne` are granted to the public role (see src/seed), so the
 * frontend can read published case studies without auth.
 */
export default {
  routes: [
    {
      method: 'GET',
      path: '/accomplishments',
      handler: 'accomplishment.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/accomplishments/:id',
      handler: 'accomplishment.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/accomplishments',
      handler: 'accomplishment.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/accomplishments/:id',
      handler: 'accomplishment.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/accomplishments/:id',
      handler: 'accomplishment.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
