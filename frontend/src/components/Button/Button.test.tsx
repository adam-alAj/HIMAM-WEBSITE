import type { ReactElement } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'

function renderWithRouter(ui: ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('Button', () => {
  it('renders a button element with its label', () => {
    renderWithRouter(<Button>Start a project</Button>)
    expect(screen.getByRole('button', { name: 'Start a project' })).toBeInTheDocument()
  })

  it('fires onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    renderWithRouter(<Button onClick={onClick}>Click me</Button>)
    await user.click(screen.getByRole('button', { name: 'Click me' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled and not clickable while loading', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    renderWithRouter(
      <Button loading onClick={onClick}>
        Sending
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'Sending' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
    await user.click(button).catch(() => undefined)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders a router Link when given a `to` prop', () => {
    renderWithRouter(<Button to="/services">View services</Button>)
    const link = screen.getByRole('link', { name: 'View services' })
    expect(link).toHaveAttribute('href', '/services')
  })

  it('renders an external anchor when given an `href` prop', () => {
    renderWithRouter(<Button href="https://example.com">External</Button>)
    const link = screen.getByRole('link', { name: 'External' })
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders an icon-only button with a sr-only accessible label', () => {
    renderWithRouter(<Button iconOnly>Close</Button>)
    const button = screen.getByRole('button', { name: 'Close' })
    expect(button).toBeInTheDocument()
  })
})
