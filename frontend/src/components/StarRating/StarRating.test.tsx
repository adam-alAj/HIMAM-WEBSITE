import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StarRating } from './StarRating'

describe('StarRating', () => {
  it('exposes the rating to assistive tech via aria-label', () => {
    render(<StarRating rating={4} />)
    expect(screen.getByRole('img', { name: 'Rated 4 out of 5 stars' })).toBeInTheDocument()
  })

  it('renders five star icons', () => {
    const { container } = render(<StarRating rating={5} />)
    expect(container.querySelectorAll('svg')).toHaveLength(5)
  })

  it('clamps out-of-range ratings defensively', () => {
    render(<StarRating rating={9} />)
    expect(screen.getByRole('img', { name: 'Rated 5 out of 5 stars' })).toBeInTheDocument()
  })
})
