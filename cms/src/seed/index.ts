/**
 * Demo seed content for the marketing site.
 *
 * - `seedAll` inserts the demo content (services, team members,
 *   accomplishments, metrics, values, testimonials, faqs) — all published —
 *   on first boot, so a fresh checkout has live content for the React
 *   frontend. Idempotent: each collection is only seeded when empty.
 *   Testimonials are linked to the seeded services by slug. Disable entirely
 *   with `SEED_DEMO_CONTENT=false` in cms/.env.
 * - `ensurePublicRead` grants the public role read-only access (find +
 *   findOne) to every public content API. Idempotent; runs on every boot.
 *
 * Editing content afterwards happens in the Strapi admin — no code deploy.
 */
import type { Core, Modules, Schema, UID } from '@strapi/strapi';

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
 * Testimonials — linked to the seeded services by slug
 * ------------------------------------------------------------------ */

interface TestimonialSeed {
  clientName: string;
  clientRole: string;
  quote: string;
  rating: number | null;
  /** Slug of the seeded Service this quote relates to (null = general). */
  serviceSlug: string | null;
  order: number;
}

export const testimonialSeeds: TestimonialSeed[] = [
  {
    clientName: 'Dana Whitfield',
    clientRole: 'VP of Product, Northwind Logistics',
    quote:
      'Himam rebuilt our customer portal in twelve weeks. It’s faster, cleaner, and our support tickets dropped by a third. They operate like an extension of our own team.',
    rating: 5,
    serviceSlug: 'custom-applications',
    order: 1,
  },
  {
    clientName: 'Marcus Lee',
    clientRole: 'Founder, Lumen & Co',
    quote:
      'We came with an idea for an AI assistant; they came back with a shipped product and a plan to scale it. A rare mix of engineering depth and business sense.',
    rating: 5,
    serviceSlug: 'ai-chatbots',
    order: 2,
  },
  {
    clientName: 'Elena Kovac',
    clientRole: 'COO, Kepler Health',
    quote:
      'The intake portal paid for itself in the first quarter. Patients stopped re-filling the same forms, and our front desk finally stopped re-keying data by hand.',
    rating: 5,
    serviceSlug: 'custom-applications',
    order: 3,
  },
  {
    clientName: 'Daniel Osei',
    clientRole: 'Operations Director, Vantage Labs',
    quote:
      'Our order flow used to touch six systems and nine minutes of typing. Now it’s one pipeline and about ninety seconds. Month-end reconciliation takes an afternoon, not two days.',
    rating: 4,
    serviceSlug: 'business-systems',
    order: 4,
  },
  {
    clientName: 'Ingrid Halvorsen',
    clientRole: 'Head of E-commerce, Fjord & Co',
    quote:
      'We redesigned once before with an agency and got a brochure. This time we got a CMS we actually edit ourselves and a real, measurable lift in enquiries.',
    rating: 5,
    serviceSlug: 'website-development',
    order: 5,
  },
  {
    clientName: 'Tomás Rivera',
    clientRole: 'CTO, Bluepeak',
    quote:
      'Fast, accessible, and the team answered our questions in writing instead of on a call. The handover documentation alone was worth the price of admission.',
    rating: 4,
    serviceSlug: 'website-development',
    order: 6,
  },
];

/* ------------------------------------------------------------------ *
 * FAQs — grouped by category on the FAQ page
 * ------------------------------------------------------------------ */

type FaqCategory = 'Pricing' | 'Process' | 'Technology' | 'Support';

interface FaqSeed {
  question: string;
  answer: Blocks;
  category: FaqCategory;
  order: number;
}

export const faqSeeds: FaqSeed[] = [
  {
    question: 'How much does a project cost?',
    answer: [
      p(
        'Every project is quoted individually after a short discovery call, because scope — not hours — drives price. As a guide: marketing sites start around $6,000, custom applications around $18,000, and business systems from $25,000. You’ll get a fixed, written quote before any work starts, and we stick to it.'
      ),
    ],
    category: 'Pricing',
    order: 1,
  },
  {
    question: 'Do you work hourly or fixed-price?',
    answer: [
      p(
        'Fixed-price for defined scope. Once we agree the specification, the price is the price — no surprise invoices at the end. Ongoing support and change requests are quoted separately and transparently.'
      ),
    ],
    category: 'Pricing',
    order: 2,
  },
  {
    question: 'What does a quote include?',
    answer: [
      p(
        'Discovery and specification, design, development, testing, deployment, and a written handover with documentation. Hosting and monitoring can be included for an ongoing fee.'
      ),
    ],
    category: 'Pricing',
    order: 3,
  },
  {
    question: 'How long does a typical project take?',
    answer: [
      p(
        'A marketing site typically ships in 4–8 weeks; a custom application in 8–16 weeks depending on scope. You’ll see a working build within the first two weeks of any project — never a long silence.'
      ),
    ],
    category: 'Process',
    order: 1,
  },
  {
    question: 'How do you keep us updated?',
    answer: [
      p(
        'A written weekly update plus a live demo environment you can click through anytime. Decisions that affect cost or timeline are raised in writing before they happen — you’ll never discover them in an invoice.'
      ),
    ],
    category: 'Process',
    order: 2,
  },
  {
    question: 'What happens after launch?',
    answer: [
      p(
        'Every engagement includes a handover with documentation and a training session for your team. Most clients then take an ongoing support plan for monitoring, maintenance, and small change requests.'
      ),
    ],
    category: 'Process',
    order: 3,
  },
  {
    question: 'What tech stack do you use?',
    answer: [
      p(
        'React and TypeScript on the frontend, Node or PostgreSQL on the backend, Strapi for content, and everything containerised and deployed with CI/CD. We choose boring, well-supported technology — the kind your next developer can pick up without a rewrite.'
      ),
    ],
    category: 'Technology',
    order: 1,
  },
  {
    question: 'Do you work with our existing systems?',
    answer: [
      p(
        'Usually, yes. We’ve integrated with ERPs, CRMs, helpdesks, payment providers, and legacy databases. The first deliverable of any systems project is a written integration plan for the tools you already use.'
      ),
    ],
    category: 'Technology',
    order: 2,
  },
  {
    question: 'Can we edit content ourselves?',
    answer: [
      p(
        'Yes — that’s the point. All site content lives in Strapi, a CMS your team can log into and edit without touching code. We train whoever needs it as part of the handover.'
      ),
    ],
    category: 'Technology',
    order: 3,
  },
  {
    question: 'Who owns the code and the data?',
    answer: [
      p(
        'You do. Source code, documentation, and all data are yours from day one. There are no lock-ins and no hostage clauses — if you ever want to take the project elsewhere, it’s yours to take.'
      ),
    ],
    category: 'Technology',
    order: 4,
  },
  {
    question: 'Do you offer support after launch?',
    answer: [
      p(
        'Yes. Most clients take a monthly support plan covering monitoring, security updates, backups, and small change requests. Larger changes are scoped and quoted as they come up.'
      ),
    ],
    category: 'Support',
    order: 1,
  },
  {
    question: 'What happens if something breaks at 2am?',
    answer: [
      p(
        'With a support plan, monitoring alerts us first — usually before your customers notice. We respond to incidents within the hours agreed in your plan, and critical issues are treated as emergencies.'
      ),
    ],
    category: 'Support',
    order: 2,
  },
];

/* ------------------------------------------------------------------ *
 * Blog posts — authored by the seeded team members
 * ------------------------------------------------------------------ */

type BlogCategory = 'Engineering' | 'AI & Automation' | 'Process' | 'Company';

interface BlogPostSeed {
  title: string;
  slug: string;
  excerpt: string;
  body: Blocks;
  /** Name of the seeded TeamMember this post is attributed to. */
  authorName: string;
  category: BlogCategory;
  seoTitle: string;
  seoDescription: string;
  /** Staggered so the listing looks like a real publication history. */
  publishedAt: string;
}

const weeksAgo = (weeks: number) =>
  new Date(Date.now() - weeks * 7 * 24 * 60 * 60 * 1000).toISOString();

export const blogPostSeeds: BlogPostSeed[] = [
  {
    title: 'How we approach AI chatbot projects',
    slug: 'how-we-approach-ai-chatbot-projects',
    excerpt:
      'Most chatbots sound like a FAQ page wearing a costume. Here’s the process we use to build assistants that actually do work — grounded in your data, guarded where it matters, and handed off to a human at the right moment.',
    body: [
      p(
        'Everyone has a chatbot horror story: the support bot that answered every question with a link to the same help page, the “AI assistant” that was really a menu tree. We’ve built assistants that actually do work, and the difference isn’t the model — it’s the process around it.'
      ),
      heading('Start with what the model can’t do', 2),
      p(
        'Before we write a line of integration code, we write down every case where the assistant should refuse or hand off: refunds over a threshold, medical questions, anything a human needs to own. That list becomes the guardrails, and it’s the first thing the client reviews.'
      ),
      heading('Ground it in your data', 2),
      p(
        'An assistant is only as good as what it can cite. We connect it to your knowledge base, product docs, and order data — and every answer links to its source, so a customer can check the answer instead of trusting it.'
      ),
      heading('Measure deflection, not just conversations', 2),
      list([
        'Ticket volume before vs. after launch',
        'First-reply time for handled questions',
        'Handoff rate — and whether the AI escalated at the right moment',
        'Cost per resolved conversation',
      ]),
      p(
        'If the numbers don’t move in the first quarter, we change the scope — not the story.'
      ),
    ],
    authorName: 'Priya Raghavan',
    category: 'AI & Automation',
    seoTitle: 'How we approach AI chatbot projects — Himam',
    seoDescription:
      'How we build AI assistants that actually work — grounded in your data, with guardrails and human handoff.',
    publishedAt: weeksAgo(3),
  },
  {
    title: 'Choosing the right tech stack for your startup',
    slug: 'choosing-the-right-tech-stack-for-your-startup',
    excerpt:
      'Boring, well-supported technology isn’t a lack of ambition — it’s what lets a two-person team ship this quarter and a future developer maintain it next year. Our honest take on picking a stack.',
    body: [
      p(
        'Every startup we talk to has a different opinion on frameworks and one shared fear: picking the wrong one and paying for it later. Here’s the honest version — your stack barely matters at the start. Your ability to ship and change it does.'
      ),
      heading('The stack we default to', 2),
      list([
        'React and TypeScript for anything a human looks at',
        'Node.js and PostgreSQL for anything that stores data',
        'Strapi for content your team edits without code',
        'Containerised deploys with CI/CD from day one',
      ]),
      p(
        'We choose these because they’re boring: hiring is easy, documentation is endless, and the odds of the ecosystem disappearing are close to zero.'
      ),
      heading('How we’d choose differently', 2),
      p(
        'If you need heavy data processing, we’d reach for a specialist tool and isolate it behind an API. If you’re building a real-time product, we’d add the right pieces for that — but we’d still keep the core boring. The rule we give clients: exotic where it buys you something specific, boring everywhere else.'
      ),
    ],
    authorName: 'Jonas Bergström',
    category: 'Engineering',
    seoTitle: 'Choosing the right tech stack for your startup — Himam',
    seoDescription:
      'Why boring, well-supported technology is the right default for a startup — and how to pick the exceptions that actually earn their complexity.',
    publishedAt: weeksAgo(2),
  },
  {
    title: 'A day in the life of our team',
    slug: 'a-day-in-the-life-of-our-team',
    excerpt:
      'Three engineers, zero account managers. What a Tuesday actually looks like at Himam — from the morning review to shipping code the client sees the same day.',
    body: [
      p(
        'People ask what it’s like to work at a three-person studio. The honest answer: the same job as a big agency, minus the meetings about meetings, plus the requirement that everything we ship is ours.'
      ),
      heading('09:00 — Review what shipped yesterday', 2),
      p(
        'We start with the code, not a status dashboard. Every pull request gets a review from someone senior — which, at three people, means everyone. Comments are about behaviour and edge cases, not style.'
      ),
      heading('13:00 — Client builds', 2),
      p(
        'Afternoons are for client work: a portal rebuild, an AI assistant, a site migration. Each project gets a working build pushed to a demo environment the client can click through — so “progress” is something you can see, not a slide.'
      ),
      heading('17:00 — Ship something small', 2),
      p(
        'Every day ends with a small, verifiable improvement deployed to production. It keeps the release muscle warm, so when a real release lands, it’s unremarkable. That’s the point — our clients should find launching boring too.'
      ),
    ],
    authorName: 'Sana Qureshi',
    category: 'Company',
    seoTitle: 'A day in the life of our team — Himam',
    seoDescription:
      'What a Tuesday looks like at a three-person software studio — morning code review, client builds, and shipping something small every day.',
    publishedAt: weeksAgo(1),
  },
];

/* ------------------------------------------------------------------ *
 * Legal pages — starting templates, not final legal advice
 * ------------------------------------------------------------------ */

interface LegalPageSeed {
  title: string;
  slug: string;
  body: Blocks;
  lastUpdated: string;
}

export const legalPageSeeds: LegalPageSeed[] = [
  {
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    body: [
      heading('Template notice', 2),
      p(
        'This policy is a starting template, not legal advice. It will be reviewed by a lawyer before launch; until then, treat it as a draft.'
      ),
      heading('1. Who we are', 2),
      p(
        'Himam is a software engineering studio. This policy explains what we collect through this website, why we collect it, and what we do with it.'
      ),
      heading('2. What we collect', 2),
      p(
        'Information you send us through the Contact form: your name, your email address, optionally your company, the service you are interested in, an optional budget range, and the message itself. We also record the page you came from so we know which part of the site led to the enquiry.'
      ),
      p(
        'Technical information collected automatically: standard web analytics (pages visited, approximate region, device type, referring site) and any cookies described in section 4.'
      ),
      heading('3. Legal basis for processing', 2),
      p(
        '[NEEDS INPUT: HIMAM LEGAL TEAM — Confirm the applicable legal bases for processing under GDPR/UK GDPR. The following are preliminary placeholders based on the data categories collected:]'
      ),
      list([
        'Contact form submissions: processing is necessary for the performance of a contract (responding to your enquiry) or for taking steps at your request prior to entering into a contract',
        'Analytics data: processing is based on your consent (where cookies are non-essential) or our legitimate interest in understanding how the site is used',
        'Security data (rate limiting, honeypot): processing is based on our legitimate interest in preventing spam and abuse',
      ]),
      heading('4. Why we collect it', 2),
      list([
        'To reply to your enquiry and, if you ask, to follow up about it',
        'To understand which services and pages are useful, so we can improve the site',
        'To keep the site secure and prevent spam or abuse — including the honeypot and rate limits on the contact form',
      ]),
      heading('5. Cookies and analytics', 2),
      p(
        'We use a privacy-respecting analytics tool that does not rely on cross-site tracking cookies. Where cookies are used, they are limited to what is strictly necessary for the site to function or for the analytics tool itself, and we ask for consent before any non-essential cookies are set.'
      ),
      heading('6. Third parties', 2),
      p(
        '[NEEDS INPUT: HIMAM LEGAL TEAM — List the specific third-party services that process personal data. Based on the current infrastructure, these include:]'
      ),
      list([
        'Hosting and infrastructure providers (Vercel, Render) — for site hosting and CMS operation',
        'Content management system (Strapi) — for storing site content',
        'Email provider — for notifications and replies to enquiries',
        'Analytics provider — for site usage analytics (once configured)',
      ]),
      p(
        'Each provider receives only the data needed to provide its service and is contractually bound not to use it for anything else. We do not sell, rent, or trade personal data.'
      ),
      heading('7. International data transfers', 2),
      p(
        '[NEEDS INPUT: HIMAM LEGAL TEAM — Confirm whether personal data is transferred outside the UK/EEA, and if so, what safeguards are in place (e.g. Standard Contractual Clauses, adequacy decisions). The current infrastructure uses Vercel (US) and Render (US), which may involve international transfers.]'
      ),
      heading('8. How long we keep it', 2),
      p(
        'Contact submissions are kept until the enquiry is resolved and then deleted after 12 months — unless you become a client, in which case the details are kept as part of the engagement record.'
      ),
      p(
        'Analytics data is retained for [NEEDS INPUT: HIMAM LEGAL TEAM — confirm retention period, e.g. 26 months] in anonymised/aggregated form.'
      ),
      heading('9. Your rights', 2),
      p(
        'You have the right to:'
      ),
      list([
        'Access the personal data we hold about you',
        'Have your personal data corrected if it is inaccurate',
        'Have your personal data erased (the “right to be forgotten”)',
        'Restrict how we process your personal data',
        'Object to our processing of your personal data',
        'Request portability of your personal data',
      ]),
      p(
        'To exercise any of these rights, email us at hello@himam.dev. We will respond within 30 days.'
      ),
      heading('10. Right to withdraw consent', 2),
      p(
        'Where we rely on your consent to process personal data (for example, analytics cookies), you may withdraw that consent at any time by adjusting your cookie preferences or contacting us. Withdrawing consent will not affect the lawfulness of processing carried out before withdrawal.'
      ),
      heading('11. Right to lodge a complaint', 2),
      p(
        '[NEEDS INPUT: HIMAM LEGAL TEAM — Add the relevant supervisory authority details. For UK-based companies, this is the Information Commissioner\'s Office (ICO): https://ico.org.uk. For EU-based companies, identify the relevant national data protection authority.]'
      ),
      heading('12. Data security', 2),
      p(
        'We take appropriate technical and organisational measures to protect personal data against unauthorised access, alteration, disclosure, or destruction. These measures include:'
      ),
      list([
        'HTTPS encryption for all data in transit',
        'Access controls and authentication for the CMS admin',
        'Regular security updates and patches',
        'Rate limiting and spam protection on the contact form',
      ]),
      heading('13. Children\'s privacy', 2),
      p(
        'Our website is not directed at children under 16. We do not knowingly collect personal data from children. If you believe a child has provided us with personal data, please contact us and we will delete it.'
      ),
      heading('14. Changes to this policy', 2),
      p(
        'If this policy changes materially, we will update the date at the top of this page and, where required, notify you by email.'
      ),
      heading('15. Contact', 2),
      p('Questions about this policy: hello@himam.dev.'),
      heading('16. Effective date', 2),
      p('This policy is effective as of the date shown at the top of this page.'),
      heading('17. Data controller', 2),
      p(
        '[NEEDS INPUT: HIMAM LEGAL TEAM — Add the registered name and address of the data controller entity.]'
      ),
      p('Himam is the data controller responsible for your personal data.'),
      heading('18. Data processors', 2),
      p(
        '[NEEDS INPUT: HIMAM LEGAL TEAM — Add a complete list of data processors (third-party services that process personal data on behalf of Himam), including their purpose and location.]'
      ),
    ],
    lastUpdated: '2026-08-17',
  },
  {
    title: 'Terms of Service',
    slug: 'terms-of-service',
    body: [
      heading('Template notice', 2),
      p(
        'These terms are a starting template, not legal advice. They will be reviewed by a lawyer before launch; until then, treat them as a draft.'
      ),
      heading('1. About these terms', 2),
      p(
        'These terms govern the use of this website and the services Himam provides. By using the site or engaging us, you agree to them.'
      ),
      heading('2. Definitions', 2),
      p(
        '[NEEDS INPUT: HIMAM LEGAL TEAM — Add formal definitions for key terms used in these terms, including Agreement, Deliverables, Services, Client, Himam, Confidential Information, Intellectual Property, and any other defined terms.]'
      ),
      heading('3. The services', 2),
      p(
        'Himam provides software engineering services: custom applications, website development, business systems and integrations, and AI chatbots. Each engagement is governed by a written proposal and agreement that defines scope, deliverables, price, and timeline. Where these terms and the agreement conflict, the agreement wins.'
      ),
      heading('4. Proposals and pricing', 2),
      p(
        'Proposals are valid for 30 days. Quoted prices are fixed for the agreed scope. Changes to scope after the proposal is signed are handled as change requests with a written estimate.'
      ),
      heading('5. Payments', 2),
      p(
        'Invoices are payable within 14 days unless the agreement says otherwise. On fixed-price engagements we invoice a deposit (typically 30–50%) before work starts, with the balance due at milestones or on delivery as agreed.'
      ),
      heading('6. Client responsibilities', 2),
      list([
        'Provide access to the systems and materials needed for the work, on time',
        'Review and respond to deliverables within the response windows in the agreement',
        'Ensure you have the right to use any third-party content or data you provide',
      ]),
      heading('7. Cancellation and refund', 2),
      p(
        '[NEEDS INPUT: HIMAM LEGAL TEAM — Add cancellation and refund terms. Consider: cancellation notice periods, refunds for work not yet completed, non-refundable deposits, and any exceptions for specific engagement types.]'
      ),
      heading('8. Intellectual property', 2),
      p(
        'Once payment is received in full, you own the work we create for you: source code, designs, documentation, and content. We retain the right to use our general skills, and to reference the work in our portfolio unless the agreement says otherwise.'
      ),
      heading('9. Confidentiality', 2),
      p(
        'We keep your business information confidential and only use it to perform the engagement. On request, we will sign a mutual non-disclosure agreement before work starts.'
      ),
      heading('10. Warranties and liability', 2),
      p(
        'We deliver work that conforms to the agreed specification. Our total liability under any engagement is limited to the amount you paid us for that engagement, and we are not liable for indirect or consequential losses. Nothing in these terms limits liability that cannot be limited by law.'
      ),
      heading('11. Limitation of liability', 2),
      p(
        '[REQUIRES LEGAL REVIEW BEFORE PUBLICATION — SRS §4.8.18]' 
      ),
      p(
        '[NEEDS INPUT: HIMAM LEGAL TEAM — Add specific limitation of liability language. Consider: aggregate cap on liability, exclusion of indirect/consequential damages, carve-outs for IP infringement, confidentiality breaches, and gross negligence. The current warranty section (section 10) provides a basic framework but needs legal review for enforceability.]'
      ),
      heading('12. Indemnification', 2),
      p(
        '[NEEDS INPUT: HIMAM LEGAL TEAM — Add indemnification provisions. Consider whether each party indemnifies the other against third-party claims arising from: breach of terms, infringement of IP, breach of confidentiality, or negligence.]'
      ),
      heading('13. Termination', 2),
      p(
        'Either party may end an engagement with written notice. You pay for work completed up to the termination date, and we deliver everything produced so far.'
      ),
      heading('14. AI services', 2),
      p(
        '[REQUIRES LEGAL REVIEW BEFORE PUBLICATION — SRS §4.8.14]'
      ),
      p(
        '[NEEDS INPUT: HIMAM LEGAL TEAM — Add AI-specific terms covering: (1) nature of AI outputs and their reliability, (2) client responsibility for reviewing AI-generated content before use, (3) limitations on AI accuracy and potential for errors, (4) data handling for AI training/processing, (5) compliance with applicable AI regulations, and (6) disclaimers regarding AI decision-making.]'
      ),
      heading('15. Data protection', 2),
      p(
        'Each party will comply with applicable data protection laws. For details on how we handle personal data, see our Privacy Policy. [NEEDS INPUT: HIMAM LEGAL TEAM — Add specific data processing terms if required, including roles (controller/processor), sub-processing, international transfers, and data subject rights.]'
      ),
      heading('16. Third-party content', 2),
      p(
        'Our services may include or integrate with third-party software, APIs, or content. We are not responsible for the availability, accuracy, or terms of third-party services. You are responsible for complying with third-party terms and licensing requirements.'
      ),
      heading('17. Availability and service levels', 2),
      p(
        '[NEEDS INPUT: HIMAM LEGAL TEAM — Add availability commitments if any, or disclaimers regarding uptime guarantees. For ongoing support plans, reference the applicable service level agreement in the engagement agreement.]'
      ),
      heading('18. Dispute resolution', 2),
      p(
        '[NEEDS INPUT: HIMAM LEGAL TEAM — Add dispute resolution provisions. Consider: (1) informal resolution requirement (30-day notice), (2) mediation before litigation, (3) arbitration vs. court proceedings, and (4) location of dispute resolution.]'
      ),
      heading('19. Governing law', 2),
      p(
        'These terms are governed by the laws of [jurisdiction]. Any disputes are subject to the exclusive jurisdiction of its courts.'
      ),
      heading('20. Severability', 2),
      p(
        'If any provision of these terms is found to be invalid or unenforceable, the remaining provisions will continue in full force and effect.'
      ),
      heading('21. Entire agreement', 2),
      p(
        '[NEEDS INPUT: HIMAM LEGAL TEAM — Add entire agreement clause specifying that these terms, together with any engagement agreement, constitute the entire agreement and supersede prior discussions or agreements.]'
      ),
      heading('22. Amendments', 2),
      p(
        'We may update these terms from time to time. Material changes will be communicated by posting the updated terms on this page with a new effective date. Continued use of the site or services after changes constitutes acceptance of the updated terms.'
      ),
      heading('23. Assignment', 2),
      p(
        'Neither party may assign these terms without the prior written consent of the other party, except that either party may assign to an affiliate or in connection with a merger, acquisition, or sale of substantially all of its assets.'
      ),
      heading('24. Force majeure', 2),
      p(
        'Neither party will be liable for delays or failures in performance resulting from causes beyond its reasonable control, including natural disasters, pandemics, government actions, or internet disruptions.'
      ),
      heading('25. Severability (additional)', 2),
      p(
        'If any provision of these terms is held to be unenforceable, that provision will be modified to the minimum extent necessary to make it enforceable, and the remaining provisions will remain in effect.'
      ),
      heading('26. Contact', 2),
      p('Questions about these terms: hello@himam.dev.'),
    ],
    lastUpdated: '2026-08-17',
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
    // The spread of a generic seed type can't be proven assignable to the
    // union of entity inputs, so assert through unknown — the seed interfaces
    // above are the source of truth and are checked against the generated
    // content types by tsc at the call sites.
    const data = {
      ...seed,
      publishedAt: new Date().toISOString(),
    } as unknown as Modules.EntityService.Params.Data.Input<typeof uid>;
    await strapi.entityService.create(uid, { data });
  }
  strapi.log.info(`[seed] created ${seeds.length} ${label}.`);
}

/**
 * Insert the testimonials if the collection is empty, resolving each seed's
 * `serviceSlug` against the seeded services so the relation is real.
 */
async function seedTestimonials(strapi: Core.Strapi): Promise<void> {
  const uid = 'api::testimonial.testimonial';
  const count = await strapi.query(uid).count();

  if (count > 0) {
    strapi.log.info('[seed] testimonials already present — skipping.');
    return;
  }

  const slugs = [
    ...new Set(
      testimonialSeeds
        .map((seed) => seed.serviceSlug)
        .filter((slug): slug is string => Boolean(slug))
    ),
  ];
  const services = await strapi
    .query('api::service.service')
    .findMany({ where: { slug: { $in: slugs } } });
  const serviceIdBySlug = new Map(services.map((service) => [service.slug, service.id]));

  for (const seed of testimonialSeeds) {
    await strapi.entityService.create(uid, {
      data: {
        clientName: seed.clientName,
        clientRole: seed.clientRole,
        quote: seed.quote,
        rating: seed.rating ?? undefined,
        service: seed.serviceSlug ? (serviceIdBySlug.get(seed.serviceSlug) ?? null) : null,
        order: seed.order,
        publishedAt: new Date().toISOString(),
      },
    });
  }
  strapi.log.info(`[seed] created ${testimonialSeeds.length} testimonials.`);
}

/**
 * Insert the blog posts if the collection is empty, resolving each seed's
 * `authorName` against the seeded team members so the byline relation is real.
 */
async function seedBlogPosts(strapi: Core.Strapi): Promise<void> {
  const uid = 'api::blog-post.blog-post';
  const count = await strapi.query(uid).count();

  if (count > 0) {
    strapi.log.info('[seed] blog posts already present — skipping.');
    return;
  }

  const authorNames = [...new Set(blogPostSeeds.map((seed) => seed.authorName))];
  const authors = await strapi
    .query('api::team-member.team-member')
    .findMany({ where: { name: { $in: authorNames } } });
  const authorIdByName = new Map(authors.map((author) => [author.name, author.id]));

  for (const seed of blogPostSeeds) {
    await strapi.entityService.create(uid, {
      data: {
        title: seed.title,
        slug: seed.slug,
        excerpt: seed.excerpt,
        body: seed.body,
        category: seed.category,
        seoTitle: seed.seoTitle,
        seoDescription: seed.seoDescription,
        author: authorIdByName.get(seed.authorName) ?? null,
        publishedAt: seed.publishedAt,
      },
    });
  }
  strapi.log.info(`[seed] created ${blogPostSeeds.length} blog posts.`);
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
  await seedTestimonials(strapi);
  await seedCollection(strapi, 'api::faq.faq', 'faqs', faqSeeds);
  await seedBlogPosts(strapi);
  await seedCollection(strapi, 'api::legal-page.legal-page', 'legal pages', legalPageSeeds);
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
const PUBLIC_APIS = [
  'service',
  'team-member',
  'accomplishment',
  'metric',
  'value',
  'testimonial',
  'faq',
  'blog-post',
  'legal-page',
] as const;

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
