import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/* ── Inline SVG icons (no external deps) ── */
const EmailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const LockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
    <line x1="2" y1="2" x2="22" y2="22"/>
  </svg>
);

const AlertIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const validate = (email, password) => {
  const errors = {};
  if (!email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }
  return errors;
};

const LoginForm = ({ onSubmit }) => {
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe]     = useState(false);
  const [errors, setErrors]             = useState({});
  const [loading, setLoading]           = useState(false);
  const [touched, setTouched]           = useState({});

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(email, password));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const errs = validate(email, password);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    if (onSubmit) onSubmit({ email, password, rememberMe });
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {/* Email */}
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <div className="input-wrap">
          <span className="input-icon"><EmailIcon /></span>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => handleBlur('email')}
            className={touched.email && errors.email ? 'error' : ''}
            autoComplete="email"
          />
        </div>
        {touched.email && errors.email && (
          <span className="field-error"><AlertIcon /> {errors.email}</span>
        )}
      </div>

      {/* Password */}
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <div className="input-wrap">
          <span className="input-icon"><LockIcon /></span>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => handleBlur('password')}
            className={touched.password && errors.password ? 'error' : ''}
            autoComplete="current-password"
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        {touched.password && errors.password && (
          <span className="field-error"><AlertIcon /> {errors.password}</span>
        )}
      </div>

      {/* Remember + Forgot */}
      <div className="form-footer-row">
        <label className="remember-label">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          Remember me
        </label>
        <Link to="/forgot-password" className="forgot-link">
          Forgot password?
        </Link>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className={`btn-primary${loading ? ' loading' : ''}`}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner" />
            Signing in…
          </>
        ) : 'Sign In'}
      </button>
    </form>
  );
};

export default LoginForm;
