import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';

/* ── Icons ── */
const LockIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const LockSmIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6"/>
  </svg>
);

const AlertIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

/* ── Validation helpers ── */
const validatePassword = (val) => {
  if (!val) return 'Password is required.';
  if (val.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Z]/.test(val)) return 'Include at least one uppercase letter.';
  if (!/[0-9]/.test(val)) return 'Include at least one number.';
  return '';
};

const validateConfirm = (pass, confirm) => {
  if (!confirm) return 'Please confirm your password.';
  if (pass !== confirm) return 'Passwords do not match.';
  return '';
};

/* ── Strength meter ── */
const getStrength = (val) => {
  if (!val) return 0;
  let score = 0;
  if (val.length >= 8)          score++;
  if (val.length >= 12)         score++;
  if (/[A-Z]/.test(val))        score++;
  if (/[0-9]/.test(val))        score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  return score; // 0–5
};

const strengthLabel = (s) => {
  if (s <= 1) return { text: 'Weak',   color: 'var(--color-danger)' };
  if (s <= 3) return { text: 'Fair',   color: 'var(--color-warning)' };
  if (s <= 4) return { text: 'Good',   color: 'var(--color-info)' };
  return          { text: 'Strong', color: 'var(--color-success)' };
};

/* ── Requirements list ── */
const Req = ({ met, label }) => (
  <li className={`reset-req${met ? ' met' : ''}`}>
    <CheckIcon />
    {label}
  </li>
);

/* ═══════════════════════════════
   COMPONENT
═══════════════════════════════ */
const ResetPassword = () => {
  const navigate = useNavigate();

  const [password,        setPassword]        = useState('');
  const [confirm,         setConfirm]         = useState('');
  const [showPass,        setShowPass]        = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [touchedPass,     setTouchedPass]     = useState(false);
  const [touchedConfirm,  setTouchedConfirm]  = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [saved,           setSaved]           = useState(false);
  const [countdown,       setCountdown]       = useState(3);

  const passErr    = touchedPass    ? validatePassword(password)         : '';
  const confirmErr = touchedConfirm ? validateConfirm(password, confirm) : '';
  const strength   = getStrength(password);
  const strInfo    = strengthLabel(strength);

  const handleSubmit = async () => {
    setTouchedPass(true);
    setTouchedConfirm(true);
    if (validatePassword(password) || validateConfirm(password, confirm)) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500)); // simulate API
    setLoading(false);
    setSaved(true);

    // countdown then redirect
    let count = 3;
    const id = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count === 0) {
        clearInterval(id);
        navigate('/login');
      }
    }, 1000);
  };

  /* ── Success screen ── */
  if (saved) {
    return (
      <AuthLayout>
        <div className="reset-success-wrap">
          <div className="reset-success-icon">
            <CheckIcon />
          </div>
          <h2 className="reset-success-title">Password updated!</h2>
          <p className="reset-success-sub">
            Your password has been changed successfully.<br />
            Redirecting to sign in in <strong>{countdown}s</strong>…
          </p>
          <Link to="/login" className="btn-primary" style={{ textAlign: 'center', marginTop: '20px', display: 'block', textDecoration: 'none', padding: '14px' }}>
            Go to Sign In now
          </Link>
        </div>
      </AuthLayout>
    );
  }

  /* ── Main form ── */
  return (
    <AuthLayout>
      <Link to="/login" className="forgot-back-link">
        <ArrowLeftIcon /> Back to sign in
      </Link>

      <div className="forgot-icon-wrap">
        <LockIcon />
      </div>

      <div className="auth-heading">
        <h1>Set new password</h1>
        <p>Choose a strong password to protect your account.</p>
      </div>

      <div className="auth-form">
        {/* ── New password ── */}
        <div className="form-group">
          <label htmlFor="new-password">New password</label>
          <div className="input-wrap">
            <span className="input-icon"><LockSmIcon /></span>
            <input
              id="new-password"
              type={showPass ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouchedPass(true)}
              className={passErr ? 'error' : ''}
              autoComplete="new-password"
              style={{ paddingRight: '44px' }}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPass((p) => !p)}
              tabIndex={-1}
              aria-label={showPass ? 'Hide password' : 'Show password'}
            >
              {showPass ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          {passErr && (
            <span className="field-error"><AlertIcon /> {passErr}</span>
          )}

          {/* Strength bar */}
          {password && (
            <div className="reset-strength">
              <div className="reset-strength-bars">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div
                    key={n}
                    className="reset-strength-bar"
                    style={{
                      background: n <= strength ? strInfo.color : 'var(--color-border)',
                      transition: 'background 0.3s',
                    }}
                  />
                ))}
              </div>
              <span className="reset-strength-label" style={{ color: strInfo.color }}>
                {strInfo.text}
              </span>
            </div>
          )}
        </div>

        {/* ── Confirm password ── */}
        <div className="form-group">
          <label htmlFor="confirm-password">Confirm new password</label>
          <div className="input-wrap">
            <span className="input-icon"><LockSmIcon /></span>
            <input
              id="confirm-password"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Re-enter password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              onBlur={() => setTouchedConfirm(true)}
              className={confirmErr ? 'error' : ''}
              autoComplete="new-password"
              style={{ paddingRight: '44px' }}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowConfirm((p) => !p)}
              tabIndex={-1}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          {confirmErr && (
            <span className="field-error"><AlertIcon /> {confirmErr}</span>
          )}
        </div>

        {/* ── Requirements ── */}
        <ul className="reset-req-list">
          <Req met={password.length >= 8}          label="At least 8 characters" />
          <Req met={/[A-Z]/.test(password)}        label="One uppercase letter" />
          <Req met={/[0-9]/.test(password)}        label="One number" />
          <Req met={/[^A-Za-z0-9]/.test(password)} label="One special character (optional)" />
        </ul>

        {/* ── Save button ── */}
        <button
          type="button"
          className={`btn-primary${loading ? ' loading' : ''}`}
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? (
            <>
              <span className="spinner" />
              Saving…
            </>
          ) : 'Save new password'}
        </button>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;