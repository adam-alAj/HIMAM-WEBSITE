import { Link } from 'react-router-dom'
import { resolveMediaUrl, type TeamMember } from '../../lib/cms'
import { formatDate } from '../../lib/format'
import styles from './AuthorByline.module.css'

interface AuthorBylineProps {
  author: Pick<TeamMember, 'name' | 'role' | 'photo'> | null
  /** ISO publish date shown after the name. */
  date?: string
  /** Reading time in minutes, e.g. "4 min read". */
  readingTime?: number
  /** When set, the author's name links here (e.g. /about). */
  link?: string
  className?: string
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

/**
 * Compact author + date row (blog cards and article byline). The avatar is an
 * initials placeholder until a photo is uploaded in the CMS.
 */
export function AuthorByline({ author, date, readingTime: minutes, link, className }: AuthorBylineProps) {
  const name = author?.name ?? 'Himam Team'
  const photoUrl = resolveMediaUrl(author?.photo?.url)
  const hasMeta = Boolean(date || minutes)

  return (
    <div className={`${styles.byline} ${className ?? ''}`}>
      {photoUrl ? (
        <img
          className={styles.avatar}
          src={photoUrl}
          alt={author?.photo?.alternativeText ?? name}
        />
      ) : (
        <span className={styles.avatarPlaceholder} aria-hidden="true">
          {initialsOf(name)}
        </span>
      )}
      <div className={styles.text}>
        <span className={styles.nameRow}>
          {link ? (
            <Link to={link} className={styles.nameLink}>
              {name}
            </Link>
          ) : (
            <span className={styles.name}>{name}</span>
          )}
        </span>
        {hasMeta && (
          <span className={styles.meta}>
            {date && formatDate(date)}
            {date && minutes ? ' · ' : ''}
            {minutes ? `${minutes} min read` : ''}
          </span>
        )}
      </div>
    </div>
  )
}
