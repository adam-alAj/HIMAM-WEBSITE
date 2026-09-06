import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import { Button } from '../components/Button/Button'
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
  service: string
  budgetMax: string
  message: string
  honeypot: string
}

type FieldName = 'name' | 'email' | 'company' | 'service' | 'budgetMax' | 'message'
type FormErrors = Partial<Record<FieldName, string>>
type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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
    errors.email = 'That doesn\u2019t look like a valid email address.'
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

export default function Contact() {
  const [values, setValues] = useState<FormValues>(EMPTY_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [servicesReady, setServicesReady] = useState(false)

  const schedulingUrl = import.meta.env.VITE_SCHEDULING_URL as string | undefined

  useEffect(() => {
    let cancelled = false
    fetchServices()
      .then((list) => { if (!cancelled) setServices(list) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setServicesReady(true) })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    setPageMeta({
      title: 'Contact \u2014 Himam',
      description:
        'Start a project with Himam \u2014 tell us what you\'re working on and we\'ll reply within one business day.',
    })
  }, [])

  const handleChange =
    (field: keyof FormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }))
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
      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                                */}
      {/* ------------------------------------------------------------------ */}
      <Section background="default" padding="lg">
        <div className={styles.hero}>
          {/* Decorative grid background */}
          <div className={styles.heroGrid} aria-hidden="true" />
          <div className={styles.heroGlow} aria-hidden="true" />

          <p className={styles.eyebrow}>Get in touch</p>
          <h1 className={styles.heroTitle}>
            Let{'\u2019'}s build something{' '}
            <span className={styles.heroAccent}>great</span> together.
          </h1>
          <p className={styles.heroLead}>
            Tell us what you{'\u2019'}re working on and we{'\u2019'}ll come back within one
            business day with honest feedback and a clear next step. No pressure, no pitch.
          </p>
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* Main contact area                                                   */}
      {/* ------------------------------------------------------------------ */}
      <Section background="subtle" padding="lg">
        <div className={styles.contactGrid}>
          {/* ---- Left: Contact information ---- */}
          <div className={styles.infoPanel}>
            <div className={styles.infoHeader}>
              <h2 className={styles.infoTitle}>Have a project in mind?</h2>
              <p className={styles.infoBody}>
                We{'\u2019'}d love to hear about it. Reach out through any of these
                channels and we{'\u2019'}ll get back to you promptly.
              </p>
            </div>

            <div className={styles.infoCards}>
              <a href={`mailto:${siteEmail}`} className={styles.infoCard}>
                <span className={styles.infoCardIcon}>
                  <Icon name="mail" size={22} aria-hidden="true" />
                </span>
                <div className={styles.infoCardContent}>
                  <span className={styles.infoCardLabel}>Email us</span>
                  <span className={styles.infoCardValue}>{siteEmail}</span>
                </div>
                <Icon name="arrow-up-right" size={16} className={styles.infoCardArrow} aria-hidden="true" />
              </a>

              {schedulingUrl ? (
                <a href={schedulingUrl} className={styles.infoCard}>
                  <span className={styles.infoCardIcon}>
                    <Icon name="calendar" size={22} aria-hidden="true" />
                  </span>
                  <div className={styles.infoCardContent}>
                    <span className={styles.infoCardLabel}>Schedule a call</span>
                    <span className={styles.infoCardValue}>Book a time that works</span>
                  </div>
                  <Icon name="arrow-up-right" size={16} className={styles.infoCardArrow} aria-hidden="true" />
                </a>
              ) : (
                <div className={styles.infoCard}>
                  <span className={styles.infoCardIcon}>
                    <Icon name="calendar" size={22} aria-hidden="true" />
                  </span>
                  <div className={styles.infoCardContent}>
                    <span className={styles.infoCardLabel}>Prefer to talk?</span>
                    <span className={styles.infoCardValue}>
                      We{'\u2019'}ll send a scheduling link with our reply.
                    </span>
                  </div>
                </div>
              )}

              <div className={styles.infoCard}>
                <span className={styles.infoCardIcon}>
                  <Icon name="clock" size={22} aria-hidden="true" />
                </span>
                <div className={styles.infoCardContent}>
                  <span className={styles.infoCardLabel}>Response time</span>
                  <span className={styles.infoCardValue}>
                    Within one business day, usually faster.
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.infoHighlight}>
              <Icon name="send" size={18} aria-hidden="true" />
              <p className={styles.infoHighlightText}>
                Most projects start with a 30-minute discovery call. We{'\u2019'}ll
                listen, ask questions, and tell you honestly whether we{'\u2019'}re the
                right fit.
              </p>
            </div>
          </div>

          {/* ---- Right: Contact form ---- */}
          <div className={styles.formCard}>
            {status === 'success' ? (
              <div className={styles.success} role="status">
                <span className={styles.successIconRing}>
                  <span className={styles.successIcon}>
                    <Icon name="check" size={32} aria-hidden="true" />
                  </span>
                </span>
                <h2 className={styles.successTitle}>Message sent.</h2>
                <p className={styles.successBody}>
                  Thanks{values.name.trim() ? `, ${values.name.trim().split(' ')[0]}` : ''}.
                  We{'\u2019'}ll reply within one business day.
                </p>
                <Button variant="secondary" size="lg" onClick={resetForm}>
                  Send another message
                </Button>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <div className={styles.formHeader}>
                  <h2 className={styles.formTitle}>Start a project</h2>
                  <p className={styles.formIntro}>
                    Fill out the form and we{'\u2019'}ll be in touch.
                  </p>
                </div>

                {status === 'error' && (
                  <div className={styles.formError} role="alert">
                    <Icon name="alert-triangle" size={16} aria-hidden="true" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className={styles.formBody}>
                  <div className={styles.fieldRow}>
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
                  </div>

                  <div className={styles.fieldRow}>
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
                      placeholder="Select a service"
                      options={services.map((s) => ({
                        value: String(s.id),
                        label: s.title,
                      }))}
                      disabled={!servicesReady}
                      value={values.service}
                      onChange={handleChange('service')}
                    />
                  </div>

                  <Input
                    label="Budget"
                    name="budgetMax"
                    type="number"
                    placeholder="e.g. 10000"
                    min="0"
                    step="1"
                    value={values.budgetMax}
                    onChange={handleChange('budgetMax')}
                  />

                  <Input
                    label="Message"
                    name="message"
                    multiline
                    rows={5}
                    placeholder="What are you trying to build? What{'\u2019'}s the timeline?"
                    required
                    value={values.message}
                    onChange={handleChange('message')}
                    error={errors.message}
                  />
                </div>

                {/* Honeypot */}
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

                <div className={styles.submitArea}>
                  <Button
                    type="submit"
                    size="lg"
                    fullWidth
                    loading={status === 'submitting'}
                    className={styles.submitButton}
                  >
                    {status === 'submitting' ? (
                      'Sending\u2026'
                    ) : (
                      <>
                        Send message
                        <Icon name="send" size={16} aria-hidden="true" className={styles.submitIcon} />
                      </>
                    )}
                  </Button>
                  <p className={styles.privacyNote}>
                    We only use your details to reply. No newsletters, no sharing.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </Section>
    </>
  )
}
