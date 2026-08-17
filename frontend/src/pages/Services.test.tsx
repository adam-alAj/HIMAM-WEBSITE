import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Service } from '../lib/cms'

const mocks = vi.hoisted(() => ({
  fetchServices: vi.fn(),
}))

vi.mock('../lib/cms', () => ({
  fetchServices: mocks.fetchServices,
}))

import Services from './Services'

const serviceFixture: Service[] = [
  {
    id: 1,
    documentId: 'svc-1',
    title: 'Custom Applications',
    slug: 'custom-applications',
    shortDescription: 'Bespoke software built around your workflows.',
    longDescription: [],
    icon: 'monitor',
    features: [{ id: 1, text: 'Discovery workshop' }],
    startingFrom: 'From $18,000',
    order: 1,
    publishedAt: '2026-08-01T00:00:00.000Z',
  },
  {
    id: 2,
    documentId: 'svc-2',
    title: 'AI Chatbots & Conversational AI',
    slug: 'ai-chatbots',
    shortDescription: 'Assistants that actually do work.',
    longDescription: [],
    icon: 'bot',
    features: [{ id: 1, text: 'Grounded in your data' }],
    startingFrom: 'From $12,000',
    order: 2,
    publishedAt: '2026-08-01T00:00:00.000Z',
  },
]

function renderServices() {
  return render(
    <MemoryRouter>
      <Services />
    </MemoryRouter>,
  )
}

describe('Services page', () => {
  beforeEach(() => {
    mocks.fetchServices.mockReset()
  })

  it('shows a loading skeleton while the CMS fetch is pending', () => {
    mocks.fetchServices.mockReturnValue(new Promise(() => undefined))
    const { container } = renderServices()
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull()
  })

  it('renders service cards from the CMS with titles, descriptions, and detail links', async () => {
    mocks.fetchServices.mockResolvedValue(serviceFixture)
    renderServices()

    expect(
      await screen.findByRole('heading', { name: 'Custom Applications' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'AI Chatbots & Conversational AI' }),
    ).toBeInTheDocument()

    // Each card has a "Learn more" link to its detail page, in sort order.
    const learnMore = screen.getAllByRole('link', { name: /Learn more/ })
    expect(learnMore[0]).toHaveAttribute('href', '/services/custom-applications')
    expect(learnMore[1]).toHaveAttribute('href', '/services/ai-chatbots')
  })

  it('shows an inline error with a working retry when the fetch fails', async () => {
    const user = userEvent.setup()
    mocks.fetchServices
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce(serviceFixture)

    renderServices()

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(/couldn’t load our services/i)

    await user.click(screen.getByRole('button', { name: /Try again/ }))

    expect(
      await screen.findByRole('heading', { name: 'Custom Applications' }),
    ).toBeInTheDocument()
    expect(mocks.fetchServices).toHaveBeenCalledTimes(2)
  })

  it('renders the empty state when the CMS returns no services', async () => {
    mocks.fetchServices.mockResolvedValue([])
    renderServices()

    expect(
      await screen.findByRole('heading', { name: 'No services published yet' }),
    ).toBeInTheDocument()
  })
})
