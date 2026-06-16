// ============================================================
// SkillAsAService — FreelancerProfile.jsx
// Author: Praveen Gorla  |  Day 4 (updated)
//
// Changes:
//   • Sign Out wired via useAuthContext().logout()
//   • Notification panel state added (bell badge + panel)
//   • Both passed to DashboardHeader via onSignOut + onNotifClick
// ============================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import DashboardHeader from '../../components/common/DashboardHeader';
import NotificationPanel, { SAMPLE_NOTIFS } from '../../components/common/NotificationPanel';
import PortfolioModule from '../../components/portfolio/PortfolioModule';

export default function FreelancerProfile() {
  const { logout } = useAuthContext();
  const navigate   = useNavigate();

  /* ---- Notification state ---- */
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

  /* ---- Sign Out ---- */
  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg)',
        fontFamily: 'var(--font-family)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ---- Header — notification + sign out wired ---- */}
      <DashboardHeader
        pageTitle="My Profile"
        pageSubtitle="Day 4 — Portfolio module"
        notifCount={unreadCount}
        onNotifClick={() => setNotifOpen(true)}
        userRole="freelancer"
        userName="Praveen Gorla"
        onSignOut={handleSignOut}
      />

      {/* ---- Notification Panel ---- */}
      <NotificationPanel
        isOpen={notifOpen}
        onClose={() => setNotifOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
        onMarkRead={handleMarkRead}
      />

      {/* ---- Page Content ---- */}
      <div style={{ flex: 1, padding: 'var(--space-8)', maxWidth: 1000, margin: '0 auto', width: '100%' }}>
        {/* Lohith's Basic Info / Skills tabs go above this section */}
        <PortfolioModule />
      </div>
    </div>
  );
}
