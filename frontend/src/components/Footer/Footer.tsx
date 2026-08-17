import { Link } from 'react-router-dom'
import { Icon, type IconName } from '../Icon/Icon'
import styles from './Footer.module.css'

export interface FooterLink {
  label: string
  to?: string
  href?: string
}

export interface FooterColumn {
  title: string
  links: FooterLink[]
}

type SocialName = 'github' | 'linkedin' | 'xSocial' | 'mail'

interface FooterProps {
  columns?: FooterColumn[]
  socials?: SocialName[]
  className?: string
}

const defaultColumns: FooterColumn[] = [
  {
    title: 'Services',
    links: [
      { label: 'Web applications', to: '/' },
      { label: 'Mobile applications', to: '/' },
      { label: 'Custom software systems', to: '/' },
      { label: 'AI solutions & chatbots', to: '/' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/' },
      { label: 'Blog', to: '/' },
      { label: 'Contact', to: '/' },
    ],
  },
  {
    title: 'Contact',
    links: [
      { label: 'hello@himam.dev', href: 'mailto:hello@himam.dev' },
      { label: 'Remote, worldwide', to: '/' },
    ],
  },
]

const defaultSocials: SocialName[] = ['github', 'linkedin', 'xSocial']

const socialLabels: Record<SocialName, string> = {
  github: 'Himam on GitHub',
  linkedin: 'Himam on LinkedIn',
  xSocial: 'Himam on X',
  mail: 'Email Himam',
}

const socialIcons: Record<SocialName, IconName> = {
  github: 'github',
  linkedin: 'linkedin',
  xSocial: 'xSocial',
  mail: 'mail',
}

/**
 * Site footer on the ink-navy surface (MASTER.md §16). Link columns stack on
 * mobile; social links are icon-only with accessible labels.
 */
export function Footer({
  columns = defaultColumns,
  socials = defaultSocials,
  className,
}: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className={`${styles.footer} ${className ?? ''}`}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link to="/" className={styles.brandLink} aria-label="Himam — home">
              <span className={styles.brandMark} aria-hidden="true">
                <Icon name="layers" size={20} />
              </span>
              <span className={styles.brandName}>Himam</span>
            </Link>
            <p className={styles.tagline}>
              Software engineering studio building apps, websites, systems, and AI
              chatbots for ambitious teams.
            </p>
          </div>

          <nav className={styles.columns} aria-label="Footer">
            {columns.map((column) => (
              <div className={styles.column} key={column.title}>
                <h3 className={styles.columnTitle}>{column.title}</h3>
                <ul className={styles.columnList}>
                  {column.links.map((link) => (
                    <li key={link.label}>
                      {link.href ? (
                        <a
                          href={link.href}
                          className={styles.columnLink}
                          {...(link.href.startsWith('http')
                            ? { target: '_blank', rel: 'noopener noreferrer' }
                            : {})}
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link to={link.to ?? '/'} className={styles.columnLink}>
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>© {year} Himam. All rights reserved.</p>
          <ul className={styles.socials}>
            {socials.map((social) => (
              <li key={social}>
                <a
                  href="#"
                  className={styles.social}
                  aria-label={socialLabels[social]}
                >
                  <Icon name={socialIcons[social]} size={18} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
