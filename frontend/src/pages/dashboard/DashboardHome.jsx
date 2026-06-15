import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import AppCard from '../../components/common/AppCard';
import { useAuthContext } from '../../context/AuthContext';
import { FREELANCER_NAV } from '../../constants/navItems';

/**
 * DashboardHome v2 — changes:
 *  1. "Get Started" card auto-hides once dismissed (stored in localStorage)
 *     so it doesn't show every time after the user has seen it
 *  2. Quick action items use useNavigate (not <a href>) — no more login redirect
 *  3. pageTitle removed — DashboardLayout auto-generates "[Name]'s Dashboard"
 *  4. pageSubtitle uses first name from AuthContext
 */

const STATS = [
  {
    id: 'earnings',
    label: 'Total Earnings',
    value: '₹0',
    accentColor: 'var(--brand-gold)',
    iconBg: 'rgba(253, 196, 73, 0.12)',
    iconColor: 'var(--brand-gold)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    id: 'subscribers',
    label: 'Active Subscribers',
    value: '0',
    accentColor: 'var(--brand-cyan)',
    iconBg: 'rgba(50, 220, 253, 0.12)',
    iconColor: 'var(--brand-cyan)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: 'projects',
    label: 'Open Projects',
    value: '0',
    accentColor: 'var(--brand-blue)',
    iconBg: 'rgba(3, 90, 225, 0.12)',
    iconColor: 'var(--brand-blue)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: 'messages',
    label: 'Unread Messages',
    value: '0',
    accentColor: 'var(--color-primary)',
    iconBg: 'rgba(26, 159, 224, 0.12)',
    iconColor: 'var(--color-primary)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

// Storage key for dismissed state
const GET_STARTED_KEY = 'saas_get_started_dismissed';

// ── Quick action item — uses navigate, never <a href> ────────────────────────
const QuickActionItem = ({ action }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(action.path)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-4)',
        padding: 'var(--space-4)',
        background: 'var(--color-bg-secondary)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        textDecoration: 'none',
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left',
        transition: 'border-color var(--transition-fast), background var(--transition-fast)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = action.color;
        e.currentTarget.style.background  = 'var(--color-bg-hover)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border)';
        e.currentTarget.style.background  = 'var(--color-bg-secondary)';
      }}
    >
      <div style={{
        width: 40, height: 40,
        borderRadius: 'var(--radius-sm)',
        background: `${action.color}1A`,
        color: action.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {action.icon}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text)', marginBottom: 2 }}>
          {action.label}
        </div>
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
          {action.description}
        </div>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  );
};

const QUICK_ACTIONS = [
  {
    label: 'Create Subscription Plan',
    description: 'Set up Basic, Standard, or Premium plans for your clients',
    path: '/subscriptions',
    color: 'var(--brand-blue)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
  },
  {
    label: 'Complete Your Profile',
    description: 'Add your skills, portfolio, and experience to attract clients',
    path: '/profile',
    color: 'var(--brand-cyan)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    label: 'Set Up Your Wallet',
    description: 'Add a payout method to receive your earnings',
    path: '/wallet',
    color: 'var(--brand-gold)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
];

// ── Main component ─────────────────────────────────────────────────────────────
const DashboardHome = () => {
  const { user } = useAuthContext();
  const firstName = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'there';
  const greeting  = getGreeting();
  const navigate  = useNavigate();

  // "Get Started" dismissal — persists in localStorage
  // Once dismissed it won't show again (even after page refresh)
  const [showGetStarted, setShowGetStarted] = useState(
    () => localStorage.getItem(GET_STARTED_KEY) !== 'true'
  );

  const dismissGetStarted = () => {
    localStorage.setItem(GET_STARTED_KEY, 'true');
    setShowGetStarted(false);
  };

  return (
    <DashboardLayout
      navItems={FREELANCER_NAV}
      portalName="Freelancer Portal"
      pageSubtitle={`${greeting}, ${firstName} 👋`}
    >
      {/* ── Page Header ── */}
      <div className="page-header">
        <h1>Dashboard Overview</h1>
        <p>Here's what's happening with your freelance business today.</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="stat-grid">
        {STATS.map((stat) => (
          <div key={stat.id} className="stat-card" style={{ '--stat-accent': stat.accentColor }}>
            <div className="stat-icon" style={{ background: stat.iconBg, color: stat.iconColor }}>
              {stat.icon}
            </div>
            <div className="stat-body">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Get Started — dismissible, only shows until user clicks "Got it" ── */}
      {showGetStarted && (
        <AppCard
          title="Get started"
          subtitle="Complete these steps to start earning"
          accentColor="blue"
          action={
            <button
              onClick={dismissGetStarted}
              style={{
                fontSize: 12,
                color: 'var(--color-text-muted)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '2px 8px',
                borderRadius: 4,
                transition: 'color var(--transition-fast)',
              }}
              title="Dismiss — won't show again"
            >
              Dismiss
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {QUICK_ACTIONS.map((action) => (
              <QuickActionItem key={action.label} action={action} />
            ))}
          </div>
        </AppCard>
      )}

      {/* ── Recent Activity ── */}
      <div style={{ marginTop: 'var(--space-5)' }}>
        <AppCard title="Recent activity" subtitle="Your latest transactions and project updates">
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: 'var(--space-10) 0', gap: 'var(--space-3)',
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 'var(--radius-md)',
              background: 'var(--color-bg-input)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-text-muted)',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-secondary)', margin: '0 0 4px' }}>
                No activity yet
              </p>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
                Your transactions and project updates will appear here once you start working.
              </p>
            </div>
          </div>
        </AppCard>
      </div>
    </DashboardLayout>
  );
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default DashboardHome;
