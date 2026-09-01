import type { Core } from '@strapi/strapi';
import { ensurePublicRead, seedAll } from './seed/index.js';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * - Grants the public role read-only access to every content API
   *   (services, team members, accomplishments, metrics, values).
   * - Seeds demo content on first boot (disable with
   *   `SEED_DEMO_CONTENT=false` in cms/.env).
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await ensurePublicRead(strapi);

    if (process.env.SEED_DEMO_CONTENT !== 'false') {
      await seedAll(strapi);
    } else {
      strapi.log.info('[seed] SEED_DEMO_CONTENT=false — skipping demo content.');
    }
  },
};
