import { useCallback, useEffect, useState } from 'react'
import { Button } from '../components/Button/Button'
import { Icon } from '../components/Icon/Icon'
import { Section } from '../components/Section/Section'
import { ServiceCard } from '../components/ServiceCard/ServiceCard'
import { Skeleton } from '../components/Skeleton/Skeleton'
import { fetchServices, type Service } from '../lib/cms'
import { setPageMeta } from '../lib/seo'
import { siteEmail } from '../lib/site'
import styles from './Services.module.css'

type FetchState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; services: Service[] }

/** Skeleton grid shown while services load (MASTER.md §16 — static under reduced motion). */
function GridSkeleton() {
  return (
    <div className={styles.grid} aria-hidden="true">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className={styles.skeletonCard}>
          <Skeleton width={48} height={48} radius="md" />
          <Skeleton width="60%" height={22} radius="sm" />
          <Skeleton width="100%" height={14} />
          <Skeleton width="90%" height={14} />
          <Skeleton width="100%" height={14} />
          <Skeleton width="70%" height={14} />
        </div>
      ))}
    </div>
  )
}

/**
 * Services page — reads live content from Strapi (docs/architecture.md §4),
 * so service offerings and pricing stay editable in the CMS without a deploy.
 */
export default function Services() {
  const [state, setState] = useState<FetchState>({ status: 'loading' })

  const load = useCallback(async () => {
    setState({ status: 'loading' })
    try {
      const services = await fetchServices()
      setState({ status: 'ready', services })
    } catch (error) {
      setState({
        status: 'error',
        message: error instanceof Error ? error.message : 'Something went wrong.',
      })
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    setPageMeta({
      title: 'Services — Himam',
      description:
        'Custom applications, website development, business systems, and AI chatbots — delivered end to end by a senior team of three engineers.',
    })
  }, [])

  return (
    <>
      {/* Hero */}
      <Section background="default" padding="lg">
        <div className={styles.hero}>
          <p className={styles.eyebrow}>Services</p>
          <h1 className={styles.title}>What we build.</h1>
          <p className={styles.lead}>
            Four disciplines, one senior team. Every service below is delivered end to
            end by experienced engineers — from discovery to deploy — and can be
            combined into a single engagement.
          </p>
        </div>
      </Section>

      {/* Grid */}
      <Section background="subtle" padding="lg">
        <h2 className="sr-only">Our services</h2>
        {state.status === 'loading' && <GridSkeleton />}

        {state.status === 'error' && (
          <div className={styles.statePanel} role="alert">
            <Icon name="alert-triangle" size={24} className={styles.errorIcon} aria-hidden="true" />
            <h2 className={styles.stateTitle}>Couldn’t load our services</h2>
            <p className={styles.stateBody}>
              The content service isn’t responding right now ({state.message}). Please try
              again — no changes have been lost.
            </p>
            <Button onClick={() => void load()}>Try again</Button>
          </div>
        )}

        {state.status === 'ready' && state.services.length === 0 && (
          <div className={styles.statePanel}>
            <h2 className={styles.stateTitle}>No services published yet</h2>
            <p className={styles.stateBody}>
              Our team is putting the finishing touches on this page. In the meantime,
              we’d love to hear about your project.
            </p>
            <Button to="/contact">Start a project</Button>
          </div>
        )}

        {state.status === 'ready' && state.services.length > 0 && (
          <div className={styles.grid}>
            {state.services.map((service) => (
              <ServiceCard key={service.documentId} service={service} />
            ))}
          </div>
        )}
      </Section>

      {/* Final CTA */}
      <Section background="navy" padding="lg">
        <div className={styles.cta}>
          <h2 className={styles.ctaTitle}>Not sure which one fits?</h2>
          <p className={styles.ctaLead}>
            Tell us what you’re working on and we’ll recommend the right starting point —
            or a combination that covers the whole project.
          </p>
          <div className={styles.ctaActions}>
            <Button size="lg" to="/contact">
              Start a project
              <Icon name="arrow-right" size={16} aria-hidden="true" />
            </Button>
            <Button size="lg" variant="secondary" to="/testimonials">
              Read what clients say
            </Button>
            <Button size="lg" variant="ghost" href={`mailto:${siteEmail}`}>
              Email us
            </Button>
          </div>
        </div>
      </Section>
    </>
  )
}
