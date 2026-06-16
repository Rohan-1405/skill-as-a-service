// ============================================================
// SkillAsAService — FreelancerDashboard.jsx
// Author: Praveen Gorla  |  Updated Day 3
//
// Changes:
//   • Sign Out wired via useAuthContext().logout()
//   • logout passed to DashboardHeader as onSignOut prop
//   • NotificationPanel state managed here
// ============================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import DashboardHeader from '../../components/common/DashboardHeader';
import NotificationPanel, { SAMPLE_NOTIFS } from '../../components/common/NotificationPanel';
import AppButton from '../../components/common/AppButton';
import AppCard from '../../components/common/AppCard';

export default function FreelancerDashboard() {
  const { logout } = useAuthContext();
  const navigate   = useNavigate();

  const [notifOpen, setNotifOpen]         = useState(false);
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  /* ---- Sign Out handler: clears auth then redirects to login ---- */
  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      fontFamily: 'var(--font-family)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* ---- Header (Praveen - Day 3) — Sign Out wired ---- */}
      <DashboardHeader
        pageTitle="Dashboard"
        pageSubtitle="Welcome back 👋"
        notifCount={unreadCount}
        onNotifClick={() => setNotifOpen(true)}
        userRole="freelancer"
        userName="Praveen Gorla"
        onSignOut={handleSignOut}
      />

      {/* ---- Notification Panel (Praveen - Day 3) ---- */}
      <NotificationPanel
        isOpen={notifOpen}
        onClose={() => setNotifOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
        onMarkRead={handleMarkRead}
      />

      {/* ---- Page Content ---- */}
      <div style={{ flex: 1, padding: 'var(--space-8)', maxWidth: 900, margin: '0 auto', width: '100%' }}>
        <AppCard accentColor="cyan" title="Day 3 Progress" subtitle="Components wired ✅">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-6)',
          }}>
            {[
              { label: 'DashboardHeader',   status: '✅ Done', color: 'var(--color-success)' },
              { label: 'NotificationPanel', status: '✅ Done', color: 'var(--color-success)' },
              { label: 'Sign Out',          status: '✅ Wired', color: 'var(--color-success)' },
            ].map(item => (
              <div key={item.label} style={{
                background: 'var(--color-bg-input)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-4)',
              }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)', marginBottom: 4 }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '12px', color: item.color }}>{item.status}</div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
            Click the 🔔 bell in the header to see the NotificationPanel. Click your avatar → Sign Out to log out.
          </p>

          {/* Fallback Sign Out button in the card body as well */}
          <AppButton variant="ghost" size="sm" onClick={handleSignOut}>
            Sign Out
          </AppButton>
        </AppCard>
      </div>
    </div>
  );
}
