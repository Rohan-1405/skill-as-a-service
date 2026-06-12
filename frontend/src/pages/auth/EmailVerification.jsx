import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';

/**
 * EmailVerification — shown after registration.
 *
 * Flow:  Register → /verify-email (this page) → /login
 *
 * Two states:
 *   Default          — waiting, shows mail icon + resend button
 *   ?verified=true   — verified via email link, shows green check + go to login
 */

const MailIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const EmailVerification = () => {
  const [searchParams]              = useSearchParams();
  const [resending, setResending]   = useState(false);
  const [resent, setResent]         = useState(false);

  const isVerified = searchParams.get('verified') === 'true';

  const handleResend = async () => {
    setResending(true);
    // TODO (Day 2 API): call authService.resendVerification()
    await new Promise((r) => setTimeout(r, 1500));
    setResending(false);
    setResent(true);
    setTimeout(() => setResent(false), 4000);
  };

  return (
    <AuthLayout>

      {/* Icon */}
      <div style={{
        width: 68,
        height: 68,
        borderRadius: '50%',
        background: isVerified
          ? 'rgba(100, 255, 218, 0.08)'
          : 'rgba(26, 159, 224, 0.1)',
        border: `1px solid ${isVerified
          ? 'rgba(100, 255, 218, 0.25)'
          : 'rgba(26, 159, 224, 0.2)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px',
        color: isVerified ? 'var(--color-success)' : 'var(--color-primary)',
      }}>
        {isVerified ? <CheckIcon /> : <MailIcon />}
      </div>

      {/* Heading */}
      <div className="auth-heading">
        <h1>{isVerified ? 'Email Verified!' : 'Check Your Email'}</h1>
        <p>
          {isVerified
            ? 'Your account is now active. You can sign in.'
            : "We've sent a verification link to your registered email address. Click the link to activate your account."}
        </p>
      </div>

      {/* Content */}
      {isVerified ? (

        /* ── Verified: go to login ── */
        <Link
          to="/login"
          style={{
            display: 'block',
            width: '100%',
            padding: '11px',
            background: 'var(--gradient-blue)',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '600',
            fontFamily: 'var(--font-family)',
            borderRadius: 'var(--radius-sm)',
            textAlign: 'center',
            textDecoration: 'none',
            boxShadow: 'var(--shadow-btn)',
          }}
        >
          Go to Sign In
        </Link>

      ) : (

        /* ── Waiting: resend option ── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

          {/* Resent success message */}
          {resent && (
            <div style={{
              background: 'rgba(100, 255, 218, 0.06)',
              border: '1px solid rgba(100, 255, 218, 0.2)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              fontSize: '13px',
              color: 'var(--color-success)',
              textAlign: 'center',
            }}>
              ✅ Verification email resent. Check your inbox.
            </div>
          )}

          {/* Resend button */}
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            style={{
              width: '100%',
              padding: '11px',
              background: 'transparent',
              color: 'var(--color-primary)',
              border: '1.5px solid var(--color-primary)',
              fontSize: '14px',
              fontWeight: '600',
              fontFamily: 'var(--font-family)',
              borderRadius: 'var(--radius-sm)',
              cursor: resending ? 'not-allowed' : 'pointer',
              opacity: resending ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'opacity var(--transition-fast)',
            }}
          >
            {resending ? (
              <>
                <span style={{
                  width: 14,
                  height: 14,
                  border: '2px solid rgba(26,159,224,0.3)',
                  borderTopColor: 'var(--color-primary)',
                  borderRadius: '50%',
                  animation: 'ev-spin 0.7s linear infinite',
                  flexShrink: 0,
                }} />
                <style>{`@keyframes ev-spin { to { transform: rotate(360deg); } }`}</style>
                Sending…
              </>
            ) : 'Resend Verification Email'}
          </button>

          {/* Helper text */}
          <p style={{
            textAlign: 'center',
            fontSize: '12.5px',
            color: 'var(--color-text-muted)',
            margin: 0,
            lineHeight: '1.6',
          }}>
            Didn't receive it? Check your spam folder or try a different email.
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="auth-signup-row">
        <Link to="/login" style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
          ← Back to Sign In
        </Link>
      </div>

    </AuthLayout>
  );
};

export default EmailVerification;
