// ============================================================
// SkillAsAService - Validation Schemas (Yup)
// Day 1 | 12:00 - 1:30 PM | Praveen Gorla
// Task: Registration Form Development
// ============================================================

import * as Yup from 'yup';

export const registerSchema = Yup.object({
  role: Yup.string()
    .oneOf(['freelancer', 'client'], 'Please select a role')
    .required('Please select a role'),

  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name is too long')
    .matches(/^[a-zA-Z\s]+$/, 'Only letters allowed')
    .required('First name is required'),

  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name is too long')
    .matches(/^[a-zA-Z\s]+$/, 'Only letters allowed')
    .required('Last name is required'),

  email: Yup.string()
    .email('Enter a valid email address')
    .required('Email is required'),

  mobile: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number')
    .required('Mobile number is required'),

  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must include at least one uppercase letter')
    .matches(/[a-z]/, 'Must include at least one lowercase letter')
    .matches(/[0-9]/, 'Must include at least one number')
    .matches(/[^A-Za-z0-9]/, 'Must include at least one special character')
    .required('Password is required'),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),

  agreeTerms: Yup.boolean()
    .oneOf([true], 'You must accept the Terms & Conditions')
    .required('You must accept the Terms & Conditions'),
});

export const loginSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email address')
    .required('Email is required'),

  password: Yup.string()
    .required('Password is required'),
});

export const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email address')
    .required('Email is required'),
});

// Password strength helper
export function getPasswordStrength(password) {
  if (!password) return { level: '', score: 0, label: '' };
  let score = 0;
  if (password.length >= 8)        score++;
  if (/[A-Z]/.test(password))      score++;
  if (/[0-9]/.test(password))      score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { level: 'weak',   score: 1, label: 'Weak' };
  if (score <= 2) return { level: 'medium', score: 2, label: 'Medium' };
  if (score <= 3) return { level: 'medium', score: 3, label: 'Medium' };
  return            { level: 'strong', score: 4, label: 'Strong' };
}
