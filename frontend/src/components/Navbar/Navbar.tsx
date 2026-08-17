import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Button } from '../Button/Button'
import { Icon } from '../Icon/Icon'
import styles from './Navbar.module.css'

export interface NavbarLink {
  label: string
  to: string
}

interface NavbarProps {
  links?: NavbarLink[]
  cta?: NavbarLink
  className?: string
}

const defaultLinks: NavbarLink[] = [
  { label: 'Home', to: '/' },
  { label: 'Style Guide', to: '/style-guide' },
]

const defaultCta: NavbarLink = { label: 'Start a project', to: '/style-guide' }

/**
 * Sticky site navigation (MASTER.md §16). Desktop links + CTA; below 768px
 * a hamburger toggles a menu (aria-expanded, Escape closes, links close it).
 */
export function Navbar({ links = defaultLinks, cta = defaultCta, className }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close on Escape; move focus into the menu when opened.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    const firstLink = menuRef.current?.querySelector<HTMLElement>('a, button')
    firstLink?.focus()
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <header className={`${styles.navbar} ${className ?? ''}`}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} aria-label="Himam — home">
          <span className={styles.brandMark} aria-hidden="true">
            <Icon name="layers" size={22} />
          </span>
          <span className={styles.brandName}>Himam</span>
        </Link>

        <nav className={styles.desktopNav} aria-label="Primary">
          <ul className={styles.navList}>
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    isActive ? `${styles.link} ${styles.linkActive}` : styles.link
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <Button size="sm" to={cta.to} className={styles.cta}>
            {cta.label}
          </Button>
          <button
            type="button"
            className={styles.menuToggle}
            aria-expanded={open}
            aria-controls="navbar-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? 'close' : 'menu'} size={24} />
          </button>
        </div>
      </div>

      {open && (
        <nav id="navbar-menu" className={styles.mobileMenu} aria-label="Primary mobile" ref={menuRef}>
          <ul className={styles.navList}>
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    isActive ? `${styles.link} ${styles.linkActive}` : styles.link
                  }
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <Button fullWidth to={cta.to} onClick={() => setOpen(false)}>
            {cta.label}
          </Button>
        </nav>
      )}
    </header>
  )
}
