/**
 * Legal page controller — standard core controller. Public access is scoped to
 * `find`/`findOne` via the users-permissions public role (see src/seed).
 */
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::legal-page.legal-page');
