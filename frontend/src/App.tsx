import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SiteLayout } from './layouts/SiteLayout'
import About from './pages/About'
import Accomplishments from './pages/Accomplishments'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Contact from './pages/Contact'
import Faq from './pages/Faq'
import Home from './pages/Home'
import Legal from './pages/Legal'
import PagePlaceholder from './pages/PagePlaceholder'
import ServiceDetail from './pages/ServiceDetail'
import Services from './pages/Services'
import StyleGuide from './pages/StyleGuide'
import Testimonials from './pages/Testimonials'

/**
 * App shell. Every route renders through the shared SiteLayout (skip link,
 * Navbar, Footer). The catch-all placeholder keeps navigation functional
 * until pages land in later phases (Privacy, …).
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/accomplishments" element={<Accomplishments />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Legal slug="privacy-policy" />} />
          <Route path="/terms" element={<Legal slug="terms-of-service" />} />
          <Route path="/style-guide" element={<StyleGuide />} />
          <Route path="*" element={<PagePlaceholder />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
