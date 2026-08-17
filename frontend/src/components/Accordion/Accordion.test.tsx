import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Accordion, type AccordionItem } from './Accordion'

const items: AccordionItem[] = [
  { id: 'q1', title: 'How much does it cost?', content: 'It depends on scope.' },
  { id: 'q2', title: 'How long does it take?', content: 'Usually 4–8 weeks.' },
]

describe('Accordion', () => {
  it('starts collapsed with aria-expanded false on every trigger', () => {
    render(<Accordion items={items} />)
    const triggers = screen.getAllByRole('button')
    expect(triggers).toHaveLength(2)
    for (const trigger of triggers) {
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
    }
  })

  it('expands a panel on click and wires aria-controls to the region', async () => {
    const user = userEvent.setup()
    render(<Accordion items={items} />)
    const trigger = screen.getByRole('button', { name: /How much does it cost/ })

    // Collapsed panels stay in the DOM but are hidden — role queries skip them.
    expect(
      screen.queryByRole('region', { name: /How much does it cost/ }),
    ).not.toBeInTheDocument()

    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    const region = screen.getByRole('region', { name: /How much does it cost/ })
    expect(region).toBeVisible()
    expect(region).toHaveTextContent('It depends on scope.')
    expect(trigger.getAttribute('aria-controls')).toBe(region.id)
  })

  it('opens and closes panels independently', async () => {
    const user = userEvent.setup()
    render(<Accordion items={items} />)
    const first = screen.getByRole('button', { name: /How much does it cost/ })
    const second = screen.getByRole('button', { name: /How long does it take/ })

    await user.click(first)
    await user.click(second)
    expect(first).toHaveAttribute('aria-expanded', 'true')
    expect(second).toHaveAttribute('aria-expanded', 'true')

    await user.click(first)
    expect(first).toHaveAttribute('aria-expanded', 'false')
    expect(second).toHaveAttribute('aria-expanded', 'true')
  })

  it('is keyboard operable (Enter toggles)', async () => {
    const user = userEvent.setup()
    render(<Accordion items={items} />)
    const trigger = screen.getByRole('button', { name: /How much does it cost/ })
    trigger.focus()
    await user.keyboard('{Enter}')
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })
})
