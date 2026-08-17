/**
 * Testimonial content API routes. Write routes exist but are protected — only
 * `find`/`findOne` are granted to the public role (see src/seed), so the
 * frontend can read published testimonials without auth.
 */
export default {
  routes: [
    {
      method: 'GET',
      path: '/testimonials',
      handler: 'testimonial.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/testimonials/:id',
      handler: 'testimonial.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/testimonials',
      handler: 'testimonial.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/testimonials/:id',
      handler: 'testimonial.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/testimonials/:id',
      handler: 'testimonial.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
