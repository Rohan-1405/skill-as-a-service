// ============================================================
// SkillAsAService — ClientDashboard.jsx
// Author: Praveen Gorla  |  Day 3 (COMPLETED)
//
// Full client dashboard with:
//   - DashboardHeader + NotificationPanel
//   - Stats widgets (Active Subscriptions, Projects, Wallet, Notifications)
//   - Quick Actions
//   - Active Subscriptions list
//   - Recent Projects list
//   - Sidebar navigation
// ============================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import DashboardHeader from '../../components/common/DashboardHeader';
import NotificationPanel, { SAMPLE_NOTIFS } from '../../components/common/NotificationPanel';

// ── Icons (inline SVG to avoid extra deps) ──────────────────
const Icon = {
  Dashboard:   () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  Browse:      () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  Subs:        () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Projects:    () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  Wallet:      () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z"/></svg>,
  Messages:    () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Settings:    () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Arrow:       () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>,
  Plus:        () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
};

// ── Sample Data ──────────────────────────────────────────────
const STATS = [
  { label: 'Active Subscriptions', value: '3',      sub: '+1 this month',    color: 'var(--color-primary)',   bg: 'rgba(26,159,224,0.10)',   icon: '📋' },
  { label: 'Pending Projects',     value: '5',      sub: '2 due this week',  color: 'var(--brand-gold)',      bg: 'rgba(253,196,73,0.10)',   icon: '📁' },
  { label: 'Wallet Balance',       value: '₹4,200', sub: 'Available funds',  color: 'var(--color-success)',   bg: 'rgba(100,255,218,0.08)',  icon: '💰' },
  { label: 'Unread Messages',      value: '8',      sub: '3 from freelancers',color:'var(--brand-cyan)',      bg: 'rgba(50,220,253,0.10)',   icon: '💬' },
];

const ACTIVE_SUBS = [
  { freelancer: 'Arjun Sharma',  plan: 'Standard Plan',  skill: 'Full Stack Dev', renewal: '18 Jul 2026', price: '₹5,999', status: 'Active',   avatar: 'AS', color: 'var(--color-primary)' },
  { freelancer: 'Priya Menon',   plan: 'Basic Plan',     skill: 'UI/UX Design',   renewal: '22 Jul 2026', price: '₹2,999', status: 'Active',   avatar: 'PM', color: 'var(--brand-cyan)' },
  { freelancer: 'Rohan Gupta',   plan: 'Premium Plan',   skill: 'DevOps',         renewal: '05 Aug 2026', price: '₹11,999',status: 'Expiring', avatar: 'RG', color: 'var(--brand-gold)' },
];

const RECENT_PROJECTS = [
  { title: 'E-commerce Redesign',    freelancer: 'Arjun Sharma',  status: 'Active',    progress: 65, due: '25 Jun' },
  { title: 'Mobile App UI',          freelancer: 'Priya Menon',   status: 'Review',    progress: 90, due: '20 Jun' },
  { title: 'CI/CD Pipeline Setup',   freelancer: 'Rohan Gupta',   status: 'Pending',   progress: 20, due: '30 Jun' },
  { title: 'SEO Optimization',       freelancer: 'Arjun Sharma',  status: 'Completed', progress: 100,due: 'Done'   },
];

const STATUS_CONFIG = {
  Active:    { color: 'var(--color-primary)', bg: 'rgba(26,159,224,0.12)' },
  Review:    { color: 'var(--brand-gold)',    bg: 'rgba(253,196,73,0.12)' },
  Pending:   { color: 'var(--color-text-muted)', bg: 'rgba(160,170,191,0.10)' },
  Completed: { color: 'var(--color-success)', bg: 'rgba(100,255,218,0.10)' },
  Expiring:  { color: 'var(--color-danger)',  bg: 'rgba(255,83,112,0.10)' },
};

const NAV_ITEMS = [
  { icon: Icon.Dashboard, label: 'Dashboard',          active: true },
  { icon: Icon.Browse,    label: 'Browse Freelancers', active: false },
  { icon: Icon.Subs,      label: 'Subscriptions',      active: false, badge: 3 },
  { icon: Icon.Projects,  label: 'Projects',           active: false, badge: 5 },
  { icon: Icon.Wallet,    label: 'Wallet',             active: false },
  { icon: Icon.Messages,  label: 'Messages',           active: false, badge: 8 },
  { icon: Icon.Settings,  label: 'Settings',           active: false },
];

// ── Component ────────────────────────────────────────────────
export default function ClientDashboard() {
  const { logout } = useAuthContext();
  const navigate   = useNavigate();

  const [notifOpen, setNotifOpen]         = useState(false);
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFS);
  const [sidebarOpen, setSidebarOpen]     = useState(false);
  const [activeNav, setActiveNav]         = useState('Dashboard');

  const unreadCount    = notifications.filter(n => !n.read).length;
  const handleMarkRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const handleMarkAll  = ()   => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)', fontFamily: 'var(--font-family)' }}>

      {/* ── SIDEBAR ── */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 199, display: 'none' }}
          className="sidebar-mobile-overlay"
        />
      )}
      <aside style={{
        width: 240, flexShrink: 0,
        background: 'var(--color-bg-secondary)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh',
        overflowY: 'auto',
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--gradient-brand)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 800, color: '#fff',
            }}>S</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.2 }}>SkillAsAService</div>
              <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>Client Portal</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0 12px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 8px 8px' }}>Main Menu</div>
          {NAV_ITEMS.map(({ icon: NavIcon, label, badge }) => {
            const isActive = activeNav === label;
            return (
              <button key={label}
                onClick={() => setActiveNav(label)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                  padding: '10px 12px', marginBottom: 2, borderRadius: 8,
                  background: isActive ? 'rgba(26,159,224,0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(26,159,224,0.20)' : '1px solid transparent',
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  cursor: 'pointer', textAlign: 'left',
                  fontSize: 13, fontWeight: isActive ? 600 : 400,
                  fontFamily: 'var(--font-family)',
                  transition: 'all 150ms',
                }}
              >
                <NavIcon />
                <span style={{ flex: 1 }}>{label}</span>
                {badge && (
                  <span style={{
                    background: 'var(--color-danger)', color: '#fff',
                    fontSize: 10, fontWeight: 700, padding: '1px 6px',
                    borderRadius: 999, minWidth: 18, textAlign: 'center',
                  }}>{badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User info at bottom */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'var(--gradient-blue)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>C</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Client User</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>client@example.com</div>
            </div>
          </div>
          <button onClick={logout} style={{
            marginTop: 10, width: '100%', padding: '8px',
            background: 'transparent', border: '1px solid var(--color-border)',
            borderRadius: 6, color: 'var(--color-danger)',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'var(--font-family)',
          }}>Sign Out</button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader
          pageTitle="Dashboard"
          pageSubtitle="Welcome back, Client!"
          onMenuToggle={() => setSidebarOpen(v => !v)}
          notifCount={unreadCount}
          onNotifClick={() => setNotifOpen(true)}
          userRole="client"
          userName="Client User"
          onSignOut={logout}
        />

        <main style={{ flex: 1, padding: '28px 28px', overflowY: 'auto' }}>

          {/* ── STATS WIDGETS ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16, marginBottom: 28,
          }}>
            {STATS.map((s) => (
              <div key={s.label} style={{
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 12,
                padding: '20px 18px',
                display: 'flex', flexDirection: 'column', gap: 12,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 500 }}>{s.label}</span>
                  <div style={{
                    width: 36, height: 36, borderRadius: 9,
                    background: s.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18,
                  }}>{s.icon}</div>
                </div>
                <div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>{s.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── QUICK ACTIONS ── */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)', marginBottom: 12 }}>Quick Actions</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[
                { label: '🔍 Browse Freelancers', primary: true  },
                { label: '➕ Create Project',      primary: false },
                { label: '💰 Add Funds',           primary: false },
                { label: '💬 Open Messages',       primary: false },
              ].map(btn => (
                <button key={btn.label} style={{
                  padding: '9px 18px', borderRadius: 8,
                  background: btn.primary ? 'var(--gradient-blue)' : 'var(--color-bg-card)',
                  border: btn.primary ? 'none' : '1px solid var(--color-border)',
                  color: btn.primary ? '#fff' : 'var(--color-text-secondary)',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'var(--font-family)',
                  boxShadow: btn.primary ? 'var(--shadow-btn)' : 'none',
                }}>{btn.label}</button>
              ))}
            </div>
          </div>

          {/* ── TWO-COLUMN LOWER SECTION ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

            {/* Active Subscriptions */}
            <div style={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 12, overflow: 'hidden',
            }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>Active Subscriptions</div>
                <button style={{ fontSize: 12, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--font-family)' }}>View All →</button>
              </div>
              <div style={{ padding: '8px 0' }}>
                {ACTIVE_SUBS.map((sub, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: i < ACTIVE_SUBS.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: `linear-gradient(135deg, ${sub.color}, rgba(26,159,224,0.3))`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
                    }}>{sub.avatar}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginBottom: 2 }}>{sub.freelancer}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{sub.plan} · {sub.skill}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)' }}>{sub.price}</div>
                      <span style={{
                        fontSize: 10, fontWeight: 700,
                        color: STATUS_CONFIG[sub.status]?.color || 'var(--color-text-muted)',
                        background: STATUS_CONFIG[sub.status]?.bg,
                        padding: '2px 8px', borderRadius: 999,
                        display: 'inline-block', marginTop: 2,
                      }}>{sub.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Projects */}
            <div style={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 12, overflow: 'hidden',
            }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>Recent Projects</div>
                <button style={{ fontSize: 12, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--font-family)' }}>View All →</button>
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
                        <span style={{
                          fontSize: 10, fontWeight: 700,
                          color: st.color, background: st.bg,
                          padding: '2px 8px', borderRadius: 999,
                        }}>{proj.status}</span>
                      </div>
                      {/* Progress bar */}
                      <div style={{ height: 4, background: 'var(--color-border)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', borderRadius: 2, width: `${proj.progress}%`,
                          background: proj.progress === 100 ? 'var(--color-success)' : 'var(--gradient-blue)',
                          transition: 'width 400ms ease',
                        }} />
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 3 }}>{proj.progress}% complete</div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={notifOpen}
        onClose={() => setNotifOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkRead}
        onMarkAllRead={handleMarkAll}
      />
    </div>
  );
}
