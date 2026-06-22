import React, { useState, useEffect } from 'react';
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

  // Mobile (≤480px): closed by default. Tablet + PC: open by default.
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 480);

  // Handle resize — if user rotates phone to landscape, recheck
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 480) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // isMobile: sidebar should auto-close after nav click only on mobile (≤768px)
  const isMobile = () => window.innerWidth <= 768;

  const firstName = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || null;
  const resolvedTitle = pageTitle || (firstName ? `${firstName}'s Dashboard` : 'Dashboard');

  return (
    <div className={`dashboard-shell${sidebarOpen ? ' sidebar-open' : ' sidebar-hidden'}`}>

      {/* Overlay — only visible on mobile when sidebar is open */}
      <div
        className={`sidebar-overlay${sidebarOpen ? ' visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <Sidebar
        navItems={navItems}
        portalName={portalName}
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavClick={() => { if (isMobile()) setSidebarOpen(false); }}
      />

      {/* Main */}
      <div className="dashboard-main">

        {/* Topbar */}
        <header className="dashboard-topbar" role="banner">
          <div className="dashboard-topbar-left">

            {/* Toggle button — hamburger on ALL devices */}
            <button
              className="topbar-sidebar-toggle"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              <svg
                width="20" height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="3" y1="6"  x2="21" y2="6"  />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            {/* Title */}
            <div className="dashboard-topbar-title-group">
              <span className="dashboard-topbar-title">{resolvedTitle}</span>
              {pageSubtitle && (
                <span className="dashboard-topbar-breadcrumb">{pageSubtitle}</span>
              )}
            </div>
          </div>

          {/* Right: bell + profile */}
          <div className="dashboard-topbar-right">
            <button className="topbar-icon-btn" aria-label="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="topbar-badge-dot" aria-hidden="true" />
            </button>
            <TopbarProfile />
          </div>
        </header>

        {/* Content */}
        <main className="dashboard-content" role="main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;