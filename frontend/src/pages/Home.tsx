import { useCallback, useEffect, useState } from 'react'
import { Badge } from '../components/Badge/Badge'
import { Button } from '../components/Button/Button'
import { Card } from '../components/Card/Card'
import { Icon, type IconName } from '../components/Icon/Icon'
import { OrganizationJsonLd, WebSiteJsonLd } from '../components/JsonLd/JsonLd'
import { Section } from '../components/Section/Section'
import { Skeleton } from '../components/Skeleton/Skeleton'
import {
  fetchMetrics,
  fetchServices,
  fetchTestimonials,
  type Metric,
  type Service,
  type Testimonial,
} from '../lib/cms'
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

type FetchState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; metrics: Metric[]; services: Service[]; testimonials: Testimonial[] }

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */

export default function Home() {
  const [state, setState] = useState<FetchState>({ status: 'loading' })

  const load = useCallback(async () => {
    setState({ status: 'loading' })
    try {
      const [metrics, services, testimonials] = await Promise.all([
        fetchMetrics(),
        fetchServices(),
        fetchTestimonials(),
      ])
      setState({ status: 'ready', metrics, services, testimonials })
    } catch {
      setState({ status: 'error' })
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

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
            We're a senior team of three engineers building web apps, mobile apps,
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

      {/* 3. Services teaser — CMS-driven */}
      <Section background="default" padding="lg">
        <header className={styles.sectionHead}>
          <p className={styles.sectionEyebrow}>Services</p>
          <h2 className={styles.sectionTitle}>What we can take off your plate.</h2>
          <p className={styles.sectionIntro}>
            One senior team covering the full lifecycle of your product — from the first
            conversation to years of steady operation.
          </p>
        </header>
        {state.status === 'loading' && (
          <div className={styles.serviceList}>
            {[1, 2, 3, 4].map((n) => (
              <div className={styles.serviceRow} key={n}>
                <div className={styles.serviceText}>
                  <Skeleton width="60%" height={20} />
                  <Skeleton width="100%" height={14} />
                </div>
              </div>
            ))}
          </div>
        )}
        {state.status === 'ready' && (
          <div className={styles.serviceList}>
            {state.services.map((service) => (
              <div className={styles.serviceRow} key={service.documentId}>
                <div className={styles.serviceText}>
                  <h3 className={styles.serviceTitle}>{service.title}</h3>
                  <p className={styles.serviceBody}>{service.shortDescription}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  to={`/services/${service.slug}`}
                  className={styles.serviceLink}
                >
                  View
                  <Icon name="arrow-up-right" size={16} aria-hidden="true" />
                </Button>
              </div>
            ))}
          </div>
        )}
        <div className={styles.ctaRow}>
          <Button variant="secondary" to="/services">
            View all services
          </Button>
        </div>
      </Section>

      {/* 4. Proof — metrics from CMS */}
      <Section background="navy" padding="lg">
        <header className={`${styles.sectionHead} ${styles.sectionHeadNavy}`}>
          <p className={styles.sectionEyebrow}>Proof</p>
          <h2 className={styles.sectionTitle}>Results, not promises.</h2>
          <p className={styles.sectionIntro}>
            A small studio lives on its track record. Here's the short version.
          </p>
        </header>
        <div className={styles.statsGrid}>
          {state.status === 'loading' &&
            [1, 2, 3, 4].map((n) => (
              <div className={styles.stat} key={n}>
                <Skeleton width={64} height={36} />
                <Skeleton width={100} height={14} />
              </div>
            ))}
          {state.status === 'ready' &&
            state.metrics.map((metric) => (
              <div className={styles.stat} key={metric.documentId}>
                <span className={styles.statNumber}>{metric.value}</span>
                <span className={styles.statLabel}>{metric.label}</span>
              </div>
            ))}
        </div>
      </Section>

      {/* 5. Testimonial teaser — CMS-driven */}
      <Section background="default" padding="lg">
        <header className={styles.sectionHead}>
          <p className={styles.sectionEyebrow}>Testimonials</p>
          <h2 className={styles.sectionTitle}>What our clients say.</h2>
          <p className={styles.sectionIntro}>
            We're proud of the relationships behind these words — and we'd be glad to
            introduce you.
          </p>
        </header>
        <div className={styles.testimonialGrid}>
          {state.status === 'loading' &&
            [1, 2].map((n) => (
              <Card key={n} variant="subtle" padding="lg">
                <Skeleton width="100%" height={60} />
                <Skeleton width="40%" height={14} />
                <Skeleton width="30%" height={12} />
              </Card>
            ))}
          {state.status === 'ready' &&
            state.testimonials.slice(0, 2).map((testimonial) => (
              <Card key={testimonial.documentId} variant="subtle" padding="lg">
                <p className={styles.quote}>"{testimonial.quote}"</p>
                <footer className={styles.quoteAuthor}>
                  <span className={styles.authorName}>{testimonial.clientName}</span>
                  <span className={styles.authorRole}>{testimonial.clientRole}</span>
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
          <h2 className={styles.ctaTitle}>Let's build something that lasts.</h2>
          <p className={styles.ctaLead}>
            Tell us what you're working on. We'll reply within one business day with
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
