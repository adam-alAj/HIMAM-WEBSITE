import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Badge } from '../components/Badge/Badge'
import { Blocks } from '../components/Blocks/Blocks'
import { Button } from '../components/Button/Button'
import { Icon, type IconName } from '../components/Icon/Icon'
import { iconPaths } from '../components/Icon/icons'
import { Section } from '../components/Section/Section'
import { Skeleton } from '../components/Skeleton/Skeleton'
import { fetchServiceBySlug, type Service } from '../lib/cms'
import { setPageMeta } from '../lib/seo'
import { siteEmail } from '../lib/site'
import styles from './ServiceDetail.module.css'

type DetailState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; service: Service | null }

function isIconName(name: string): name is IconName {
  return name in iconPaths
}

function DetailSkeleton() {
  return (
    <>
      <Section background="default" padding="lg">
        <div className={styles.hero} aria-hidden="true">
          <Skeleton width={140} height={16} radius="sm" />
          <Skeleton width={48} height={48} radius="md" />
          <Skeleton width="55%" height={40} radius="sm" />
          <Skeleton width="90%" height={18} />
          <Skeleton width="70%" height={18} />
        </div>
      </Section>
      <Section background="subtle" padding="lg" container="narrow">
        <div className={styles.bodySkeleton} aria-hidden="true">
          <Skeleton width="100%" height={16} />
          <Skeleton width="100%" height={16} />
          <Skeleton width="96%" height={16} />
          <Skeleton width="40%" height={24} radius="sm" />
          <Skeleton width="100%" height={16} />
          <Skeleton width="88%" height={16} />
        </div>
      </Section>
    </>
  )
}

/**
 * Service detail page — reads one service from Strapi by slug
 * (GET /api/services?filters[slug][$eq]=…), so long-form copy and pricing
 * stay editable in the CMS without a frontend deploy.
 */
export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [state, setState] = useState<DetailState>({ status: 'loading' })

  const load = useCallback(async () => {
    if (!slug) return
    setState({ status: 'loading' })
    try {
      const service = await fetchServiceBySlug(slug)
      setState({ status: 'ready', service })
    } catch (error) {
      setState({
        status: 'error',
        message: error instanceof Error ? error.message : 'Something went wrong.',
      })
    }
  }, [slug])

  useEffect(() => {
    void load()
  }, [load])

  // Dynamic meta once the service resolves (title + short description).
  useEffect(() => {
    if (state.status !== 'ready' || !state.service) return
    setPageMeta({
      title: `${state.service.title} — Himam`,
      description: state.service.shortDescription,
    })
  }, [state])

  if (state.status === 'loading') return <DetailSkeleton />

  if (state.status === 'error') {
    return (
      <Section background="subtle" padding="lg">
        <div className={styles.statePanel} role="alert">
          <Icon name="alert-triangle" size={24} className={styles.errorIcon} aria-hidden="true" />
          <h1 className={styles.stateTitle}>Couldn’t load this service</h1>
          <p className={styles.stateBody}>
            The content service isn’t responding right now ({state.message}). Please try
            again.
          </p>
          <div className={styles.stateActions}>
            <Button onClick={() => void load()}>Try again</Button>
            <Button variant="secondary" to="/services">
              Back to services
            </Button>
          </div>
        </div>
      </Section>
    )
  }

  if (state.service === null) {
    return (
      <Section background="subtle" padding="lg">
        <div className={styles.statePanel}>
          <h1 className={styles.stateTitle}>Service not found</h1>
          <p className={styles.stateBody}>
            We couldn’t find that service. It may have been unpublished or renamed in the
            CMS.
          </p>
          <Button to="/services">Back to services</Button>
        </div>
      </Section>
    )
  }

  const service = state.service
  const icon: IconName = isIconName(service.icon) ? service.icon : 'layers'

  return (
    <>
      {/* Hero */}
      <Section background="default" padding="lg">
        <Link to="/services" className={styles.back}>
          <Icon name="chevron-left" size={16} aria-hidden="true" />
          All services
        </Link>
        <div className={styles.hero}>
          <div className={styles.heroMeta}>
            <span className={styles.iconTile}>
              <Icon name={icon} size={24} aria-hidden="true" />
            </span>
            {service.startingFrom && <Badge variant="light">{service.startingFrom}</Badge>}
          </div>
          <h1 className={styles.title}>{service.title}</h1>
          <p className={styles.lead}>{service.shortDescription}</p>
        </div>
      </Section>

      {/* Body */}
      <Section background="subtle" padding="lg" container="narrow">
        <Blocks blocks={service.longDescription} />

        <h2 className={styles.checklistTitle}>Key features</h2>
        <ul className={styles.checklist}>
          {service.features.map((feature) => (
            <li key={feature.id}>
              <Icon name="check" size={16} aria-hidden="true" />
              <span>{feature.text}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* CTA */}
      <Section background="navy" padding="lg">
        <div className={styles.cta}>
          <h2 className={styles.ctaTitle}>Ready to get started?</h2>
          <p className={styles.ctaLead}>
            Tell us about your project and we’ll come back within one business day with
            honest feedback and a clear next step.
          </p>
          <div className={styles.ctaActions}>
            <Button size="lg" to="/contact">
              Start a project
              <Icon name="arrow-right" size={16} aria-hidden="true" />
            </Button>
            <Button size="lg" variant="secondary" href={`mailto:${siteEmail}`}>
              Email us
            </Button>
          </div>
        </div>
      </Section>
    </>
  )
}
