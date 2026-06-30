// ============================================================
// SkillAsAService — ClientSubscriptions.jsx
// Route: /client/subscriptions
// Lists all active subscriptions with Upgrade/Downgrade/Renew/Cancel flows.
// ============================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientLayout from './ClientLayout';

const INIT_SUBS = [
  { id: 1, freelancer: 'Arjun Sharma', skill: 'Full Stack Developer', plan: 'Standard', price: 5999,  billing: 'monthly', renewal: '2026-07-18', status: 'Active',   avatar: 'AS', color: '#1A9FE0', requests: 8,  used: 5,  revisions: 3, delivery: 5  },
  { id: 2, freelancer: 'Priya Menon',  skill: 'UI/UX Design',        plan: 'Basic',    price: 2999,  billing: 'monthly', renewal: '2026-07-22', status: 'Active',   avatar: 'PM', color: '#32DCFD', requests: 3,  used: 3,  revisions: 1, delivery: 7  },
  { id: 3, freelancer: 'Rohan Gupta',  skill: 'DevOps & Cloud',       plan: 'Premium',  price: 11999, billing: 'monthly', renewal: '2026-08-05', status: 'Expiring', avatar: 'RG', color: '#FDC449', requests: 20, used: 14, revisions: 5, delivery: 2  },
  { id: 4, freelancer: 'Divya Nair',   skill: 'Content Writing',      plan: 'Basic',    price: 1999,  billing: 'monthly', renewal: '2026-07-10', status: 'Paused',   avatar: 'DN', color: '#64FFDA', requests: 3,  used: 1,  revisions: 1, delivery: 7  },
];

const PLANS = [
  { name: 'Basic',    price: 1999,  requests: 3,  revisions: 1, delivery: 7 },
  { name: 'Standard', price: 5999,  requests: 8,  revisions: 3, delivery: 5 },
  { name: 'Premium',  price: 11999, requests: 20, revisions: 5, delivery: 2 },
];

const STATUS_CFG = {
  Active:   { color: '#1A9FE0', bg: 'rgba(26,159,224,0.12)'  },
  Expiring: { color: '#FF5370', bg: 'rgba(255,83,112,0.12)'  },
  Paused:   { color: '#FDC449', bg: 'rgba(253,196,73,0.12)'  },
  Cancelled:{ color: '#556080', bg: 'rgba(85,96,128,0.12)'   },
};

function Modal({ title, onClose, children, footer }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
      <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 16, padding: '28px 32px', width: '100%', maxWidth: 480, boxShadow: 'var(--shadow-card)', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: 20, cursor: 'pointer', lineHeight: 1 }}>✕</button>
        </div>
        {children}
        {footer && <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 22 }}>{footer}</div>}
      </div>
    </div>
  );
}

export default function ClientSubscriptions() {
  const navigate = useNavigate();
  const [subs, setSubs]           = useState(INIT_SUBS);
  const [modal, setModal]         = useState(null); // { type, sub }
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [toast, setToast]         = useState(null);
  const [filter, setFilter]       = useState('All');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAction = (type, sub) => {
    setSelectedPlan(sub.plan);
    setModal({ type, sub });
  };

  const confirmAction = () => {
    const { type, sub } = modal;
    if (type === 'cancel') {
      setSubs(prev => prev.map(s => s.id === sub.id ? { ...s, status: 'Cancelled' } : s));
      showToast(`Subscription to ${sub.freelancer} cancelled.`, 'danger');
    } else if (type === 'renew') {
      const d = new Date(); d.setMonth(d.getMonth() + 1);
      setSubs(prev => prev.map(s => s.id === sub.id ? { ...s, status: 'Active', renewal: d.toISOString().split('T')[0] } : s));
      showToast(`Subscription to ${sub.freelancer} renewed!`);
    } else if (type === 'change') {
      const plan = PLANS.find(p => p.name === selectedPlan);
      if (plan) {
        setSubs(prev => prev.map(s => s.id === sub.id ? { ...s, plan: plan.name, price: plan.price, requests: plan.requests, revisions: plan.revisions, delivery: plan.delivery } : s));
        showToast(`Plan changed to ${plan.name}!`);
      }
    }
    setModal(null);
  };

  const filtered = filter === 'All' ? subs : subs.filter(s => s.status === filter);
  const counts = { All: subs.length, Active: subs.filter(s => s.status === 'Active').length, Expiring: subs.filter(s => s.status === 'Expiring').length, Paused: subs.filter(s => s.status === 'Paused').length };

  return (
    <ClientLayout pageTitle="My Subscriptions" pageSubtitle="Manage your active plans">
      <style>{`
        .cs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px; }
        @media (max-width: 600px) { .cs-grid { grid-template-columns: 1fr; } }
        .cs-card { background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: 14px; overflow: hidden; transition: border-color 200ms; }
        .cs-card:hover { border-color: rgba(26,159,224,0.3); }
      `}</style>

      <div style={{ padding: '28px' }}>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {['All', 'Active', 'Expiring', 'Paused'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-family)', background: filter === f ? 'var(--gradient-blue)' : 'var(--color-bg-card)', border: filter === f ? 'none' : '1px solid var(--color-border)', color: filter === f ? '#fff' : 'var(--color-text-secondary)', boxShadow: filter === f ? 'var(--shadow-btn)' : 'none' }}>
              {f} {counts[f] !== undefined && <span style={{ opacity: 0.7 }}>({counts[f]})</span>}
            </button>
          ))}
          <button onClick={() => navigate('/client/browse')} style={{ marginLeft: 'auto', padding: '7px 18px', borderRadius: 999, fontSize: 13, fontWeight: 600, background: 'rgba(26,159,224,0.1)', border: '1px solid rgba(26,159,224,0.25)', color: 'var(--color-primary)', cursor: 'pointer', fontFamily: 'var(--font-family)' }}>+ Add Subscription</button>
        </div>

        {/* Cards */}
        <div className="cs-grid">
          {filtered.map(sub => {
            const st = STATUS_CFG[sub.status] || STATUS_CFG.Active;
            const pct = Math.round((sub.used / sub.requests) * 100);
            const daysLeft = Math.max(0, Math.ceil((new Date(sub.renewal) - new Date()) / 86400000));
            return (
              <div key={sub.id} className="cs-card">
                {/* Header */}
                <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 46, height: 46, borderRadius: '50%', background: `linear-gradient(135deg, ${sub.color}, rgba(26,159,224,0.3))`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{sub.avatar}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>{sub.freelancer}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 1 }}>{sub.skill}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: st.color, background: st.bg, padding: '3px 10px', borderRadius: 999 }}>{sub.status}</span>
                </div>

                {/* Plan info */}
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 2 }}>Plan</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-primary)' }}>{sub.plan}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 2 }}>Price</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)' }}>₹{sub.price.toLocaleString()}<span style={{ fontSize: 11, fontWeight: 400, color: 'var(--color-text-muted)' }}>/mo</span></div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 2 }}>Renews in</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: daysLeft <= 7 ? 'var(--color-danger)' : 'var(--color-text)' }}>{daysLeft}d</div>
                    </div>
                  </div>
                  {/* Usage bar */}
                  <div style={{ marginBottom: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 5 }}>
                      <span>Requests used</span>
                      <span>{sub.used} / {sub.requests}</span>
                    </div>
                    <div style={{ height: 5, background: 'var(--color-border)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: pct >= 90 ? 'var(--color-danger)' : pct >= 70 ? 'var(--brand-gold)' : 'var(--gradient-blue)', borderRadius: 3, transition: 'width 400ms ease' }} />
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                    {sub.revisions} revisions · {sub.delivery}-day delivery SLA
                  </div>
                </div>

                {/* Actions */}
                <div style={{ padding: '12px 20px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {sub.status !== 'Cancelled' && (
                    <button onClick={() => handleAction('change', sub)} style={{ flex: 1, padding: '7px 10px', borderRadius: 7, background: 'rgba(26,159,224,0.1)', border: '1px solid rgba(26,159,224,0.2)', color: 'var(--color-primary)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-family)' }}>Change Plan</button>
                  )}
                  {(sub.status === 'Expiring' || sub.status === 'Paused') && (
                    <button onClick={() => handleAction('renew', sub)} style={{ flex: 1, padding: '7px 10px', borderRadius: 7, background: 'var(--gradient-blue)', border: 'none', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-family)', boxShadow: 'var(--shadow-btn)' }}>Renew</button>
                  )}
                  {sub.status === 'Active' && (
                    <button onClick={() => handleAction('cancel', sub)} style={{ flex: 1, padding: '7px 10px', borderRadius: 7, background: 'rgba(255,83,112,0.08)', border: '1px solid rgba(255,83,112,0.2)', color: 'var(--color-danger)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-family)' }}>Cancel</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-text-muted)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 8 }}>No subscriptions here</div>
            <button onClick={() => navigate('/client/browse')} style={{ marginTop: 8, padding: '9px 22px', borderRadius: 999, background: 'var(--gradient-blue)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-family)', boxShadow: 'var(--shadow-btn)' }}>Browse Freelancers</button>
          </div>
        )}
      </div>

      {/* ── CANCEL MODAL ── */}
      {modal?.type === 'cancel' && (
        <Modal title="Cancel Subscription" onClose={() => setModal(null)} footer={[
          <button key="no" onClick={() => setModal(null)} style={{ padding: '9px 22px', borderRadius: 8, background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-family)' }}>Keep Subscription</button>,
          <button key="yes" onClick={confirmAction} style={{ padding: '9px 22px', borderRadius: 8, background: 'rgba(255,83,112,0.12)', border: '1px solid rgba(255,83,112,0.3)', color: 'var(--color-danger)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-family)' }}>Yes, Cancel</button>,
        ]}>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 14, lineHeight: 1.7 }}>
            Are you sure you want to cancel your <strong style={{ color: 'var(--color-text)' }}>{modal.sub.plan} Plan</strong> with <strong style={{ color: 'var(--color-text)' }}>{modal.sub.freelancer}</strong>?
            <br /><br />
            <span style={{ color: 'var(--color-danger)', fontSize: 12 }}>⚠️ Your remaining requests will be lost and no refund is issued for the current billing cycle.</span>
          </div>
        </Modal>
      )}

      {/* ── RENEW MODAL ── */}
      {modal?.type === 'renew' && (
        <Modal title="Renew Subscription" onClose={() => setModal(null)} footer={[
          <button key="no" onClick={() => setModal(null)} style={{ padding: '9px 22px', borderRadius: 8, background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-family)' }}>Cancel</button>,
          <button key="yes" onClick={confirmAction} style={{ padding: '9px 22px', borderRadius: 8, background: 'var(--gradient-blue)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-family)', boxShadow: 'var(--shadow-btn)' }}>Confirm Renewal</button>,
        ]}>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 14, lineHeight: 1.7 }}>
            Renewing <strong style={{ color: 'var(--color-text)' }}>{modal.sub.plan} Plan</strong> with <strong style={{ color: 'var(--color-text)' }}>{modal.sub.freelancer}</strong> for <strong style={{ color: 'var(--color-primary)' }}>₹{modal.sub.price.toLocaleString()}/month</strong>.
            <br /><br />Your wallet will be charged and the plan renewed for 30 days.
          </div>
        </Modal>
      )}

      {/* ── CHANGE PLAN MODAL ── */}
      {modal?.type === 'change' && (
        <Modal title={`Change Plan — ${modal.sub.freelancer}`} onClose={() => setModal(null)} footer={[
          <button key="no" onClick={() => setModal(null)} style={{ padding: '9px 22px', borderRadius: 8, background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-family)' }}>Cancel</button>,
          <button key="yes" onClick={confirmAction} style={{ padding: '9px 22px', borderRadius: 8, background: 'var(--gradient-blue)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-family)', boxShadow: 'var(--shadow-btn)' }}>Confirm Change</button>,
        ]}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {PLANS.map(plan => {
              const isCurrent = plan.name === modal.sub.plan;
              const isSelected = plan.name === selectedPlan;
              return (
                <div key={plan.name} onClick={() => !isCurrent && setSelectedPlan(plan.name)} style={{ padding: '14px 16px', borderRadius: 10, border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`, background: isSelected ? 'rgba(26,159,224,0.06)' : 'var(--color-bg-secondary)', cursor: isCurrent ? 'default' : 'pointer', opacity: isCurrent ? 0.5 : 1, transition: 'all 150ms' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>{plan.name} {isCurrent && <span style={{ fontSize: 10, color: 'var(--color-text-muted)', fontWeight: 400 }}>(current)</span>}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>{plan.requests} requests · {plan.revisions} revisions · {plan.delivery}d SLA</div>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-primary)' }}>₹{plan.price.toLocaleString()}<span style={{ fontSize: 10, fontWeight: 400, color: 'var(--color-text-muted)' }}>/mo</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Modal>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: toast.type === 'danger' ? 'rgba(255,83,112,0.15)' : 'rgba(100,255,218,0.15)', border: `1px solid ${toast.type === 'danger' ? 'rgba(255,83,112,0.4)' : 'rgba(100,255,218,0.4)'}`, color: toast.type === 'danger' ? '#FF5370' : '#64FFDA', padding: '12px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-family)', zIndex: 2000, boxShadow: 'var(--shadow-card)' }}>
          {toast.msg}
        </div>
      )}
    </ClientLayout>
  );
}
