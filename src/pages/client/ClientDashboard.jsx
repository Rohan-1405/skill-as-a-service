// ============================================================
// SkillAsAService — ClientDashboard.jsx
// Author: Praveen Gorla
// Stub page — full build Day 3
// Updated: uses design-system tokens (AppCard component)
// ============================================================

import React from 'react';
import AppCard from '../../components/common/AppCard';
import AppButton from '../../components/common/AppButton';
import { useAuthContext } from '../../context/AuthContext';

export default function ClientDashboard() {
  const { logout } = useAuthContext();

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--color-bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-family)', padding: 'var(--space-4)',
    }}>
      <AppCard accentColor="gold" style={{ maxWidth: 520, width: '100%', textAlign: 'center' }}>
        <div style={{ padding: 'var(--space-4) 0' }}>
          <div style={{
            width: 56, height: 56, borderRadius: 'var(--radius-full)',
            background: 'rgba(253,196,73,0.10)',
            border: '1px solid rgba(253,196,73,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto var(--space-4)',
            fontSize: '1.8rem',
          }}>🏢</div>
          <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text)', margin: '0 0 var(--space-2)' }}>
            Client Dashboard
          </h2>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', margin: '0 0 var(--space-6)' }}>
            Browse freelancers, manage subscriptions, and track projects — available on Day 3.
          </p>
          <AppButton variant="ghost" size="sm" onClick={logout}>
            Sign Out
          </AppButton>
        </div>
      </AppCard>
    </div>
  );
}
