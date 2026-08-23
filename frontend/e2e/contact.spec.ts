import { expect, test } from '@playwright/test'

/**
 * End-to-end contact flow against the REAL stack (Strapi + Postgres + the
 * Vite app). The CMS is booted by playwright.config.ts with seeding enabled,
 * so the service dropdown has real options and POST /api/contact-submissions
 * is live.
 */
test.describe('Contact form', () => {
  test('blocks an empty submission with client-side validation', async ({ page }) => {
    await page.goto('/contact')

    await page.getByRole('button', { name: 'Send message' }).click()

    await expect(page.getByText('Please enter your name.')).toBeVisible()
    await expect(page.getByText('Please enter your email.')).toBeVisible()
    await expect(
      page.getByText('Please tell us a little about your project.'),
    ).toBeVisible()
  })

  test('rejects an invalid email before anything is sent', async ({ page }) => {
    await page.goto('/contact')

    await page.getByLabel(/^Name/).fill('Playwright Tester')
    await page.getByLabel(/^Email/).fill('not-an-email')
    await page.getByLabel(/^Message/).fill('This is a valid project message.')
    await page.getByRole('button', { name: 'Send message' }).click()

    await expect(
      page.getByText(/That doesn’t look like a valid email address/),
    ).toBeVisible()
  })

  test('submits a real enquiry end to end and shows the success state', async ({ page }) => {
    await page.goto('/contact')

    // Service dropdown is populated live from the CMS — pick the first offering.
    await page.getByLabel(/^Name/).fill('Playwright Tester')
    await page.getByLabel(/^Email/).fill('e2e@example.com')
    await page.getByLabel(/^Message/).fill(
      'Automated end-to-end test enquiry — please ignore. ' +
        'We are validating the contact pipeline from the CI pipeline.',
    )
    await page.getByLabel('Service of interest').selectOption({ index: 1 })
    await page.getByLabel('Maximum budget').fill('15000')

    await page.getByRole('button', { name: 'Send message' }).click()

    // Success panel replaces the form; the stored entry is visible in the
    // Strapi admin (Content Manager → Contact Submission).
    const success = page.getByRole('status')
    await expect(success).toContainText('Message sent.')
    await expect(success).toContainText('We’ll reply within one business day')

    // The form is gone — the page now offers "send another".
    await expect(page.getByRole('button', { name: /Send another message/ })).toBeVisible()
  })
})
