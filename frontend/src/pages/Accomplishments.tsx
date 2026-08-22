import { useCallback, useEffect, useState } from 'react'
import { Badge } from '../components/Badge/Badge'
import { Blocks } from '../components/Blocks/Blocks'
import { Button } from '../components/Button/Button'
import { Card } from '../components/Card/Card'
import { Icon } from '../components/Icon/Icon'
import { Section } from '../components/Section/Section'
import { Skeleton } from '../components/Skeleton/Skeleton'
import {
  fetchAccomplishments,
  fetchMetrics,
  type Accomplishment,
  type Blocks as BlocksValue,
  type Metric,
} from '../lib/cms'
import { setPageMeta } from '../lib/seo'
import { siteEmail } from '../lib/site'
import styles from './Accomplishments.module.css'

type FetchState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; accomplishments: Accomplishment[]; metrics: Metric[] }

function CaseBlock({ label, blocks }: { label: string; blocks: BlocksValue }) {
  return (
    <div className={styles.caseBlock}>
      <p className={styles.caseLabel}>{label}</p>
      <Blocks blocks={blocks} />
    </div>
  )
}

function CaseStudyCard({ caseStudy }: { caseStudy: Accomplishment }) {
  return (
    <Card padding="lg" className={styles.caseCard}>
      <h3 className={styles.caseTitle}>{caseStudy.projectName}</h3>
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

      <CaseBlock label="The problem" blocks={caseStudy.problem} />
      <CaseBlock label="What we built" blocks={caseStudy.solution} />
      <CaseBlock label="The result" blocks={caseStudy.outcome} />
    </Card>
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
    <div className={styles.caseGrid} aria-hidden="true">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className={styles.skeletonCard}>
          <Skeleton width="60%" height={22} radius="sm" />
          <Skeleton width="45%" height={14} />
          <Skeleton width="100%" height={14} />
          <Skeleton width="95%" height={14} />
          <Skeleton width="100%" height={14} />
          <Skeleton width="80%" height={14} />
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
          <p className={styles.eyebrow}>Accomplishments</p>
          <h1 className={styles.title}>Proof, not promises.</h1>
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
          <div className={styles.caseGrid}>
            {state.accomplishments.map((caseStudy) => (
              <CaseStudyCard key={caseStudy.documentId} caseStudy={caseStudy} />
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
            <Button size="lg" variant="ghost" href={`mailto:${siteEmail}`}>
              Email us
            </Button>
          </div>
        </div>
      </Section>
    </>
  )
}
