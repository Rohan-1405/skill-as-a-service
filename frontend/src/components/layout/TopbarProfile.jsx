import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

/**
 * TopbarProfile — Avatar + Name + Role shown at the top-right of every dashboard page.
 *
 * Shows:
 *   [Avatar initials]  User Name
 *                      Freelancer
 *
 * Clicking opens a small dropdown with: View Profile, Settings, Log out.
 *
 * Avatar: uses profile picture from user.avatar if present, otherwise initials.
 * Role label maps:  FREELANCER → "Freelancer"
 *                   CLIENT     → "Client"
 *                   ADMIN      → "Admin"
 *                   KYC_TEAM   → "KYC Team"
 *                   SUPPORT    → "Support"
 *
 * Owner: Lohith
 */

const ROLE_LABELS = {
  FREELANCER: 'Freelancer',
  CLIENT:     'Client',
  ADMIN:      'Admin',
  KYC_TEAM:   'KYC Team',
  SUPPORT:    'Support',
};

const getInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
};

const TopbarProfile = () => {
  const { user, logout }  = useAuthContext();
  const navigate          = useNavigate();
  const [open, setOpen]   = useState(false);
  const dropdownRef       = useRef(null);

  const userName  = user?.name  || user?.email?.split('@')[0] || 'User';
  const userRole  = user?.role  ? (ROLE_LABELS[user.role] || user.role) : 'Freelancer';
  const userAvatar= user?.avatar || null;
  const initials  = getInitials(userName);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <div className="topbar-profile" ref={dropdownRef}>
      {/* ── Trigger button ── */}
      <button
        className="topbar-profile-btn"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open profile menu"
        aria-expanded={open}
      >
        {/* Avatar */}
        <div className="topbar-profile-avatar">
          {userAvatar ? (
            <img src={userAvatar} alt={userName} className="topbar-profile-avatar-img" />
          ) : (
            <span className="topbar-profile-initials">{initials}</span>
          )}
        </div>

        {/* Name + Role */}
        <div className="topbar-profile-info">
          <span className="topbar-profile-name">{userName}</span>
          <span className="topbar-profile-role">{userRole}</span>
        </div>

        {/* Chevron */}
        <svg
          className={`topbar-profile-chevron${open ? ' open' : ''}`}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <div className="topbar-profile-dropdown" role="menu">
          {/* User summary at top of dropdown */}
          <div className="topbar-profile-dropdown-header">
            <div className="topbar-profile-avatar topbar-profile-avatar-lg">
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className="topbar-profile-avatar-img" />
              ) : (
                <span className="topbar-profile-initials">{initials}</span>
              )}
            </div>
            <div>
              <div className="topbar-profile-name" style={{ fontSize: 14 }}>{userName}</div>
              <div className="topbar-profile-role">{user?.email || userRole}</div>
            </div>
          </div>

          <div className="topbar-profile-dropdown-divider" />

          <button
            className="topbar-profile-dropdown-item"
            role="menuitem"
            onClick={() => { setOpen(false); navigate('/profile'); }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            View Profile
          </button>

          <button
            className="topbar-profile-dropdown-item"
            role="menuitem"
            onClick={() => { setOpen(false); navigate('/settings'); }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Settings
          </button>

          <div className="topbar-profile-dropdown-divider" />

          <button
            className="topbar-profile-dropdown-item topbar-profile-dropdown-item--danger"
            role="menuitem"
            onClick={handleLogout}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Log out
          </button>
        </div>
      )}
    </div>
  );
};

export default TopbarProfile;
