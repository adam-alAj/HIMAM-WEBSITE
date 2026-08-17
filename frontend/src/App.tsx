import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SiteLayout } from './layouts/SiteLayout'
import Home from './pages/Home'
import PagePlaceholder from './pages/PagePlaceholder'
import ServiceDetail from './pages/ServiceDetail'
import Services from './pages/Services'
import StyleGuide from './pages/StyleGuide'

/**
 * App shell. Every route renders through the shared SiteLayout (skip link,
 * Navbar, Footer). The catch-all placeholder keeps navigation functional
 * until pages land in later phases (About, Blog, Privacy, …).
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/style-guide" element={<StyleGuide />} />
          <Route path="*" element={<PagePlaceholder />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
