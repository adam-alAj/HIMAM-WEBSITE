import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import Home from './Home'

// Mock the CMS fetch functions
vi.mock('../lib/cms', () => ({
  fetchMetrics: vi.fn().mockResolvedValue([
    { documentId: '1', value: '40+', label: 'Products shipped', order: 1 },
    { documentId: '2', value: '12', label: 'Industries served', order: 2 },
    { documentId: '3', value: '98%', label: 'Client retention', order: 3 },
    { documentId: '4', value: '3', label: 'Senior engineers on every project', order: 4 },
  ]),
  fetchServices: vi.fn().mockResolvedValue([
    { documentId: 's1', title: 'Custom Applications', slug: 'custom-applications', shortDescription: 'Tailor-made web and mobile applications.', icon: 'monitor', features: [], order: 1 },
    { documentId: 's2', title: 'Website Development', slug: 'website-development', shortDescription: 'High-performance marketing sites.', icon: 'globe', features: [], order: 2 },
    { documentId: 's3', title: 'Business Systems & Software', slug: 'business-systems', shortDescription: 'Custom systems and integrations.', icon: 'database', features: [], order: 3 },
    { documentId: 's4', title: 'AI Chatbots & Conversational AI', slug: 'ai-chatbots', shortDescription: 'AI assistants grounded in your business.', icon: 'bot', features: [], order: 4 },
  ]),
  fetchTestimonials: vi.fn().mockResolvedValue([
    { documentId: 't1', clientName: 'Dana Whitfield', clientRole: 'VP of Product, Northwind', quote: 'Himam rebuilt our customer portal.', rating: 5, service: null, order: 1 },
    { documentId: 't2', clientName: 'Marcus Lee', clientRole: 'Founder, Lumen & Co', quote: 'They came back with a shipped product.', rating: 5, service: null, order: 2 },
  ]),
}))

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  )
}

describe('Home page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the hero headline and tagline', async () => {
    renderHome()
    expect(
      screen.getByRole('heading', { name: 'Software that moves your business forward.' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/senior team of three engineers/i)).toBeInTheDocument()
  })

  it('links the primary CTAs to /services and /contact', async () => {
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

  it('renders the four offering cards', async () => {
    renderHome()
    expect(screen.getByRole('heading', { name: 'Web applications' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Mobile applications' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Custom software systems' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'AI solutions & chatbots' })).toBeInTheDocument()
  })

  it('renders the stats band from CMS', async () => {
    renderHome()
    // Stats are loaded asynchronously from CMS
    expect(await screen.findByText('40+')).toBeInTheDocument()
    expect(screen.getByText('Products shipped')).toBeInTheDocument()
    expect(screen.getByText('98%')).toBeInTheDocument()
  })
})
