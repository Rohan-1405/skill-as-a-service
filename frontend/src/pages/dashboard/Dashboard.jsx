import React from 'react';
import AppCard from '../../components/common/AppCard';

/**
 * Dashboard — Stub page for Milestone 1.
 * Full dashboard layout (sidebar + header) will be built on Day 3.
 */
const Dashboard = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-family)',
        padding: 'var(--space-4)',
      }}
    >
      <AppCard accentColor="blue" style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
        <div style={{ padding: 'var(--space-4) 0' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-4)',
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
          </div>
          <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text)', margin: '0 0 var(--space-2)' }}>
            Dashboard
          </h2>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
            Welcome to SkillAsAService! Full dashboard with sidebar and analytics will be available on Day 3.
          </p>
        </div>
      </AppCard>
    </div>
  );
};

export default Dashboard;
