import { useCallback, useEffect, useState } from 'react'
import { Badge } from '../components/Badge/Badge'
import { Blocks } from '../components/Blocks/Blocks'
import { Button } from '../components/Button/Button'
import { Icon } from '../components/Icon/Icon'
import { Section } from '../components/Section/Section'
import { Skeleton } from '../components/Skeleton/Skeleton'
import {
  fetchAccomplishments,
  fetchMetrics,
  resolveMediaUrl,
  type Accomplishment,
  type Metric,
} from '../lib/cms'
import { setPageMeta } from '../lib/seo'
import { siteEmail } from '../lib/site'
import styles from './Accomplishments.module.css'

type FetchState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; accomplishments: Accomplishment[]; metrics: Metric[] }

function SlideControls({
  count,
  activeIndex,
  onPrev,
  onNext,
}: {
  count: number
  activeIndex: number
  onPrev: () => void
  onNext: () => void
}) {
  const prevDisabled = activeIndex === 0
  const nextDisabled = activeIndex === count - 1
  return (
    <div className={styles.slideControls} aria-hidden="true">
      <button
        className={styles.slideArrow}
        onClick={onPrev}
        disabled={prevDisabled}
        type="button"
        aria-label="Previous image"
      >
        <Icon name="chevron-left" size={20} />
      </button>
      <button
        className={styles.slideArrow}
        onClick={onNext}
        disabled={nextDisabled}
        type="button"
        aria-label="Next image"
      >
        <Icon name="chevron-right" size={20} />
      </button>
    </div>
  )
}

export function CaseStudyRow({ caseStudy }: { caseStudy: Accomplishment }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const images = caseStudy.gallery ?? []
  const hasImages = images.length > 0
  const activeImage = hasImages ? images[activeIndex] : null
  const activeUrl = activeImage ? resolveMediaUrl(activeImage.url) : null

  const goTo = (index: number) => {
    if (index < 0) index = images.length - 1
    if (index >= images.length) index = 0
    setActiveIndex(index)
  }

  return (
    <section className={styles.caseRow} aria-labelledby={`case-${caseStudy.documentId}-title`}>
      {/* Gallery — first half of the row */}
      <div className={styles.caseGallery}>
        {/* Image stage */}
        <div className={styles.imageStage}>
          {hasImages && activeUrl ? (
            <>
              <img
                className={styles.stageImage}
                src={activeUrl}
                alt={activeImage?.alternativeText ?? caseStudy.projectName}
                aria-label={`${caseStudy.projectName} — image ${activeIndex + 1} of ${images.length}`}
              />
              <SlideControls
                count={images.length}
                activeIndex={activeIndex}
                onPrev={() => goTo(activeIndex - 1)}
                onNext={() => goTo(activeIndex + 1)}
              />
            </>
          ) : (
            <div className={styles.stageFallback} aria-hidden="true">
              <Icon name="monitor" size={24} />
              <span>No project photos</span>
            </div>
          )}
        </div>

        {/* Thumbnail tabs */}
        {hasImages && (
          <div className={styles.thumbnails} role="tablist" aria-label="Project photos">
            {images.map((image, index) => {
              const url = resolveMediaUrl(image.url)
              return url ? (
                <button
                  key={image.url + index}
                  type="button"
                  className={`${styles.thumb} ${index === activeIndex ? styles.thumbActive : ''}`}
                  onClick={() => setActiveIndex(index)}
                  role="tab"
                  aria-selected={index === activeIndex}
                  aria-label={`View photo ${index + 1}`}
                >
                  <img
                    className={styles.thumbImage}
                    src={url}
                    alt={image.alternativeText ?? `${caseStudy.projectName} — photo ${index + 1}`}
                    loading="lazy"
                  />
                </button>
              ) : null
            })}
          </div>
        )}
      </div>

      {/* Info — under the gallery */}
      <div className={styles.caseInfo}>
        <h3 id={`case-${caseStudy.documentId}-title`} className={styles.caseTitle}>
          {caseStudy.projectName}
        </h3>

        <div className={styles.caseMeta}>
          {caseStudy.client && <span className={styles.caseClient}>{caseStudy.client}</span>}
          {caseStudy.industry && (
            <Badge variant="outline" size="sm">
              {caseStudy.industry}
            </Badge>
          )}
          {caseStudy.year && (
            <Badge variant="outline" size="sm">
              {caseStudy.year}
            </Badge>
          )}
        </div>

        {caseStudy.metric && (
          <p className={styles.caseMetric}>
            <Icon name="arrow-up-right" size={16} aria-hidden="true" />
            {caseStudy.metric}
          </p>
        )}

        <div className={styles.caseBlocks}>
          <div className={styles.caseBlock}>
            <p className={styles.caseLabel}>The problem</p>
            <Blocks blocks={caseStudy.problem} />
          </div>
          <div className={styles.caseBlock}>
            <p className={styles.caseLabel}>What we built</p>
            <Blocks blocks={caseStudy.solution} />
          </div>
          <div className={styles.caseBlock}>
            <p className={styles.caseLabel}>The result</p>
            <Blocks blocks={caseStudy.outcome} />
          </div>
        </div>
      </div>
    </section>
  )
}

function MetricSkeleton() {
  return (
    <Section background="navy" padding="lg">
      <div className={styles.metricsGrid} aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className={styles.metricSkeleton}>
            <Skeleton width={64} height={36} radius="sm" />
            <Skeleton width="70%" height={14} />
          </div>
        ))}
      </div>
    </Section>
  )
}

function CaseStudySkeleton() {
  return (
    <div className={styles.caseSkeletons} aria-hidden="true">
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className={styles.caseSkeleton}>
          <Skeleton width="100%" height={280} radius="lg" />
          <div className={styles.thumbSkeleton}>
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} width={64} height={64} radius="md" />
            ))}
          </div>
          <div className={styles.infoSkeleton}>
            <Skeleton width="55%" height={26} radius="sm" />
            <Skeleton width="40%" height={14} />
            <Skeleton width="100%" height={14} />
            <Skeleton width="95%" height={14} />
            <Skeleton width="100%" height={14} />
            <Skeleton width="80%" height={14} />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Accomplishments page — a metrics band and case studies, both read live
 * from Strapi (docs/architecture.md §4), so the team can add projects and
 * update numbers without a frontend deploy.
 */
export default function Accomplishments() {
  const [state, setState] = useState<FetchState>({ status: 'loading' })

  const load = useCallback(async () => {
    setState({ status: 'loading' })
    try {
      const [accomplishments, metrics] = await Promise.all([
        fetchAccomplishments(),
        fetchMetrics(),
      ])
      setState({ status: 'ready', accomplishments, metrics })
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
      title: 'Accomplishments — Himam',
      description:
        'Case studies and outcomes from Himam’s projects — dispatch portals, AI assistants, integrations, and patient intake — with the numbers to back them up.',
    })
  }, [])

  return (
    <>
      {/* Hero */}
      <Section background="default" padding="lg">
        <div className={styles.hero}>
          <p className={`${styles.eyebrow} ${styles.heroEyebrow}`}>Accomplishments</p>
          <h1 className={styles.title}>Products as proof.</h1>
          <p className={styles.lead}>
            A small studio lives on its track record. These are projects we’re proud of —
            the problems clients brought us, what we built, and the numbers that came out
            of it.
          </p>
        </div>
      </Section>

      {/* Metrics band */}
      {state.status === 'loading' && <MetricSkeleton />}
      {state.status === 'ready' && state.metrics.length > 0 && (
        <Section background="navy" padding="lg">
          <p className={`${styles.eyebrow} ${styles.eyebrowNavy}`}>By the numbers</p>
          <div className={styles.metricsGrid}>
            {state.metrics.map((metric) => (
              <div key={metric.documentId} className={styles.metric}>
                <span className={styles.metricValue}>{metric.value}</span>
                <span className={styles.metricLabel}>{metric.label}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Case studies */}
      <Section background="subtle" padding="lg">
        <header className={styles.sectionHead}>
          <p className={styles.eyebrow}>Selected projects</p>
          <h2 className={styles.sectionTitle}>Work that held up in production.</h2>
          <p className={styles.sectionIntro}>
            Every project below shipped, stayed shipped, and produced a number worth
            measuring. Details are representative of our work.
          </p>
        </header>

        {state.status === 'loading' && <CaseStudySkeleton />}

        {state.status === 'error' && (
          <div className={styles.statePanel} role="alert">
            <Icon name="alert-triangle" size={24} className={styles.errorIcon} aria-hidden="true" />
            <h3 className={styles.stateTitle}>Couldn’t load our projects</h3>
            <p className={styles.stateBody}>
              The content service isn’t responding right now ({state.message}). Please try
              again — no changes have been lost.
            </p>
            <Button onClick={() => void load()}>Try again</Button>
          </div>
        )}

        {state.status === 'ready' && state.accomplishments.length === 0 && (
          <div className={styles.statePanel}>
            <h3 className={styles.stateTitle}>No projects published yet</h3>
            <p className={styles.stateBody}>
              Case studies are being written up. Meanwhile, we’d love to hear about your
              project.
            </p>
            <Button to="/contact">Start a project</Button>
          </div>
        )}

        {state.status === 'ready' && state.accomplishments.length > 0 && (
          <div className={styles.caseRows}>
            {state.accomplishments.map((caseStudy) => (
              <CaseStudyRow key={caseStudy.documentId} caseStudy={caseStudy} />
            ))}
          </div>
        )}
      </Section>

      {/* CTA */}
      <Section background="navy" padding="lg">
        <div className={styles.cta}>
          <h2 className={styles.ctaTitle}>Your project could be next.</h2>
          <p className={styles.ctaLead}>
            We take on a small number of projects each year so every client gets senior
            attention. Tell us what you’re working on.
          </p>
          <div className={styles.ctaActions}>
            <Button size="lg" to="/contact">
              Start a project
              <Icon name="arrow-right" size={16} aria-hidden="true" />
            </Button>
            <Button size="lg" variant="secondary" to="/testimonials">
              Read what clients say
            </Button>
            <Button size="lg" variant="light" href={`mailto:${siteEmail}`}>
              Email us
            </Button>
          </div>
        </div>
      </Section>
    </>
  )
}
