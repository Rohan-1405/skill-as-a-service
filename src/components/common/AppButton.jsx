import React from 'react';

/**
 * AppButton — Shared button component for the entire project.
 *
 * Props:
 *   children    — button label / content
 *   variant     — "primary" | "secondary" | "danger" | "outline" | "gold" | "ghost"
 *   size        — "sm" | "md" | "lg"
 *   type        — HTML button type ("button" | "submit" | "reset")
 *   onClick     — click handler
 *   disabled    — disables the button
 *   isLoading   — shows spinner and disables
 *   fullWidth   — stretches to 100% width
 *   className   — extra CSS classes
 *
 * Owner: Lohith — do not edit without informing the team.
 */

const styles = {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-2)',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'var(--font-family)',
    fontWeight: 'var(--font-weight-semibold)',
    borderRadius: 'var(--radius-md)',
    transition: 'opacity var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast)',
    textDecoration: 'none',
    lineHeight: 1,
  },
  size: {
    sm: { padding: 'var(--space-2) var(--space-3)',  fontSize: 'var(--font-size-sm)' },
    md: { padding: 'var(--space-3) var(--space-5)',  fontSize: 'var(--font-size-base)' },
    lg: { padding: 'var(--space-4) var(--space-8)',  fontSize: 'var(--font-size-lg)' },
  },
  variant: {
    primary: {
      background: 'var(--color-primary-gradient)',
      color: 'var(--color-primary-text)',
      boxShadow: 'var(--shadow-btn)',
    },
    secondary: {
      background: 'var(--color-bg-input)',
      color: 'var(--color-text)',
      border: '1.5px solid var(--color-border)',
    },
    danger: {
      background: 'var(--color-danger)',
      color: '#fff',
    },
    outline: {
      background: 'transparent',
      color: 'var(--color-primary)',
      border: '1.5px solid var(--color-primary)',
    },
    gold: {
      background: 'var(--brand-gold)',
      color: 'var(--color-highlight-text)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--color-primary)',
    },
  },
};

const AppButton = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  onClick,
  disabled = false,
  isLoading = false,
  fullWidth = false,
  className = '',
  style = {},
}) => {
  const isDisabled = disabled || isLoading;

  const computedStyle = {
    ...styles.base,
    ...styles.size[size],
    ...styles.variant[variant],
    width: fullWidth ? '100%' : undefined,
    opacity: isDisabled ? 0.6 : 1,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    ...style,
  };

  const handleHover = (e, enter) => {
    if (isDisabled) return;
    e.currentTarget.style.opacity = enter ? '0.88' : '1';
    e.currentTarget.style.transform = enter ? 'translateY(-1px)' : 'translateY(0)';
  };

  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={isDisabled}
      style={computedStyle}
      onMouseEnter={(e) => handleHover(e, true)}
      onMouseLeave={(e) => handleHover(e, false)}
    >
      {isLoading ? (
        <>
          <span
            style={{
              width: 16,
              height: 16,
              border: '2px solid rgba(255,255,255,0.35)',
              borderTopColor: variant === 'secondary' || variant === 'outline' ? 'var(--color-primary)' : '#fff',
              borderRadius: '50%',
              animation: 'appbtn-spin 0.7s linear infinite',
              flexShrink: 0,
            }}
          />
          <style>{`@keyframes appbtn-spin { to { transform: rotate(360deg); } }`}</style>
          Loading…
        </>
      ) : children}
    </button>
  );
};

export default AppButton;
