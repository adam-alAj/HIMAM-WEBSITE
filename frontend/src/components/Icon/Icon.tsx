import { iconPaths, type IconName } from './icons'
import styles from './Icon.module.css'

export type { IconName }

export type IconSize = 12 | 14 | 16 | 18 | 20 | 22 | 24 | 32

interface IconProps {
  name: IconName
  size?: IconSize
  className?: string
  /** Accessible label. Omit for purely decorative icons (aria-hidden). */
  label?: string
}

/**
 * Single icon system for the site (design-system/MASTER.md §14).
 * Decorative by default; pass `label` when the icon conveys meaning.
 */
export function Icon({ name, size = 24, className, label }: IconProps) {
  const classes = [styles.icon, className].filter(Boolean).join(' ')
  return (
    <svg
      className={classes}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
      focusable="false"
    >
      {iconPaths[name]}
    </svg>
  )
}
