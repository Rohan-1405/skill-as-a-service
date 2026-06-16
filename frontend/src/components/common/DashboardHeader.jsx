// ============================================================
// SkillAsAService — DashboardHeader.jsx
// Author: Praveen Gorla  |  Day 3
//
// Props:
//   pageTitle   — string  — current page name e.g. "Dashboard"
//   pageSubtitle — string — optional sub-label e.g. "Welcome back, Praveen"
//   onMenuToggle — fn    — called when hamburger is tapped (mobile)
//   notifCount   — number — badge count on the bell icon
//   onNotifClick — fn    — opens the NotificationPanel
//   userRole     — "freelancer" | "client" | "admin"
//   userName     — string
//   userAvatar   — string (image URL, optional)
// ============================================================

import React, { useState } from 'react';

/* ---- Search Icon ---- */
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);

/* ---- Bell Icon ---- */
const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

/* ---- Hamburger Icon ---- */
const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

/* ---- Chevron Down ---- */
const ChevronIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/* ---- Role badge colors ---- */
const ROLE_CONFIG = {
  freelancer: { label: 'Freelancer', bg: 'rgba(50,220,253,0.12)', color: 'var(--brand-cyan)' },
  client:     { label: 'Client',     bg: 'rgba(26,159,224,0.12)', color: 'var(--color-primary)' },
  admin:      { label: 'Admin',      bg: 'rgba(253,196,73,0.12)', color: 'var(--brand-gold)' },
};

export default function DashboardHeader({
  pageTitle    = 'Dashboard',
  pageSubtitle = '',
  onMenuToggle,
  notifCount   = 0,
  onNotifClick,
  userRole     = 'freelancer',
  userName     = 'User',
  userAvatar   = '',
  onSignOut,           // ← NEW: called when user clicks "Sign Out" in dropdown
}) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);

  const role = ROLE_CONFIG[userRole] || ROLE_CONFIG.freelancer;

  /* initials fallback */
  const initials = userName
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <>
      <style>{`
        .saas-header {
          position: sticky;
          top: 0;
          z-index: var(--z-header);
          height: var(--header-height);
          background: var(--color-bg-secondary);
          border-bottom: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          padding: 0 var(--space-6);
          gap: var(--space-4);
          font-family: var(--font-family);
          backdrop-filter: blur(8px);
        }

        /* ---- hamburger (mobile only) ---- */
        .saas-header__menu-btn {
          display: none;
          background: none;
          border: none;
          color: var(--color-text-secondary);
          padding: var(--space-2);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: background var(--transition-fast), color var(--transition-fast);
          flex-shrink: 0;
        }
        .saas-header__menu-btn:hover {
          background: var(--color-bg-hover);
          color: var(--color-text);
        }
        @media (max-width: 768px) {
          .saas-header__menu-btn { display: flex; align-items: center; }
        }

        /* ---- page title ---- */
        .saas-header__title-wrap {
          flex: 0 0 auto;
          min-width: 0;
        }
        .saas-header__page-title {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-bold);
          color: var(--color-text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.2;
        }
       .saas-header__page-subtitle {
  font-size: var(--font-size-xs);
  color: #5ecfff;
  margin-top: 1px;
  white-space: nowrap;
  text-shadow:
    0 0 8px rgba(26,159,224,0.5),
    0 0 16px rgba(26,159,224,0.3);
}

        /* ---- spacer ---- */
        .saas-header__spacer { flex: 1; }

        /* ---- search ---- */
        .saas-header__search {
          position: relative;
          flex: 0 1 280px;
        }
        .saas-header__search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #00d9ff;
          pointer-events: none;
          display: flex;
          transition: color var(--transition-fast);
        }
        .saas-header__search.focused .saas-header__search-icon {
          color: var(--color-primary);
        }
 .saas-header__search-input {
  width: 100%;
  background: rgba(0, 207, 255, 0.22);
  border: 2px solid #00d9ff;
  border-radius: 999px;
   color: rgba(255,255,255,0.75);
  padding: 8px 16px 8px 38px;
  outline: none;

  box-shadow:
    inset 0 0 10px rgba(0, 217, 255, 0.25),
    0 0 12px rgba(0, 217, 255, 0.4);

  transition: all 0.3s ease;
}

.saas-header__search-input:hover {
  background: rgba(0, 207, 255, 0.30);

  box-shadow:
    inset 0 0 15px rgba(0, 217, 255, 0.4),
    0 0 18px rgba(0, 217, 255, 0.6);
}
        @media (max-width: 640px) {
          .saas-header__search { display: none; }
        }

        /* ---- icon buttons ---- */
        .saas-header__icon-btn {
  position: relative;
  background: rgba(0, 207, 255, 0.08);
  border: 1px solid rgba(0, 207, 255, 0.15);
  color: #00d9ff;
  width: 40px;
  height: 40px;
  border-radius: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: all 0.3s ease;
}

.saas-header__icon-btn:hover {
  background: rgba(0, 207, 255, 0.18);

  box-shadow:
    0 0 10px rgba(0, 217, 255, 0.5),
    0 0 20px rgba(0, 217, 255, 0.3);

  color: #ffffff;
}
        .saas-header__icon-btn.active {
          color: var(--color-primary);
          background: rgba(26,159,224,0.1);
        }

        /* notification badge */
        .saas-header__badge {
          position: absolute;
          top: 6px;
          right: 6px;
          min-width: 16px;
          height: 16px;
          border-radius: var(--radius-full);
          background: var(--color-danger);
          color: #fff;
          font-size: 9px;
          font-weight: var(--font-weight-bold);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 3px;
          line-height: 1;
          border: 2px solid var(--color-bg-secondary);
          animation: saas-badge-pulse 2s ease-in-out infinite;
        }
        @keyframes saas-badge-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }

        /* ---- divider ---- */
        .saas-header__divider {
          width: 1px;
          height: 28px;
          background: var(--color-border);
          flex-shrink: 0;
        }

        /* ---- avatar button ---- */
        .saas-header__avatar-btn {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          background: none;
          border: none;
          cursor: pointer;
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-md);
          transition: background var(--transition-fast);
          position: relative;
          flex-shrink: 0;
        }
        .saas-header__avatar-btn:hover { background: var(--color-bg-hover); }
        .saas-header__avatar-img {
          width: 34px;
          height: 34px;
          border-radius: var(--radius-full);
          object-fit: cover;
          border: 2px solid var(--color-border-strong);
        }
        .saas-header__avatar-initials {
          width: 34px;
          height: 34px;
          border-radius: var(--radius-full);
          background: var(--gradient-blue);
          color: #fff;
          font-size: 12px;
          font-weight: var(--font-weight-bold);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--color-border-strong);
          flex-shrink: 0;
          font-family: var(--font-family);
        }
        .saas-header__avatar-info {
          text-align: left;
          line-height: 1.2;
        }
        .saas-header__avatar-name {
          font-size: 13px;
          font-weight: var(--font-weight-semibold);
          color: var(--color-text);
          white-space: nowrap;
        }
        .saas-header__avatar-role {
          display: inline-flex;
          align-items: center;
          font-size: 10px;
          font-weight: var(--font-weight-semibold);
          padding: 1px 6px;
          border-radius: var(--radius-full);
          margin-top: 2px;
        }
        .saas-header__chevron {
          color: var(--color-text-muted);
          transition: transform var(--transition-fast);
          display: flex;
        }
        .saas-header__chevron.open { transform: rotate(180deg); }
        @media (max-width: 480px) {
          .saas-header__avatar-info { display: none; }
          .saas-header__chevron { display: none; }
        }

        /* ---- avatar dropdown ---- */
        .saas-header__dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 200px;
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-card);
          z-index: var(--z-dropdown);
          overflow: hidden;
          animation: saas-dropdown-in 150ms ease;
        }
        @keyframes saas-dropdown-in {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .saas-header__dropdown-header {
          padding: 12px 14px;
          border-bottom: 1px solid var(--color-border);
        }
        .saas-header__dropdown-name {
          font-size: 13px;
          font-weight: var(--font-weight-semibold);
          color: var(--color-text);
        }
        .saas-header__dropdown-email {
          font-size: 11px;
          color: var(--color-text-muted);
          margin-top: 1px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .saas-header__dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          font-size: 13px;
          font-weight: var(--font-weight-medium);
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: background var(--transition-fast), color var(--transition-fast);
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-family: var(--font-family);
        }
        .saas-header__dropdown-item:hover {
          background: var(--color-bg-hover);
          color: var(--color-text);
        }
        .saas-header__dropdown-item.danger { color: var(--color-danger); }
        .saas-header__dropdown-item.danger:hover { background: var(--color-danger-light); }
        .saas-header__dropdown-divider {
          height: 1px;
          background: var(--color-border);
          margin: 4px 0;
        }
      `}</style>

      <header className="saas-header">
        {/* mobile hamburger */}
        <button className="saas-header__menu-btn" onClick={onMenuToggle} aria-label="Toggle menu">
          <MenuIcon />
        </button>

        {/* page title */}
        <div className="saas-header__title-wrap">
          <div className="saas-header__page-title">{pageTitle}</div>
          {pageSubtitle && (
            <div className="saas-header__page-subtitle">{pageSubtitle}</div>
          )}
        </div>

        {/* push right */}
        <div className="saas-header__spacer" />

        {/* search */}
        <div className={`saas-header__search${searchFocused ? ' focused' : ''}`}>
          <span className="saas-header__search-icon"><SearchIcon /></span>
          <input
            className="saas-header__search-input"
            type="text"
            placeholder="Search..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>

        {/* notification bell */}
        <button
          className={`saas-header__icon-btn${notifCount > 0 ? ' active' : ''}`}
          onClick={onNotifClick}
          aria-label="Notifications"
        >
          <BellIcon />
          {notifCount > 0 && (
            <span className="saas-header__badge">
              {notifCount > 99 ? '99+' : notifCount}
            </span>
          )}
        </button>

        <div className="saas-header__divider" />

        {/* avatar + dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            className="saas-header__avatar-btn"
            onClick={() => setAvatarMenuOpen(v => !v)}
            aria-label="Account menu"
          >
            {userAvatar ? (
              <img src={userAvatar} alt={userName} className="saas-header__avatar-img" />
            ) : (
              <div className="saas-header__avatar-initials">{initials}</div>
            )}
            <div className="saas-header__avatar-info">
              <div className="saas-header__avatar-name">{userName}</div>
              <div
                className="saas-header__avatar-role"
                style={{ background: role.bg, color: role.color }}
              >
                {role.label}
              </div>
            </div>
            <span className={`saas-header__chevron${avatarMenuOpen ? ' open' : ''}`}>
              <ChevronIcon />
            </span>
          </button>

          {avatarMenuOpen && (
            <>
              {/* backdrop */}
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 'calc(var(--z-dropdown) - 1)' }}
                onClick={() => setAvatarMenuOpen(false)}
              />
              <div className="saas-header__dropdown">
                <div className="saas-header__dropdown-header">
                  <div className="saas-header__dropdown-name">{userName}</div>
                  <div className="saas-header__dropdown-email">example@skillasaservice.com</div>
                </div>
                {[
                  { icon: '👤', label: 'My Profile' },
                  { icon: '⚙️', label: 'Settings' },
                  { icon: '💰', label: 'Wallet' },
                ].map(item => (
                  <button key={item.label} className="saas-header__dropdown-item">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
                <div className="saas-header__dropdown-divider" />
                <button
                  className="saas-header__dropdown-item danger"
                  onClick={() => {
                    setAvatarMenuOpen(false);
                    if (onSignOut) onSignOut();
                  }}
                >
                  <span>🚪</span>
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </header>
    </>
  );
}
