import { Outlet } from 'react-router-dom'
import { Footer } from '../components/Footer/Footer'
import { Navbar } from '../components/Navbar/Navbar'
import { footerColumns, navCta, navLinks } from '../lib/site'

/**
 * Shared layout for every route: skip link, Navbar, main, Footer.
 * Header/nav and footer are defined here once and reused across all pages
 * (MASTER.md §16). Page components render through <Outlet />.
 */
export function SiteLayout() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar links={navLinks} cta={navCta} />
      <main id="main">
        <Outlet />
      </main>
      <Footer columns={footerColumns} />
    </>
  )
}
