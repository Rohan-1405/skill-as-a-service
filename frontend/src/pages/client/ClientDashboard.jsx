// ============================================================
// SkillAsAService — ClientDashboard.jsx  (UPDATED)
// Now uses ClientLayout — all nav/sidebar logic lives there.
// Dashboard widgets are fully wired with navigation.
// ============================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import ClientLayout from './ClientLayout';

// ── Mock data ─────────────────────────────────────────────────
const STATS = [
  { label: 'Active Subscriptions', value: '3',      sub: '+1 this month',      color: 'var(--color-primary)',     bg: 'rgba(26,159,224,0.10)',  icon: '📋', path: '/client/subscriptions' },
  { label: 'Pending Projects',     value: '5',      sub: '2 due this week',    color: 'var(--brand-gold)',        bg: 'rgba(253,196,73,0.10)',  icon: '📁', path: '/client/projects'      },
  { label: 'Wallet Balance',       value: '₹4,200', sub: 'Available funds',    color: 'var(--color-success)',     bg: 'rgba(100,255,218,0.08)', icon: '💰', path: '/client/wallet'        },
  { label: 'Unread Messages',      value: '8',      sub: '3 from freelancers', color: 'var(--brand-cyan)',        bg: 'rgba(50,220,253,0.10)',  icon: '💬', path: '/client/messages'      },
];

const ACTIVE_SUBS = [
  { freelancer: 'Arjun Sharma', plan: 'Standard Plan', skill: 'Full Stack Dev', renewal: '18 Jul 2026', price: '₹5,999',  status: 'Active',   avatar: 'AS', color: 'var(--color-primary)' },
  { freelancer: 'Priya Menon',  plan: 'Basic Plan',    skill: 'UI/UX Design',   renewal: '22 Jul 2026', price: '₹2,999',  status: 'Active',   avatar: 'PM', color: 'var(--brand-cyan)'    },
  { freelancer: 'Rohan Gupta',  plan: 'Premium Plan',  skill: 'DevOps',         renewal: '05 Aug 2026', price: '₹11,999', status: 'Expiring', avatar: 'RG', color: 'var(--brand-gold)'    },
];

const RECENT_PROJECTS = [
  { title: 'E-commerce Redesign',  freelancer: 'Arjun Sharma', status: 'Active',    progress: 65,  due: '25 Jun' },
  { title: 'Mobile App UI',        freelancer: 'Priya Menon',  status: 'Review',    progress: 90,  due: '20 Jun' },
  { title: 'CI/CD Pipeline Setup', freelancer: 'Rohan Gupta',  status: 'Pending',   progress: 20,  due: '30 Jun' },
  { title: 'SEO Optimization',     freelancer: 'Arjun Sharma', status: 'Completed', progress: 100, due: 'Done'   },
];

const STATUS_CONFIG = {
  Active:    { color: 'var(--color-primary)',   bg: 'rgba(26,159,224,0.12)'  },
  Review:    { color: 'var(--brand-gold)',       bg: 'rgba(253,196,73,0.12)'  },
  Pending:   { color: 'var(--color-text-muted)', bg: 'rgba(160,170,191,0.10)' },
  Completed: { color: 'var(--color-success)',    bg: 'rgba(100,255,218,0.10)' },
  Expiring:  { color: 'var(--color-danger)',     bg: 'rgba(255,83,112,0.10)'  },
};

export default function ClientDashboard() {
  const navigate = useNavigate();

  return (
    <ClientLayout pageTitle="Dashboard" pageSubtitle="Welcome back!">
      <style>{`
        .cd-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }
        .cd-stat-card {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 20px 18px;
          cursor: pointer;
          transition: border-color 200ms, transform 200ms;
        }
        .cd-stat-card:hover {
          border-color: var(--color-primary);
          transform: translateY(-2px);
        }
        .cd-lower-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .cd-quick-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 28px;
        }
        @media (max-width: 900px) {
          .cd-stats-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .cd-lower-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .cd-stats-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div style={{ padding: '28px' }}>

        {/* ── STAT WIDGETS ── */}
        <div className="cd-stats-grid">
          {STATS.map((s) => (
            <div key={s.label} className="cd-stat-card" onClick={() => navigate(s.path)}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 500 }}>{s.label}</span>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{s.icon}</div>
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── QUICK ACTIONS ── */}
        <div className="cd-quick-actions">
          {[
            { label: '🔍 Browse Freelancers', primary: true,  path: '/client/browse'         },
            { label: '➕ Create Project',      primary: false, path: '/client/projects'       },
            { label: '💰 Add Funds',           primary: false, path: '/client/wallet'         },
            { label: '💬 Open Messages',       primary: false, path: '/client/messages'       },
          ].map(btn => (
            <button
              key={btn.label}
              onClick={() => navigate(btn.path)}
              style={{
                padding: '9px 18px', borderRadius: 8,
                background: btn.primary ? 'var(--gradient-blue)' : 'var(--color-bg-card)',
                border: btn.primary ? 'none' : '1px solid var(--color-border)',
                color: btn.primary ? '#fff' : 'var(--color-text-secondary)',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'var(--font-family)',
                boxShadow: btn.primary ? 'var(--shadow-btn)' : 'none',
                transition: 'opacity 150ms',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >{btn.label}</button>
          ))}
        </div>

        {/* ── LOWER 2-COL ── */}
        <div className="cd-lower-grid">

          {/* Active Subscriptions */}
          <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>Active Subscriptions</div>
              <button onClick={() => navigate('/client/subscriptions')} style={{ fontSize: 12, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--font-family)' }}>View All →</button>
            </div>
            <div style={{ padding: '8px 0' }}>
              {ACTIVE_SUBS.map((sub, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: i < ACTIVE_SUBS.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg, ${sub.color}, rgba(26,159,224,0.3))`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{sub.avatar}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginBottom: 2 }}>{sub.freelancer}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{sub.plan} · {sub.skill}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)' }}>{sub.price}</div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: STATUS_CONFIG[sub.status]?.color, background: STATUS_CONFIG[sub.status]?.bg, padding: '2px 8px', borderRadius: 999, display: 'inline-block', marginTop: 2 }}>{sub.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Projects */}
          <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>Recent Projects</div>
              <button onClick={() => navigate('/client/projects')} style={{ fontSize: 12, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--font-family)' }}>View All →</button>
            </div>
            <div style={{ padding: '8px 0' }}>
              {RECENT_PROJECTS.map((proj, i) => {
                const st = STATUS_CONFIG[proj.status] || STATUS_CONFIG.Pending;
                return (
                  <div key={i} style={{ padding: '12px 20px', borderBottom: i < RECENT_PROJECTS.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginBottom: 1 }}>{proj.title}</div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{proj.freelancer} · Due {proj.due}</div>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: st.color, background: st.bg, padding: '2px 8px', borderRadius: 999, flexShrink: 0 }}>{proj.status}</span>
                    </div>
                    <div style={{ height: 4, background: 'var(--color-border)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 2, width: `${proj.progress}%`, background: proj.progress === 100 ? 'var(--color-success)' : 'var(--gradient-blue)', transition: 'width 400ms ease' }} />
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 3 }}>{proj.progress}% complete</div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </ClientLayout>
  );
}
