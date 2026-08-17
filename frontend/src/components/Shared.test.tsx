import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Badge } from './Badge/Badge'
import { Card } from './Card/Card'
import { Icon } from './Icon/Icon'
import { Section } from './Section/Section'
import { Skeleton } from './Skeleton/Skeleton'

describe('Badge', () => {
  it('renders its label', () => {
    render(<Badge>AI Chatbots</Badge>)
    expect(screen.getByText('AI Chatbots')).toBeInTheDocument()
  })

  it('renders a status dot as decorative when requested', () => {
    const { container } = render(<Badge dot>Live</Badge>)
    const dot = container.querySelector('[aria-hidden="true"]')
    expect(dot).not.toBeNull()
  })
})

describe('Card', () => {
  it('renders children in a plain container', () => {
    render(<Card>Some content</Card>)
    expect(screen.getByText('Some content')).toBeInTheDocument()
  })

  it('renders the whole card as a router link when given `to`', () => {
    render(
      <MemoryRouter>
        <Card to="/services/custom-applications">View service</Card>
      </MemoryRouter>,
    )
    const link = screen.getByRole('link', { name: 'View service' })
    expect(link).toHaveAttribute('href', '/services/custom-applications')
  })
})

describe('Section', () => {
  it('renders a semantic section by default with an id', () => {
    render(<Section id="hero">Body</Section>)
    const section = screen.getByText('Body').closest('section')
    expect(section).not.toBeNull()
    expect(section).toHaveAttribute('id', 'hero')
  })
})

describe('Skeleton', () => {
  it('is hidden from assistive tech', () => {
    const { container } = render(<Skeleton width={100} height={20} />)
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull()
  })
})

describe('Icon', () => {
  it('is decorative by default (aria-hidden)', () => {
    const { container } = render(<Icon name="arrow-right" />)
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull()
  })

  it('is labelled when the icon conveys meaning', () => {
    render(<Icon name="check" label="Saved" />)
    expect(screen.getByRole('img', { name: 'Saved' })).toBeInTheDocument()
  })
})
