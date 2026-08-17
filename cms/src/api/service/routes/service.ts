/**
 * Service content API routes. Write routes exist but are protected — only
 * `find`/`findOne` are granted to the public role, so the frontend can read
 * published services without auth while writes stay behind admin auth.
 */
export default {
  routes: [
    {
      method: 'GET',
      path: '/services',
      handler: 'service.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/services/:id',
      handler: 'service.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/services',
      handler: 'service.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/services/:id',
      handler: 'service.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/services/:id',
      handler: 'service.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
