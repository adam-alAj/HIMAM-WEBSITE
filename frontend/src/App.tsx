import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ComingSoon from './pages/ComingSoon'
import StyleGuide from './pages/StyleGuide'

/**
 * App shell. Route map stays minimal during the design-system phase:
 * `/` is the Phase 1 placeholder; `/style-guide` is the visual QA
 * environment for the design system (design-system/MASTER.md §16–17).
 * Real site pages are added in later phases.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ComingSoon />} />
        <Route path="/style-guide" element={<StyleGuide />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
