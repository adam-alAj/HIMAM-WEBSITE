/**
 * Black-box API tests for the Strapi public endpoints (Phases 4–9 content
 * types). Run against a booted instance (tests/run.mjs boots one; in CI the
 * suite is executed after the CMS is healthy). Zero dependencies — uses
 * node:test and the global fetch.
 *
 * Coverage:
 *   - Every content type's public list/findOne returns 200 with the expected
 *     shape (documentId + required fields, seeded data present).
 *   - Write routes (POST/PUT/DELETE) reject unauthenticated requests (401).
 *   - The one public write (contact form) validates, honeypots, and rate-limits.
 */
import test from 'node:test'
import assert from 'node:assert/strict'

const CMS_URL = process.env.CMS_URL ?? 'http://127.0.0.1:1337'

async function api(path, options = {}) {
  const response = await fetch(`${CMS_URL}/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  let body = null
  try {
    body = await response.json()
  } catch {
    // Non-JSON response — body stays null.
  }
  return { status: response.status, body }
}

/**
 * Content types from Phases 4–9 and the scalar fields each entry must expose
 * on the public list endpoint (components/relations need explicit populate,
 * so only top-level scalar fields are asserted here).
 */
const CONTENT_TYPES = {
  service: {
    plural: 'services',
    fields: ['title', 'slug', 'shortDescription', 'icon'],
  },
  'team-member': {
    plural: 'team-members',
    fields: ['name', 'role', 'focusArea', 'bio'],
  },
  accomplishment: {
    plural: 'accomplishments',
    fields: ['projectName', 'slug', 'problem', 'solution', 'outcome'],
  },
  metric: {
    plural: 'metrics',
    fields: ['value', 'label'],
  },
  value: {
    plural: 'values',
    fields: ['title', 'text', 'icon'],
  },
  testimonial: {
    plural: 'testimonials',
    fields: ['clientName', 'clientRole', 'quote'],
  },
  faq: {
    plural: 'faqs',
    fields: ['question', 'answer', 'category'],
  },
  'blog-post': {
    plural: 'blog-posts',
    fields: ['title', 'slug', 'excerpt', 'body', 'category'],
  },
  'legal-page': {
    plural: 'legal-pages',
    fields: ['title', 'slug', 'body', 'lastUpdated'],
  },
}

for (const [name, { plural, fields }] of Object.entries(CONTENT_TYPES)) {
  test(`public API: ${name} list returns seeded entries with the expected shape`, async () => {
    const { status, body } = await api(`/${plural}?pagination[pageSize]=100`)

    assert.equal(status, 200, `${plural} should be publicly readable`)
    assert.ok(Array.isArray(body?.data), 'response must have a data array')
    assert.ok(body.data.length > 0, 'seed data must be present')
    assert.ok(body.meta?.pagination, 'pagination meta must be present')

    for (const entry of body.data) {
      assert.ok(entry.documentId, 'every entry must expose documentId')
      for (const field of fields) {
        assert.ok(field in entry, `${plural} entry must expose "${field}"`)
      }
    }
  })

  test(`public API: ${name} findOne by documentId works`, async () => {
    const list = await api(`/${plural}?pagination[pageSize]=1`)
    const documentId = list.body.data[0].documentId

    const { status, body } = await api(`/${plural}/${documentId}`)
    assert.equal(status, 200)
    assert.equal(body.data.documentId, documentId)
  })

  test(`permissions: unauthenticated writes to ${name} are rejected`, async () => {
    const sample = { title: 'Hacker test' }
    const post = await api(`/${plural}`, { method: 'POST', body: JSON.stringify(sample) })
    assert.equal(post.status, 401, `POST /${plural} must require auth`)

    const put = await api(`/${plural}/000000000000000000000000`, {
      method: 'PUT',
      body: JSON.stringify(sample),
    })
    assert.equal(put.status, 401, `PUT /${plural}/:id must require auth`)

    const del = await api(`/${plural}/000000000000000000000000`, { method: 'DELETE' })
    assert.equal(del.status, 401, `DELETE /${plural}/:id must require auth`)
  })
}

test('service list exposes the features component when populated', async () => {
  const { status, body } = await api('/services?populate=features&pagination[pageSize]=1')
  assert.equal(status, 200)
  const service = body.data[0]
  assert.ok(Array.isArray(service.features), 'features must populate as an array')
  assert.ok(service.features.length > 0, 'seeded services have features')
  assert.ok(service.features[0].text, 'each feature has text')
})

test('blog-post findOne by slug filter returns the matching post with author', async () => {
  const { body } = await api(
    '/blog-posts?populate[0]=author&filters[slug][$eq]=how-we-approach-ai-chatbot-projects&pagination[pageSize]=1',
  )
  assert.equal(body.data.length, 1)
  assert.equal(body.data[0].slug, 'how-we-approach-ai-chatbot-projects')
  assert.ok(body.data[0].author?.name, 'author must be populated')
})

test('contact form: valid submission is stored (201)', async () => {
  const { status, body } = await api('/contact-submissions', {
    method: 'POST',
    body: JSON.stringify({
      name: 'API Test',
      email: 'api-test@example.com',
      message: 'A valid enquiry from the automated test suite.',
    }),
  })
  assert.equal(status, 201, 'valid submissions must be accepted and stored')
  assert.equal(body?.ok, true)
})

test('contact form: invalid email is rejected (400) before storage', async () => {
  const { status, body } = await api('/contact-submissions', {
    method: 'POST',
    body: JSON.stringify({
      name: 'API Test',
      email: 'not-an-email',
      message: 'A valid enquiry from the automated test suite.',
    }),
  })
  assert.equal(status, 400)
  assert.ok(body?.error?.details?.errors?.email, 'email field error must be returned')
})

test('contact form: honeypot submissions are silently dropped (fake success)', async () => {
  const { status, body } = await api('/contact-submissions', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Bot',
      email: 'bot@example.com',
      message: 'SPAM SPAM SPAM',
      honeypot: 'filled-by-a-bot',
    }),
  })
  // Bots learn nothing: same success shape as a real submission, nothing stored.
  assert.equal(status, 200)
  assert.equal(body?.ok, true)
})

test('permissions: contact submissions are never publicly readable', async () => {
  const list = await api('/contact-submissions')
  assert.equal(list.status, 401, 'lead data must not be exposed over the public API')

  const findOne = await api('/contact-submissions/000000000000000000000000')
  assert.equal(findOne.status, 401)
})

// Runs last: the in-memory per-IP limiter (5 per hour) counts every
// non-honeypot request, so this test deliberately burns through the budget.
test('contact form: rate limiter rejects bursts with 429', async () => {
  const results = []
  for (let i = 0; i < 8; i += 1) {
    const { status } = await api('/contact-submissions', {
      method: 'POST',
      body: JSON.stringify({ name: 'Burst', email: `burst${i}@example.com`, message: 'x'.repeat(12) }),
    })
    results.push(status)
  }
  assert.ok(results.includes(429), `expected a 429 among the burst responses (got ${results})`)
})
