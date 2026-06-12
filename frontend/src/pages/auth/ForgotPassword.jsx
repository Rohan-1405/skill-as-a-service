import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';

const EmailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const MailIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6"/>
  </svg>
);

const AlertIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const validateEmail = (val) => {
  if (!val.trim()) return 'Email is required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Please enter a valid email address.';
  return '';
};

const ForgotPassword = () => {
  const [email, setEmail]     = useState('');
  const [error, setError]     = useState('');
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  const handleBlur = () => {
    setTouched(true);
    setError(validateEmail(email));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    const err = validateEmail(email);
    setError(err);
    if (err) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
  };

  return (
    <AuthLayout>
      <Link to="/login" className="forgot-back-link">
        <ArrowLeftIcon /> Back to sign in
      </Link>

      <div className="forgot-icon-wrap">
        <MailIcon />
      </div>

      <div className="auth-heading">
        <h1>Reset your password</h1>
        <p>Enter your email and we'll send you a reset link.</p>
      </div>

      {sent ? (
        <div className="success-box">
          <p>
            ✅ Reset link sent! Check your inbox at <strong>{email}</strong>.<br />
            Didn't get it? Check your spam folder.
          </p>
        </div>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="reset-email">Email Address</label>
            <div className="input-wrap">
              <span className="input-icon"><EmailIcon /></span>
              <input
                id="reset-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleBlur}
                className={touched && error ? 'error' : ''}
                autoComplete="email"
              />
            </div>
            {touched && error && (
              <span className="field-error"><AlertIcon /> {error}</span>
            )}
          </div>

          <button
            type="submit"
            className={`btn-primary${loading ? ' loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" />
                Sending link…
              </>
            ) : 'Send Reset Link'}
          </button>
        </form>
      )}

      <div className="auth-footer-row">
        Remembered your password?
        <Link to="/login">Sign in</Link>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
