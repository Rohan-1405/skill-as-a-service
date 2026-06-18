// ============================================================
// SkillAsAService — WithdrawalModal.jsx
// Author: Praveen Gorla  |  Day 7
//
// Withdrawal Request Modal
// - Select payout method
// - Enter amount
// - Add account details
// - Submit for admin approval
// ============================================================

import React, { useState } from 'react';

const PAYOUT_METHODS = [
  { id: 'bank',         label: 'Bank Transfer', icon: '🏦', fields: ['Account Holder Name', 'Account Number', 'IFSC Code', 'Bank Name'] },
  { id: 'upi',          label: 'UPI',           icon: '📱', fields: ['UPI ID'] },
  { id: 'paypal',       label: 'PayPal',        icon: '🅿️', fields: ['PayPal Email'] },
  { id: 'wise',         label: 'Wise',          icon: '🌍', fields: ['Wise Email / Account'] },
  { id: 'stripe',       label: 'Stripe Connect',icon: '⚡', fields: ['Stripe Account ID'] },
];

const WALLET_BALANCE = 12450; // mock — in real app comes from API / parent prop

export default function WithdrawalModal({ isOpen, onClose, onSuccess, walletBalance = WALLET_BALANCE }) {
  const [method, setMethod]     = useState('');
  const [amount, setAmount]     = useState('');
  const [fields, setFields]     = useState({});
  const [step, setStep]         = useState(1); // 1 = method + amount, 2 = account details
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState({});

  if (!isOpen) return null;

  const selectedMethod = PAYOUT_METHODS.find(m => m.id === method);
  const minWithdrawal  = 500;
  const maxWithdrawal  = walletBalance;

  // ── Validate step 1 ─────────────────────────────────────────
  const validateStep1 = () => {
    const e = {};
    if (!method) e.method = 'Please select a payout method';
    const num = parseFloat(amount);
    if (!amount || isNaN(num)) e.amount = 'Please enter withdrawal amount';
    else if (num < minWithdrawal) e.amount = `Minimum withdrawal is ₹${minWithdrawal}`;
    else if (num > maxWithdrawal) e.amount = `Insufficient wallet balance (₹${walletBalance.toLocaleString()} available)`;
    return e;
  };

  // ── Validate step 2 ─────────────────────────────────────────
  const validateStep2 = () => {
    const e = {};
    selectedMethod?.fields.forEach(f => {
      if (!fields[f]?.trim()) e[f] = `${f} is required`;
    });
    return e;
  };

  const handleStep1Next = () => {
    const e = validateStep1();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep(2);
  };

  const handleSubmit = () => {
    const e = validateStep2();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess && onSuccess({ amount: parseFloat(amount), method, fields });
      handleClose();
    }, 1800);
  };

  const handleClose = () => {
    setMethod(''); setAmount(''); setFields({});
    setStep(1); setErrors({}); setLoading(false);
    onClose();
  };

  const s = styles;

  return (
    <>
      <div onClick={handleClose} style={s.backdrop} />
      <div style={s.modal}>

        {/* Header */}
        <div style={s.modalHeader}>
          <div>
            <div style={s.modalTitle}>🏧 Withdraw Funds</div>
            <div style={s.modalSubtitle}>
              Step {step} of 2 — {step === 1 ? 'Choose method & amount' : 'Enter account details'}
            </div>
          </div>
          <button onClick={handleClose} style={s.closeBtn}>✕</button>
        </div>

        {/* Step indicator */}
        <div style={{ padding: '12px 24px 0', display: 'flex', gap: 6 }}>
          {[1, 2].map(n => (
            <div key={n} style={{
              flex: 1, height: 3, borderRadius: 999,
              background: n <= step ? 'var(--color-primary)' : 'var(--color-border)',
              transition: 'background 300ms',
            }} />
          ))}
        </div>

        {/* Balance chip */}
        <div style={{ padding: '12px 24px 0' }}>
          <div style={s.balanceChip}>
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Available Balance</span>
            <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-success)' }}>
              ₹{walletBalance.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Body */}
        <div style={s.modalBody}>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <>
              {/* Payout method */}
              <div style={s.section}>
                <label style={s.label}>Payout Method</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {PAYOUT_METHODS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => { setMethod(m.id); setErrors(prev => ({ ...prev, method: '' })); }}
                      style={{
                        ...s.methodRow,
                        ...(method === m.id ? s.methodRowActive : {}),
                      }}
                    >
                      <span style={{ fontSize: 20 }}>{m.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: method === m.id ? 'var(--color-primary)' : 'var(--color-text-secondary)', flex: 1, textAlign: 'left' }}>
                        {m.label}
                      </span>
                      <span style={{
                        width: 16, height: 16, borderRadius: '50%',
                        border: `2px solid ${method === m.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        background: method === m.id ? 'var(--color-primary)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        {method === m.id && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                      </span>
                    </button>
                  ))}
                </div>
                {errors.method && <div style={s.errorText}>{errors.method}</div>}
              </div>

              {/* Amount */}
              <div style={s.section}>
                <label style={s.label}>Withdrawal Amount</label>
                <div style={{ position: 'relative' }}>
                  <span style={s.rupeePrefix}>₹</span>
                  <input
                    type="number"
                    placeholder={`Min ₹${minWithdrawal} — Max ₹${walletBalance.toLocaleString()}`}
                    value={amount}
                    onChange={e => { setAmount(e.target.value); setErrors(prev => ({ ...prev, amount: '' })); }}
                    style={{
                      ...s.input,
                      paddingLeft: 32,
                      borderColor: errors.amount ? 'var(--color-danger)' : (amount ? 'var(--color-primary)' : 'var(--color-border)'),
                    }}
                  />
                </div>
                {errors.amount && <div style={s.errorText}>{errors.amount}</div>}

                {/* Quick % buttons */}
                <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                  {[25, 50, 75, 100].map(pct => (
                    <button
                      key={pct}
                      onClick={() => { setAmount(Math.floor(walletBalance * pct / 100).toString()); setErrors(prev => ({ ...prev, amount: '' })); }}
                      style={s.pctBtn}
                    >{pct}%</button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div style={s.infoBox}>
                ℹ️ Withdrawal requests are reviewed by admin within 24–48 hours. Processing time depends on your selected payout method.
              </div>
            </>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && selectedMethod && (
            <>
              <div style={{ ...s.summaryBox, marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 6 }}>Withdrawal Summary</div>
                <div style={s.summaryRow}>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>Method</span>
                  <span style={{ color: 'var(--color-text)', fontSize: 13, fontWeight: 600 }}>
                    {selectedMethod.icon} {selectedMethod.label}
                  </span>
                </div>
                <div style={s.summaryRow}>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>Amount</span>
                  <span style={{ color: 'var(--color-primary)', fontSize: 15, fontWeight: 800 }}>₹{parseFloat(amount).toLocaleString()}</span>
                </div>
              </div>

              <div style={s.section}>
                <label style={s.label}>Account Details</label>
                {selectedMethod.fields.map(f => (
                  <div key={f} style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 5 }}>
                      {f} <span style={{ color: 'var(--color-danger)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder={`Enter ${f}`}
                      value={fields[f] || ''}
                      onChange={e => {
                        setFields(prev => ({ ...prev, [f]: e.target.value }));
                        setErrors(prev => ({ ...prev, [f]: '' }));
                      }}
                      style={{
                        ...s.input,
                        borderColor: errors[f] ? 'var(--color-danger)' : (fields[f] ? 'var(--color-primary)' : 'var(--color-border)'),
                      }}
                    />
                    {errors[f] && <div style={s.errorText}>{errors[f]}</div>}
                  </div>
                ))}
              </div>

              <div style={s.infoBox}>
                🔒 Your account details are encrypted and stored securely. They are only used to process this withdrawal.
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={s.modalFooter}>
          {step === 1
            ? <button onClick={handleClose} style={s.cancelBtn}>Cancel</button>
            : <button onClick={() => { setStep(1); setErrors({}); }} style={s.cancelBtn}>← Back</button>
          }

          {step === 1
            ? <button onClick={handleStep1Next} style={s.submitBtn}>Continue →</button>
            : (
              <button onClick={handleSubmit} disabled={loading} style={{ ...s.submitBtn, opacity: loading ? 0.7 : 1 }}>
                {loading
                  ? <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={s.spinner} /> Submitting...
                    </span>
                  : 'Submit Withdrawal Request'
                }
              </button>
            )
          }
        </div>
      </div>
    </>
  );
}

// ── Styles ───────────────────────────────────────────────────
const styles = {
  backdrop: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.65)',
    backdropFilter: 'blur(4px)',
    zIndex: 'var(--z-modal)',
  },
  modal: {
    position: 'fixed',
    top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%', maxWidth: 500,
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-card)',
    zIndex: 'calc(var(--z-modal) + 1)',
    fontFamily: 'var(--font-family)',
    maxHeight: '92vh',
    overflowY: 'auto',
  },
  modalHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    padding: '20px 24px',
    borderBottom: '1px solid var(--color-border)',
  },
  modalTitle: { fontSize: 17, fontWeight: 700, color: 'var(--color-text)', marginBottom: 2 },
  modalSubtitle: { fontSize: 12, color: 'var(--color-text-muted)' },
  closeBtn: {
    background: 'transparent', border: '1px solid var(--color-border)',
    color: 'var(--color-text-muted)', width: 30, height: 30,
    borderRadius: 6, cursor: 'pointer', fontSize: 14,
    fontFamily: 'var(--font-family)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  balanceChip: {
    display: 'inline-flex', alignItems: 'center', gap: 10,
    background: 'rgba(100,255,218,0.06)',
    border: '1px solid rgba(100,255,218,0.2)',
    borderRadius: 8, padding: '8px 14px',
  },
  modalBody: { padding: '16px 24px' },
  modalFooter: {
    display: 'flex', gap: 10, justifyContent: 'flex-end',
    padding: '14px 24px',
    borderTop: '1px solid var(--color-border)',
  },
  section: { marginBottom: 18 },
  label: {
    display: 'block', fontSize: 12, fontWeight: 700,
    color: 'var(--color-text-muted)', letterSpacing: '0.06em',
    textTransform: 'uppercase', marginBottom: 8,
  },
  methodRow: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '10px 14px', borderRadius: 10,
    border: '1px solid var(--color-border)',
    background: 'var(--color-bg-secondary)',
    cursor: 'pointer',
    fontFamily: 'var(--font-family)',
    transition: 'all 150ms',
  },
  methodRowActive: {
    border: '1px solid var(--color-primary)',
    background: 'rgba(26,159,224,0.08)',
  },
  rupeePrefix: {
    position: 'absolute', left: 12, top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--color-text-muted)', fontSize: 14, fontWeight: 600,
    pointerEvents: 'none',
  },
  input: {
    width: '100%', boxSizing: 'border-box',
    background: 'var(--color-bg-input)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--color-text)',
    padding: '10px 14px',
    fontSize: 14, outline: 'none',
    fontFamily: 'var(--font-family)',
  },
  pctBtn: {
    flex: 1, padding: '6px 0',
    background: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-border)',
    borderRadius: 6,
    color: 'var(--color-text-muted)',
    fontSize: 11, fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'var(--font-family)',
  },
  infoBox: {
    background: 'rgba(50,220,253,0.05)',
    border: '1px solid rgba(50,220,253,0.15)',
    borderRadius: 8, padding: '10px 14px',
    fontSize: 12, color: 'var(--color-text-muted)',
    lineHeight: 1.5,
  },
  summaryBox: {
    background: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-border)',
    borderRadius: 10, padding: '12px 16px',
    display: 'flex', flexDirection: 'column', gap: 6,
  },
  summaryRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  errorText: { fontSize: 11, color: 'var(--color-danger)', marginTop: 5 },
  cancelBtn: {
    padding: '9px 20px',
    background: 'transparent',
    border: '1px solid var(--color-border)',
    borderRadius: 8,
    color: 'var(--color-text-secondary)',
    fontSize: 13, fontWeight: 600, cursor: 'pointer',
    fontFamily: 'var(--font-family)',
  },
  submitBtn: {
    padding: '9px 22px',
    background: 'var(--gradient-blue)',
    border: 'none', borderRadius: 8,
    color: '#fff', fontSize: 13, fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'var(--font-family)',
    boxShadow: 'var(--shadow-btn)',
    display: 'flex', alignItems: 'center', gap: 6,
  },
  spinner: {
    display: 'inline-block', width: 14, height: 14,
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
};
