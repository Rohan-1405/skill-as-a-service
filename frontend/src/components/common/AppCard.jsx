import React from 'react';

/**
 * AppCard — Shared card / panel component for the entire project.
 *
 * Props:
 *   children      — card body content
 *   title         — card header title
 *   subtitle      — small text below title
 *   headerRight   — JSX rendered on the right side of the header (e.g. a button)
 *   accentColor   — top border color: "blue" | "cyan" | "gold" (optional)
 *   noPadding     — removes default body padding (for tables that go edge-to-edge)
 *   className     — extra CSS classes
 *   style         — extra inline styles on the card wrapper
 *
 * Owner: Lohith — do not edit without informing the team.
 */

const ACCENT_MAP = {
  blue: 'var(--brand-blue)',
  cyan: 'var(--brand-cyan)',
  gold: 'var(--brand-gold)',
};

const AppCard = ({
  children,
  title,
  subtitle,
  headerRight,
  accentColor,
  noPadding = false,
  className = '',
  style = {},
}) => {
  return (
    <div
      className={className}
      style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
        borderTop: accentColor ? `3px solid ${ACCENT_MAP[accentColor] || accentColor}` : undefined,
        ...style,
      }}
    >
      {(title || headerRight) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-4) var(--space-6)',
            borderBottom: '1px solid var(--color-border)',
            background: 'var(--color-bg-card)',
          }}
        >
          <div>
            {title && (
              <h6
                style={{
                  margin: 0,
                  fontWeight: 'var(--font-weight-semibold)',
                  fontSize: 'var(--font-size-base)',
                  color: 'var(--color-text)',
                  fontFamily: 'var(--font-family)',
                }}
              >
                {title}
              </h6>
            )}
            {subtitle && (
              <p
                style={{
                  margin: '2px 0 0',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-muted)',
                  fontFamily: 'var(--font-family)',
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          {headerRight && <div>{headerRight}</div>}
        </div>
      )}

      <div style={noPadding ? { padding: 0 } : { padding: 'var(--space-6)' }}>
        {children}
      </div>
    </div>
  );
};

export default AppCard;
