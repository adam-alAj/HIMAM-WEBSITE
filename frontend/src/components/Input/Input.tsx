import { useId, type ChangeEventHandler, type FocusEventHandler } from 'react'
import { Icon } from '../Icon/Icon'
import styles from './Input.module.css'

export type InputSize = 'md' | 'lg'

interface InputProps {
  label: string
  id?: string
  name?: string
  type?: 'text' | 'email' | 'tel' | 'url' | 'password' | 'number' | 'search'
  placeholder?: string
  /** Supporting text shown below the field (hidden when an error is present). */
  hint?: string
  error?: string
  disabled?: boolean
  required?: boolean
  size?: InputSize
  /** Renders a <textarea> instead of <input>. */
  multiline?: boolean
  rows?: number
  defaultValue?: string
  value?: string
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
  autoComplete?: string
}

/**
 * Form field with visible, associated label, hint/error messaging, and full
 * aria wiring (MASTER.md §15). Error pairs icon + text — never color alone.
 */
export function Input({
  label,
  id,
  name,
  type = 'text',
  placeholder,
  hint,
  error,
  disabled = false,
  required = false,
  size = 'md',
  multiline = false,
  rows = 4,
  defaultValue,
  value,
  onChange,
  onBlur,
  autoComplete,
}: InputProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const hintId = hint ? `${fieldId}-hint` : undefined
  const errorId = error ? `${fieldId}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  const classes = [styles.field, styles[size], error ? styles.hasError : '']
    .filter(Boolean)
    .join(' ')

  const fieldClasses = multiline ? styles.textarea : styles.input

  const commonProps = {
    id: fieldId,
    name,
    placeholder,
    disabled,
    value,
    defaultValue,
    onChange,
    onBlur,
    autoComplete,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
    'aria-required': required || undefined,
  }

  return (
    <div className={classes}>
      <label className={styles.label} htmlFor={fieldId}>
        {label}
        {required && (
          <>
            <span aria-hidden="true"> *</span>
            <span className="sr-only">(required)</span>
          </>
        )}
      </label>
      {multiline ? (
        <textarea className={fieldClasses} rows={rows} {...commonProps} />
      ) : (
        <input className={fieldClasses} type={type} {...commonProps} />
      )}
      {error ? (
        <p id={errorId} className={styles.errorText} role="alert">
          <Icon name="alert-triangle" size={14} aria-hidden="true" />
          {error}
        </p>
      ) : (
        hint && (
          <p id={hintId} className={styles.hint}>
            {hint}
          </p>
        )
      )}
    </div>
  )
}
