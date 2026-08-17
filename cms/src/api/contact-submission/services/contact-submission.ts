/**
 * Contact submission service — standard core service. Public reads are never
 * exposed (see routes); the admin Content Manager uses this service to list
 * and manage leads.
 */
import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::contact-submission.contact-submission');
