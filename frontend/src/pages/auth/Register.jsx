// ============================================================
// SkillAsAService — Register.jsx
// Author: Praveen Gorla
// Updated: migrated from custom CSS vars to design-system tokens
//          (variables.css + register.css), matched Lohith's folder structure
// ============================================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import {
  FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff,
  FiAlertCircle, FiCheckCircle, FiXCircle
} from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaFacebook } from 'react-icons/fa';
import {
  registerSchema,
  getPasswordStrength,
  getFieldStatus,
  getPasswordRules
} from '../../utils/validators';
import logo from '../../assets/logos/logo.png';

// ── Password Rules Checklist ──────────────────────────────
function PasswordChecklist({ password }) {
  const rules = getPasswordRules(password);
  return (
    <div className="pwd-rules">
      <p className="pwd-rules-title">Password Requirements</p>
      {rules.map((rule, i) => (
        <div
          key={i}
          className="pwd-rule-item"
          style={{ color: rule.passed ? 'var(--color-success)' : 'var(--color-text-muted)' }}
        >
          {rule.passed
            ? <FiCheckCircle size={13} color="var(--color-success)" />
            : <FiXCircle size={13} color="var(--color-danger)" />
          }
          {rule.label}
        </div>
      ))}
    </div>
  );
}

// ── Field Status Icon ─────────────────────────────────────
function FieldStatusIcon({ formik, name }) {
  const status = getFieldStatus(formik, name);
  const style = { position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' };
  if (status === 'success') return <FiCheckCircle style={{ ...style, color: 'var(--color-success)' }} />;
  if (status === 'error')   return <FiXCircle    style={{ ...style, color: 'var(--color-danger)' }} />;
  return null;
}

// ── Brand Left Panel ──────────────────────────────────────
function AuthLeftPanel() {
  return (
    <div className="auth-left">
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '460px' }}>

        <div style={{ marginBottom: '48px' }}>
          <img
            src={logo}
            alt="SkillAsAService"
            style={{
              height: '140px', objectFit: 'contain',
              filter: 'drop-shadow(0 4px 16px rgba(26,159,224,0.4))',
            }}
          />
        </div>

        <h1 style={{
          fontFamily: 'var(--font-family)', fontSize: 'var(--font-size-4xl)',
          fontWeight: 'var(--font-weight-extrabold)', color: 'var(--color-text)',
          lineHeight: 1.2, marginBottom: '20px',
        }}>
          Sell Your Skills<br />
          <span style={{
            background: 'var(--gradient-brand)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>As A Subscription</span>
        </h1>

        <p style={{
          color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-lg)',
          marginBottom: '48px', lineHeight: 'var(--line-height-relaxed)',
        }}>
          Join thousands of freelancers earning recurring revenue through subscription-based services.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
          {[
            { value: '10K+',  label: 'Freelancers' },
            { value: '5K+',   label: 'Subscribers' },
            { value: '99.9%', label: 'Uptime' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)', padding: '20px 16px', textAlign: 'center',
            }}>
              <div style={{
                fontSize: 'var(--font-size-2xl)',
                fontWeight: 'var(--font-weight-extrabold)',
                color: 'var(--brand-gold)', marginBottom: '4px',
              }}>{s.value}</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '40px' }}>
          {['💰 Recurring Revenue', '🚀 Project Tools', '💬 Real-Time Chat', '🔒 Secure Payments'].map(f => (
            <div key={f} style={{
              background: 'rgba(26,159,224,0.10)',
              border: '1px solid rgba(26,159,224,0.25)',
              borderRadius: 'var(--radius-full)', padding: '8px 16px',
              fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)',
            }}>{f}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Register Page ─────────────────────────────────────────
export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword]     = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [showPwdRules, setShowPwdRules]     = useState(false);
  const [isLoading, setIsLoading]           = useState(false);

  const formik = useFormik({
    initialValues: {
      role: '', firstName: '', lastName: '',
      email: '', mobile: '', password: '',
      confirmPassword: '', agreeTerms: false,
    },
    validationSchema: registerSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await new Promise(r => setTimeout(r, 1500));
        toast.success('🎉 Account created! Please verify your email.');
        navigate(`/verify-email?email=${encodeURIComponent(values.email)}`);
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Registration failed. Try again.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  const pwdStrength  = getPasswordStrength(formik.values.password);
  const isFieldError = (name) => formik.touched[name] && formik.errors[name];

  const fields      = ['role','firstName','lastName','email','mobile','password','confirmPassword','agreeTerms'];
  const filledCount = fields.filter(f => formik.values[f] && !formik.errors[f]).length;
  const progress    = Math.round((filledCount / fields.length) * 100);

  return (
    <div className="auth-wrapper">
      <AuthLeftPanel />

      <div className="auth-right">

        {/* Mobile Logo */}
        <div className="mobile-logo">
          <img src={logo} alt="SkillAsAService" style={{ height: '70px', objectFit: 'contain' }} />
        </div>

        <h2 className="auth-title">Create Your Account</h2>
        <p className="auth-subtitle">Start your subscription journey today</p>

        {/* Progress Bar */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              Form Completion
            </span>
            <span style={{
              fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)',
              color: progress === 100 ? 'var(--color-success)' : 'var(--color-accent)',
            }}>{progress}%</span>
          </div>
          <div style={{ height: '4px', background: 'var(--color-border)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '2px', width: `${progress}%`,
              background: progress === 100 ? 'var(--color-success)' : 'var(--gradient-brand)',
              transition: 'width var(--transition-slow)',
            }} />
          </div>
        </div>

        {/* Role Selector */}
        <div className="role-selector">
          {[
            { value: 'freelancer', icon: '💼', label: 'Freelancer', desc: 'Sell my skills' },
            { value: 'client',     icon: '🏢', label: 'Client',     desc: 'Hire talent' },
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

        {/* Social Buttons */}
        <div className="social-grid">
          {[
            { icon: <FcGoogle size={18} />,                   label: 'Google',   provider: 'google' },
            { icon: <FaFacebook size={18} color="#1877F2" />, label: 'Facebook', provider: 'facebook' },
            { icon: <FaGithub size={18} color="#fff" />,      label: 'GitHub',   provider: 'github' },
          ].map(s => (
            <button key={s.provider} type="button" className="social-btn-reg"
              onClick={() => toast.info(`${s.label} OAuth — coming soon`)}>
              {s.icon} {s.label}
            </button>
          ))}
        </div>

        {/* Trust badges */}
        <div className="trust-badges" style={{ marginTop: '10px' }}>
          {[{ icon: '🔒', text: 'Secure OAuth' }, { icon: '⚡', text: 'Instant' }, { icon: '🛡️', text: 'No Password' }].map(b => (
            <div key={b.text} className="trust-badge">{b.icon} {b.text}</div>
          ))}
        </div>

        <div className="reg-divider">or register with email</div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} noValidate>

          {/* Name Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { name: 'firstName', placeholder: 'John', label: 'First Name' },
              { name: 'lastName',  placeholder: 'Doe',  label: 'Last Name' },
            ].map(field => (
              <div className="reg-form-group" key={field.name}>
                <label className="reg-label">{field.label}</label>
                <div className="input-group">
                  <FiUser className="input-icon" size={14} />
                  <input
                    className={`reg-control ${isFieldError(field.name) ? 'is-invalid' : getFieldStatus(formik, field.name) === 'success' ? 'is-valid' : ''}`}
                    type="text" placeholder={field.placeholder}
                    {...formik.getFieldProps(field.name)}
                  />
                  <FieldStatusIcon formik={formik} name={field.name} />
                </div>
                {isFieldError(field.name) && (
                  <p className="invalid-feedback"><FiAlertCircle size={12} /> {formik.errors[field.name]}</p>
                )}
              </div>
            ))}
          </div>

          {/* Email */}
          <div className="reg-form-group">
            <label className="reg-label">Email Address</label>
            <div className="input-group">
              <FiMail className="input-icon" size={14} />
              <input
                className={`reg-control ${isFieldError('email') ? 'is-invalid' : getFieldStatus(formik,'email') === 'success' ? 'is-valid' : ''}`}
                type="email" placeholder="john@example.com"
                {...formik.getFieldProps('email')}
              />
              <FieldStatusIcon formik={formik} name="email" />
            </div>
            {isFieldError('email') && (
              <p className="invalid-feedback"><FiAlertCircle size={12} /> {formik.errors.email}</p>
            )}
          </div>

          {/* Mobile */}
          <div className="reg-form-group">
            <label className="reg-label">Mobile Number</label>
            <div className="input-group">
              <FiPhone className="input-icon" size={14} />
              <input
                className={`reg-control ${isFieldError('mobile') ? 'is-invalid' : getFieldStatus(formik,'mobile') === 'success' ? 'is-valid' : ''}`}
                type="tel" placeholder="9876543210" maxLength={10}
                {...formik.getFieldProps('mobile')}
              />
              <FieldStatusIcon formik={formik} name="mobile" />
            </div>
            {isFieldError('mobile') && (
              <p className="invalid-feedback"><FiAlertCircle size={12} /> {formik.errors.mobile}</p>
            )}
          </div>

          {/* Password */}
          <div className="reg-form-group">
            <label className="reg-label">Password</label>
            <div className="input-group">
              <FiLock className="input-icon" size={14} />
              <input
                className={`reg-control ${isFieldError('password') ? 'is-invalid' : ''}`}
                type={showPassword ? 'text' : 'password'}
                placeholder="Min 8 chars, upper, number, symbol"
                {...formik.getFieldProps('password')}
                onFocus={() => setShowPwdRules(true)}
                onBlur={(e) => { formik.handleBlur(e); setShowPwdRules(false); }}
              />
              <span className="input-icon-right" onClick={() => setShowPassword(v => !v)}>
                {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </span>
            </div>

            {/* Strength segments */}
            {formik.values.password && (
              <div>
                <div className="strength-bar-wrap">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="strength-segment" style={{
                      background: i <= pwdStrength.score ? pwdStrength.color : 'var(--color-border)',
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: 'var(--font-size-xs)', color: pwdStrength.color, fontWeight: 'var(--font-weight-semibold)' }}>
                  {pwdStrength.label}
                </span>
              </div>
            )}

            {(showPwdRules || formik.values.password) && (
              <PasswordChecklist password={formik.values.password} />
            )}

            {isFieldError('password') && (
              <p className="invalid-feedback"><FiAlertCircle size={12} /> {formik.errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="reg-form-group">
            <label className="reg-label">Confirm Password</label>
            <div className="input-group">
              <FiLock className="input-icon" size={14} />
              <input
                className={`reg-control ${isFieldError('confirmPassword') ? 'is-invalid' : getFieldStatus(formik,'confirmPassword') === 'success' ? 'is-valid' : ''}`}
                type={showConfirmPwd ? 'text' : 'password'}
                placeholder="Re-enter your password"
                {...formik.getFieldProps('confirmPassword')}
              />
              <span className="input-icon-right" onClick={() => setShowConfirmPwd(v => !v)}>
                {showConfirmPwd ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </span>
              <FieldStatusIcon formik={formik} name="confirmPassword" />
            </div>
            {isFieldError('confirmPassword') && (
              <p className="invalid-feedback"><FiAlertCircle size={12} /> {formik.errors.confirmPassword}</p>
            )}
          </div>

          {/* Terms */}
          <div className="reg-form-group">
            <label className="form-check">
              <input type="checkbox"
                {...formik.getFieldProps('agreeTerms')}
                checked={formik.values.agreeTerms} />
              <span className="form-check-label">
                I agree to the{' '}
                <Link to="/terms" style={{ color: 'var(--color-accent)', fontWeight: '600' }}>Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" style={{ color: 'var(--color-accent)', fontWeight: '600' }}>Privacy Policy</Link>
              </span>
            </label>
            {isFieldError('agreeTerms') && (
              <p className="invalid-feedback"><FiAlertCircle size={12} /> {formik.errors.agreeTerms}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading || !(formik.isValid && formik.dirty)}
            style={{ marginTop: '8px', width: '100%', padding: '12px' }}
          >
            {isLoading
              ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Creating Account...</>
              : '🚀 Create Account'
            }
          </button>

        </form>

        <p style={{
          textAlign: 'center', marginTop: '24px',
          color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)',
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--color-accent)', fontWeight: '600' }}>Sign In</Link>
        </p>

      </div>
    </div>
  );
}
