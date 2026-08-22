import { useEffect } from 'react'
import { Badge } from '../components/Badge/Badge'
import { Button } from '../components/Button/Button'
import { Card } from '../components/Card/Card'
import { Icon, type IconName } from '../components/Icon/Icon'
import { OrganizationJsonLd, WebSiteJsonLd } from '../components/JsonLd/JsonLd'
import { Section } from '../components/Section/Section'
import { setPageMeta } from '../lib/seo'
import { siteEmail, siteTagline } from '../lib/site'
import styles from './Home.module.css'

/* ------------------------------------------------------------------ *
 * Content (realistic placeholder copy — see design-system/MASTER.md)
 * ------------------------------------------------------------------ */

const offerings: { icon: IconName; title: string; body: string }[] = [
  {
    icon: 'monitor',
    title: 'Web applications',
    body: 'Fast, scalable web apps and portals — dashboards, customer platforms, and internal tools built with React and modern TypeScript stacks.',
  },
  {
    icon: 'phone',
    title: 'Mobile applications',
    body: 'iOS and Android apps your customers actually enjoy using — from a focused MVP to a polished, published product.',
  },
  {
    icon: 'database',
    title: 'Custom software systems',
    body: 'Backend systems, integrations, and internal tooling that automate operations and scale with your data — no off-the-shelf compromises.',
  },
  {
    icon: 'bot',
    title: 'AI solutions & chatbots',
    body: 'AI chatbots and automation that do real work — support, lead qualification, and document processing, grounded in your own data.',
  },
]

const services: { title: string; body: string }[] = [
  {
    title: 'Custom software development',
    body: 'We design, build, and ship products end to end — owning the roadmap, the code, and the release.',
  },
  {
    title: 'AI & automation',
    body: 'Chatbots, copilots, and workflow automation that cut repetitive work and answer your customers around the clock.',
  },
  {
    title: 'Web & mobile platforms',
    body: 'Marketing sites, web apps, and mobile apps built on modern, maintainable stacks you won’t have to throw away.',
  },
  {
    title: 'Support & scale',
    body: 'We stay after launch — monitoring, maintenance, and performance tuning as your business grows.',
  },
]

const stats: [string, string][] = [
  ['40+', 'Products shipped'],
  ['12', 'Industries served'],
  ['98%', 'Client retention'],
  ['3', 'Senior engineers on every project'],
]

const clients = ['Northwind', 'Vantage Labs', 'Bluepeak', 'Kepler', 'Lumen & Co', 'Acme Corp']

const testimonials: { quote: string; author: string; role: string }[] = [
  {
    quote:
      'Himam rebuilt our customer portal in twelve weeks. It’s faster, cleaner, and our support tickets dropped by a third. They operate like an extension of our own team.',
    author: 'Dana Whitfield',
    role: 'VP of Product, Northwind',
  },
  {
    quote:
      'We came with an idea for an AI assistant; they came back with a shipped product and a plan to scale it. A rare mix of engineering depth and business sense.',
    author: 'Marcus Lee',
    role: 'Founder, Lumen & Co',
  },
]

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */

export default function Home() {
  useEffect(() => {
    setPageMeta({
      title: 'Himam — Software Engineering Studio',
      description: siteTagline,
    })
  }, [])

  return (
    <>
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      {/* 1. Hero */}
      <Section background="default" padding="lg">
        <div className={styles.hero}>
          <Badge variant="light" icon="layers">
            Himam — software engineering studio
          </Badge>
          <h1 className={styles.heroTitle}>Software that moves your business forward.</h1>
          <p className={styles.heroLead}>
            We’re a senior team of three engineers building web apps, mobile apps,
            custom systems, and AI chatbots — from first sketch to production, owned
            end to end.
          </p>
          <div className={styles.ctaRow}>
            <Button size="lg" to="/services">
              Explore our services
              <Icon name="arrow-right" size={16} aria-hidden="true" />
            </Button>
            <Button size="lg" variant="secondary" to="/contact">
              Start a project
            </Button>
          </div>
          <p className={styles.heroNote}>
            Small team. Senior engineers. No hand-offs, no middlemen.
          </p>
        </div>
      </Section>

      {/* 2. What we build */}
      <Section background="subtle" padding="lg">
        <header className={styles.sectionHead}>
          <p className={styles.sectionEyebrow}>What we build</p>
          <h2 className={styles.sectionTitle}>Four disciplines. One senior team.</h2>
          <p className={styles.sectionIntro}>
            Every project is led by experienced engineers. No juniors learning on your
            dime, no hand-offs between vendors — one accountable team from discovery to
            deploy.
          </p>
        </header>
        <div className={styles.cardGrid}>
          {offerings.map((offering) => (
            <Card key={offering.title} padding="lg" className={styles.buildCard}>
              <span className={styles.iconTile}>
                <Icon name={offering.icon} size={24} aria-hidden="true" />
              </span>
              <h3 className={styles.cardTitle}>{offering.title}</h3>
              <p className={styles.cardBody}>{offering.body}</p>
              <Button variant="ghost" size="sm" to="/services" className={styles.cardAction}>
                Learn more
                <Icon name="arrow-right" size={16} aria-hidden="true" />
              </Button>
            </Card>
          ))}
        </div>
      </Section>

      {/* 3. Services teaser */}
      <Section background="default" padding="lg">
        <header className={styles.sectionHead}>
          <p className={styles.sectionEyebrow}>Services</p>
          <h2 className={styles.sectionTitle}>What we can take off your plate.</h2>
          <p className={styles.sectionIntro}>
            One senior team covering the full lifecycle of your product — from the first
            conversation to years of steady operation.
          </p>
        </header>
        <div className={styles.serviceList}>
          {services.map((service) => (
            <div className={styles.serviceRow} key={service.title}>
              <div className={styles.serviceText}>
                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <p className={styles.serviceBody}>{service.body}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                to="/services"
                className={styles.serviceLink}
              >
                View
                <Icon name="arrow-up-right" size={16} aria-hidden="true" />
              </Button>
            </div>
          ))}
        </div>
        <div className={styles.ctaRow}>
          <Button variant="secondary" to="/services">
            View all services
          </Button>
        </div>
      </Section>

      {/* 4. Proof */}
      <Section background="navy" padding="lg">
        <header className={`${styles.sectionHead} ${styles.sectionHeadNavy}`}>
          <p className={styles.sectionEyebrow}>Proof</p>
          <h2 className={styles.sectionTitle}>Results, not promises.</h2>
          <p className={styles.sectionIntro}>
            A small studio lives on its track record. Here’s the short version.
          </p>
        </header>
        <div className={styles.statsGrid}>
          {stats.map(([number, label]) => (
            <div className={styles.stat} key={label}>
              <span className={styles.statNumber}>{number}</span>
              <span className={styles.statLabel}>{label}</span>
            </div>
          ))}
        </div>
        <div className={styles.clients}>
          <p className={styles.clientsLabel}>Trusted by teams at</p>
          <ul className={styles.clientList}>
            {clients.map((client) => (
              <li key={client} className={styles.clientMark}>
                {client}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 5. Testimonial teaser */}
      <Section background="default" padding="lg">
        <header className={styles.sectionHead}>
          <p className={styles.sectionEyebrow}>Testimonials</p>
          <h2 className={styles.sectionTitle}>What our clients say.</h2>
          <p className={styles.sectionIntro}>
            We’re proud of the relationships behind these words — and we’d be glad to
            introduce you.
          </p>
        </header>
        <div className={styles.testimonialGrid}>
          {testimonials.map((testimonial) => (
            <Card key={testimonial.author} variant="subtle" padding="lg">
              <p className={styles.quote}>{testimonial.quote}</p>
              <footer className={styles.quoteAuthor}>
                <span className={styles.authorName}>{testimonial.author}</span>
                <span className={styles.authorRole}>{testimonial.role}</span>
              </footer>
            </Card>
          ))}
        </div>
        <div className={styles.ctaRow}>
          <Button variant="secondary" to="/testimonials">
            Read more testimonials
            <Icon name="arrow-right" size={16} aria-hidden="true" />
          </Button>
        </div>
      </Section>

      {/* 6. Final CTA banner */}
      <Section background="navy" padding="lg">
        <div className={styles.ctaBanner}>
          <h2 className={styles.ctaTitle}>Let’s build something that lasts.</h2>
          <p className={styles.ctaLead}>
            Tell us what you’re working on. We’ll reply within one business day with
            honest feedback and a clear next step.
          </p>
          <div className={styles.ctaRow}>
            <Button size="lg" to="/contact">
              Start a project
              <Icon name="arrow-right" size={16} aria-hidden="true" />
            </Button>
            <Button size="lg" variant="secondary" href={`mailto:${siteEmail}`}>
              Email us
            </Button>
          </div>
          <p className={styles.ctaNote}>
            No pressure, no pitch — just a conversation about your product.
          </p>
        </div>
      </Section>
    </>
  )
}
