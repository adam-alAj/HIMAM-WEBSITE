import type { ChangeEvent } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Input } from './Input'

describe('Input', () => {
  it('associates the label with the field via htmlFor/id', () => {
    render(<Input label="Your name" />)
    const field = screen.getByLabelText('Your name')
    expect(field).toBeInstanceOf(HTMLInputElement)
  })

  it('marks required fields in the label and with aria-required', () => {
    render(<Input label="Email" required />)
    const field = screen.getByLabelText(/Email/)
    expect(field).toHaveAttribute('aria-required', 'true')
    expect(screen.getByText('(required)')).toBeInTheDocument()
  })

  it('shows an error with aria-invalid and wires aria-describedby', () => {
    render(<Input label="Email" error="Please enter a valid email." />)
    const field = screen.getByLabelText('Email')
    expect(field).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('alert')).toHaveTextContent('Please enter a valid email.')
    const errorId = screen.getByRole('alert').id
    expect(field.getAttribute('aria-describedby')).toContain(errorId)
  })

  it('renders a textarea in multiline mode', () => {
    render(<Input label="Message" multiline />)
    expect(screen.getByLabelText('Message')).toBeInstanceOf(HTMLTextAreaElement)
  })

  it('forwards change events with the field value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Input label="Name" onChange={onChange} />)
    await user.type(screen.getByLabelText('Name'), 'Jane')
    expect(onChange).toHaveBeenCalled()
    const event = onChange.mock.calls.at(-1)?.[0] as ChangeEvent<HTMLInputElement>
    expect(event.target.value).toBe('Jane')
  })
})
