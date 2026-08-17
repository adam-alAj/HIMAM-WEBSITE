import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styles from './Card.module.css'

export type CardVariant = 'default' | 'subtle' | 'navy'
export type CardPadding = 'none' | 'sm' | 'md' | 'lg'

interface CardProps {
  variant?: CardVariant
  padding?: CardPadding
  /** Lift + border on hover and full keyboard focus-ability. */
  interactive?: boolean
  /** Renders the whole card as a router Link. */
  to?: string
  /** Renders the whole card as an external link. */
  href?: string
  className?: string
  children: ReactNode
}

/**
 * Neutral surface for grouping content (MASTER.md §16).
 * Use `interactive` for clickable cards — never for plain containers.
 */
export function Card({
  variant = 'default',
  padding = 'md',
  interactive = false,
  to,
  href,
  className,
  children,
}: CardProps) {
  const classes = [
    styles.card,
    styles[variant],
    styles[`padding${padding[0].toUpperCase()}${padding.slice(1)}`],
    interactive ? styles.interactive : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    )
  }

  return <div className={classes}>{children}</div>
}
