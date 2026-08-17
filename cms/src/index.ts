import type { Core } from '@strapi/strapi';
import { ensurePublicServiceRead, seedServices } from './seed';

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
   * - Grants the public role read-only access to the Service API.
   * - Seeds the four core services on first boot (disable with
   *   `SEED_DEMO_CONTENT=false` in cms/.env).
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await ensurePublicServiceRead(strapi);

    if (process.env.SEED_DEMO_CONTENT !== 'false') {
      await seedServices(strapi);
    } else {
      strapi.log.info('[seed] SEED_DEMO_CONTENT=false — skipping demo content.');
    }
  },
};
