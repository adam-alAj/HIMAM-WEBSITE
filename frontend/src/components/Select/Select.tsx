import { useId, type ChangeEventHandler } from 'react'
import { Icon } from '../Icon/Icon'
import styles from './Select.module.css'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  label: string
  id?: string
  name?: string
  options: SelectOption[]
  /** First, empty option (e.g. \"Select a service (optional)\"). */
  placeholder?: string
  hint?: string
  error?: string
  disabled?: boolean
  required?: boolean
  value?: string
  defaultValue?: string
  onChange?: ChangeEventHandler<HTMLSelectElement>
}

/**
 * Dropdown form field with visible, associated label, hint/error messaging,
 * and the same aria wiring as Input (MASTER.md §15). Error pairs icon + text.
 */
export function Select({
  label,
  id,
  name,
  options,
  placeholder,
  hint,
  error,
  disabled = false,
  required = false,
  value,
  defaultValue,
  onChange,
}: SelectProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const hintId = hint ? `${fieldId}-hint` : undefined
  const errorId = error ? `${fieldId}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  const classes = [styles.field, error ? styles.hasError : ''].filter(Boolean).join(' ')

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
      <div className={styles.wrap}>
        <select
          id={fieldId}
          name={name}
          className={styles.select}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          aria-required={required || undefined}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Icon name="chevron-down" size={16} className={styles.chevron} aria-hidden="true" />
      </div>
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
