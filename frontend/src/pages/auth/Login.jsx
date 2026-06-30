// ============================================================
// SkillAsAService — Login.jsx
// FIX: Social login now shows a role-selection modal before
//      proceeding, so it never blindly navigates to client dashboard.
// ============================================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import LoginForm from '../../components/auth/LoginForm';
import SocialLoginButtons from '../../components/auth/SocialLoginButtons';
import { useAuthContext } from '../../context/AuthContext';
import authService from '../../services/authService';
import logo from '../../assets/logos/logo.png';

// ── Role → redirect map ──────────────────────────────────────
const ROLE_REDIRECT = {
  freelancer: '/freelancer/dashboard',
  client:     '/client/dashboard',
  admin:      '/admin/dashboard',
};

// ── Role Picker Modal ────────────────────────────────────────
// Shown when user clicks a social button, so we know which
// portal to direct them to (since OAuth doesn't give us a role).
function RolePickerModal({ provider, onSelect, onCancel }) {
  const [selected, setSelected] = useState('');

  const providerLabel = provider
    ? provider.charAt(0).toUpperCase() + provider.slice(1)
    : '';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        background: 'var(--color-bg-card, #131c2e)',
        border: '1px solid var(--color-border, rgba(255,255,255,0.1))',
        borderRadius: 16,
        padding: '32px 28px',
        width: '100%', maxWidth: 400,
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
        fontFamily: 'var(--font-family, sans-serif)',
      }}>
        <h2 style={{
          fontSize: 18, fontWeight: 700,
          color: 'var(--color-text, #e2e8f0)',
          margin: '0 0 8px',
        }}>
          Continue with {providerLabel}
        </h2>
        <p style={{
          fontSize: 13, color: 'var(--color-text-muted, #8892b0)',
          margin: '0 0 24px', lineHeight: 1.6,
        }}>
          Select how you want to use SkillAsAService so we can take you to the right place.
        </p>

        {/* Role cards */}
        {[
          { role: 'freelancer', emoji: '💼', title: 'I am a Freelancer', desc: 'I offer skills and services to clients' },
          { role: 'client',     emoji: '🏢', title: 'I am a Client',     desc: 'I hire freelancers for my projects'   },
        ].map(opt => (
          <div
            key={opt.role}
            onClick={() => setSelected(opt.role)}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 16px', borderRadius: 10, marginBottom: 10,
              border: `2px solid ${selected === opt.role
                ? 'var(--color-primary, #1A9FE0)'
                : 'var(--color-border, rgba(255,255,255,0.1))'}`,
              background: selected === opt.role
                ? 'rgba(26,159,224,0.08)'
                : 'var(--color-bg-secondary, #0d1526)',
              cursor: 'pointer',
              transition: 'border-color 150ms, background 150ms',
            }}
          >
            <span style={{ fontSize: 28 }}>{opt.emoji}</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text, #e2e8f0)', marginBottom: 2 }}>
                {opt.title}
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted, #8892b0)' }}>
                {opt.desc}
              </div>
            </div>
            {/* Selected indicator */}
            {selected === opt.role && (
              <div style={{
                marginLeft: 'auto', width: 20, height: 20, borderRadius: '50%',
                background: 'var(--color-primary, #1A9FE0)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </div>
        ))}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '10px', borderRadius: 8,
              background: 'transparent',
              border: '1px solid var(--color-border, rgba(255,255,255,0.1))',
              color: 'var(--color-text-secondary, #a0aabf)',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'var(--font-family, sans-serif)',
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => selected && onSelect(selected)}
            disabled={!selected}
            style={{
              flex: 2, padding: '10px', borderRadius: 8,
              background: selected ? 'var(--color-primary, #1A9FE0)' : 'rgba(26,159,224,0.3)',
              border: 'none',
              color: '#fff',
              fontSize: 13, fontWeight: 600,
              cursor: selected ? 'pointer' : 'not-allowed',
              fontFamily: 'var(--font-family, sans-serif)',
              transition: 'background 150ms',
            }}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Login Page ───────────────────────────────────────────────
const Login = () => {
  const navigate          = useNavigate();
  const { login }         = useAuthContext();
  const [authError, setAuthError]         = useState('');
  const [socialLoading, setSocialLoading] = useState('');
  // pendingSocial: stores the provider while the role modal is open
  const [pendingSocial, setPendingSocial] = useState('');

  // ── Email / password ────────────────────────────────────
  const handleSubmit = async ({ email, password }) => {
    setAuthError('');
    try {
      const { token, user } = await authService.login(email, password);
      login(user, token, user.role);
      navigate(ROLE_REDIRECT[user.role] || '/dashboard', { replace: true });
    } catch (err) {
      setAuthError(err.message || 'Invalid email or password. Please try again.');
    }
  };

  // ── Social: step 1 — open role picker ───────────────────
  const handleSocialClick = (provider) => {
    setAuthError('');
    setPendingSocial(provider);   // opens the modal
  };

  // ── Social: step 2 — user picked role, proceed ──────────
  const handleRoleSelected = async (role) => {
    const provider = pendingSocial;
    setPendingSocial('');          // close modal
    setSocialLoading(provider);
    try {
      // Now we pass role explicitly — no more hardcoded 'client'
      const { token, user } = await authService.socialLogin(provider, role);
      login(user, token, user.role);
      navigate(ROLE_REDIRECT[user.role] || '/dashboard', { replace: true });
    } catch (err) {
      setAuthError(err.message || `${provider} login failed. Please try again.`);
    } finally {
      setSocialLoading('');
    }
  };

  const handleRoleCancel = () => setPendingSocial('');

  return (
    <>
      {/* Role picker modal — shown when a social button is clicked */}
      {pendingSocial && (
        <RolePickerModal
          provider={pendingSocial}
          onSelect={handleRoleSelected}
          onCancel={handleRoleCancel}
        />
      )}

      <AuthLayout>
        {/* Logo */}
        <div className="auth-logo">
          <img src={logo} alt="SkillAsAService" className="auth-logo-img" />
        </div>

        {/* Heading */}
        <div className="auth-heading">
          <h1>Welcome back</h1>
          <p>Sign in to continue your learning journey</p>
        </div>

        {/* Auth-level error */}
        {authError && (
          <div style={{
            background: 'rgba(255,83,112,0.10)',
            border: '1px solid rgba(255,83,112,0.30)',
            borderRadius: 8, padding: '10px 14px',
            color: '#FF5370', fontSize: 13, marginBottom: 16,
            fontFamily: 'var(--font-family)',
          }}>
            {authError}
          </div>
        )}

        {/* Form */}
        <LoginForm onSubmit={handleSubmit} />

        {/* Divider */}
        <div className="auth-divider">
          <div className="auth-divider-line" />
          <span>or continue with</span>
          <div className="auth-divider-line" />
        </div>

        {/* Social buttons — clicking opens role picker, not direct login */}
        <SocialLoginButtons
          onSocialLogin={handleSocialClick}
          loadingProvider={socialLoading}
        />

        {/* Sign up link */}
        <div className="auth-signup-row">
          Don't have an account?
          <Link to="/register">Sign up free</Link>
        </div>
      </AuthLayout>
    </>
  );
};

export default Login;
