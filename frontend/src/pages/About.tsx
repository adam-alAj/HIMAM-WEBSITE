import { useCallback, useEffect, useState } from 'react'
import { Badge } from '../components/Badge/Badge'
import { Blocks } from '../components/Blocks/Blocks'
import { Button } from '../components/Button/Button'
import { Card } from '../components/Card/Card'
import { Icon, type IconName } from '../components/Icon/Icon'
import { iconPaths } from '../components/Icon/icons'
import { Section } from '../components/Section/Section'
import { Skeleton } from '../components/Skeleton/Skeleton'
import {
  fetchTeamMembers,
  fetchValues,
  type StudioValue,
  type TeamMember,
} from '../lib/cms'
import { setPageMeta } from '../lib/seo'
import { siteEmail } from '../lib/site'
import styles from './About.module.css'

type FetchState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; team: TeamMember[]; values: StudioValue[] }

function isIconName(name: string): name is IconName {
  return name in iconPaths
}

/** Initials placeholder shown until a real headshot is uploaded in the CMS. */
function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <Card padding="lg" className={styles.memberCard}>
      {member.photo?.url ? (
        <img
          className={styles.photo}
          src={member.photo.url}
          alt={member.photo.alternativeText ?? member.name}
        />
      ) : (
        <span className={styles.photoPlaceholder} aria-hidden="true">
          {initialsOf(member.name)}
        </span>
      )}
      <h3 className={styles.memberName}>{member.name}</h3>
      <p className={styles.memberRole}>{member.role}</p>
      <Badge variant="outline" size="sm" className={styles.focusBadge}>
        {member.focusArea}
      </Badge>
      <div className={styles.memberBio}>
        <Blocks blocks={member.bio} />
      </div>
    </Card>
  )
}

function ValueCard({ value }: { value: StudioValue }) {
  const icon: IconName = isIconName(value.icon) ? value.icon : 'layers'
  return (
    <Card variant="subtle" padding="lg" className={styles.valueCard}>
      <span className={styles.valueIcon}>
        <Icon name={icon} size={24} aria-hidden="true" />
      </span>
      <h3 className={styles.valueTitle}>{value.title}</h3>
      <p className={styles.valueText}>{value.text}</p>
    </Card>
  )
}

function AboutSkeleton() {
  return (
    <Section background="subtle" padding="lg">
      <div className={styles.memberGrid} aria-hidden="true">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className={styles.skeletonCard}>
            <Skeleton width={64} height={64} radius="md" />
            <Skeleton width="55%" height={22} radius="sm" />
            <Skeleton width="70%" height={14} />
            <Skeleton width="100%" height={14} />
            <Skeleton width="95%" height={14} />
            <Skeleton width="85%" height={14} />
          </div>
        ))}
      </div>
    </Section>
  )
}

/**
 * About page — mission, the three founding engineers, and how we work.
 * Team members and values come from Strapi (docs/architecture.md §4), so
 * bios and principles stay editable without a frontend deploy.
 */
export default function About() {
  const [state, setState] = useState<FetchState>({ status: 'loading' })

  const load = useCallback(async () => {
    setState({ status: 'loading' })
    try {
      const [team, values] = await Promise.all([fetchTeamMembers(), fetchValues()])
      setState({ status: 'ready', team, values })
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
      title: 'About Us — Himam',
      description:
        'The three engineers behind Himam — who we are, how we work, and the principles we don’t bend.',
    })
  }, [])

  return (
    <>
      {/* Hero — mission / origin */}
      <Section background="default" padding="lg">
        <div className={styles.hero}>
          <p className={styles.eyebrow}>About us</p>
          <h1 className={styles.title}>Three engineers. One accountable team.</h1>
          <p className={styles.lead}>
            Himam was founded in 2019 by three engineers who kept watching good projects
            lose quality between the agency that sold them, the developers who built them,
            and the account managers in between. We started Himam to sell our own work
            directly — and to stay small enough that the people who pitch you are the
            people who build it.
          </p>
          <div className={styles.heroBadges}>
            <Badge variant="light" icon="calendar">
              Founded 2019
            </Badge>
            <Badge variant="light" icon="users">
              Three founders
            </Badge>
            <Badge variant="light" icon="code">
              Senior-only team
            </Badge>
          </div>
        </div>
      </Section>

      {/* Our story */}
      <Section background="subtle" padding="lg" container="narrow">
        <header className={styles.sectionHead}>
          <p className={styles.eyebrow}>Our story</p>
          <h2 className={styles.sectionTitle}>Why Himam exists.</h2>
        </header>
        <div className={styles.story}>
          <p>
            Every founder we talk to has the same story: a project that took twice as long
            as quoted, an agency that stopped answering, a handover that never happened.
            We built Himam as the opposite of that experience.
          </p>
          <p>
            We’re three engineers and nobody else. That’s deliberate. It keeps the people
            who estimate the work responsible for doing it, keeps every line of code
            reviewable by someone senior, and keeps our prices honest — no sales team to
            pay for, no bench to feed.
          </p>
        </div>
      </Section>

      {/* The founders */}
      <Section background="default" padding="lg">
        <header className={styles.sectionHead}>
          <p className={styles.eyebrow}>The founders</p>
          <h2 className={styles.sectionTitle}>Three people, three disciplines.</h2>
          <p className={styles.sectionIntro}>
            No one at Himam is a middleman. These are the engineers who will actually work
            on your project — and what each one brings to it.
          </p>
        </header>

        {state.status === 'loading' && <AboutSkeleton />}

        {state.status === 'error' && (
          <div className={styles.statePanel} role="alert">
            <Icon name="alert-triangle" size={24} className={styles.errorIcon} aria-hidden="true" />
            <h3 className={styles.stateTitle}>Couldn’t load the team</h3>
            <p className={styles.stateBody}>
              The content service isn’t responding right now ({state.message}). Please try
              again.
            </p>
            <Button onClick={() => void load()}>Try again</Button>
          </div>
        )}

        {state.status === 'ready' && state.team.length === 0 && (
          <div className={styles.statePanel}>
            <h3 className={styles.stateTitle}>No team members published yet</h3>
            <p className={styles.stateBody}>
              The team bios are being drafted. Meanwhile, we’d love to hear about your
              project.
            </p>
            <Button to="/contact">Start a project</Button>
          </div>
        )}

        {state.status === 'ready' && state.team.length > 0 && (
          <div className={styles.memberGrid}>
            {state.team.map((member) => (
              <TeamMemberCard key={member.documentId} member={member} />
            ))}
          </div>
        )}
      </Section>

      {/* How we work */}
      <Section background="subtle" padding="lg">
        <header className={styles.sectionHead}>
          <p className={styles.eyebrow}>How we work</p>
          <h2 className={styles.sectionTitle}>Principles we don’t bend.</h2>
          <p className={styles.sectionIntro}>
            The rules we hold ourselves to on every engagement — the ones that show up in
            how we work, not just in a values deck.
          </p>
        </header>

        {state.status === 'ready' && state.values.length > 0 && (
          <div className={styles.valueGrid}>
            {state.values.map((value) => (
              <ValueCard key={value.documentId} value={value} />
            ))}
          </div>
        )}

        {state.status === 'ready' && state.values.length === 0 && (
          <p className={styles.emptyNote}>No values published yet.</p>
        )}

        {state.status === 'loading' && (
          <div className={styles.valueGrid} aria-hidden="true">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className={styles.skeletonValue}>
                <Skeleton width={48} height={48} radius="md" />
                <Skeleton width="50%" height={20} radius="sm" />
                <Skeleton width="100%" height={14} />
                <Skeleton width="92%" height={14} />
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* CTA */}
      <Section background="navy" padding="lg">
        <div className={styles.cta}>
          <h2 className={styles.ctaTitle}>Want to meet us properly?</h2>
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
