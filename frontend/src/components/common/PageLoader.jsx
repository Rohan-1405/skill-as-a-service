import React from 'react';

/**
 * PageLoader — Full-page centered loading spinner.
 * Used while async data or routes are loading.
 *
 * Props:
 *   message — optional text below spinner (default: "Loading...")
 *
 * Owner: Lohith — do not edit without informing the team.
 */

const PageLoader = ({ message = 'Loading...' }) => (
  <div
    style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-4)',
      fontFamily: 'var(--font-family)',
    }}
  >
    <div
      style={{
        width: 44,
        height: 44,
        border: '3px solid var(--color-primary-light)',
        borderTopColor: 'var(--color-primary)',
        borderRadius: '50%',
        animation: 'pageloader-spin 0.8s linear infinite',
      }}
    />
    <style>{`@keyframes pageloader-spin { to { transform: rotate(360deg); } }`}</style>
    <p
      style={{
        color: 'var(--color-text-muted)',
        fontSize: 'var(--font-size-sm)',
        margin: 0,
      }}
    >
      {message}
    </p>
  </div>
);

export default PageLoader;
