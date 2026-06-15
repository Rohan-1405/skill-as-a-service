import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import logo from '../../assets/logos/logo.png';

const Sidebar = ({ navItems = [], portalName = 'Dashboard', sidebarOpen = true, onClose }) => {
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay — only visible on small screens */}
      <div
        className={`sidebar-overlay${!sidebarOpen ? '' : ' visible'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`sidebar${sidebarOpen ? '' : ' sidebar-collapsed'}`}
        aria-label="Sidebar navigation"
      >
        {/* ── Logo only — no text, no user strip ── */}
        <NavLink to="/dashboard" className="sidebar-logo sidebar-logo-icon-only" aria-label="Go to dashboard">
          <img src={logo} alt="SkillAsAService" className="sidebar-logo-img" />
        </NavLink>

        {/* ── Navigation — onClick removed so sidebar stays open ── */}
        <nav className="sidebar-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <React.Fragment key={item.path}>
              {item.section && (
                <div className="sidebar-section-label" aria-hidden="true">
                  {item.section}
                </div>
              )}
              <NavLink
                to={item.path}
                className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
              >
                <span className="sidebar-item-icon" aria-hidden="true">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge != null && item.badge > 0 && (
                  <span className="sidebar-item-badge" aria-label={`${item.badge} unread`}>
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </NavLink>
            </React.Fragment>
          ))}
        </nav>

        {/* ── Logout ── */}
        <div className="sidebar-footer">
          <button className="sidebar-logout" onClick={handleLogout} aria-label="Log out">
            <span className="sidebar-item-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </span>
            Log out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;