import React from 'react';

/**
 * AlertMessage — Inline alert / notification component.
 *
 * Props:
 *   type      — "success" | "danger" | "warning" | "info"
 *   message   — text to display (renders nothing if falsy)
 *   onClose   — optional close handler (shows × button when provided)
 *
 * Owner: Lohith — do not edit without informing the team.
 */

const ICON_MAP = {
  success: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  danger: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  warning: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  info: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  ),
};

const COLOR_MAP = {
  success: { bg: 'var(--color-success-light)', border: 'var(--color-success)', icon: 'var(--color-success)' },
  danger:  { bg: 'var(--color-danger-light)',  border: 'var(--color-danger)',  icon: 'var(--color-danger)'  },
  warning: { bg: 'var(--color-warning-light)', border: 'var(--color-warning)', icon: 'var(--color-warning)' },
  info:    { bg: 'var(--color-info-light)',    border: 'var(--color-accent)',  icon: 'var(--color-accent)'  },
};

const AlertMessage = ({ type = 'danger', message, onClose }) => {
  if (!message) return null;

  const colors = COLOR_MAP[type] || COLOR_MAP.danger;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--space-2)',
        padding: 'var(--space-3) var(--space-4)',
        background: colors.bg,
        border: `1px solid ${colors.border}30`,
        borderRadius: 'var(--radius-md)',
        marginBottom: 'var(--space-4)',
        fontSize: 'var(--font-size-sm)',
        color: 'var(--color-text)',
        fontFamily: 'var(--font-family)',
      }}
    >
      <span style={{ color: colors.icon, flexShrink: 0, marginTop: 1 }}>
        {ICON_MAP[type]}
      </span>
      <span style={{ flex: 1, lineHeight: 'var(--line-height-normal)' }}>{message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-text-muted)',
            padding: '0 var(--space-1)',
            fontSize: 18,
            lineHeight: 1,
            flexShrink: 0,
            fontFamily: 'var(--font-family)',
          }}
          aria-label="Close alert"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default AlertMessage;
