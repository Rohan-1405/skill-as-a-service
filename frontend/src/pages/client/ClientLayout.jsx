// ============================================================
// SkillAsAService — ClientLayout.jsx
// Shared layout shell for ALL client portal pages.
// Provides: sidebar, DashboardHeader, NotificationPanel.
// Usage: wrap any client page with <ClientLayout pageTitle="...">
// ============================================================

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import DashboardHeader from '../../components/common/DashboardHeader';
import NotificationPanel, { SAMPLE_NOTIFS } from '../../components/common/NotificationPanel';
import logo from '../../assets/logos/logo.png';

// ── Icons ────────────────────────────────────────────────────
const Icons = {
  Dashboard:  () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  Browse:     () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  Subs:       () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Projects:   () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  Wallet:     () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z"/></svg>,
  Messages:   () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Profile:    () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Settings:   () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Invoices:   () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Close:      () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
};

const NAV_ITEMS = [
  { icon: Icons.Dashboard, label: 'Dashboard',          path: '/client/dashboard',      badge: null },
  { icon: Icons.Browse,    label: 'Browse Freelancers', path: '/client/browse',          badge: null },
  { icon: Icons.Subs,      label: 'Subscriptions',      path: '/client/subscriptions',   badge: 3    },
  { icon: Icons.Projects,  label: 'Projects',           path: '/client/projects',        badge: 5    },
  { icon: Icons.Messages,  label: 'Messages',           path: '/client/messages',        badge: 8    },
  { icon: Icons.Wallet,    label: 'Wallet',             path: '/client/wallet',          badge: null },
  { icon: Icons.Invoices,  label: 'Invoices',           path: '/client/invoices',        badge: null },
  { icon: Icons.Profile,   label: 'My Profile',         path: '/client/profile',         badge: null },
  { icon: Icons.Settings,  label: 'Settings',           path: '/client/settings',        badge: null },
];

export default function ClientLayout({ children, pageTitle = 'Dashboard', pageSubtitle = '' }) {
  const { logout, user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifOpen, setNotifOpen]         = useState(false);
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFS);
  const [sidebarOpen, setSidebarOpen]     = useState(false);

  const unreadCount    = notifications.filter(n => !n.read).length;
  const handleMarkRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const handleMarkAll  = ()   => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const handleSignOut = () => { logout(); navigate('/login'); };

  const handleNavClick = (path) => {
    setSidebarOpen(false);
    if (path) navigate(path);
  };

  const userName = user?.name || 'Client User';
  const userEmail = user?.email || 'client@skillasaservice.com';
  const userInitials = userName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <>
      <style>{`
        .cl-sidebar {
          width: 240px;
          flex-shrink: 0;
          background: var(--color-bg-secondary);
          border-right: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          z-index: var(--z-sidebar);
          transition: transform 280ms cubic-bezier(0.4,0,0.2,1);
        }
        .cl-sidebar-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          z-index: calc(var(--z-sidebar) - 1);
          backdrop-filter: blur(2px);
        }
        @media (max-width: 768px) {
          .cl-sidebar {
            position: fixed;
            left: 0; top: 0;
            height: 100vh;
            transform: translateX(-100%);
          }
          .cl-sidebar.open {
            transform: translateX(0);
            box-shadow: 4px 0 32px rgba(0,0,0,0.4);
          }
          .cl-sidebar-overlay.open { display: block; }
        }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)', fontFamily: 'var(--font-family)' }}>

        <div
          className={`cl-sidebar-overlay${sidebarOpen ? ' open' : ''}`}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />

        <aside className={`cl-sidebar${sidebarOpen ? ' open' : ''}`}>
          {/* Logo + close */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 16px 0' }}>
            <img src={logo} alt="SkillAsAService" style={{ width: 140, height: 52, objectFit: 'contain' }} />
            <button onClick={() => setSidebarOpen(false)} style={{ background: 'transparent', border: '1px solid var(--color-border)', borderRadius: 6, color: 'var(--color-text-muted)', padding: '4px 6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Close sidebar">
              <Icons.Close />
            </button>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: '16px 12px 0' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 8px 8px' }}>Client Portal</div>
            {NAV_ITEMS.map(({ icon: NavIcon, label, path, badge }) => {
              const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
              return (
                <button
                  key={label}
                  onClick={() => handleNavClick(path)}
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
                    <span style={{ background: 'var(--color-danger)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 999, minWidth: 18, textAlign: 'center' }}>{badge}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User footer */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--gradient-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{userInitials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userName}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userEmail}</div>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              style={{ marginTop: 10, width: '100%', padding: '8px', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: 6, color: 'var(--color-danger)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-family)', transition: 'background 150ms, border-color 150ms' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,83,112,0.08)'; e.currentTarget.style.borderColor = 'var(--color-danger)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
            >
              🚪 Sign Out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <DashboardHeader
            pageTitle={pageTitle}
            pageSubtitle={pageSubtitle}
            onMenuToggle={() => setSidebarOpen(v => !v)}
            notifCount={unreadCount}
            onNotifClick={() => setNotifOpen(true)}
            userRole="client"
            userName={userName}
            onSignOut={handleSignOut}
          />
          <main style={{ flex: 1, overflowY: 'auto' }}>
            {children}
          </main>
        </div>

        <NotificationPanel
          isOpen={notifOpen}
          onClose={() => setNotifOpen(false)}
          notifications={notifications}
          onMarkRead={handleMarkRead}
          onMarkAllRead={handleMarkAll}
        />
      </div>
    </>
  );
}
