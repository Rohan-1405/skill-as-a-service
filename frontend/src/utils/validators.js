// ============================================================
// SkillAsAService — validators.js
// Author: Praveen Gorla
// Updated: migrated to design-system variable naming style
// ============================================================

import * as Yup from 'yup';

// ── Registration Schema ───────────────────────────────────
export const registerSchema = Yup.object({
  role: Yup.string()
    .oneOf(['freelancer', 'client'], 'Please select a role to continue')
    .required('Please select a role to continue'),

  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name cannot exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'First name can only contain letters')
    .trim()
    .required('First name is required'),

  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name cannot exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Last name can only contain letters')
    .trim()
    .required('Last name is required'),

  email: Yup.string()
    .email('Please enter a valid email address')
    .max(255, 'Email is too long')
    .lowercase()
    .trim()
    .required('Email address is required'),

  mobile: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number starting with 6-9')
    .required('Mobile number is required'),

  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(32, 'Password cannot exceed 32 characters')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter (A-Z)')
    .matches(/[a-z]/, 'Must contain at least one lowercase letter (a-z)')
    .matches(/[0-9]/, 'Must contain at least one number (0-9)')
    .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Must contain at least one special character')
    .required('Password is required'),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords do not match')
    .required('Please confirm your password'),

  agreeTerms: Yup.boolean()
    .oneOf([true], 'You must accept the Terms & Conditions to register')
    .required('You must accept the Terms & Conditions to register'),
});

// ── Login Schema ──────────────────────────────────────────
export const loginSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .trim()
    .required('Email address is required'),

  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

// ── Forgot Password Schema ────────────────────────────────
export const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .trim()
    .required('Email address is required'),
});

// ── Reset Password Schema ─────────────────────────────────
export const resetPasswordSchema = Yup.object({
  otp: Yup.string()
    .length(6, 'OTP must be exactly 6 digits')
    .matches(/^\d+$/, 'OTP must contain numbers only')
    .required('OTP is required'),

  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Must contain at least one number')
    .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Must contain at least one special character')
    .required('New password is required'),

  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords do not match')
    .required('Please confirm your new password'),
});

// ── Password Strength Helper ──────────────────────────────
export function getPasswordStrength(password) {
  if (!password) return { level: '', score: 0, label: '', color: '' };

  const checks = {
    length:    password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number:    /[0-9]/.test(password),
    special:   /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;

  if (score <= 2) return { level: 'weak',   score: 2, label: 'Weak',   color: 'var(--color-danger)' };
  if (score <= 3) return { level: 'medium', score: 3, label: 'Medium', color: 'var(--color-warning)' };
  if (score === 4) return { level: 'medium', score: 4, label: 'Good',  color: 'var(--color-primary)' };
  return             { level: 'strong', score: 5, label: 'Strong', color: 'var(--color-success)' };
}

// ── Real-Time Field Validation Helper ─────────────────────
export function getFieldStatus(formik, fieldName) {
  const touched = formik.touched[fieldName];
  const error   = formik.errors[fieldName];
  const value   = formik.values[fieldName];
  if (!touched) return 'idle';
  if (error)    return 'error';
  if (value)    return 'success';
  return 'idle';
}

// ── Password Rules Checker ────────────────────────────────
export function getPasswordRules(password) {
  return [
    { label: 'At least 8 characters',      passed: password.length >= 8 },
    { label: 'One uppercase letter (A-Z)',  passed: /[A-Z]/.test(password) },
    { label: 'One lowercase letter (a-z)', passed: /[a-z]/.test(password) },
    { label: 'One number (0-9)',            passed: /[0-9]/.test(password) },
    { label: 'One special character',       passed: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
  ];
}
