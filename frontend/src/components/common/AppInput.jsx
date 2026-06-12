import React from 'react';

/**
 * AppInput — Shared input component for the entire project.
 *
 * Props:
 *   label           — field label text
 *   type            — input type ("text" | "email" | "password" | "number" ...)
 *   name            — input name / id
 *   value           — controlled value
 *   onChange        — change handler
 *   onBlur          — blur handler
 *   placeholder     — placeholder text
 *   error           — error message string (shows red border + message)
 *   helpText        — small helper text below (only if no error)
 *   required        — shows asterisk on label
 *   disabled        — disables the input
 *   readOnly        — read-only mode
 *   leftIcon        — JSX element placed inside left of input
 *   rightElement    — JSX element placed inside right of input (e.g. eye toggle)
 *   className       — extra class on outer wrapper
 *
 * Owner: Lohith — do not edit without informing the team.
 */

const AppInput = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  helpText,
  required = false,
  disabled = false,
  readOnly = false,
  leftIcon,
  rightElement,
  className = '',
  autoComplete,
}) => {
  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
      {label && (
        <label
          htmlFor={name}
          style={{
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--color-text)',
            fontFamily: 'var(--font-family)',
          }}
        >
          {label}
          {required && (
            <span style={{ color: 'var(--color-danger)', marginLeft: 2 }}>*</span>
          )}
        </label>
      )}

      <div style={{ position: 'relative' }}>
        {leftIcon && (
          <span
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          >
            {leftIcon}
          </span>
        )}

        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          autoComplete={autoComplete}
          style={{
            width: '100%',
            background: 'var(--color-bg-input)',
            border: `1.5px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-md)',
            padding: `var(--space-3) ${rightElement ? '40px' : 'var(--space-3)'} var(--space-3) ${leftIcon ? '38px' : 'var(--space-3)'}`,
            color: 'var(--color-text)',
            fontSize: 'var(--font-size-sm)',
            fontFamily: 'var(--font-family)',
            outline: 'none',
            opacity: disabled ? 0.6 : 1,
            cursor: disabled ? 'not-allowed' : readOnly ? 'default' : 'text',
            transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = error ? 'var(--color-danger)' : 'var(--color-border-focus)';
            e.target.style.boxShadow = error
              ? '0 0 0 3px rgba(239, 68, 68, 0.12)'
              : '0 0 0 3px rgba(3, 90, 225, 0.12)';
          }}
          onBlurCapture={(e) => {
            e.target.style.boxShadow = 'none';
          }}
        />

        {rightElement && (
          <span
            style={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {rightElement}
          </span>
        )}
      </div>

      {error && (
        <span
          style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-danger)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-1)',
          }}
        >
          {error}
        </span>
      )}

      {helpText && !error && (
        <span
          style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-text-muted)',
          }}
        >
          {helpText}
        </span>
      )}
    </div>
  );
};

export default AppInput;
