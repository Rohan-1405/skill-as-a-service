// ============================================================
// SkillAsAService — ClientProfile.jsx
// Route: /client/profile
// Sections: Profile Photo, Company Details, Contact Info,
//           Subscription History (with Cancel/Renew), Account Security
// ============================================================

import React, { useState, useRef } from 'react';
import ClientLayout from './ClientLayout';

const INIT_PROFILE = {
  name: 'Rajesh Kumar',
  email: 'rajesh.kumar@techcorp.in',
  phone: '+91 98765 43210',
  company: 'TechCorp Solutions Pvt Ltd',
  website: 'www.techcorp.in',
  gstNumber: '29AADCT1234A1Z1',
  industry: 'Information Technology',
  teamSize: '11-50',
  address: '42, MG Road, Bengaluru, Karnataka - 560001',
  bio: 'We build scalable SaaS products for the Indian market. Always looking for talented freelancers to grow our team.',
  avatar: null,
};

const SUB_HISTORY = [
  { id: 'SH001', freelancer: 'Arjun Sharma',  plan: 'Standard', price: 5999,  date: '2026-05-18', status: 'Active',     renewal: '2026-07-18', avatar: 'AS', color: '#1A9FE0' },
  { id: 'SH002', freelancer: 'Priya Menon',   plan: 'Basic',    price: 2999,  date: '2026-05-22', status: 'Active',     renewal: '2026-07-22', avatar: 'PM', color: '#32DCFD' },
  { id: 'SH003', freelancer: 'Rohan Gupta',   plan: 'Premium',  price: 11999, date: '2026-04-05', status: 'Expiring',   renewal: '2026-08-05', avatar: 'RG', color: '#FDC449' },
  { id: 'SH004', freelancer: 'Divya Nair',    plan: 'Basic',    price: 1999,  date: '2026-03-01', status: 'Cancelled',  renewal: '-',          avatar: 'DN', color: '#64FFDA' },
  { id: 'SH005', freelancer: 'Kiran Rao',     plan: 'Standard', price: 5999,  date: '2026-02-14', status: 'Completed',  renewal: '-',          avatar: 'KR', color: '#9B59B6' },
];

const STATUS_CFG = {
  Active:    { color: '#1A9FE0', bg: 'rgba(26,159,224,0.12)'  },
  Expiring:  { color: '#FF5370', bg: 'rgba(255,83,112,0.12)'  },
  Cancelled: { color: '#556080', bg: 'rgba(85,96,128,0.12)'   },
  Completed: { color: '#64FFDA', bg: 'rgba(100,255,218,0.10)' },
};

const inputStyle = { width: '100%', background: 'var(--color-bg-input)', border: '1.5px solid var(--color-border)', borderRadius: 8, padding: '10px 14px', color: 'var(--color-text)', fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-family)', transition: 'border-color 150ms' };
const labelStyle = { fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' };

function SectionCard({ title, children, action }) {
  return (
    <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 14, overflow: 'hidden', marginBottom: 24 }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>{title}</h2>
        {action}
      </div>
      <div style={{ padding: '24px' }}>{children}</div>
    </div>
  );
}

function ConfirmModal({ title, message, onConfirm, onCancel, variant = 'danger' }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
      <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 16, padding: '28px 32px', width: '100%', maxWidth: 420, boxShadow: 'var(--shadow-card)' }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-text)', margin: '0 0 14px' }}>{title}</h2>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: '0 0 22px' }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{ padding: '9px 22px', borderRadius: 8, background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-family)' }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding: '9px 22px', borderRadius: 8, background: variant === 'danger' ? 'rgba(255,83,112,0.12)' : 'var(--gradient-blue)', border: variant === 'danger' ? '1px solid rgba(255,83,112,0.3)' : 'none', color: variant === 'danger' ? '#FF5370' : '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-family)', boxShadow: variant !== 'danger' ? 'var(--shadow-btn)' : 'none' }}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

export default function ClientProfile() {
  const [profile, setProfile]       = useState(INIT_PROFILE);
  const [editSection, setEditSection] = useState(null); // 'company' | 'contact'
  const [draft, setDraft]           = useState({});
  const [subs, setSubs]             = useState(SUB_HISTORY);
  const [confirmModal, setConfirmModal] = useState(null); // { type, sub }
  const [toast, setToast]           = useState(null);
  const fileRef                     = useRef(null);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  // ── Photo ──────────────────────────────────────────────────
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setProfile(p => ({ ...p, avatar: ev.target.result })); showToast('Profile photo updated!'); };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removePhoto = () => { setProfile(p => ({ ...p, avatar: null })); showToast('Profile photo removed.'); };

  // ── Edit sections ─────────────────────────────────────────
  const startEdit = (section) => { setDraft({ ...profile }); setEditSection(section); };
  const cancelEdit = () => { setEditSection(null); setDraft({}); };
  const saveEdit = () => { setProfile(p => ({ ...p, ...draft })); setEditSection(null); setDraft({}); showToast('Profile saved successfully!'); };

  // ── Subscription actions ──────────────────────────────────
  const confirmSubAction = () => {
    const { type, sub } = confirmModal;
    if (type === 'cancel') {
      setSubs(prev => prev.map(s => s.id === sub.id ? { ...s, status: 'Cancelled', renewal: '-' } : s));
      showToast(`Subscription to ${sub.freelancer} cancelled.`, 'warning');
    } else if (type === 'renew') {
      const d = new Date(); d.setMonth(d.getMonth() + 1);
      setSubs(prev => prev.map(s => s.id === sub.id ? { ...s, status: 'Active', renewal: d.toISOString().split('T')[0] } : s));
      showToast(`Subscription to ${sub.freelancer} renewed!`);
    }
    setConfirmModal(null);
  };

  const initials = profile.name.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase();

  return (
    <ClientLayout pageTitle="My Profile" pageSubtitle="Manage your account">
      <style>{`
        .cp-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 700px) { .cp-grid-2 { grid-template-columns: 1fr; } }
        .cp-input:focus { border-color: var(--color-primary) !important; }
        .cp-save-btn { padding: 9px 22px; border-radius: 8px; background: var(--gradient-blue); border: none; color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; font-family: var(--font-family); box-shadow: var(--shadow-btn); }
        .cp-cancel-btn { padding: 9px 22px; border-radius: 8px; background: var(--color-bg-secondary); border: 1px solid var(--color-border); color: var(--color-text-secondary); font-size: 13px; font-weight: 600; cursor: pointer; font-family: var(--font-family); }
        .cp-edit-btn { padding: 7px 16px; border-radius: 8px; background: rgba(26,159,224,0.1); border: 1px solid rgba(26,159,224,0.2); color: var(--color-primary); font-size: 12px; font-weight: 600; cursor: pointer; font-family: var(--font-family); }
      `}</style>

      <div style={{ padding: '28px', maxWidth: 860, margin: '0 auto' }}>

        {/* ── PROFILE PHOTO ── */}
        <SectionCard title="Profile Photo">
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              {profile.avatar ? (
                <img src={profile.avatar} alt="Avatar" style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-primary)' }} />
              ) : (
                <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'var(--gradient-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: '#fff', border: '3px solid var(--color-primary)', flexShrink: 0 }}>{initials}</div>
              )}
              <div style={{ position: 'absolute', bottom: 2, right: 2, width: 22, height: 22, borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid var(--color-bg-card)' }} onClick={() => fileRef.current?.click()}>
                <span style={{ fontSize: 10, color: '#fff' }}>✏️</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>{profile.name}</div>
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 14 }}>{profile.company}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => fileRef.current?.click()} style={{ padding: '7px 16px', borderRadius: 8, background: 'var(--gradient-blue)', border: 'none', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-family)', boxShadow: 'var(--shadow-btn)' }}>Upload Photo</button>
                {profile.avatar && <button onClick={removePhoto} style={{ padding: '7px 16px', borderRadius: 8, background: 'rgba(255,83,112,0.08)', border: '1px solid rgba(255,83,112,0.2)', color: 'var(--color-danger)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-family)' }}>Remove</button>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
            </div>
          </div>
        </SectionCard>

        {/* ── COMPANY DETAILS ── */}
        <SectionCard title="Company Details" action={editSection !== 'company' && <button className="cp-edit-btn" onClick={() => startEdit('company')}>Edit</button>}>
          {editSection === 'company' ? (
            <>
              <div className="cp-grid-2">
                {[
                  { label: 'Company Name', key: 'company', placeholder: 'e.g. TechCorp Solutions Pvt Ltd' },
                  { label: 'Industry',     key: 'industry', placeholder: 'e.g. Information Technology' },
                  { label: 'Website',      key: 'website',  placeholder: 'e.g. www.example.com' },
                  { label: 'GST Number',   key: 'gstNumber', placeholder: 'e.g. 29AADCT1234A1Z1' },
                  { label: 'Team Size',    key: 'teamSize',  placeholder: 'e.g. 11-50' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={labelStyle}>{f.label}</label>
                    <input value={draft[f.key] || ''} onChange={e => setDraft(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} style={inputStyle} className="cp-input" />
                  </div>
                ))}
                <div>
                  <label style={labelStyle}>Full Address</label>
                  <textarea value={draft.address || ''} onChange={e => setDraft(p => ({ ...p, address: e.target.value }))} placeholder="e.g. 42, MG Road, Bengaluru..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} className="cp-input" />
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <label style={labelStyle}>Bio</label>
                <textarea value={draft.bio || ''} onChange={e => setDraft(p => ({ ...p, bio: e.target.value }))} placeholder="Tell freelancers about your company..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} className="cp-input" maxLength={400} />
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4, textAlign: 'right' }}>{(draft.bio||'').length}/400</div>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 18 }}>
                <button className="cp-cancel-btn" onClick={cancelEdit}>Cancel</button>
                <button className="cp-save-btn" onClick={saveEdit}>Save Changes</button>
              </div>
            </>
          ) : (
            <div className="cp-grid-2">
              {[
                { label: 'Company Name', value: profile.company  },
                { label: 'Industry',     value: profile.industry },
                { label: 'Website',      value: profile.website  },
                { label: 'GST Number',   value: profile.gstNumber },
                { label: 'Team Size',    value: profile.teamSize  },
                { label: 'Address',      value: profile.address   },
              ].map(f => (
                <div key={f.label}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>{f.label}</div>
                  <div style={{ fontSize: 13, color: 'var(--color-text)', lineHeight: 1.5 }}>{f.value || <span style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Not set</span>}</div>
                </div>
              ))}
              {profile.bio && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>Bio</div>
                  <div style={{ fontSize: 13, color: 'var(--color-text)', lineHeight: 1.6 }}>{profile.bio}</div>
                </div>
              )}
            </div>
          )}
        </SectionCard>

        {/* ── CONTACT INFO ── */}
        <SectionCard title="Contact Information" action={editSection !== 'contact' && <button className="cp-edit-btn" onClick={() => startEdit('contact')}>Edit</button>}>
          {editSection === 'contact' ? (
            <>
              <div className="cp-grid-2">
                {[
                  { label: 'Full Name',     key: 'name',  type: 'text',  placeholder: 'Your full name' },
                  { label: 'Email Address', key: 'email', type: 'email', placeholder: 'e.g. you@company.com' },
                  { label: 'Phone Number',  key: 'phone', type: 'tel',   placeholder: 'e.g. +91 98765 43210' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={labelStyle}>{f.label}</label>
                    <input type={f.type} value={draft[f.key] || ''} onChange={e => setDraft(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} style={inputStyle} className="cp-input" />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 18 }}>
                <button className="cp-cancel-btn" onClick={cancelEdit}>Cancel</button>
                <button className="cp-save-btn" onClick={saveEdit}>Save Changes</button>
              </div>
            </>
          ) : (
            <div className="cp-grid-2">
              {[
                { label: 'Full Name',     value: profile.name  },
                { label: 'Email Address', value: profile.email },
                { label: 'Phone Number',  value: profile.phone },
              ].map(f => (
                <div key={f.label}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>{f.label}</div>
                  <div style={{ fontSize: 13, color: 'var(--color-text)' }}>{f.value}</div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* ── SUBSCRIPTION HISTORY ── */}
        <SectionCard title="Subscription History">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {/* Table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--color-border)', fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <span>Freelancer</span><span>Plan</span><span>Price</span><span>Status</span><span style={{ textAlign: 'right' }}>Actions</span>
            </div>
            {subs.map(sub => {
              const st = STATUS_CFG[sub.status] || STATUS_CFG.Cancelled;
              return (
                <div key={sub.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 12, padding: '14px 0', borderBottom: '1px solid var(--color-border)', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg, ${sub.color}, rgba(26,159,224,0.3))`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{sub.avatar}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>{sub.freelancer}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Since {new Date(sub.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 13, color: 'var(--color-text)' }}>{sub.plan}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>₹{sub.price.toLocaleString()}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: st.color, background: st.bg, padding: '3px 10px', borderRadius: 999, display: 'inline-block', width: 'fit-content' }}>{sub.status}</span>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                    {sub.status === 'Active' && (
                      <button onClick={() => setConfirmModal({ type: 'cancel', sub })} style={{ padding: '5px 10px', borderRadius: 6, background: 'rgba(255,83,112,0.08)', border: '1px solid rgba(255,83,112,0.2)', color: 'var(--color-danger)', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-family)' }}>Cancel</button>
                    )}
                    {(sub.status === 'Expiring' || sub.status === 'Cancelled' || sub.status === 'Completed') && (
                      <button onClick={() => setConfirmModal({ type: 'renew', sub })} style={{ padding: '5px 10px', borderRadius: 6, background: 'rgba(26,159,224,0.1)', border: '1px solid rgba(26,159,224,0.2)', color: 'var(--color-primary)', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-family)' }}>Renew</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* ── ACCOUNT SECURITY ── */}
        <SectionCard title="Account Security">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Password */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--color-border)' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', marginBottom: 2 }}>Password</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Last changed 3 months ago</div>
              </div>
              <button onClick={() => showToast('Password change handled in Settings → Security.')} style={{ padding: '7px 16px', borderRadius: 8, background: 'rgba(26,159,224,0.1)', border: '1px solid rgba(26,159,224,0.2)', color: 'var(--color-primary)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-family)' }}>Change Password</button>
            </div>

            {/* 2FA - Coming Soon */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>Two-Factor Authentication</div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--brand-gold)', background: 'rgba(253,196,73,0.15)', border: '1px solid rgba(253,196,73,0.3)', padding: '2px 8px', borderRadius: 999 }}>Coming Soon</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Secure your account with an authenticator app. Available in the next release.</div>
              </div>
              <button disabled style={{ padding: '7px 16px', borderRadius: 8, background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: 12, fontWeight: 600, cursor: 'not-allowed', fontFamily: 'var(--font-family)', opacity: 0.6 }}>Enable 2FA</button>
            </div>
          </div>
        </SectionCard>

      </div>

      {/* ── CONFIRM MODAL ── */}
      {confirmModal && (
        <ConfirmModal
          title={confirmModal.type === 'cancel' ? 'Cancel Subscription' : 'Renew Subscription'}
          message={confirmModal.type === 'cancel'
            ? `Are you sure you want to cancel your ${confirmModal.sub.plan} Plan with ${confirmModal.sub.freelancer}? This cannot be undone.`
            : `Renew your ${confirmModal.sub.plan} Plan with ${confirmModal.sub.freelancer} for ₹${confirmModal.sub.price.toLocaleString()}/month?`}
          onConfirm={confirmSubAction}
          onCancel={() => setConfirmModal(null)}
          variant={confirmModal.type === 'cancel' ? 'danger' : 'primary'}
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
