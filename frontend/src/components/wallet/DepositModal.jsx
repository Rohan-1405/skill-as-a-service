// ============================================================
// SkillAsAService — DepositModal.jsx
// Author: Praveen Gorla  |  Day 7
//
// Deposit Funds Modal
// - Select amount (quick chips or custom input)
// - Select payment gateway
// - Confirm & proceed
// ============================================================

import React, { useState } from 'react';

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000];

const GATEWAYS = [
  { id: 'razorpay',  label: 'Razorpay',  icon: '💳', popular: true  },
  { id: 'stripe',    label: 'Stripe',    icon: '⚡', popular: false },
  { id: 'paypal',    label: 'PayPal',    icon: '🅿️', popular: false },
  { id: 'upi',       label: 'UPI',       icon: '📱', popular: true  },
  { id: 'paytm',     label: 'Paytm',     icon: '🪙', popular: false },
  { id: 'cashfree',  label: 'Cashfree',  icon: '🏦', popular: false },
];

export default function DepositModal({ isOpen, onClose, onSuccess }) {
  const [amount, setAmount]         = useState('');
  const [customAmount, setCustom]   = useState('');
  const [gateway, setGateway]       = useState('');
  const [loading, setLoading]       = useState(false);
  const [errors, setErrors]         = useState({});

  if (!isOpen) return null;

  const finalAmount = amount || customAmount;

  const validate = () => {
    const e = {};
    const num = parseFloat(finalAmount);
    if (!finalAmount || isNaN(num) || num < 100)
      e.amount = 'Minimum deposit amount is ₹100';
    if (num > 100000)
      e.amount = 'Maximum deposit amount is ₹1,00,000 per transaction';
    if (!gateway)
      e.gateway = 'Please select a payment gateway';
    return e;
  };

  const handleQuickSelect = (val) => {
    setAmount(val);
    setCustom('');
    setErrors(prev => ({ ...prev, amount: '' }));
  };

  const handleCustomChange = (e) => {
    setCustom(e.target.value);
    setAmount('');
    setErrors(prev => ({ ...prev, amount: '' }));
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess && onSuccess({ amount: parseFloat(finalAmount), gateway });
      handleClose();
    }, 1800);
  };

  const handleClose = () => {
    setAmount('');
    setCustom('');
    setGateway('');
    setErrors({});
    setLoading(false);
    onClose();
  };

  const s = styles;

  return (
    <>
      {/* Backdrop */}
      <div onClick={handleClose} style={s.backdrop} />

      {/* Modal */}
      <div style={s.modal}>
        {/* Header */}
        <div style={s.modalHeader}>
          <div>
            <div style={s.modalTitle}>💰 Add Funds to Wallet</div>
            <div style={s.modalSubtitle}>Funds reflect instantly after payment</div>
          </div>
          <button onClick={handleClose} style={s.closeBtn}>✕</button>
        </div>

        {/* Body */}
        <div style={s.modalBody}>

          {/* Quick amount chips */}
          <div style={s.section}>
            <label style={s.label}>Select Amount</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
              {QUICK_AMOUNTS.map(v => (
                <button
                  key={v}
                  onClick={() => handleQuickSelect(v)}
                  style={{
                    ...s.chip,
                    ...(amount === v ? s.chipActive : {}),
                  }}
                >
                  ₹{v.toLocaleString()}
                </button>
              ))}
            </div>

            {/* Custom amount input */}
            <div style={{ position: 'relative' }}>
              <span style={s.rupeePrefix}>₹</span>
              <input
                type="number"
                placeholder="Enter custom amount (min ₹100)"
                value={customAmount}
                onChange={handleCustomChange}
                min={100}
                style={{
                  ...s.input,
                  paddingLeft: 32,
                  borderColor: errors.amount ? 'var(--color-danger)' : (customAmount ? 'var(--color-primary)' : 'var(--color-border)'),
                }}
              />
            </div>
            {errors.amount && <div style={s.errorText}>{errors.amount}</div>}
          </div>

          {/* Gateway selection */}
          <div style={s.section}>
            <label style={s.label}>Payment Method</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {GATEWAYS.map(gw => (
                <button
                  key={gw.id}
                  onClick={() => { setGateway(gw.id); setErrors(prev => ({ ...prev, gateway: '' })); }}
                  style={{
                    ...s.gwCard,
                    ...(gateway === gw.id ? s.gwCardActive : {}),
                  }}
                >
                  <span style={{ fontSize: 20 }}>{gw.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: gateway === gw.id ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}>
                    {gw.label}
                  </span>
                  {gw.popular && (
                    <span style={s.popularBadge}>Popular</span>
                  )}
                </button>
              ))}
            </div>
            {errors.gateway && <div style={s.errorText}>{errors.gateway}</div>}
          </div>

          {/* Summary */}
          {finalAmount && parseFloat(finalAmount) >= 100 && (
            <div style={s.summaryBox}>
              <div style={s.summaryRow}>
                <span style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>Deposit Amount</span>
                <span style={{ color: 'var(--color-text)', fontSize: 13, fontWeight: 600 }}>₹{parseFloat(finalAmount).toLocaleString()}</span>
              </div>
              <div style={s.summaryRow}>
                <span style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>Platform Fee</span>
                <span style={{ color: 'var(--color-success)', fontSize: 13, fontWeight: 600 }}>Free</span>
              </div>
              <div style={{ ...s.summaryRow, borderTop: '1px solid var(--color-border)', paddingTop: 10, marginTop: 4 }}>
                <span style={{ color: 'var(--color-text)', fontSize: 14, fontWeight: 700 }}>You'll receive</span>
                <span style={{ color: 'var(--color-primary)', fontSize: 16, fontWeight: 800 }}>₹{parseFloat(finalAmount).toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={s.modalFooter}>
          <button onClick={handleClose} style={s.cancelBtn}>Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ ...s.submitBtn, opacity: loading ? 0.7 : 1 }}
          >
            {loading
              ? <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={s.spinner} /> Processing...
                </span>
              : `Proceed to Pay ${finalAmount ? `₹${parseFloat(finalAmount).toLocaleString()}` : ''}`
            }
          </button>
        </div>
      </div>
    </>
  );
}

// ── Inline styles ────────────────────────────────────────────
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
    width: '100%', maxWidth: 520,
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-card)',
    zIndex: 'calc(var(--z-modal) + 1)',
    fontFamily: 'var(--font-family)',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    padding: '20px 24px',
    borderBottom: '1px solid var(--color-border)',
  },
  modalTitle: {
    fontSize: 17, fontWeight: 700, color: 'var(--color-text)', marginBottom: 2,
  },
  modalSubtitle: {
    fontSize: 12, color: 'var(--color-text-muted)',
  },
  closeBtn: {
    background: 'transparent', border: '1px solid var(--color-border)',
    color: 'var(--color-text-muted)', width: 30, height: 30,
    borderRadius: 6, cursor: 'pointer', fontSize: 14,
    fontFamily: 'var(--font-family)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  modalBody: { padding: '20px 24px' },
  modalFooter: {
    display: 'flex', gap: 10, justifyContent: 'flex-end',
    padding: '16px 24px',
    borderTop: '1px solid var(--color-border)',
  },
  section: { marginBottom: 20 },
  label: {
    display: 'block', fontSize: 12, fontWeight: 700,
    color: 'var(--color-text-muted)', letterSpacing: '0.06em',
    textTransform: 'uppercase', marginBottom: 8,
  },
  chip: {
    padding: '7px 14px',
    borderRadius: 999,
    border: '1px solid var(--color-border)',
    background: 'var(--color-bg-secondary)',
    color: 'var(--color-text-secondary)',
    fontSize: 13, fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'var(--font-family)',
    transition: 'all 150ms',
  },
  chipActive: {
    border: '1px solid var(--color-primary)',
    background: 'rgba(26,159,224,0.12)',
    color: 'var(--color-primary)',
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
  gwCard: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: 4,
    padding: '12px 8px', borderRadius: 10,
    border: '1px solid var(--color-border)',
    background: 'var(--color-bg-secondary)',
    cursor: 'pointer',
    fontFamily: 'var(--font-family)',
    position: 'relative',
    transition: 'all 150ms',
  },
  gwCardActive: {
    border: '1px solid var(--color-primary)',
    background: 'rgba(26,159,224,0.08)',
  },
  popularBadge: {
    position: 'absolute', top: 4, right: 4,
    fontSize: 8, fontWeight: 700,
    background: 'var(--brand-gold)',
    color: '#000',
    padding: '1px 5px', borderRadius: 999,
  },
  summaryBox: {
    background: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-border)',
    borderRadius: 10,
    padding: '14px 16px',
    display: 'flex', flexDirection: 'column', gap: 8,
  },
  summaryRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  errorText: {
    fontSize: 11, color: 'var(--color-danger)', marginTop: 5,
  },
  cancelBtn: {
    padding: '9px 20px',
    background: 'transparent',
    border: '1px solid var(--color-border)',
    borderRadius: 8,
    color: 'var(--color-text-secondary)',
    fontSize: 13, fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'var(--font-family)',
  },
  submitBtn: {
    padding: '9px 22px',
    background: 'var(--gradient-blue)',
    border: 'none',
    borderRadius: 8,
    color: '#fff',
    fontSize: 13, fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'var(--font-family)',
    boxShadow: 'var(--shadow-btn)',
    display: 'flex', alignItems: 'center', gap: 6,
  },
  spinner: {
    display: 'inline-block',
    width: 14, height: 14,
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
};
