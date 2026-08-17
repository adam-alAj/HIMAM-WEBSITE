/**
 * Demo seed content for the marketing site.
 *
 * - `seedAll` inserts the demo content (services, team members,
 *   accomplishments, metrics, values) — all published — on first boot, so a
 *   fresh checkout has live content for the React frontend. Idempotent: each
 *   collection is only seeded when empty. Disable entirely with
 *   `SEED_DEMO_CONTENT=false` in cms/.env.
 * - `ensurePublicRead` grants the public role read-only access (find +
 *   findOne) to every public content API. Idempotent; runs on every boot.
 *
 * Editing content afterwards happens in the Strapi admin — no code deploy.
 */
import type { Core, Schema, UID } from '@strapi/strapi';

/* ------------------------------------------------------------------ *
 * Block helpers — Strapi "blocks" rich text
 * ------------------------------------------------------------------ */

type Blocks = Schema.Attribute.BlocksValue;
type Block = Blocks[number];
type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

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

/* ------------------------------------------------------------------ *
 * Services (Phase 4)
 * ------------------------------------------------------------------ */

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

interface ServiceSeed {
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: Blocks;
  icon: ServiceIconName;
  features: { text: string }[];
  startingFrom: string;
  order: number;
}

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

/* ------------------------------------------------------------------ *
 * Team members — the three founding engineers
 * ------------------------------------------------------------------ */

type TeamFocusArea = 'Frontend' | 'Backend' | 'AI' | 'Full-stack';

interface TeamMemberSeed {
  name: string;
  role: string;
  focusArea: TeamFocusArea;
  bio: Blocks;
  order: number;
}

export const teamMemberSeeds: TeamMemberSeed[] = [
  {
    name: 'Sana Qureshi',
    role: 'Co-founder & Frontend Engineer',
    focusArea: 'Frontend',
    bio: [
      p(
        'Sana spent nine years turning complicated internal tools into interfaces people actually use. Before Himam, she led the frontend team at a logistics startup and rebuilt a dispatch portal that field agents had stopped opening — within two months, daily active usage went from 31% to 88%.'
      ),
      p(
        'She is the reason every Himam project ships with a design system, keyboard support, and performance budgets. Her question on every build is the one that protects your investment: will a non-technical team member actually be able to use and maintain this?'
      ),
    ],
    order: 1,
  },
  {
    name: 'Jonas Bergström',
    role: 'Co-founder & Backend Engineer',
    focusArea: 'Backend',
    bio: [
      p(
        'Jonas is the systems half of the pair — PostgreSQL schemas, integrations, and the unglamorous plumbing that keeps data correct when it moves between five different tools. He spent eight years building payment and inventory systems at a Nordic e-commerce company, where the migration he designed moved two million orders without a reconciliation error.'
      ),
      p(
        'At Himam he writes the architecture docs, reviews every pull request, and designs the data models that outlive the contract. When a client later asks “can we add a field to that report?”, it is Jonas’s schema that makes the answer a day, not a project.'
      ),
    ],
    order: 2,
  },
  {
    name: 'Priya Raghavan',
    role: 'Co-founder & AI Engineer',
    focusArea: 'AI',
    bio: [
      p(
        'Priya builds AI that does real work instead of demo tricks. She spent six years at an enterprise software company building document-processing and search pipelines, then shipped her first customer-facing chatbot in 2022 — a support assistant that cut the team’s ticket volume by a third within a quarter.'
      ),
      p(
        'She is the reason every Himam AI project starts with a written answer to “what happens when the model is wrong?” — guardrails, human handoff, and honest scope are part of the build, not an afterthought.'
      ),
    ],
    order: 3,
  },
];

/* ------------------------------------------------------------------ *
 * Values — how we work
 * ------------------------------------------------------------------ */

interface ValueSeed {
  title: string;
  text: string;
  icon: ServiceIconName;
  order: number;
}

export const valueSeeds: ValueSeed[] = [
  {
    title: 'No hand-offs',
    text: 'Three senior engineers own your project from discovery to deploy. The person you pitch to is the person writing your code — no account managers, no juniors learning on your budget.',
    icon: 'users',
    order: 1,
  },
  {
    title: 'Written scope, weekly progress',
    text: 'You get a specification you can read and a working build every week. Surprises arrive in writing, before they cost you money.',
    icon: 'code',
    order: 2,
  },
  {
    title: 'Code that outlives the contract',
    text: 'Documentation, tests, and a full team handover are part of every engagement. When we leave, your team can actually run the thing.',
    icon: 'shield',
    order: 3,
  },
  {
    title: 'Straight answers',
    text: 'If something will cost more or take longer, you hear it before it happens — in plain language, with options, not excuses.',
    icon: 'message-square',
    order: 4,
  },
];

/* ------------------------------------------------------------------ *
 * Metrics — Accomplishments metrics band
 * ------------------------------------------------------------------ */

interface MetricSeed {
  value: string;
  label: string;
  order: number;
}

export const metricSeeds: MetricSeed[] = [
  { value: '40+', label: 'Products shipped', order: 1 },
  { value: '15+', label: 'Years combined experience', order: 2 },
  { value: '12', label: 'Industries served', order: 3 },
  { value: '98%', label: 'Client retention', order: 4 },
  { value: '3', label: 'Senior engineers on every project', order: 5 },
];

/* ------------------------------------------------------------------ *
 * Accomplishments — case studies (fictional but plausible)
 * ------------------------------------------------------------------ */

interface AccomplishmentSeed {
  projectName: string;
  slug: string;
  client: string;
  industry: string;
  year: string;
  metric: string;
  problem: Blocks;
  solution: Blocks;
  outcome: Blocks;
  order: number;
}

export const accomplishmentSeeds: AccomplishmentSeed[] = [
  {
    projectName: 'Dispatch portal rebuild',
    slug: 'dispatch-portal-rebuild',
    client: 'Northwind Logistics',
    industry: 'Logistics',
    year: '2024',
    metric: '88% daily active field staff (up from 31%)',
    problem: [
      p(
        'Field agents had stopped using the 10-year-old dispatch portal. Dispatchers were back to whiteboards and phone calls, and management had no visibility into what was actually happening on the road.'
      ),
    ],
    solution: [
      p(
        'We rebuilt the portal as a mobile-first React app with offline support for the yard, a shared board that dispatchers actually trust, and an API that feeds completed jobs straight into the company’s existing accounting system.'
      ),
    ],
    outcome: [
      p(
        'Daily active usage went from 31% to 88% of field staff within two months, and dispatchers report reclaiming about ninety minutes a day that used to go to phone tag and re-entry.'
      ),
    ],
    order: 1,
  },
  {
    projectName: 'AI support assistant',
    slug: 'ai-support-assistant',
    client: 'Lumen & Co',
    industry: 'E-commerce',
    year: '2024',
    metric: '38% fewer support tickets in Q1',
    problem: [
      p(
        'A six-person support team was drowning in repeat questions about order status and returns, and average first-reply time had crept past fourteen hours during peak season.'
      ),
    ],
    solution: [
      p(
        'We built a support assistant grounded in Lumen’s help centre and order system. It answers order-status questions directly, drafts return labels, and hands off to a human the moment a customer asks for something it cannot do.'
      ),
    ],
    outcome: [
      p(
        'First-reply time dropped to under ten minutes for the questions the assistant handles, and ticket volume fell by more than a third in the first quarter — without adding headcount.'
      ),
    ],
    order: 2,
  },
  {
    projectName: 'Inventory system integration',
    slug: 'inventory-system-integration',
    client: 'Vantage Labs',
    industry: 'Manufacturing',
    year: '2023',
    metric: 'Order processing: 9 minutes → 90 seconds',
    problem: [
      p(
        'Orders moved between a web store, a legacy ERP, and spreadsheets maintained by hand. Every order touched six systems and took nine minutes of data entry — and errors were usually found by customers, not by the company.'
      ),
    ],
    solution: [
      p(
        'We built a single integration layer that moves orders between the store and the ERP automatically, with a reconciliation dashboard that flags mismatches the same day instead of at month-end.'
      ),
    ],
    outcome: [
      p(
        'Order processing dropped from nine minutes to about ninety seconds, and month-end reconciliation went from two days of manual work to a scheduled report.'
      ),
    ],
    order: 3,
  },
  {
    projectName: 'Patient intake platform',
    slug: 'patient-intake-platform',
    client: 'Kepler Health',
    industry: 'Healthcare',
    year: '2022',
    metric: '70% faster patient onboarding',
    problem: [
      p(
        'Patients filled in the same paper forms at every visit, staff re-keyed the data into three different systems, and new-patient onboarding took close to an hour.'
      ),
    ],
    solution: [
      p(
        'We built a patient-facing intake portal with smart conditional forms, connected it to their practice-management and EHR systems, and made the whole flow work on a phone.'
      ),
    ],
    outcome: [
      p(
        'Onboarding time for new patients fell by two-thirds, and the practice eliminated roughly twelve thousand manual data-entry records a month.'
      ),
    ],
    order: 4,
  },
];

/* ------------------------------------------------------------------ *
 * Seeding
 * ------------------------------------------------------------------ */

/**
 * Insert `seeds` into a collection if it is empty. Creates them already
 * published so the public API serves them immediately.
 */
async function seedCollection<T>(
  strapi: Core.Strapi,
  uid: UID.ContentType,
  label: string,
  seeds: T[]
): Promise<void> {
  const count = await strapi.query(uid).count();

  if (count > 0) {
    strapi.log.info(`[seed] ${label} already present — skipping.`);
    return;
  }

  for (const seed of seeds) {
    await strapi.entityService.create(uid, {
      data: {
        ...seed,
        publishedAt: new Date().toISOString(),
      },
    });
  }
  strapi.log.info(`[seed] created ${seeds.length} ${label}.`);
}

/** Seed every demo collection on first boot (disable with SEED_DEMO_CONTENT=false). */
export async function seedAll(strapi: Core.Strapi): Promise<void> {
  await seedCollection(strapi, 'api::service.service', 'services', serviceSeeds);
  await seedCollection(strapi, 'api::team-member.team-member', 'team members', teamMemberSeeds);
  await seedCollection(
    strapi,
    'api::accomplishment.accomplishment',
    'accomplishments',
    accomplishmentSeeds
  );
  await seedCollection(strapi, 'api::metric.metric', 'metrics', metricSeeds);
  await seedCollection(strapi, 'api::value.value', 'values', valueSeeds);
}

/* ------------------------------------------------------------------ *
 * Public permissions — read-only by design
 * ------------------------------------------------------------------ */

/**
 * Content APIs the public role can read. Each entry is both the API folder
 * name and the content-type singular name, so the permission actions follow
 * the `api::<name>.<name>.find` / `.findOne` pattern. Writes stay behind
 * admin auth — the frontend never writes.
 */
const PUBLIC_APIS = ['service', 'team-member', 'accomplishment', 'metric', 'value'] as const;

/**
 * Ensure the public role can read the listed content APIs without auth.
 * Idempotent — only creates the permission rows that are missing.
 */
export async function ensurePublicRead(strapi: Core.Strapi): Promise<void> {
  const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
  });

  if (!publicRole) {
    strapi.log.warn('[seed] public role not found — cannot grant public read permissions.');
    return;
  }

  const actions = PUBLIC_APIS.flatMap((api) => [
    `api::${api}.${api}.find`,
    `api::${api}.${api}.findOne`,
  ]);

  let created = 0;
  for (const action of actions) {
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
    strapi.log.info(
      `[seed] granted public read access to ${created} content API action${created > 1 ? 's' : ''}.`
    );
  }
}
