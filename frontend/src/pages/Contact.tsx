import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import { Button } from '../components/Button/Button'
import { Card } from '../components/Card/Card'
import { Icon } from '../components/Icon/Icon'
import { Input } from '../components/Input/Input'
import { Section } from '../components/Section/Section'
import { Select } from '../components/Select/Select'
import {
  fetchServices,
  submitContactSubmission,
  type Service,
} from '../lib/cms'
import { setPageMeta } from '../lib/seo'
import { siteEmail } from '../lib/site'
import styles from './Contact.module.css'

interface FormValues {
  name: string
  email: string
  company: string
  /** Empty string or a Service id (select values are strings). */
  service: string
  budgetMax: string
  message: string
  /** Honeypot — stays visually hidden; bots that fill it get a fake success. */
  honeypot: string
}

type FieldName = 'name' | 'email' | 'company' | 'service' | 'budgetMax' | 'message'
type FormErrors = Partial<Record<FieldName, string>>

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Client-side validation — mirrors the server rules in the CMS submit handler. */
function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {}

  if (!values.name.trim()) {
    errors.name = 'Please enter your name.'
  } else if (values.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.'
  }

  if (!values.email.trim()) {
    errors.email = 'Please enter your email.'
  } else if (!EMAIL_RE.test(values.email.trim())) {
    errors.email = 'That doesn’t look like a valid email address.'
  }

  if (!values.message.trim()) {
    errors.message = 'Please tell us a little about your project.'
  } else if (values.message.trim().length < 10) {
    errors.message = 'A few more details would help (at least 10 characters).'
  }

  return errors
}

const EMPTY_FORM: FormValues = {
  name: '',
  email: '',
  company: '',
  service: '',
  budgetMax: '',
  message: '',
  honeypot: '',
}

/**
 * Contact page — the site's main conversion point. The form validates
 * client-side, submits to the CMS endpoint (which re-validates, checks the
 * honeypot, and rate-limits), and shows clear success/error states.
 */
export default function Contact() {
  const [values, setValues] = useState<FormValues>(EMPTY_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [services, setServices] = useState<Service[]>([])
  const [servicesReady, setServicesReady] = useState(false)

  const schedulingUrl = import.meta.env.VITE_SCHEDULING_URL as string | undefined

  // Service dropdown options come from the CMS (Phase 4 content type). If this
  // fetch fails the field still works — it just offers the empty option.
  useEffect(() => {
    let cancelled = false
    fetchServices()
      .then((list) => {
        if (!cancelled) setServices(list)
      })
      .catch(() => {
        // Dropdown falls back to the "not sure" placeholder.
      })
      .finally(() => {
        if (!cancelled) setServicesReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    setPageMeta({
      title: 'Contact — Himam',
      description:
        'Start a project with Himam — tell us what you’re working on and we’ll reply within one business day.',
    })
  }, [])

  const handleChange =
    (field: keyof FormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }))
      // Clear this field's error as the visitor fixes it.
      setErrors((prev) => {
        if (!(field in prev)) return prev
        const next = { ...prev }
        delete next[field as FieldName]
        return next
      })
    }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('submitting')
    setSubmitError(null)
    try {
      await submitContactSubmission({
        name: values.name.trim(),
        email: values.email.trim(),
        company: values.company.trim() || null,
        service: values.service ? Number(values.service) : null,
        budgetMax: values.budgetMax ? Number(values.budgetMax) : null,
        message: values.message.trim(),
        honeypot: values.honeypot,
      })
      setStatus('success')
    } catch (error) {
      setStatus('error')
      setSubmitError(
        error instanceof Error ? error.message : 'Something went wrong. Please try again.',
      )
    }
  }

  const resetForm = () => {
    setValues(EMPTY_FORM)
    setErrors({})
    setStatus('idle')
    setSubmitError(null)
  }

  return (
    <>
      {/* Hero */}
      <Section background="default" padding="lg">
        <div className={styles.hero}>
          <p className={styles.eyebrow}>Contact</p>
          <h1 className={styles.title}>Let’s talk.</h1>
          <p className={styles.lead}>
            Tell us what you’re working on and we’ll come back within one business day
            with honest feedback and a clear next step. No pressure, no pitch.
          </p>
        </div>
      </Section>

      {/* Form + secondary contact */}
      <Section background="subtle" padding="lg">
        <div className={styles.layout}>
          <Card padding="lg" className={styles.formCard}>
            {status === 'success' ? (
              <div className={styles.success} role="status">
                <span className={styles.successIcon}>
                  <Icon name="check" size={24} aria-hidden="true" />
                </span>
                <h2 className={styles.successTitle}>Message sent.</h2>
                <p className={styles.successBody}>
                  Thanks{values.name.trim() ? `, ${values.name.trim().split(' ')[0]}` : ''}.
                  We’ll reply within one business day — and if we can’t help, we’ll say so
                  honestly.
                </p>
                <Button variant="secondary" onClick={resetForm}>
                  Send another message
                </Button>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <h2 className={styles.formTitle}>Start a project</h2>
                <p className={styles.formIntro}>
                  The more specific you can be, the more useful our reply will be.
                </p>

                {status === 'error' && (
                  <div className={styles.formError} role="alert">
                    <Icon name="alert-triangle" size={16} aria-hidden="true" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className={styles.fieldGrid}>
                  <Input
                    label="Name"
                    name="name"
                    placeholder="Jane Smith"
                    required
                    autoComplete="name"
                    value={values.name}
                    onChange={handleChange('name')}
                    error={errors.name}
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="jane@company.com"
                    required
                    autoComplete="email"
                    value={values.email}
                    onChange={handleChange('email')}
                    error={errors.email}
                  />
                  <Input
                    label="Company"
                    name="company"
                    placeholder="Acme Corp (optional)"
                    autoComplete="organization"
                    value={values.company}
                    onChange={handleChange('company')}
                  />
                  <Select
                    label="Service of interest"
                    name="service"
                    placeholder="Select a service (optional)"
                    options={services.map((service) => ({
                      value: String(service.id),
                      label: service.title,
                    }))}
                    disabled={!servicesReady}
                    value={values.service}
                    onChange={handleChange('service')}
                    hint={
                      servicesReady
                        ? 'Not sure? Leave it blank — we’ll figure it out together.'
                        : undefined
                    }
                  />
                  <Input
                    label="Maximum budget"
                    name="budgetMax"
                    type="number"
                    placeholder="e.g. 10000"
                    min="0"
                    step="1"
                    hint="Enter the maximum budget for your project (optional)."
                    value={values.budgetMax}
                    onChange={handleChange('budgetMax')}
                  />
                </div>

                <div className={styles.messageField}>
                  <Input
                    label="Message"
                    name="message"
                    multiline
                    rows={6}
                    placeholder="What are you trying to build? What’s the timeline?"
                    required
                    value={values.message}
                    onChange={handleChange('message')}
                    error={errors.message}
                  />
                </div>

                {/* Honeypot — hidden from humans and assistive tech. */}
                <div className={styles.honeypot} aria-hidden="true">
                  <label htmlFor="contact-website">Leave this field empty</label>
                  <input
                    id="contact-website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={values.honeypot}
                    onChange={handleChange('honeypot')}
                  />
                </div>

                <Button type="submit" size="lg" fullWidth loading={status === 'submitting'}>
                  Send message
                </Button>
                <p className={styles.privacyNote}>
                  We only use your details to reply to this message. No newsletters, no
                  sharing.
                </p>
              </form>
            )}
          </Card>

          {/* Secondary ways to reach us */}
          <aside className={styles.aside}>
            <h2 className={styles.asideTitle}>Other ways to reach us</h2>

            <div className={styles.asideCard}>
              <span className={styles.asideIcon}>
                <Icon name="mail" size={20} aria-hidden="true" />
              </span>
              <div className={styles.asideText}>
                <p className={styles.asideLabel}>Email us directly</p>
                <a className={styles.asideValue} href={`mailto:${siteEmail}`}>
                  {siteEmail}
                </a>
              </div>
              <Button variant="secondary" size="sm" href={`mailto:${siteEmail}`}>
                Email
              </Button>
            </div>

            <div className={styles.asideCard}>
              <span className={styles.asideIcon}>
                <Icon name="calendar" size={20} aria-hidden="true" />
              </span>
              <div className={styles.asideText}>
                <p className={styles.asideLabel}>Prefer to talk?</p>
                {schedulingUrl ? (
                  <p className={styles.asideBody}>
                    Book a short intro call at a time that suits you.
                  </p>
                ) : (
                  <p className={styles.asideBody}>
                    We’ll send a scheduling link with our reply — no cold calls.
                  </p>
                )}
              </div>
              {schedulingUrl && (
                <Button variant="secondary" size="sm" href={schedulingUrl}>
                  Book a call
                </Button>
              )}
            </div>

            <p className={styles.asideNote}>
              We reply within one business day — usually much faster.
            </p>
          </aside>
        </div>
      </Section>
    </>
  )
}
