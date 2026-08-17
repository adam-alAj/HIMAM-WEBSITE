import type { ReactNode } from 'react'
import { Icon, type IconName } from '../Icon/Icon'
import styles from './Badge.module.css'

export type BadgeVariant =
  | 'neutral'
  | 'primary'
  | 'light'
  | 'outline'
  | 'success'
  | 'warning'
  | 'error'

export type BadgeSize = 'sm' | 'md'

interface BadgeProps {
  variant?: BadgeVariant
  size?: BadgeSize
  /** Status dot (color always paired with the text label — no color-only info). */
  dot?: boolean
  /** Leading icon (decorative). */
  icon?: IconName
  className?: string
  children: ReactNode
}

/**
 * Compact status/label tag (MASTER.md §16). Status variants pair a dot or
 * icon with text so meaning is never communicated by color alone.
 */
export function Badge({
  variant = 'neutral',
  size = 'md',
  dot = false,
  icon,
  className,
  children,
}: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${styles[size]} ${className ?? ''}`}>
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {icon && <Icon name={icon} size={size === 'sm' ? 12 : 14} aria-hidden="true" />}
      {children}
    </span>
  )
}
