import React from 'react';

/**
 * AuthLayout — Centered dark card for all authentication pages.
 * Matches the original dark theme design exactly.
 */
const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout">
      <div className="auth-card">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
