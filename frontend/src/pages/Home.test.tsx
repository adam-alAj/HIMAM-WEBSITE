import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import Home from './Home'

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  )
}

describe('Home page', () => {
  it('renders the hero headline and tagline', () => {
    renderHome()
    expect(
      screen.getByRole('heading', { name: 'Software that moves your business forward.' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/senior team of three engineers/i)).toBeInTheDocument()
  })

  it('links the primary CTAs to /services and /contact', () => {
    renderHome()
    expect(screen.getByRole('link', { name: /Explore our services/ })).toHaveAttribute(
      'href',
      '/services',
    )
    // "Start a project" appears in the hero and the final CTA band — all go to /contact.
    const startLinks = screen.getAllByRole('link', { name: /Start a project/ })
    expect(startLinks.length).toBeGreaterThan(0)
    for (const link of startLinks) {
      expect(link).toHaveAttribute('href', '/contact')
    }
  })

  it('renders the four offering cards', () => {
    renderHome()
    expect(screen.getByRole('heading', { name: 'Web applications' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Mobile applications' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Custom software systems' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'AI solutions & chatbots' })).toBeInTheDocument()
  })

  it('renders the stats band', () => {
    renderHome()
    expect(screen.getByText('40+')).toBeInTheDocument()
    expect(screen.getByText('Products shipped')).toBeInTheDocument()
    expect(screen.getByText('98%')).toBeInTheDocument()
  })
})
