import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import TopbarProfile from '../components/layout/TopbarProfile';
import { useAuthContext } from '../context/AuthContext';

const DashboardLayout = ({
  children,
  navItems = [],
  portalName = 'Dashboard',
  pageTitle,
  pageSubtitle = '',
}) => {
  const { user } = useAuthContext();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const firstName = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || null;
  const resolvedTitle = pageTitle || (firstName ? `${firstName}'s Dashboard` : 'Dashboard');

  return (
    <div className={`dashboard-shell${sidebarOpen ? '' : ' sidebar-hidden'}`}>

      <Sidebar
        navItems={navItems}
        portalName={portalName}
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="dashboard-main">

        <header className="dashboard-topbar" role="banner">
          <div className="dashboard-topbar-left">

            {/* Toggle button — inline with title, correct arrow direction */}
            <button
              className="topbar-sidebar-toggle"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
              title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {/*
                  When sidebar is OPEN  → show left arrow ← (points left = "close it")
                  When sidebar is CLOSED → show right arrow → (points right = "open it")
                  Chevron points left by default (9 18 → 15 12 → 9 6)
                  We rotate 180deg to flip it right when sidebar is closed
                */}
                <polyline
                  points="15 18 9 12 15 6"
                  style={{
                    transform: sidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)',
                    transformOrigin: '12px 12px',
                    transition: 'transform 0.25s ease',
                    display: 'block',
                  }}
                />
              </svg>
            </button>

            <div className="dashboard-topbar-title-group">
              <span className="dashboard-topbar-title">{resolvedTitle}</span>
              {pageSubtitle && (
                <span className="dashboard-topbar-breadcrumb">{pageSubtitle}</span>
              )}
            </div>
          </div>

          <div className="dashboard-topbar-right">
            <button className="topbar-icon-btn" aria-label="Notifications" title="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="topbar-badge-dot" aria-hidden="true" />
            </button>

            <TopbarProfile />
          </div>
        </header>

        <main className="dashboard-content" role="main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;