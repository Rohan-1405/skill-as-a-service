import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { FREELANCER_NAV, CLIENT_NAV } from '../constants/navItems';

/**
 * ComingSoon — placeholder page for sidebar links not yet built.
 *
 * Props:
 *   title   — e.g. "Wallet Dashboard"
 *   day     — build day number, e.g. 7
 *   portal  — "freelancer" (default) | "client"
 */
const ComingSoon = ({ title = 'This Page', day = null, portal = 'freelancer' }) => {
  const navigate   = useNavigate();
  const isClient   = portal === 'client';
  const navItems   = isClient ? CLIENT_NAV   : FREELANCER_NAV;
  const portalName = isClient ? 'Client Portal' : 'Freelancer Portal';
  const homeRoute  = isClient ? '/client/dashboard' : '/dashboard';

  return (
    <DashboardLayout
      navItems={navItems}
      portalName={portalName}
      pageSubtitle={title}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: 'var(--space-5)',
        textAlign: 'center',
      }}>
        {/* Icon */}
        <div style={{
          width: 72, height: 72,
          borderRadius: 'var(--radius-lg)',
          background: 'rgba(3, 90, 225, 0.08)',
          border: '1px solid rgba(3, 90, 225, 0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--brand-blue)',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>

        {/* Text */}
        <div>
          <h2 style={{
            fontSize: 'var(--font-size-2xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text)',
            margin: '0 0 var(--space-2)',
          }}>
            {title}
          </h2>
          <p style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
            margin: 0,
            maxWidth: 380,
          }}>
            {day
              ? `This feature is scheduled for Day ${day} of the build. Check back soon!`
              : 'This feature is coming soon. Check back in a few days!'}
          </p>
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate(homeRoute)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            background: 'var(--brand-blue)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            cursor: 'pointer',
            transition: 'opacity var(--transition-fast)',
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={(e) => e.currentTarget.style.opacity  = '1'}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Dashboard
        </button>
      </div>
    </DashboardLayout>
  );
};

export default ComingSoon;