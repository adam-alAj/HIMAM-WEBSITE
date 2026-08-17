import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../Icon/Icon'
import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonBaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
  /** Icon-only square button; `children` becomes the accessible label. */
  iconOnly?: boolean
  className?: string
  children: ReactNode
}

interface ButtonProps extends ButtonBaseProps {
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  onClick?: () => void
  /** When set, renders a React Router <Link>. */
  to?: string
  /** When set, renders an <a> (external). */
  href?: string
}

/**
 * Primary interactive control. Variants and states follow
 * design-system/MASTER.md §16 and the tokens in styles/tokens.css.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  iconOnly = false,
  type = 'button',
  disabled = false,
  onClick,
  to,
  href,
  className,
  children,
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    iconOnly ? styles.iconOnly : '',
    fullWidth ? styles.fullWidth : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {loading && (
        <span className={styles.spinner} aria-hidden="true">
          <Icon name="loader" size={16} className={styles.spin} />
        </span>
      )}
      {iconOnly ? (
        <span className="sr-only">{children}</span>
      ) : (
        <span className={styles.label}>{children}</span>
      )}
    </>
  )

  const linkProps = {
    className: classes,
    'aria-busy': loading || undefined,
    onClick,
  }

  if (to) {
    return (
      <Link to={to} {...linkProps}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        aria-busy={loading || undefined}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      onClick={onClick}
    >
      {content}
    </button>
  )
}
