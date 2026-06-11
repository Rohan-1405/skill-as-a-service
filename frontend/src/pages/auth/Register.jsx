// ============================================================
// SkillAsAService - Register.jsx
// Day 1 | 12:00 PM - 1:30 PM | Praveen Gorla
// Task: Registration Form Development
// ============================================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import {
  FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff,
  FiAlertCircle, FiCheckCircle
} from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaFacebook } from 'react-icons/fa';
import { registerSchema, getPasswordStrength } from '../../utils/validators';
import ROUTES from '../../routes';

// ---- Auth Left Panel ----
function AuthLeftPanel() {
  return (
    <div className="auth-left">
      {/* Brand Logo */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '460px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '60px' }}>
          <div style={{
            width: '52px', height: '52px',
            background: 'linear-gradient(135deg, #1E7FE8, #1254B7)',
            borderRadius: '14px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '1.6rem', fontWeight: '800', color: '#fff',
            boxShadow: '0 8px 24px rgba(30,127,232,0.4)'
          }}>S</div>
          <div>
            <div style={{ fontFamily: 'Poppins,sans-serif', fontWeight: '700', fontSize: '1.3rem', color: '#fff' }}>
              Skill<span style={{ color: '#F5A623' }}>AsA</span>Service
            </div>
            <div style={{ fontSize: '0.75rem', color: '#A0AABF', letterSpacing: '0.1em' }}>
              SUBSCRIBE • LEARN • GROW
            </div>
          </div>
        </div>

        <h1 style={{
          fontFamily: 'Poppins,sans-serif', fontSize: '2.4rem', fontWeight: '800',
          color: '#fff', lineHeight: 1.2, marginBottom: '20px'
        }}>
          Sell Your Skills<br />
          <span style={{
            background: 'linear-gradient(135deg, #4FA3FF, #F5A623)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>As A Subscription</span>
        </h1>

        <p style={{ color: '#A0AABF', fontSize: '1.05rem', marginBottom: '48px', lineHeight: 1.7 }}>
          Join thousands of freelancers earning recurring revenue through subscription-based services.
        </p>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
          {[
            { value: '10K+', label: 'Freelancers' },
            { value: '5K+',  label: 'Subscribers' },
            { value: '99.9%',label: 'Uptime' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px', padding: '20px 16px', textAlign: 'center'
            }}>
              <div style={{
                fontFamily: 'Poppins,sans-serif', fontSize: '1.6rem',
                fontWeight: '800', color: '#F5A623', marginBottom: '4px'
              }}>{s.value}</div>
              <div style={{ fontSize: '0.78rem', color: '#A0AABF' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Floating feature chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '40px' }}>
          {['💰 Recurring Revenue', '🚀 Project Tools', '💬 Real-Time Chat', '🔒 Secure Payments'].map(f => (
            <div key={f} style={{
              background: 'rgba(30,127,232,0.15)',
              border: '1px solid rgba(30,127,232,0.3)',
              borderRadius: '100px', padding: '8px 16px',
              fontSize: '0.82rem', color: '#A0AABF',
              backdropFilter: 'blur(10px)'
            }}>{f}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Main Register Component ----
export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword]        = useState(false);
  const [showConfirmPwd, setShowConfirmPwd]    = useState(false);
  const [isLoading, setIsLoading]              = useState(false);

  const formik = useFormik({
    initialValues: {
      role:            '',
      firstName:       '',
      lastName:        '',
      email:           '',
      mobile:          '',
      password:        '',
      confirmPassword: '',
      agreeTerms:      false,
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        // TODO: replace with real API call → axios.post('/api/auth/register', values)
        await new Promise(r => setTimeout(r, 1500)); // simulate API
        toast.success('Account created! Please verify your email.');
        navigate(ROUTES.VERIFY_EMAIL + `?email=${encodeURIComponent(values.email)}`);
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Registration failed. Try again.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  const pwdStrength = getPasswordStrength(formik.values.password);
  const isFieldError = (name) => formik.touched[name] && formik.errors[name];

  return (
    <div className="auth-wrapper">
      <AuthLeftPanel />

      <div className="auth-right">
        {/* Mobile Logo */}
        <div style={{ display: 'none' }} className="mobile-logo">
          <div style={{ fontFamily: 'Poppins,sans-serif', fontWeight: '700', fontSize: '1.4rem', color: '#fff', marginBottom: '28px' }}>
            Skill<span style={{ color: '#F5A623' }}>AsA</span>Service
          </div>
        </div>

        <h2 className="auth-title">Create Your Account</h2>
        <p className="auth-subtitle">Start your subscription journey today</p>

        {/* Role Selector */}
        <div className="role-selector">
          {[
            { value: 'freelancer', icon: '💼', label: 'Freelancer', desc: 'Sell my skills' },
            { value: 'client',    icon: '🏢', label: 'Client',     desc: 'Hire talent' },
          ].map(r => (
            <div
              key={r.value}
              className={`role-card ${formik.values.role === r.value ? 'active' : ''}`}
              onClick={() => formik.setFieldValue('role', r.value)}
            >
              <div className="role-icon">{r.icon}</div>
              <div className="role-label">{r.label}</div>
              <div className="role-desc">{r.desc}</div>
            </div>
          ))}
        </div>
        {isFieldError('role') && (
          <p className="invalid-feedback" style={{ marginTop: '-16px', marginBottom: '16px' }}>
            <FiAlertCircle /> {formik.errors.role}
          </p>
        )}

        {/* Social Login */}
        <div className="social-grid">
          {[
            { icon: <FcGoogle size={18}/>,          label: 'Google',   provider: 'google' },
            { icon: <FaFacebook size={18} color="#1877F2"/>, label: 'Facebook', provider: 'facebook' },
            { icon: <FaGithub size={18} color="#fff"/>,   label: 'GitHub',   provider: 'github' },
          ].map(s => (
            <button
              key={s.provider}
              type="button"
              className="social-btn"
              onClick={() => toast.info(`${s.label} login coming soon`)}
            >
              {s.icon} {s.label}
            </button>
          ))}
        </div>

        <div className="divider">or register with email</div>

        {/* Registration Form */}
        <form onSubmit={formik.handleSubmit} noValidate>
          {/* Name Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">First Name</label>
              <div className="input-group">
                <FiUser className="input-icon" />
                <input
                  className={`form-control ${isFieldError('firstName') ? 'is-invalid' : ''}`}
                  type="text"
                  placeholder="John"
                  {...formik.getFieldProps('firstName')}
                />
              </div>
              {isFieldError('firstName') && (
                <p className="invalid-feedback"><FiAlertCircle />{formik.errors.firstName}</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Last Name</label>
              <div className="input-group">
                <FiUser className="input-icon" />
                <input
                  className={`form-control ${isFieldError('lastName') ? 'is-invalid' : ''}`}
                  type="text"
                  placeholder="Doe"
                  {...formik.getFieldProps('lastName')}
                />
              </div>
              {isFieldError('lastName') && (
                <p className="invalid-feedback"><FiAlertCircle />{formik.errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-group">
              <FiMail className="input-icon" />
              <input
                className={`form-control ${isFieldError('email') ? 'is-invalid' : ''}`}
                type="email"
                placeholder="john@example.com"
                {...formik.getFieldProps('email')}
              />
            </div>
            {isFieldError('email') && (
              <p className="invalid-feedback"><FiAlertCircle />{formik.errors.email}</p>
            )}
          </div>

          {/* Mobile */}
          <div className="form-group">
            <label className="form-label">Mobile Number</label>
            <div className="input-group">
              <FiPhone className="input-icon" />
              <input
                className={`form-control ${isFieldError('mobile') ? 'is-invalid' : ''}`}
                type="tel"
                placeholder="9876543210"
                maxLength={10}
                style={{ paddingLeft: '44px' }}
                {...formik.getFieldProps('mobile')}
              />
            </div>
            {isFieldError('mobile') && (
              <p className="invalid-feedback"><FiAlertCircle />{formik.errors.mobile}</p>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-group">
              <FiLock className="input-icon" />
              <input
                className={`form-control ${isFieldError('password') ? 'is-invalid' : ''}`}
                type={showPassword ? 'text' : 'password'}
                placeholder="Min 8 chars, upper, number, symbol"
                {...formik.getFieldProps('password')}
              />
              <span className="input-icon-right" onClick={() => setShowPassword(v => !v)}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
            {/* Password Strength */}
            {formik.values.password && (
              <div className={`password-strength strength-${pwdStrength.level}`}>
                <div className="strength-bar"><div className="strength-fill" /></div>
                <span className="strength-text">Strength: {pwdStrength.label}</span>
              </div>
            )}
            {isFieldError('password') && (
              <p className="invalid-feedback"><FiAlertCircle />{formik.errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="input-group">
              <FiLock className="input-icon" />
              <input
                className={`form-control ${isFieldError('confirmPassword') ? 'is-invalid' : ''}`}
                type={showConfirmPwd ? 'text' : 'password'}
                placeholder="Re-enter your password"
                {...formik.getFieldProps('confirmPassword')}
              />
              <span className="input-icon-right" onClick={() => setShowConfirmPwd(v => !v)}>
                {showConfirmPwd ? <FiEyeOff /> : <FiEye />}
              </span>
              {formik.values.confirmPassword && !isFieldError('confirmPassword') && (
                <FiCheckCircle style={{
                  position: 'absolute', right: '14px', top: '50%',
                  transform: 'translateY(-50%)', color: '#22C55E'
                }} />
              )}
            </div>
            {isFieldError('confirmPassword') && (
              <p className="invalid-feedback"><FiAlertCircle />{formik.errors.confirmPassword}</p>
            )}
          </div>

          {/* Terms */}
          <div className="form-group">
            <label className="form-check">
              <input
                type="checkbox"
                {...formik.getFieldProps('agreeTerms')}
                checked={formik.values.agreeTerms}
              />
              <span className="form-check-label">
                I agree to the{' '}
                <Link to="/terms" style={{ color: '#F5A623' }}>Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" style={{ color: '#F5A623' }}>Privacy Policy</Link>
              </span>
            </label>
            {isFieldError('agreeTerms') && (
              <p className="invalid-feedback"><FiAlertCircle />{formik.errors.agreeTerms}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary btn-lg btn-block"
            disabled={isLoading || !formik.isValid}
            style={{ marginTop: '8px' }}
          >
            {isLoading
              ? <><div className="spinner" /> Creating Account...</>
              : '🚀 Create Account'
            }
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: '#A0AABF', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} style={{ color: '#4FA3FF', fontWeight: '600' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
