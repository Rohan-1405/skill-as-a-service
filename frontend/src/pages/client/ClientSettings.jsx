// ============================================================
// SkillAsAService — ClientSettings.jsx
// Route: /client/settings
// Sections: Account Security (Change Password, 2FA), 
//           Notification Preferences, Privacy, Danger Zone
// ============================================================

import React, { useState } from 'react';
import ClientLayout from './ClientLayout';

const inputStyle = { width: '100%', background: 'var(--color-bg-input)', border: '1.5px solid var(--color-border)', borderRadius: 8, padding: '10px 14px', color: 'var(--color-text)', fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-family)', transition: 'border-color 150ms' };
const labelStyle = { fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' };

function SectionCard({ title, subtitle, children }) {
  return (
    <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 14, overflow: 'hidden', marginBottom: 24 }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)' }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: '4px 0 0' }}>{subtitle}</p>}
      </div>
      <div style={{ padding: '24px' }}>{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginBottom: 2 }}>{label}</div>
        {description && <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{description}</div>}
      </div>
      <div
        onClick={() => onChange(!checked)}
        style={{ width: 44, height: 24, borderRadius: 12, background: checked ? 'var(--color-primary)' : 'var(--color-border)', cursor: 'pointer', position: 'relative', transition: 'background 200ms', flexShrink: 0, marginLeft: 16 }}
      >
        <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: checked ? 23 : 3, transition: 'left 200ms', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
      </div>
    </div>
  );
}

function ConfirmModal({ title, message, onConfirm, onCancel, danger = false }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
      <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 16, padding: '28px 32px', width: '100%', maxWidth: 420, boxShadow: 'var(--shadow-card)' }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: danger ? 'var(--color-danger)' : 'var(--color-text)', margin: '0 0 14px' }}>{title}</h2>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: '0 0 22px' }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{ padding: '9px 22px', borderRadius: 8, background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-family)' }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding: '9px 22px', borderRadius: 8, background: danger ? 'rgba(255,83,112,0.15)' : 'var(--gradient-blue)', border: danger ? '1px solid rgba(255,83,112,0.4)' : 'none', color: danger ? '#FF5370' : '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-family)', boxShadow: danger ? 'none' : 'var(--shadow-btn)' }}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

export default function ClientSettings() {
  // ── Password ──────────────────────────────────────────────
  const [pwForm, setPwForm]   = useState({ current: '', newPw: '', confirm: '' });
  const [pwShow, setPwShow]   = useState({ current: false, newPw: false, confirm: false });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  // ── Notifications ─────────────────────────────────────────
  const [notifs, setNotifs] = useState({
    emailNewMessage:    true,
    emailProjectUpdate: true,
    emailBilling:       true,
    emailMarketing:     false,
    pushMessages:       true,
    pushProjects:       true,
    pushWallet:         true,
  });

  // ── Privacy ───────────────────────────────────────────────
  const [privacy, setPrivacy] = useState({
    profileVisible:   true,
    showCompany:      true,
    showSubscriptions: false,
  });

  // ── Danger zone ───────────────────────────────────────────
  const [confirmModal, setConfirmModal] = useState(null);
  const [toast, setToast]               = useState(null);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3200); };

  // ── Password validation ───────────────────────────────────
  const handlePasswordSave = () => {
    setPwError(''); setPwSuccess('');
    if (!pwForm.current) { setPwError('Enter your current password.'); return; }
    if (pwForm.newPw.length < 8) { setPwError('New password must be at least 8 characters.'); return; }
    if (!/[A-Z]/.test(pwForm.newPw)) { setPwError('Password must contain at least one uppercase letter.'); return; }
    if (!/[0-9]/.test(pwForm.newPw)) { setPwError('Password must contain at least one number.'); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwError('Passwords do not match.'); return; }
    setPwSuccess('Password changed successfully!');
    setPwForm({ current: '', newPw: '', confirm: '' });
  };

  const pwStrength = (pw) => {
    let s = 0;
    if (pw.length >= 8)           s++;
    if (/[A-Z]/.test(pw))         s++;
    if (/[0-9]/.test(pw))         s++;
    if (/[^A-Za-z0-9]/.test(pw))  s++;
    return s;
  };
  const strength = pwStrength(pwForm.newPw);
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', '#FF5370', '#FDC449', '#1A9FE0', '#64FFDA'][strength];

  const PasswordField = ({ label, field }) => (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type={pwShow[field] ? 'text' : 'password'}
          value={pwForm[field]}
          onChange={e => { setPwForm(p => ({ ...p, [field]: e.target.value })); setPwError(''); setPwSuccess(''); }}
          placeholder="••••••••"
          style={{ ...inputStyle, paddingRight: 40 }}
        />
        <button
          type="button"
          onClick={() => setPwShow(p => ({ ...p, [field]: !p[field] }))}
          style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: 14, padding: 4 }}
        >{pwShow[field] ? '🙈' : '👁️'}</button>
      </div>
    </div>
  );

  return (
    <ClientLayout pageTitle="Settings" pageSubtitle="Manage your account preferences">
      <style>{`
        .cset-input:focus { border-color: var(--color-primary) !important; }
        .cset-save { padding: 9px 22px; border-radius: 8px; background: var(--gradient-blue); border: none; color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; font-family: var(--font-family); box-shadow: var(--shadow-btn); }
        .cset-toggle-row:last-child { border-bottom: none !important; }
      `}</style>

      <div style={{ padding: '28px', maxWidth: 760, margin: '0 auto' }}>

        {/* ── CHANGE PASSWORD ── */}
        <SectionCard title="Change Password" subtitle="Use a strong password with at least 8 characters, one uppercase letter, and one number.">
          {pwError && <div style={{ background: 'rgba(255,83,112,0.1)', border: '1px solid rgba(255,83,112,0.3)', borderRadius: 8, padding: '10px 14px', color: 'var(--color-danger)', fontSize: 13, marginBottom: 16 }}>{pwError}</div>}
          {pwSuccess && <div style={{ background: 'rgba(100,255,218,0.1)', border: '1px solid rgba(100,255,218,0.3)', borderRadius: 8, padding: '10px 14px', color: '#64FFDA', fontSize: 13, marginBottom: 16 }}>{pwSuccess}</div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <PasswordField label="Current Password" field="current" />
            <PasswordField label="New Password" field="newPw" />
            {pwForm.newPw && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--color-border)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(strength / 4) * 100}%`, background: strengthColor, borderRadius: 2, transition: 'width 200ms, background 200ms' }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: strengthColor, minWidth: 40 }}>{strengthLabel}</span>
              </div>
            )}
            <PasswordField label="Confirm New Password" field="confirm" />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
              <button className="cset-save" onClick={handlePasswordSave}>Update Password</button>
            </div>
          </div>
        </SectionCard>

        {/* ── TWO-FACTOR AUTH ── */}
        <SectionCard title="Two-Factor Authentication">
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>Authenticator App (TOTP)</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--brand-gold)', background: 'rgba(253,196,73,0.15)', border: '1px solid rgba(253,196,73,0.3)', padding: '2px 8px', borderRadius: 999 }}>Coming Soon</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.6 }}>Add an extra layer of security using Google Authenticator, Authy, or a compatible TOTP app. This feature is available in the next release.</p>
            </div>
            <button disabled style={{ padding: '9px 22px', borderRadius: 8, background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: 13, fontWeight: 600, cursor: 'not-allowed', fontFamily: 'var(--font-family)', opacity: 0.6, flexShrink: 0 }}>Enable 2FA</button>
          </div>
        </SectionCard>

        {/* ── NOTIFICATIONS ── */}
        <SectionCard title="Notification Preferences" subtitle="Choose how and when you receive notifications.">
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Email Notifications</div>
            {[
              { key: 'emailNewMessage',    label: 'New Messages',        description: 'When a freelancer sends you a message' },
              { key: 'emailProjectUpdate', label: 'Project Updates',     description: 'Milestone completions and status changes' },
              { key: 'emailBilling',       label: 'Billing & Invoices',  description: 'Subscription renewals and payment receipts' },
              { key: 'emailMarketing',     label: 'News & Promotions',   description: 'Platform updates and featured freelancers' },
            ].map(n => (
              <Toggle key={n.key} checked={notifs[n.key]} onChange={v => setNotifs(p => ({ ...p, [n.key]: v }))} label={n.label} description={n.description} />
            ))}
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8, marginTop: 16 }}>Push Notifications</div>
            {[
              { key: 'pushMessages', label: 'Chat Messages',    description: 'Real-time message alerts' },
              { key: 'pushProjects', label: 'Project Activity', description: 'Task and milestone updates' },
              { key: 'pushWallet',   label: 'Wallet Activity',  description: 'Deposits and charges' },
            ].map(n => (
              <Toggle key={n.key} checked={notifs[n.key]} onChange={v => setNotifs(p => ({ ...p, [n.key]: v }))} label={n.label} description={n.description} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
            <button className="cset-save" onClick={() => showToast('Notification preferences saved!')}>Save Preferences</button>
          </div>
        </SectionCard>

        {/* ── PRIVACY ── */}
        <SectionCard title="Privacy Settings" subtitle="Control who can see your information.">
          {[
            { key: 'profileVisible',    label: 'Public Profile',        description: 'Allow freelancers to view your company profile' },
            { key: 'showCompany',       label: 'Show Company Name',     description: 'Display your company name on project posts' },
            { key: 'showSubscriptions', label: 'Show Subscription Info', description: 'Let freelancers see which plans you have active' },
          ].map(p => (
            <Toggle key={p.key} checked={privacy[p.key]} onChange={v => setPrivacy(prev => ({ ...prev, [p.key]: v }))} label={p.label} description={p.description} />
          ))}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
            <button className="cset-save" onClick={() => showToast('Privacy settings saved!')}>Save Privacy Settings</button>
          </div>
        </SectionCard>

        {/* ── DANGER ZONE ── */}
        <div style={{ background: 'rgba(255,83,112,0.04)', border: '1px solid rgba(255,83,112,0.2)', borderRadius: 14, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,83,112,0.2)' }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-danger)', margin: 0 }}>Danger Zone</h2>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: '4px 0 0' }}>These actions are irreversible. Proceed with caution.</p>
          </div>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'Deactivate Account', desc: 'Pause your account. You can reactivate it later by logging in.', action: 'deactivate' },
              { label: 'Delete Account',     desc: 'Permanently delete your account and all associated data. This cannot be undone.', action: 'delete' },
            ].map(item => (
              <div key={item.action} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: item.action === 'deactivate' ? '1px solid rgba(255,83,112,0.15)' : 'none', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{item.desc}</div>
                </div>
                <button onClick={() => setConfirmModal(item.action)} style={{ padding: '8px 18px', borderRadius: 8, background: 'rgba(255,83,112,0.1)', border: '1px solid rgba(255,83,112,0.3)', color: 'var(--color-danger)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-family)', flexShrink: 0 }}>{item.label}</button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── MODALS ── */}
      {confirmModal === 'deactivate' && (
        <ConfirmModal
          title="Deactivate Account?"
          message="Your account will be paused. All active subscriptions will be suspended. You can reactivate by logging in again."
          onConfirm={() => { setConfirmModal(null); showToast('Account deactivated. You will be signed out.', 'warning'); }}
          onCancel={() => setConfirmModal(null)}
        />
      )}
      {confirmModal === 'delete' && (
        <ConfirmModal
          title="Delete Account?"
          message="This will permanently delete your account, all subscriptions, projects, messages, and payment history. This cannot be undone."
          onConfirm={() => { setConfirmModal(null); showToast('Account deletion scheduled. Check your email to confirm.', 'warning'); }}
          onCancel={() => setConfirmModal(null)}
          danger
        />
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: toast.type === 'warning' ? 'rgba(255,83,112,0.15)' : 'rgba(100,255,218,0.15)', border: `1px solid ${toast.type === 'warning' ? 'rgba(255,83,112,0.4)' : 'rgba(100,255,218,0.4)'}`, color: toast.type === 'warning' ? '#FF5370' : '#64FFDA', padding: '12px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-family)', zIndex: 2000, boxShadow: 'var(--shadow-card)' }}>
          {toast.msg}
        </div>
      )}
    </ClientLayout>
  );
}
