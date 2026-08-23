import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  fetchServices: vi.fn(),
  submitContactSubmission: vi.fn(),
}))

vi.mock('../lib/cms', () => ({
  fetchServices: mocks.fetchServices,
  submitContactSubmission: mocks.submitContactSubmission,
}))

import Contact from './Contact'

function renderContact() {
  return render(<Contact />)
}

/** Fills every required field with valid values. */
async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/Name/), 'Jane Smith')
  await user.type(screen.getByLabelText(/Email/), 'jane@example.com')
  await user.type(screen.getByLabelText(/Message/), 'We need a customer portal rebuilt before Q4.')
}

describe('Contact page', () => {
  beforeEach(() => {
    mocks.fetchServices.mockReset().mockResolvedValue([])
    mocks.submitContactSubmission.mockReset()
  })

  it('loads the service dropdown options from the CMS', async () => {
    mocks.fetchServices.mockResolvedValue([
      {
        id: 1,
        documentId: 'svc-1',
        title: 'Custom Applications',
        slug: 'custom-applications',
      },
    ])
    renderContact()

    const select = await screen.findByLabelText(/Service of interest/)
    expect(await screen.findByRole('option', { name: 'Custom Applications' })).toBeInTheDocument()
    expect(select).not.toBeDisabled()
  })

  it('shows field-level errors when submitting an empty form', async () => {
    const user = userEvent.setup()
    renderContact()

    await user.click(screen.getByRole('button', { name: /Send message/ }))

    expect(await screen.findByText('Please enter your name.')).toBeInTheDocument()
    expect(screen.getByText('Please enter your email.')).toBeInTheDocument()
    expect(screen.getByText('Please tell us a little about your project.')).toBeInTheDocument()
    expect(mocks.submitContactSubmission).not.toHaveBeenCalled()
  })

  it('rejects an invalid email format client-side', async () => {
    const user = userEvent.setup()
    renderContact()

    await user.type(screen.getByLabelText(/Name/), 'Jane Smith')
    await user.type(screen.getByLabelText(/Email/), 'not-an-email')
    await user.type(screen.getByLabelText(/Message/), 'This is a real project message here.')
    await user.click(screen.getByRole('button', { name: /Send message/ }))

    expect(
      await screen.findByText(/That doesn’t look like a valid email address/),
    ).toBeInTheDocument()
    expect(mocks.submitContactSubmission).not.toHaveBeenCalled()
  })

  it('submits valid data and shows the success panel', async () => {
    const user = userEvent.setup()
    mocks.submitContactSubmission.mockResolvedValue(undefined)
    renderContact()

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /Send message/ }))

    const success = await screen.findByRole('status')
    expect(success).toHaveTextContent('Message sent.')
    expect(mocks.submitContactSubmission).toHaveBeenCalledTimes(1)
    const payload = mocks.submitContactSubmission.mock.calls[0][0]
    expect(payload).toMatchObject({
      name: 'Jane Smith',
      email: 'jane@example.com',
      honeypot: '',
    })
    expect(payload.budgetMax).toBeNull()
  })

  it('surfaces a submission failure in an error alert and keeps the form', async () => {
    const user = userEvent.setup()
    mocks.submitContactSubmission.mockRejectedValue(new Error('Submission failed (500)'))
    renderContact()

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /Send message/ }))

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(/Submission failed \(500\)/)
    // The form is still present so the visitor can retry.
    expect(screen.getByRole('button', { name: /Send message/ })).toBeInTheDocument()
  })
})
