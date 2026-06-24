import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import AppCard from '../../components/common/AppCard';
import { FREELANCER_NAV } from '../../constants/navItems';

/* ─────────────────────────────────────────
   Settings Page — Freelancer Portal
   Sections: Change Password, Email Prefs,
   Payout Preferences, Privacy, Danger Zone
───────────────────────────────────────── */

const Field = ({ label, hint, error, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text)' }}>{label}</label>
    {hint && <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0 }}>{hint}</p>}
    {children}
    {error && <span style={{ fontSize: 12, color: 'var(--color-danger)' }}>{error}</span>}
  </div>
);

const inputStyle = (hasError = false) => ({
  padding: '9px 12px',
  background: 'var(--color-bg-input)',
  border: `1px solid ${hasError ? 'var(--color-danger)' : 'var(--color-border)'}`,
  borderRadius: 'var(--radius-sm)',
  color: 'var(--color-text)',
  fontSize: 'var(--font-size-sm)',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
});

const Toggle = ({ checked, onChange, label, description }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, padding: 'var(--space-3) 0' }}>
    <div>
      <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text)' }}>{label}</div>
      {description && <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>{description}</div>}
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        flexShrink: 0,
        width: 44,
        height: 24,
        borderRadius: 12,
        background: checked ? 'var(--color-primary)' : 'var(--color-border)',
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 0.2s',
      }}
    >
      <span style={{
        position: 'absolute',
        top: 3,
        left: checked ? 23 : 3,
        width: 18,
        height: 18,
        borderRadius: '50%',
        background: '#fff',
        transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      }} />
    </button>
  </div>
);

const SaveBtn = ({ saving, onClick, label = 'Save Changes' }) => (
  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
    <button type="button" onClick={onClick} disabled={saving}
      style={{
        padding: '8px 24px',
        background: saving ? 'var(--color-text-muted)' : 'var(--color-primary)',
        color: '#fff', border: 'none',
        borderRadius: 'var(--radius-sm)',
        fontSize: 'var(--font-size-sm)',
        fontWeight: 'var(--font-weight-semibold)',
        cursor: saving ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', gap: 6,
        transition: 'opacity 0.2s',
      }}
      onMouseEnter={(e) => !saving && (e.currentTarget.style.opacity = '0.88')}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
    >
      {saving ? (
        <>
          <span style={{ width: 13, height: 13, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
          Saving…
        </>
      ) : label}
    </button>
  </div>
);

const Toast = ({ msg, type }) => (
  <div style={{
    position: 'fixed', top: 80, right: 24, zIndex: 1000,
    padding: '12px 20px',
    background: type === 'success' ? 'var(--color-success)' : 'var(--color-danger)',
    color: type === 'success' ? '#0a1628' : '#fff',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 600,
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    display: 'flex', alignItems: 'center', gap: 8,
  }}>
    {type === 'success'
      ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    }
    {msg}
  </div>
);

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
const Settings = () => {
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  /* ── Password ── */
  const [pwOpen,   setPwOpen]   = useState(false);
  const [pwForm,   setPwForm]   = useState({ newPw: '', confirm: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [pwSaving, setPwSaving] = useState(false);

  const handlePwSave = async () => {
    const e = {};
    if (pwForm.newPw.length < 8)           e.newPw  = 'Minimum 8 characters.';
    if (pwForm.newPw !== pwForm.confirm)    e.confirm = 'Passwords do not match.';
    if (Object.keys(e).length) { setPwErrors(e); return; }
    setPwErrors({});
    setPwSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    setPwSaving(false);
    setPwForm({ newPw: '', confirm: '' });
    setPwOpen(false);
    showToast('Password updated successfully.');
  };

  /* ── Email Preferences ── */
  const [emailPrefs, setEmailPrefs] = useState({
    newSubscriber:     true,
    projectUpdates:    true,
    paymentReceived:   true,
    withdrawalStatus:  true,
    kycUpdates:        true,
    weeklyDigest:      true,
    promotionalEmails: false,
  });
  const [emailSaving, setEmailSaving] = useState(false);

  const handleEmailSave = async () => {
    setEmailSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setEmailSaving(false);
    showToast('Email preferences saved.');
  };

  /* ── Payout ── */
  const [payoutMethod, setPayoutMethod] = useState('bank');
  const [payoutSaving, setPayoutSaving] = useState(false);

  const handlePayoutSave = async () => {
    setPayoutSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setPayoutSaving(false);
    showToast('Payout preference updated. Manage full details on the Withdrawals page.');
  };

  /* ── Privacy ── */
  const [privacy, setPrivacy] = useState({
    showOnlineStatus:        true,
    profileIndexed:          true,
    allowContactFromClients: true,
    showEarnings:            false,
  });
  const [privacySaving, setPrivacySaving] = useState(false);

  const handlePrivacySave = async () => {
    setPrivacySaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setPrivacySaving(false);
    showToast('Privacy settings saved.');
  };

  /* ── Danger Zone ── */
  const [deleteConfirm, setDeleteConfirm] = useState('');

  return (
    <DashboardLayout navItems={FREELANCER_NAV} portalName="Freelancer Portal" pageSubtitle="Account Settings">
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your account security, notifications, and preferences.</p>
      </div>

      {/* ── Change Password ── */}
      <AppCard accentColor="blue">
        {/* Header row — always visible, click to open/close form */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => { setPwOpen((p) => !p); setPwErrors({}); setPwForm({ newPw: '', confirm: '' }); }}
          onKeyDown={(e) => e.key === 'Enter' && setPwOpen((p) => !p)}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <div>
            <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text)' }}>
              Change Password
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
              {pwOpen ? 'Fill in the fields below and save' : 'Click to update your password'}
            </div>
          </div>
          <svg
            width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: pwOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }}
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>

        {/* Expandable form */}
        {pwOpen && (
          <div style={{ marginTop: 'var(--space-5)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-5)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: 440 }}>
              <Field label="New Password" hint="Minimum 8 characters." error={pwErrors.newPw}>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={pwForm.newPw}
                  autoComplete="new-password"
                  onChange={(e) => {
                    setPwForm((p) => ({ ...p, newPw: e.target.value }));
                    setPwErrors((p) => { const n = { ...p }; delete n.newPw; return n; });
                  }}
                  style={inputStyle(!!pwErrors.newPw)}
                />
              </Field>
              <Field label="Confirm New Password" error={pwErrors.confirm}>
                <input
                  type="password"
                  placeholder="Re-enter new password"
                  value={pwForm.confirm}
                  autoComplete="new-password"
                  onChange={(e) => {
                    setPwForm((p) => ({ ...p, confirm: e.target.value }));
                    setPwErrors((p) => { const n = { ...p }; delete n.confirm; return n; });
                  }}
                  style={inputStyle(!!pwErrors.confirm)}
                />
              </Field>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
              <button
                type="button"
                onClick={() => { setPwOpen(false); setPwErrors({}); setPwForm({ newPw: '', confirm: '' }); }}
                style={{
                  padding: '8px 20px',
                  background: 'none',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--font-size-sm)',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={pwSaving}
                onClick={handlePwSave}
                style={{
                  padding: '8px 24px',
                  background: pwSaving ? 'var(--color-text-muted)' : 'var(--color-primary)',
                  color: '#fff', border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 600,
                  cursor: pwSaving ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                {pwSaving ? (
                  <>
                    <span style={{ width: 13, height: 13, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                    Saving…
                  </>
                ) : 'Update Password'}
              </button>
            </div>
          </div>
        )}
      </AppCard>

      {/* ── Email Notifications ── */}
      <AppCard title="Email Notifications" subtitle="Choose which emails you want to receive" style={{ marginTop: 'var(--space-5)' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {[
            { key: 'newSubscriber',     label: 'New Subscriber',       description: 'When a client subscribes to one of your plans' },
            { key: 'projectUpdates',    label: 'Project Updates',       description: 'Milestone completions, task assignments, status changes' },
            { key: 'paymentReceived',   label: 'Payment Received',      description: 'When a subscription payment is credited to your wallet' },
            { key: 'withdrawalStatus',  label: 'Withdrawal Status',     description: 'Updates on your withdrawal requests (approved/rejected)' },
            { key: 'kycUpdates',        label: 'KYC Status Updates',    description: 'When your identity verification is approved or rejected' },
            { key: 'weeklyDigest',      label: 'Weekly Summary',        description: 'A weekly digest of your earnings and subscriber activity' },
            { key: 'promotionalEmails', label: 'Promotional Emails',    description: 'Platform announcements, tips, and feature updates' },
          ].map((item, i, arr) => (
            <div key={item.key} style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
              <Toggle
                checked={emailPrefs[item.key]}
                onChange={(v) => setEmailPrefs((p) => ({ ...p, [item.key]: v }))}
                label={item.label}
                description={item.description}
              />
            </div>
          ))}
        </div>
        <SaveBtn saving={emailSaving} onClick={handleEmailSave} />
      </AppCard>

      {/* ── Payout Preferences ── */}
      <AppCard title="Payout Preferences" subtitle="Choose your default withdrawal method" style={{ marginTop: 'var(--space-5)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {[
            { id: 'bank',   label: 'Bank Transfer (NEFT/IMPS)', desc: 'Direct transfer to your Indian bank account' },
            { id: 'upi',    label: 'UPI',                       desc: 'Instant transfer via PhonePe, GPay, BHIM UPI' },
            { id: 'paypal', label: 'PayPal',                    desc: 'International PayPal account' },
            { id: 'wise',   label: 'Wise (TransferWise)',        desc: 'Global bank transfer via Wise' },
          ].map((m) => (
            <label key={m.id} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              padding: 'var(--space-4)',
              border: `1px solid ${payoutMethod === m.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              background: payoutMethod === m.id ? 'rgba(26,159,224,0.05)' : 'transparent',
              transition: 'all 0.15s',
            }}>
              <input type="radio" name="payout" value={m.id} checked={payoutMethod === m.id}
                onChange={() => setPayoutMethod(m.id)} style={{ marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text)' }}>{m.label}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>{m.desc}</div>
              </div>
            </label>
          ))}
        </div>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 'var(--space-3)' }}>
          To add or update your bank/UPI details, go to the <a href="/withdrawals" style={{ color: 'var(--color-primary)' }}>Withdrawals</a> page.
        </p>
        <SaveBtn saving={payoutSaving} onClick={handlePayoutSave} />
      </AppCard>

      {/* ── Privacy ── */}
      <AppCard title="Privacy" subtitle="Control what others can see about you" style={{ marginTop: 'var(--space-5)' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {[
            { key: 'showOnlineStatus',        label: 'Show Online Status',        description: "Let clients see when you're active on the platform" },
            { key: 'profileIndexed',          label: 'Appear in Search Results',  description: 'Allow your profile to be discovered in the public marketplace' },
            { key: 'allowContactFromClients', label: 'Allow Direct Messages',     description: 'Let clients message you before subscribing' },
            { key: 'showEarnings',            label: 'Show Earnings Badge',       description: 'Display a "₹XX+ earned" badge on your public profile' },
          ].map((item, i, arr) => (
            <div key={item.key} style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
              <Toggle
                checked={privacy[item.key]}
                onChange={(v) => setPrivacy((p) => ({ ...p, [item.key]: v }))}
                label={item.label}
                description={item.description}
              />
            </div>
          ))}
        </div>
        <SaveBtn saving={privacySaving} onClick={handlePrivacySave} />
      </AppCard>

      {/* ── Danger Zone ── */}
      <AppCard title="Danger Zone" style={{ marginTop: 'var(--space-5)', borderColor: 'rgba(255,83,112,0.3)' }}>
        <div style={{
          padding: 'var(--space-4)',
          border: '1px solid rgba(255,83,112,0.2)',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(255,83,112,0.04)',
        }}>
          <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-danger)', marginBottom: 4 }}>
            Delete Account
          </div>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)', lineHeight: 1.5 }}>
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              placeholder={`Type "DELETE" to confirm`}
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              style={{ ...inputStyle(), maxWidth: 220 }}
            />
            <button
              type="button"
              disabled={deleteConfirm !== 'DELETE'}
              onClick={() => alert('Connect to DELETE /api/auth/account')}
              style={{
                padding: '9px 20px',
                background: deleteConfirm === 'DELETE' ? 'var(--color-danger)' : 'var(--color-bg-input)',
                color: deleteConfirm === 'DELETE' ? '#fff' : 'var(--color-text-muted)',
                border: `1px solid ${deleteConfirm === 'DELETE' ? 'var(--color-danger)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 600,
                cursor: deleteConfirm === 'DELETE' ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s',
              }}
            >
              Delete My Account
            </button>
          </div>
        </div>
      </AppCard>
    </DashboardLayout>
  );
};

export default Settings;