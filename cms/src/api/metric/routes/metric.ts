/**
 * Metric content API routes. Write routes exist but are protected — only
 * `find`/`findOne` are granted to the public role (see src/seed), so the
 * frontend can read metrics without auth.
 */
export default {
  routes: [
    {
      method: 'GET',
      path: '/metrics',
      handler: 'metric.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/metrics/:id',
      handler: 'metric.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/metrics',
      handler: 'metric.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/metrics/:id',
      handler: 'metric.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/metrics/:id',
      handler: 'metric.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
