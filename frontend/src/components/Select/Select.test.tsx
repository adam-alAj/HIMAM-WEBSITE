import type { ChangeEvent } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Select } from './Select'

const options = [
  { value: '1', label: 'Custom Applications' },
  { value: '2', label: 'Website Development' },
]

describe('Select', () => {
  it('renders a labelled select with the given options', () => {
    render(<Select label="Service" options={options} />)
    const select = screen.getByLabelText('Service')
    expect(select).toBeInstanceOf(HTMLSelectElement)
    expect(screen.getAllByRole('option')).toHaveLength(2)
    expect(screen.getByRole('option', { name: 'Website Development' })).toBeInTheDocument()
  })

  it('fires onChange with the selected value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Select label="Service" options={options} onChange={onChange} />)
    await user.selectOptions(screen.getByLabelText('Service'), '2')
    expect(onChange).toHaveBeenCalled()
    const event = onChange.mock.calls.at(-1)?.[0] as ChangeEvent<HTMLSelectElement>
    expect(event.target.value).toBe('2')
  })

  it('is disabled when given the disabled prop', () => {
    render(<Select label="Service" options={options} disabled />)
    expect(screen.getByLabelText('Service')).toBeDisabled()
  })
})
