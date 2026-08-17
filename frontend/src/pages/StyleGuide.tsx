import { useState, type ReactNode } from 'react'
import { Badge } from '../components/Badge/Badge'
import { Button } from '../components/Button/Button'
import { Card } from '../components/Card/Card'
import { Footer } from '../components/Footer/Footer'
import { Icon } from '../components/Icon/Icon'
import { Input } from '../components/Input/Input'
import { Modal } from '../components/Modal/Modal'
import { Navbar } from '../components/Navbar/Navbar'
import { Section } from '../components/Section/Section'
import { Skeleton } from '../components/Skeleton/Skeleton'
import styles from './StyleGuide.module.css'

/* ------------------------------------------------------------------ *
 * Small internal building blocks for the style guide page
 * ------------------------------------------------------------------ */

function SectionHead({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children?: ReactNode
}) {
  return (
    <header className={styles.sectionHead}>
      <p className={styles.sectionEyebrow}>{eyebrow}</p>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children && <p className={styles.sectionIntro}>{children}</p>}
    </header>
  )
}

function Swatch({ token, hex, usage }: { token: string; hex: string; usage: string }) {
  return (
    <div className={styles.swatch}>
      <div className={styles.swatchColor} style={{ background: `var(${token})` }} />
      <div className={styles.swatchMeta}>
        <code className={styles.tokenName}>{token}</code>
        <span className={styles.tokenHex}>{hex}</span>
        <span className={styles.tokenUsage}>{usage}</span>
      </div>
    </div>
  )
}

function TypeSample({
  token,
  name,
  sample,
  variant,
}: {
  token: string
  name: string
  sample: string
  variant?: 'display' | 'body' | 'label' | 'code'
}) {
  const style =
    variant === 'label'
      ? {
          fontSize: 'var(--text-label)',
          lineHeight: 'var(--text-label-line)',
          letterSpacing: 'var(--text-label-tracking)',
          textTransform: 'uppercase',
          fontWeight: 'var(--weight-semibold)',
        }
      : { fontSize: `var(${token})`, lineHeight: `var(${token}-line)` }
  return (
    <div className={styles.typeRow}>
      <div className={styles.typeMeta}>
        <span className={styles.typeName}>{name}</span>
        <code className={styles.typeToken}>{token}</code>
      </div>
      <div
        className={`${styles.typeSample} ${variant === 'code' ? styles.fontMono : ''}`}
        style={style}
      >
        {sample}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Data for the demo sections
 * ------------------------------------------------------------------ */

const palette: { token: string; hex: string; usage: string }[] = [
  { token: '--color-white', hex: '#FFFFFF', usage: 'Primary surface' },
  { token: '--color-off-white', hex: '#F6F9FD', usage: 'Subtle separation' },
  { token: '--color-blue-50', hex: '#F0F6FC', usage: 'Very light blue — soft surfaces' },
  { token: '--color-blue-100', hex: '#E1EEF9', usage: 'Light blue — highlights' },
  { token: '--color-blue-200', hex: '#C4DCF0', usage: 'Light borders' },
  { token: '--color-blue-300', hex: '#9DC4E4', usage: 'Secondary blue — decorative' },
  { token: '--color-blue-400', hex: '#5D9BD9', usage: 'Accent on dark — decorative' },
  { token: '--color-blue-500', hex: '#2E6FC2', usage: 'Secondary interactive accent' },
  { token: '--color-blue-600', hex: '#1F5FBF', usage: 'Primary blue — actions' },
  { token: '--color-blue-700', hex: '#174E9F', usage: 'Primary hover' },
  { token: '--color-blue-800', hex: '#123E80', usage: 'Primary active' },
  { token: '--color-blue-900', hex: '#0C2A57', usage: 'Dark blue — navbar, dark sections' },
  { token: '--color-blue-950', hex: '#081B3A', usage: 'Ink navy — headings, footer' },
]

const textColors: { token: string; hex: string; usage: string }[] = [
  { token: '--color-text-primary', hex: '#081B3A', usage: 'Headings & body on light' },
  { token: '--color-text-secondary', hex: '#3A4C66', usage: 'Supporting text' },
  { token: '--color-text-muted', hex: '#5C6B83', usage: 'Captions, placeholders' },
  { token: '--color-text-inverse', hex: '#FFFFFF', usage: 'Text on navy' },
  { token: '--color-text-inverse-muted', hex: '#A9BCD4', usage: 'Secondary text on navy' },
]

const semanticColors: { token: string; hex: string; usage: string }[] = [
  { token: '--color-success', hex: '#1E7A46', usage: 'Success — functional only' },
  { token: '--color-warning', hex: '#A05E03', usage: 'Warning — functional only' },
  { token: '--color-error', hex: '#C23B2E', usage: 'Error / destructive' },
]

const contrastPairs: [string, string, string][] = [
  ['--color-text-primary', '--color-white', '≈ 14.6:1'],
  ['--color-text-secondary', '--color-white', '≈ 8.3:1'],
  ['--color-text-muted', '--color-white', '≈ 5.4:1'],
  ['--color-text-inverse', '--color-blue-900', '≈ 14.9:1'],
  ['--color-text-inverse-muted', '--color-blue-900', '≈ 7.1:1'],
  ['--color-text-on-primary', '--color-blue-600', '≈ 6.0:1'],
  ['--color-text-primary', '--color-blue-50', '≈ 13.4:1'],
]

const spacingTokens: [string, string][] = [
  ['--space-1', '4px'],
  ['--space-2', '8px'],
  ['--space-3', '12px'],
  ['--space-4', '16px'],
  ['--space-6', '24px'],
  ['--space-8', '32px'],
  ['--space-12', '48px'],
  ['--space-16', '64px'],
  ['--space-24', '96px'],
]

const radiusTokens: [string, string][] = [
  ['--radius-sm', '6px'],
  ['--radius-md', '8px'],
  ['--radius-lg', '12px'],
  ['--radius-xl', '16px'],
  ['--radius-full', '9999px'],
]

const shadowTokens: [string, string][] = [
  ['--shadow-xs', 'Cards at rest'],
  ['--shadow-sm', 'Hovered cards, popovers'],
  ['--shadow-md', 'Dropdowns, sticky navbar'],
  ['--shadow-lg', 'Modals'],
]

const breakpoints: [string, string, string][] = [
  ['--bp-mobile', '375px', 'Small phones — base styles'],
  ['--bp-tablet', '768px', 'Tablets, large phones'],
  ['--bp-laptop', '1024px', 'Laptops / small desktops'],
  ['--bp-desktop', '1440px', 'Large desktops'],
]

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */

export default function StyleGuide() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <Navbar />

      <main id="main">
        {/* Intro */}
        <Section background="default" padding="lg">
          <div className={styles.intro}>
            <Badge variant="light" icon="layers">
              Design system v1.0
            </Badge>
            <h1 className={styles.heroTitle}>Himam Design System</h1>
            <p className={styles.heroLead}>
              The visual QA environment for the component library. Every token and
              shared component below is the single source of truth documented in{' '}
              <code>design-system/MASTER.md</code> — future pages must build on these
              foundations, never around them.
            </p>
            <div className={styles.introBadges}>
              <Badge variant="outline">React 19</Badge>
              <Badge variant="outline">TypeScript</Badge>
              <Badge variant="outline">WCAG 2.1 AA</Badge>
              <Badge variant="outline">Blue &amp; white</Badge>
            </div>
          </div>
        </Section>

        {/* Colors */}
        <Section background="subtle" padding="lg">
          <SectionHead eyebrow="Foundation" title="Color palette">
            A structured blue scale on white. Hover a swatch's token to inspect; every
            value is a CSS custom property in <code>styles/tokens.css</code>.
          </SectionHead>
          <h3 className={styles.groupTitle}>Brand blues &amp; surfaces</h3>
          <div className={styles.swatchGrid}>
            {palette.map((c) => (
              <Swatch key={c.token} {...c} />
            ))}
          </div>
          <h3 className={styles.groupTitle}>Text colors</h3>
          <div className={styles.swatchGrid}>
            {textColors.map((c) => (
              <Swatch key={c.token} {...c} />
            ))}
          </div>
          <h3 className={styles.groupTitle}>Semantic (functional only)</h3>
          <div className={styles.swatchGrid}>
            {semanticColors.map((c) => (
              <Swatch key={c.token} {...c} />
            ))}
          </div>
          <h3 className={styles.groupTitle}>Contrast pairs (WCAG AA)</h3>
          <table className={styles.contrastTable}>
            <thead>
              <tr>
                <th>Text token</th>
                <th>On background</th>
                <th>Ratio</th>
              </tr>
            </thead>
            <tbody>
              {contrastPairs.map(([fg, bg, ratio]) => (
                <tr key={`${fg}-${bg}`}>
                  <td>
                    <code>{fg}</code>
                  </td>
                  <td>
                    <code>{bg}</code>
                  </td>
                  <td>{ratio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        {/* Typography */}
        <Section background="default" padding="lg">
          <SectionHead eyebrow="Foundation" title="Typography">
            Sora for display &amp; headings, Inter for body &amp; UI, a system mono
            stack for code. Two loaded families only (design-system/MASTER.md §3).
          </SectionHead>
          <div className={styles.fontPairRow}>
            <div className={styles.fontPair}>
              <span className={styles.fontPairLabel}>Display &amp; headings</span>
              <span className={`${styles.fontPairName} ${styles.fontSora}`}>Sora</span>
              <span className={styles.fontPairMeta}>600 · 700 — geometric, confident</span>
            </div>
            <div className={styles.fontPair}>
              <span className={styles.fontPairLabel}>Body &amp; UI</span>
              <span className={`${styles.fontPairName} ${styles.fontInter}`}>Inter</span>
              <span className={styles.fontPairMeta}>400 · 500 · 600 — neutral, readable</span>
            </div>
            <div className={styles.fontPair}>
              <span className={styles.fontPairLabel}>Code / technical</span>
              <span className={`${styles.fontPairName} ${styles.fontMono}`}>Mono stack</span>
              <span className={styles.fontPairMeta}>System stack — no extra download</span>
            </div>
          </div>

          <TypeSample token="--text-display" name="Display" sample="Custom software, delivered with intent." variant="display" />
          <TypeSample token="--text-h1" name="Heading 1" sample="We build systems that scale with your business." />
          <TypeSample token="--text-h2" name="Heading 2" sample="Engineering services for ambitious teams." />
          <TypeSample token="--text-h3" name="Heading 3" sample="Web, mobile, systems, and AI." />
          <TypeSample token="--text-h4" name="Heading 4" sample="A professional partner for your product." />
          <TypeSample token="--text-h5" name="Heading 5" sample="Security-first development." />
          <TypeSample token="--text-h6" name="Heading 6" sample="Reliable delivery, measurable results." />
          <TypeSample token="--text-body-lg" name="Body large" sample="A three-person software engineering studio building apps, websites, systems, and AI chatbots for businesses that take their products seriously." variant="body" />
          <TypeSample token="--text-body" name="Body" sample="From product design to deployment, we take full ownership of the build — clear communication, clean code, and on-time delivery." variant="body" />
          <TypeSample token="--text-body-sm" name="Body small" sample="Used for meta information, secondary copy, and supporting details." variant="body" />
          <TypeSample token="--text-caption" name="Caption" sample="Captions, footnotes, and fine print." variant="body" />
          <TypeSample token="--text-label" name="Label" sample="Section eyebrow" variant="label" />
          <TypeSample token="--text-code" name="Code" sample="const deploy = () => ship('production')" variant="code" />
        </Section>

        {/* Spacing */}
        <Section background="subtle" padding="lg">
          <SectionHead eyebrow="Foundation" title="Spacing scale">
            4 px base grid. Bars are rendered at their exact token width.
          </SectionHead>
          <div className={styles.spacingList}>
            {spacingTokens.map(([token, px]) => (
              <div className={styles.spacingRow} key={token}>
                <div className={styles.spacingMeta}>
                  <code>{token}</code>
                  <span>{px}</span>
                </div>
                <div className={styles.spacingBar} style={{ width: `var(${token})` }} />
              </div>
            ))}
          </div>
        </Section>

        {/* Radius & shadows */}
        <Section background="default" padding="lg">
          <SectionHead eyebrow="Foundation" title="Border radius &amp; shadows">
            Small-to-medium radii for a corporate feel; cool-tinted, low-elevation
            shadows.
          </SectionHead>
          <div className={styles.demoGrid}>
            {radiusTokens.map(([token, value]) => (
              <div className={styles.demoItem} key={token}>
                <div className={styles.radiusBox} style={{ borderRadius: `var(${token})` }} />
                <code>{token}</code>
                <span>{value}</span>
              </div>
            ))}
          </div>
          <div className={styles.demoGrid}>
            {shadowTokens.map(([token, usage]) => (
              <div className={styles.demoItem} key={token}>
                <div className={styles.shadowBox} style={{ boxShadow: `var(${token})` }} />
                <code>{token}</code>
                <span>{usage}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Buttons */}
        <Section background="subtle" padding="lg">
          <SectionHead eyebrow="Components" title="Buttons">
            Variants × sizes. Hover, active, focus, disabled, and loading states are
            live on these elements — tab through to see the focus ring.
          </SectionHead>
          <h3 className={styles.groupTitle}>Variants</h3>
          <div className={styles.demoRow}>
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </div>
          <h3 className={styles.groupTitle}>Sizes</h3>
          <div className={styles.demoRow}>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
          <h3 className={styles.groupTitle}>States</h3>
          <div className={styles.demoRow}>
            <Button disabled>Disabled</Button>
            <Button loading>Loading</Button>
            <Button variant="secondary" disabled>
              Disabled
            </Button>
          </div>
          <h3 className={styles.groupTitle}>With icons &amp; as links</h3>
          <div className={styles.demoRow}>
            <Button>
              Start a project <Icon name="arrow-right" size={16} aria-hidden="true" />
            </Button>
            <Button to="/style-guide">Router link</Button>
            <Button href="https://example.com" variant="secondary">
              External link <Icon name="external-link" size={16} aria-hidden="true" />
            </Button>
            <Button variant="secondary" iconOnly aria-label="Search">
              <Icon name="search" size={20} aria-hidden="true" />
            </Button>
          </div>
          <h3 className={styles.groupTitle}>Full width</h3>
          <div className={styles.demoColumn}>
            <Button fullWidth>Full width</Button>
          </div>
        </Section>

        {/* Cards */}
        <Section background="default" padding="lg">
          <SectionHead eyebrow="Components" title="Cards">
            Three surfaces + an interactive hover-lift card. The grid below reflows
            between breakpoints automatically.
          </SectionHead>
          <div className={styles.cardGrid}>
            <Card padding="lg">
              <h3>Default</h3>
              <p>
                White surface with a hairline border — the workhorse container for
                content blocks.
              </p>
            </Card>
            <Card variant="subtle" padding="lg">
              <h3>Subtle</h3>
              <p>
                Very light blue fill for supporting content — stats, highlights,
                secondary info.
              </p>
            </Card>
            <Card variant="navy" padding="lg">
              <h3>Navy</h3>
              <p>
                Dark blue surface for emphasis and contrast — the brand statement
                variant.
              </p>
            </Card>
            <Card padding="lg" interactive to="/style-guide">
              <h3>Interactive</h3>
              <p>
                Hover to lift, tab to focus. The whole card is a link — never build
                clickable divs.
              </p>
              <span className={styles.cardLinkHint}>
                View cards <Icon name="arrow-up-right" size={16} aria-hidden="true" />
              </span>
            </Card>
          </div>
        </Section>

        {/* Badges */}
        <Section background="subtle" padding="lg">
          <SectionHead eyebrow="Components" title="Badges &amp; tags">
            Status variants pair color with text (and optional dot) so meaning never
            relies on color alone.
          </SectionHead>
          <div className={styles.demoRow}>
            <Badge>Neutral</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="light">Light</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="success" dot>
              Live
            </Badge>
            <Badge variant="warning" dot>
              Reviewing
            </Badge>
            <Badge variant="error" dot>
              Blocked
            </Badge>
          </div>
          <div className={styles.demoRow}>
            <Badge variant="neutral" icon="code" size="sm">
              TypeScript
            </Badge>
            <Badge variant="light" icon="bot" size="sm">
              AI chatbot
            </Badge>
            <Badge variant="outline" icon="database" size="sm">
              PostgreSQL
            </Badge>
            <Badge variant="primary" size="sm">
              Small
            </Badge>
          </div>
        </Section>

        {/* Forms */}
        <Section background="default" padding="lg">
          <SectionHead eyebrow="Components" title="Form inputs">
            Visible, associated labels; hint and error messaging wired through
            <code> aria-describedby</code>; errors pair icon + text.
          </SectionHead>
          <div className={styles.formGrid}>
            <Input label="Work email" type="email" placeholder="you@company.com" hint="We'll only use it to reply." autoComplete="email" />
            <Input label="Phone (optional)" type="tel" placeholder="+1 555 000 1234" />
            <Input label="Project type" placeholder="Web application" required />
            <Input
              label="Budget"
              placeholder="e.g. $25k – $50k"
              error="Please enter a budget range."
            />
            <Input label="Company" placeholder="Acme Inc." disabled defaultValue="Acme Inc." />
            <Input
              label="Project details"
              placeholder="Tell us about your product…"
              multiline
              hint="A few sentences is enough to start the conversation."
            />
          </div>
        </Section>

        {/* Modal */}
        <Section background="subtle" padding="lg">
          <SectionHead eyebrow="Components" title="Modal">
            Focus trap, Escape to close, scroll lock, focus restore, and backdrop
            click-to-close. Try tabbing while it's open.
          </SectionHead>
          <div className={styles.demoRow}>
            <Button onClick={() => setModalOpen(true)}>
              Open modal <Icon name="arrow-up-right" size={16} aria-hidden="true" />
            </Button>
          </div>
        </Section>

        {/* Skeleton */}
        <Section background="default" padding="lg">
          <SectionHead eyebrow="Components" title="Loading / skeleton">
            Placeholders for async content. Decorative only (<code>aria-hidden</code>);
            shimmer freezes under <code>prefers-reduced-motion</code>.
          </SectionHead>
          <div className={styles.skeletonGrid}>
            <Card padding="lg" className={styles.skeletonCard}>
              <div className={styles.skeletonHeader}>
                <Skeleton circle width={48} height={48} />
                <div className={styles.skeletonLines}>
                  <Skeleton width="60%" height={14} radius="sm" />
                  <Skeleton width="40%" height={12} radius="sm" />
                </div>
              </div>
              <Skeleton height={12} radius="sm" />
              <Skeleton height={12} radius="sm" width="92%" />
              <Skeleton height={12} radius="sm" width="70%" />
            </Card>
            <div className={styles.skeletonList}>
              <Skeleton height={16} width="100%" />
              <Skeleton height={16} width="85%" />
              <Skeleton height={16} width="70%" />
              <div className={styles.skeletonRow}>
                <Skeleton circle width={24} height={24} />
                <Skeleton height={14} width="30%" radius="sm" />
              </div>
            </div>
          </div>
        </Section>

        {/* Interactive states */}
        <Section background="subtle" padding="lg">
          <SectionHead eyebrow="Accessibility" title="Interactive states">
            Every interactive element has hover, active, visible keyboard focus, and
            disabled states — all driven by tokens. Hover or tab through this button to
            feel the full cycle.
          </SectionHead>
          <div className={styles.demoRow}>
            <Button size="lg">Hover me · Tab to focus</Button>
            <Button size="lg" variant="secondary">
              Secondary
            </Button>
            <Button size="lg" loading>
              Saving…
            </Button>
          </div>
        </Section>

        {/* Responsive */}
        <Section background="default" padding="lg">
          <SectionHead eyebrow="Layout" title="Responsive behavior">
            Mobile-first at 375 px, scaling to 1440 px. Containers below are rendered
            at their exact token widths; the card grid and footer reflow automatically.
          </SectionHead>
          <div className={styles.containerDemos}>
            <div className={styles.containerDemo}>
              <span>--container-narrow · 720px</span>
              <div className={styles.containerBar} style={{ maxWidth: 'var(--container-narrow)' }} />
            </div>
            <div className={styles.containerDemo}>
              <span>--container · 1200px</span>
              <div className={styles.containerBar} style={{ maxWidth: 'var(--container)' }} />
            </div>
            <div className={styles.containerDemo}>
              <span>--container-wide · 1360px</span>
              <div className={styles.containerBar} style={{ maxWidth: 'var(--container-wide)' }} />
            </div>
          </div>
          <h3 className={styles.groupTitle}>Breakpoints</h3>
          <div className={styles.demoGrid}>
            {breakpoints.map(([token, value, usage]) => (
              <div className={styles.demoItem} key={token}>
                <div className={styles.breakpointBox}>
                  <span className={styles.breakpointValue}>{value}</span>
                </div>
                <code>{token}</code>
                <span>{usage}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Navbar & footer note */}
        <Section background="subtle" padding="lg">
          <SectionHead eyebrow="Layout" title="Navbar &amp; footer">
            The sticky navbar above this section and the footer at the bottom of this
            page are the real components. Below 768 px the navbar collapses to a
            hamburger menu (try resizing the viewport).
          </SectionHead>
        </Section>
      </main>

      <Footer />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Start a project"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setModalOpen(false)}>Send request</Button>
          </>
        }
      >
        <p>
          Tell us about your product and timeline. We'll reply within one business day
          with next steps and an estimate.
        </p>
        <p>
          This modal traps focus, closes on <kbd>Escape</kbd> or backdrop click, and
          restores focus to the trigger button when it closes.
        </p>
      </Modal>
    </>
  )
}
