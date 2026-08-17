/**
 * Demo seed content for the marketing site.
 *
 * - `seedServices` inserts the four core services (published) on first boot,
 *   so a fresh checkout has live content for the React frontend. Idempotent:
 *   it only runs when the collection is empty. Disable with
 *   `SEED_DEMO_CONTENT=false` in cms/.env.
 * - `ensurePublicServiceRead` grants the public role read-only access to the
 *   Service API (find + findOne). Idempotent; runs on every boot.
 *
 * Editing services afterwards happens in the Strapi admin — no code deploy.
 */
import type { Core, Schema } from '@strapi/strapi';

/** Icon names shared with the frontend Icon component (MASTER.md §14). */
const SERVICE_ICON_NAMES = [
  'monitor',
  'phone',
  'database',
  'bot',
  'code',
  'layers',
  'shield',
  'globe',
  'users',
  'message-square',
  'search',
  'calendar',
  'clock',
  'send',
  'mail',
  'map-pin',
] as const;

type ServiceIconName = (typeof SERVICE_ICON_NAMES)[number];

type Blocks = Schema.Attribute.BlocksValue;
type Block = Blocks[number];
type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface ServiceSeed {
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: Blocks; // Strapi blocks rich text
  icon: ServiceIconName;
  features: { text: string }[];
  startingFrom: string;
  order: number;
}

const textNode = (text: string) => ({ type: 'text' as const, text });

const p = (text: string): Block => ({
  type: 'paragraph',
  children: [textNode(text)],
});

const heading = (text: string, level: HeadingLevel): Block => ({
  type: 'heading',
  level,
  children: [textNode(text)],
});

const list = (items: string[]): Block => ({
  type: 'list',
  format: 'unordered',
  children: items.map((item) => ({
    type: 'list-item',
    children: [textNode(item)],
  })),
});

export const serviceSeeds: ServiceSeed[] = [
  {
    title: 'Custom Applications',
    slug: 'custom-applications',
    shortDescription:
      'Tailor-made web and mobile applications designed around your workflows — not around a template.',
    longDescription: [
      p(
        "Your business doesn't run on an off-the-shelf shape. We design and build applications around how you actually work — customer portals, dashboards, and internal tools that replace spreadsheets and email threads."
      ),
      p(
        'Every build starts with discovery: we map the workflows, agree the scope, and ship in short, reviewable cycles so you see progress — not surprises — every week.'
      ),
      heading('What you get', 3),
      list([
        'Product discovery and a written specification',
        'Modern, maintainable stack (React, TypeScript, PostgreSQL)',
        'CI/CD, hosting, and monitoring included from day one',
        'Documentation and a full team handover',
      ]),
    ],
    icon: 'monitor',
    features: [
      { text: 'Discovery & requirements workshop' },
      { text: 'Custom UI/UX design' },
      { text: 'Modern web stack (React, TypeScript)' },
      { text: 'Deployment, monitoring & support' },
    ],
    startingFrom: 'From $18,000',
    order: 1,
  },
  {
    title: 'Website Development',
    slug: 'website-development',
    shortDescription:
      'High-performance marketing sites and CMS-driven websites built to convert visitors into customers.',
    longDescription: [
      p(
        'Your website is your hardest-working salesperson. We build fast, accessible, conversion-focused sites on a CMS you can edit yourself — no developer required to change a headline, a case study, or a pricing table.'
      ),
      p(
        'Every site ships on the Himam design system: consistent typography, tokens, and components, so new pages look native and stay fast to build.'
      ),
      heading('Included in every build', 3),
      list([
        'CMS-driven content (Strapi) — edit copy without a deploy',
        'Conversion-focused copywriting and layout',
        'Core Web Vitals performance and SEO basics',
        'Analytics and privacy-compliant tracking',
      ]),
    ],
    icon: 'globe',
    features: [
      { text: 'CMS-driven content (Strapi)' },
      { text: 'Conversion-focused design' },
      { text: 'SEO & performance optimization' },
      { text: 'Analytics & tracking setup' },
    ],
    startingFrom: 'From $6,000',
    order: 2,
  },
  {
    title: 'Business Systems & Software',
    slug: 'business-systems',
    shortDescription:
      'Custom systems and integrations that automate operations — from internal platforms to data pipelines.',
    longDescription: [
      p(
        'Off-the-shelf software makes you adapt to it. We build systems that adapt to you: custom backends, integrations between the tools you already use, and internal platforms that remove manual work from your operations.'
      ),
      p(
        'Whether it is an ERP workflow, a reporting platform, or a pipeline moving data between systems, we deliver something your team actually wants to use.'
      ),
      heading('How we work', 3),
      list([
        'Process & workflow analysis before a line of code',
        'Custom backend and third-party integrations',
        'Data migrations and automated pipelines',
        'Admin dashboards and reporting',
      ]),
    ],
    icon: 'database',
    features: [
      { text: 'Process & workflow analysis' },
      { text: 'Custom backend & integrations' },
      { text: 'Data migrations & pipelines' },
      { text: 'Admin dashboards & reporting' },
    ],
    startingFrom: 'From $25,000',
    order: 3,
  },
  {
    title: 'AI Chatbots & Conversational AI',
    slug: 'ai-chatbots',
    shortDescription:
      'AI assistants grounded in your business — answering customers, qualifying leads, and automating support.',
    longDescription: [
      p(
        'Most chatbots sound like a FAQ page wearing a costume. Ours are grounded in your actual knowledge base and workflows, so they answer accurately, hand off to a human at the right moment, and learn from every conversation.'
      ),
      p(
        'We build assistants that do real work: deflect support tickets, qualify inbound leads, and guide customers through your product — with full control over what the AI can say and do.'
      ),
      heading('What you get', 3),
      list([
        'AI grounded in your documents and data',
        'Guardrails, human handoff, and escalation rules',
        'Integrations with your CRM and helpdesk',
        'Analytics on cost, deflection, and satisfaction',
      ]),
    ],
    icon: 'bot',
    features: [
      { text: 'AI grounded in your knowledge base' },
      { text: 'Lead qualification flows' },
      { text: '24/7 support automation' },
      { text: 'Human handoff & analytics' },
    ],
    startingFrom: 'From $12,000',
    order: 4,
  },
];

/**
 * Insert the four core services if the collection is empty. Creates them
 * already published so the public API serves them immediately.
 */
export async function seedServices(strapi: Core.Strapi): Promise<void> {
  const count = await strapi.query('api::service.service').count();

  if (count > 0) {
    strapi.log.info('[seed] services already present — skipping (set SEED_DEMO_CONTENT=false to disable).');
    return;
  }

  for (const seed of serviceSeeds) {
    await strapi.entityService.create('api::service.service', {
      data: {
        ...seed,
        publishedAt: new Date().toISOString(),
      },
    });
  }
  strapi.log.info(`[seed] created ${serviceSeeds.length} services.`);
}

/** Public actions granted for the Service API — read-only by design. */
const PUBLIC_SERVICE_ACTIONS = ['api::service.service.find', 'api::service.service.findOne'];

/**
 * Ensure the public role can read services without auth. Idempotent — only
 * creates the permission rows that are missing.
 */
export async function ensurePublicServiceRead(strapi: Core.Strapi): Promise<void> {
  const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
  });

  if (!publicRole) {
    strapi.log.warn('[seed] public role not found — cannot grant service read permission.');
    return;
  }

  let created = 0;
  for (const action of PUBLIC_SERVICE_ACTIONS) {
    const existing = await strapi
      .query('plugin::users-permissions.permission')
      .findOne({ where: { action, role: publicRole.id } });

    if (!existing) {
      await strapi
        .query('plugin::users-permissions.permission')
        .create({ data: { action, role: publicRole.id } });
      created += 1;
    }
  }
  if (created > 0) {
    strapi.log.info(`[seed] granted public read access to Service API (${created} permission${created > 1 ? 's' : ''}).`);
  }
}
