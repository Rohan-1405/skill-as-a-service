import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import AppCard from '../../components/common/AppCard';
import { FREELANCER_NAV } from '../../constants/navItems';

/* ─────────────────────────────────────────
   KYC Verification Page
   Flow: Freelancer uploads docs → submitted
   → Admin reviews in Admin Dashboard
   → Approved / Rejected (UI Flow Section 17 + 22)
───────────────────────────────────────── */

const DOC_TYPES = [
  {
    id: 'aadhaar',
    label: 'Aadhaar Card',
    description: 'Front and back sides of your Aadhaar card',
    required: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
      </svg>
    ),
  },
  {
    id: 'pan',
    label: 'PAN Card',
    description: 'Clear photo or scan of your PAN card',
    required: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    id: 'passport',
    label: 'Passport',
    description: 'Photo page of your valid passport',
    required: false,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16v16H4z"/><circle cx="12" cy="10" r="3"/>
        <path d="M7 20v-1a5 5 0 0 1 10 0v1"/>
      </svg>
    ),
  },
  {
    id: 'driving_license',
    label: 'Driving License',
    description: 'Front side of your valid driving license',
    required: false,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
        <circle cx="12" cy="14" r="2"/>
      </svg>
    ),
  },
];

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_FILE_MB = 5;

/* ─── Status banner ─── */
const StatusBanner = ({ status }) => {
  const configs = {
    not_submitted: null,
    pending: {
      color: 'var(--color-warning)',
      bg: 'rgba(245,166,35,0.08)',
      border: 'rgba(245,166,35,0.25)',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      title: 'Verification Pending',
      message: 'Your documents have been submitted and are under review by our KYC team. This usually takes 1–2 business days.',
    },
    approved: {
      color: 'var(--color-success)',
      bg: 'rgba(100,255,218,0.08)',
      border: 'rgba(100,255,218,0.25)',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      ),
      title: 'KYC Verified',
      message: 'Your identity has been verified. You now have full access to all platform features including withdrawals.',
    },
    rejected: {
      color: 'var(--color-danger)',
      bg: 'rgba(255,83,112,0.08)',
      border: 'rgba(255,83,112,0.25)',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      ),
      title: 'Verification Rejected',
      message: 'Your KYC submission was rejected. Please re-upload clear, valid documents and resubmit. Common reasons: blurry images, expired documents, or mismatched names.',
    },
  };

  const cfg = configs[status];
  if (!cfg) return null;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'var(--space-4)',
      padding: 'var(--space-4) var(--space-5)',
      background: cfg.bg,
      border: `1px solid ${cfg.border}`,
      borderRadius: 'var(--radius-md)',
      marginBottom: 'var(--space-5)',
    }}>
      <span style={{ color: cfg.color, flexShrink: 0, marginTop: 2 }}>{cfg.icon}</span>
      <div>
        <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: cfg.color, marginBottom: 4 }}>
          {cfg.title}
        </div>
        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
          {cfg.message}
        </div>
      </div>
    </div>
  );
};

/* ─── Single document upload box ─── */
const DocUploadBox = ({ doc, file, onSelect, onRemove, error, disabled }) => {
  const inputRef = React.useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    if (disabled) return;
    const f = e.dataTransfer.files[0];
    if (f) onSelect(doc.id, f);
  };

  const handleChange = (e) => {
    const f = e.target.files[0];
    if (f) onSelect(doc.id, f);
    e.target.value = '';
  };

  const fileLabel = file
    ? `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`
    : null;

  return (
    <div style={{
      border: `1px solid ${error ? 'var(--color-danger)' : file ? 'var(--color-success)' : 'var(--color-border)'}`,
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      transition: 'border-color 0.2s',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        padding: 'var(--space-4)',
        background: 'var(--color-bg-secondary)',
        borderBottom: `1px solid var(--color-border)`,
      }}>
        <span style={{ color: file ? 'var(--color-success)' : 'var(--color-primary)', flexShrink: 0 }}>
          {file
            ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            : doc.icon
          }
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text)' }}>
            {doc.label}
            {doc.required && <span style={{ color: 'var(--color-danger)', marginLeft: 4 }}>*</span>}
            {!doc.required && <span style={{ fontSize: 11, color: 'var(--color-text-muted)', marginLeft: 6 }}>(optional)</span>}
          </div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{doc.description}</div>
        </div>
        {file && !disabled && (
          <button
            type="button"
            onClick={() => onRemove(doc.id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-danger)', padding: 4, borderRadius: 4 }}
            title="Remove file"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>

      {/* Drop zone */}
      {!file && !disabled && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current.click()}
          style={{
            padding: 'var(--space-6)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-2)',
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
            <strong style={{ color: 'var(--color-primary)' }}>Click to upload</strong> or drag and drop
          </p>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
            JPG, PNG or PDF · Max {MAX_FILE_MB}MB
          </p>
          <input ref={inputRef} type="file" accept={ACCEPTED_TYPES.join(',')} onChange={handleChange} style={{ display: 'none' }} />
        </div>
      )}

      {/* File attached */}
      {file && (
        <div style={{
          padding: 'var(--space-3) var(--space-4)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          background: 'rgba(100,255,218,0.04)',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/>
          </svg>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-success)', flex: 1, wordBreak: 'break-all' }}>
            {fileLabel}
          </span>
        </div>
      )}

      {/* Disabled — submitted state */}
      {disabled && !file && (
        <div style={{ padding: 'var(--space-4)', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
          Not submitted
        </div>
      )}

      {error && (
        <div style={{ padding: '6px var(--space-4)', fontSize: 'var(--font-size-xs)', color: 'var(--color-danger)', borderTop: '1px solid rgba(255,83,112,0.2)' }}>
          {error}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────
   APPLICATION PROGRESS TRACKER
   Shows after submission — 4 steps:
   Submitted → Under Review → Decision → Complete
───────────────────────────────────────── */
const ApplicationProgress = ({ status, submittedAt }) => {
  // steps: index 0–3
  const steps = [
    {
      key: 'submitted',
      label: 'Documents Submitted',
      desc: 'Your documents have been uploaded and sent to the KYC team.',
      doneFor: ['pending', 'approved', 'rejected'],
      activeFor: [],
    },
    {
      key: 'review',
      label: 'Under Review',
      desc: 'An admin is reviewing your Aadhaar, PAN, and any other documents you uploaded.',
      doneFor: ['approved', 'rejected'],
      activeFor: ['pending'],
    },
    {
      key: 'decision',
      label: 'Decision Made',
      desc: status === 'approved'
        ? 'Your identity has been successfully verified.'
        : status === 'rejected'
        ? 'Your submission was reviewed but could not be verified. See the reason above.'
        : 'Waiting for the admin to approve or reject your submission.',
      doneFor: ['approved', 'rejected'],
      activeFor: [],
      isDecision: true,
    },
    {
      key: 'complete',
      label: 'KYC Complete',
      desc: 'Your account is fully verified. Withdrawals and all platform features are unlocked.',
      doneFor: ['approved'],
      activeFor: [],
    },
  ];

  const getStepState = (step) => {
    if (step.doneFor.includes(status)) return 'done';
    if (step.activeFor.includes(status)) return 'active';
    return 'waiting';
  };

  const stepColors = {
    done:    { bg: 'rgba(100,255,218,0.12)', border: 'var(--color-success)', icon: 'var(--color-success)', text: 'var(--color-success)' },
    active:  { bg: 'rgba(26,159,224,0.10)',  border: 'var(--color-primary)', icon: 'var(--color-primary)', text: 'var(--color-primary)' },
    waiting: { bg: 'var(--color-bg-secondary)', border: 'var(--color-border)', icon: 'var(--color-text-muted)', text: 'var(--color-text-muted)' },
  };

  // override decision step colors for rejected
  const getDecisionColors = (step) => {
    if (step.isDecision && status === 'rejected' && getStepState(step) === 'done') {
      return { bg: 'rgba(255,83,112,0.08)', border: 'var(--color-danger)', icon: 'var(--color-danger)', text: 'var(--color-danger)' };
    }
    return stepColors[getStepState(step)];
  };

  const StepIcon = ({ state, isDecision, isRejected }) => {
    if (state === 'done' && isDecision && isRejected) {
      // X icon for rejected decision
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      );
    }
    if (state === 'done') {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      );
    }
    if (state === 'active') {
      // Spinning loader
      return (
        <span style={{ width: 14, height: 14, border: '2px solid rgba(26,159,224,0.3)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
      );
    }
    // Waiting — dot
    return <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-border)', display: 'inline-block' }} />;
  };

  return (
    <AppCard
      title="Application Progress"
      subtitle={submittedAt ? `Submitted on ${submittedAt}` : 'Track where your application stands'}
      style={{ marginBottom: 'var(--space-5)' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 'var(--space-2)' }}>
        {steps.map((step, i) => {
          const state  = getStepState(step);
          const colors = getDecisionColors(step);
          const isLast = i === steps.length - 1;
          const isRej  = step.isDecision && status === 'rejected';

          return (
            <div key={step.key} style={{ display: 'flex', gap: 'var(--space-4)', position: 'relative' }}>
              {/* Left column: icon + connector line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: colors.bg,
                  border: `2px solid ${colors.border}`,
                  color: colors.icon,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.3s',
                }}>
                  <StepIcon state={state} isDecision={step.isDecision} isRejected={isRej} />
                </div>
                {!isLast && (
                  <div style={{
                    width: 2,
                    flex: 1,
                    minHeight: 24,
                    background: state === 'done' ? 'var(--color-success)' : 'var(--color-border)',
                    margin: '4px 0',
                    opacity: state === 'done' ? 0.5 : 0.3,
                    transition: 'background 0.3s',
                  }} />
                )}
              </div>

              {/* Right column: text */}
              <div style={{ paddingBottom: isLast ? 0 : 'var(--space-5)', paddingTop: 6, flex: 1 }}>
                <div style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: state === 'waiting' ? 'var(--color-text-muted)' : 'var(--color-text)',
                  marginBottom: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  {step.label}
                  {state === 'active' && (
                    <span style={{
                      fontSize: 10,
                      padding: '2px 8px',
                      borderRadius: 20,
                      background: 'rgba(26,159,224,0.12)',
                      color: 'var(--color-primary)',
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                    }}>
                      IN PROGRESS
                    </span>
                  )}
                  {step.isDecision && status === 'approved' && state === 'done' && (
                    <span style={{
                      fontSize: 10,
                      padding: '2px 8px',
                      borderRadius: 20,
                      background: 'rgba(100,255,218,0.12)',
                      color: 'var(--color-success)',
                      fontWeight: 600,
                    }}>
                      APPROVED
                    </span>
                  )}
                  {isRej && (
                    <span style={{
                      fontSize: 10,
                      padding: '2px 8px',
                      borderRadius: 20,
                      background: 'rgba(255,83,112,0.12)',
                      color: 'var(--color-danger)',
                      fontWeight: 600,
                    }}>
                      REJECTED
                    </span>
                  )}
                </div>
                <div style={{
                  fontSize: 'var(--font-size-xs)',
                  color: state === 'waiting' ? 'var(--color-text-muted)' : 'var(--color-text-secondary)',
                  lineHeight: 1.6,
                }}>
                  {step.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Review time estimate — only shown while pending */}
      {status === 'pending' && (
        <div style={{
          marginTop: 'var(--space-4)',
          padding: 'var(--space-3) var(--space-4)',
          background: 'rgba(26,159,224,0.06)',
          border: '1px solid rgba(26,159,224,0.18)',
          borderRadius: 'var(--radius-sm)',
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          Estimated review time: <strong style={{ color: 'var(--color-text)' }}>1–2 business days.</strong> You'll receive an email once a decision is made.
        </div>
      )}

      {/* Resubmit nudge — only shown when rejected */}
      {status === 'rejected' && (
        <div style={{
          marginTop: 'var(--space-4)',
          padding: 'var(--space-3) var(--space-4)',
          background: 'rgba(255,83,112,0.06)',
          border: '1px solid rgba(255,83,112,0.18)',
          borderRadius: 'var(--radius-sm)',
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-danger)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Scroll down to re-upload your documents and resubmit. Make sure they are clear, valid, and not expired.
        </div>
      )}
    </AppCard>
  );
};

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
const KYCVerification = () => {
  // kycStatus: 'not_submitted' | 'pending' | 'approved' | 'rejected'
  const [kycStatus, setKycStatus] = useState('not_submitted');
  const [submittedAt, setSubmittedAt] = useState(null);
  const [files, setFiles] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const isSubmitted = kycStatus === 'pending' || kycStatus === 'approved';
  const isRejected  = kycStatus === 'rejected';
  const canEdit     = kycStatus === 'not_submitted' || kycStatus === 'rejected';

  const handleSelect = (docId, file) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setErrors((p) => ({ ...p, [docId]: 'Only JPG, PNG or PDF allowed.' }));
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setErrors((p) => ({ ...p, [docId]: `File must be under ${MAX_FILE_MB}MB.` }));
      return;
    }
    setErrors((p) => { const n = { ...p }; delete n[docId]; return n; });
    setFiles((p) => ({ ...p, [docId]: file }));
  };

  const handleRemove = (docId) => {
    setFiles((p) => { const n = { ...p }; delete n[docId]; return n; });
    setErrors((p) => { const n = { ...p }; delete n[docId]; return n; });
  };

  const handleSubmit = async () => {
    const newErrors = {};
    DOC_TYPES.filter((d) => d.required).forEach((d) => {
      if (!files[d.id]) newErrors[d.id] = 'This document is required.';
    });
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      showToast('Please upload all required documents.', 'error');
      return;
    }

    setSubmitting(true);
    // Simulate API call — replace with real POST to /api/kyc/submit
    await new Promise((r) => setTimeout(r, 2000));
    setSubmitting(false);
    setKycStatus('pending');
    const now = new Date();
    setSubmittedAt(now.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }));
    showToast('Documents submitted! Our team will review within 1–2 business days.', 'success');
  };

  // Demo: allow toggling status for preview (remove in production)
  const handleDemoReset = () => {
    setKycStatus('not_submitted');
    setFiles({});
    setErrors({});
    setSubmittedAt(null);
  };

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <DashboardLayout navItems={FREELANCER_NAV} portalName="Freelancer Portal" pageSubtitle="Identity Verification">

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 80, right: 24, zIndex: 1000,
          padding: '12px 20px',
          background: toast.type === 'success' ? 'var(--color-success)' : 'var(--color-danger)',
          color: toast.type === 'success' ? '#0a1628' : '#fff',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--font-size-sm)',
          fontWeight: 'var(--font-weight-semibold)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', gap: 8,
          animation: 'fadeIn 0.2s ease',
        }}>
          {toast.type === 'success'
            ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          }
          {toast.msg}
        </div>
      )}

      <div className="page-header">
        <h1>KYC Verification</h1>
        <p>Verify your identity to unlock withdrawals and build trust with clients.</p>
      </div>

      {/* Status Banner */}
      <StatusBanner status={kycStatus} />

      {/* Application Progress — shown after first submission */}
      {kycStatus !== 'not_submitted' && (
        <ApplicationProgress status={kycStatus} submittedAt={submittedAt} />
      )}

      {/* Info card */}
      <AppCard accentColor="blue" style={{ marginBottom: 'var(--space-5)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          {[
            { icon: '🔒', title: 'Secure & Encrypted', desc: 'Your documents are encrypted and stored securely on AWS S3.' },
            { icon: '👤', title: 'Admin Review', desc: 'A verified admin reviews your submission within 1–2 business days.' },
            { icon: '✅', title: 'One-Time Process', desc: 'Once approved, your KYC remains valid as long as your account is active.' },
          ].map((item) => (
            <div key={item.title} style={{ flex: '1 1 180px', minWidth: 160 }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{item.icon}</div>
              <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text)', marginBottom: 4 }}>{item.title}</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </AppCard>

      {/* Document upload grid */}
      <AppCard
        title="Upload Documents"
        subtitle="Aadhaar and PAN are mandatory. Passport or Driving License adds extra credibility."
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
          {DOC_TYPES.map((doc) => (
            <DocUploadBox
              key={doc.id}
              doc={doc}
              file={files[doc.id] || null}
              onSelect={handleSelect}
              onRemove={handleRemove}
              error={errors[doc.id]}
              disabled={isSubmitted}
            />
          ))}
        </div>

        {/* Required note */}
        <p style={{ marginTop: 'var(--space-4)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
          <span style={{ color: 'var(--color-danger)' }}>*</span> Required documents. Accepted formats: JPG, PNG, PDF · Max 5MB per file.
        </p>

        {/* Submit / status actions */}
        {canEdit && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-5)' }}>
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              style={{
                padding: '10px 28px',
                background: submitting ? 'var(--color-text-muted)' : 'var(--color-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                cursor: submitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => !submitting && (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              {submitting ? (
                <>
                  <span style={{
                    width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff', borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite', display: 'inline-block',
                  }} />
                  Submitting…
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                  {isRejected ? 'Resubmit Documents' : 'Submit for Verification'}
                </>
              )}
            </button>
          </div>
        )}

        {isSubmitted && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-5)' }}>
            {/* Demo only — remove in production */}
            <button
              type="button"
              onClick={handleDemoReset}
              style={{
                padding: '8px 16px',
                background: 'none',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-muted)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              [Demo] Reset Status
            </button>
          </div>
        )}
      </AppCard>

      {/* FAQ */}
      <AppCard title="Frequently Asked Questions" style={{ marginTop: 'var(--space-5)' }}>
        {[
          { q: 'Why is KYC required?', a: 'KYC (Know Your Customer) helps us verify your identity, prevent fraud, and comply with financial regulations. It is required to enable payouts.' },
          { q: 'How long does verification take?', a: 'Our admin team reviews submissions within 1–2 business days. You will receive an email notification once reviewed.' },
          { q: 'What if my submission is rejected?', a: 'You will receive a reason via email. Common causes are blurry images, expired documents, or a mismatch between your name on the platform and on the document. Simply re-upload and resubmit.' },
          { q: 'Is my data safe?', a: 'Yes. All documents are encrypted with AES-256 and stored on AWS S3 with strict access controls. Only authorised admins can view your documents for verification purposes.' },
        ].map((faq, i) => (
          <div key={i} style={{
            padding: 'var(--space-4) 0',
            borderBottom: i < 3 ? '1px solid var(--color-border)' : 'none',
          }}>
            <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text)', marginBottom: 6 }}>
              {faq.q}
            </div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              {faq.a}
            </div>
          </div>
        ))}
      </AppCard>
    </DashboardLayout>
  );
};

export default KYCVerification;