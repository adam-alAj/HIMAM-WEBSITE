import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Blocks } from './Blocks'
import type { Blocks as BlocksValue } from '../../lib/cms'

const blocks: BlocksValue = [
  { type: 'heading', level: 2, children: [{ type: 'text', text: 'What you get' }] },
  {
    type: 'paragraph',
    children: [
      { type: 'text', text: 'A senior team, ' },
      { type: 'text', text: 'end to end', bold: true },
      { type: 'text', text: '.' },
    ],
  },
  {
    type: 'list',
    format: 'unordered',
    children: [
      {
        type: 'list-item',
        children: [{ type: 'text', text: 'Discovery workshop' }],
      },
      {
        type: 'list-item',
        children: [{ type: 'text', text: 'Deployment support' }],
      },
    ],
  },
  {
    type: 'quote',
    children: [{ type: 'text', text: 'Owned end to end.' }],
  },
]

describe('Blocks renderer', () => {
  it('renders headings, paragraphs, lists, and quotes from Strapi blocks', () => {
    render(<Blocks blocks={blocks} />)

    expect(screen.getByRole('heading', { name: 'What you get' })).toBeInTheDocument()
    const paragraph = screen.getByText(/A senior team,/)
    expect(paragraph.querySelector('strong')).toHaveTextContent('end to end')

    const listItems = screen.getAllByRole('listitem')
    expect(listItems.some((item) => item.textContent === 'Discovery workshop')).toBe(true)
    expect(listItems.some((item) => item.textContent === 'Deployment support')).toBe(true)

    expect(screen.getByRole('blockquote')).toHaveTextContent('Owned end to end.')
  })

  it('caps heading levels at h2 so the page owns h1', () => {
    const h1Blocks: BlocksValue = [
      { type: 'heading', level: 1, children: [{ type: 'text', text: 'Too big' }] },
    ]
    render(<Blocks blocks={h1Blocks} />)
    const heading = screen.getByRole('heading', { name: 'Too big' })
    expect(heading.tagName).toBe('H2')
  })

  it('renders links with the target/rel when external', () => {
    const linkBlocks: BlocksValue = [
      {
        type: 'paragraph',
        children: [
          {
            type: 'link',
            url: 'https://example.com',
            target: '_blank',
            children: [{ type: 'text', text: 'Read more' }],
          },
        ],
      },
    ]
    render(<Blocks blocks={linkBlocks} />)
    const link = screen.getByRole('link', { name: 'Read more' })
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
