// ============================================================
// SkillAsAService — NotificationPanel.jsx
// Author: Praveen Gorla  |  Day 3
//
// A slide-in panel that lists notifications.
// Wire it to DashboardHeader's onNotifClick.
//
// Props:
//   isOpen         — boolean
//   onClose        — fn
//   notifications  — array of notification objects (see SAMPLE_NOTIFS below)
//   onMarkAllRead  — fn  (optional)
//   onMarkRead     — fn(id) (optional)
// ============================================================

import React, { useEffect } from 'react';

/* ---- default sample data (swap with API data later) ---- */
export const SAMPLE_NOTIFS = [
  {
    id: 1,
    type: 'subscription',
    title: 'New Subscriber',
    message: 'Ravi Kumar subscribed to your Standard Plan.',
    time: '2 min ago',
    read: false,
  },
  {
    id: 2,
    type: 'payment',
    title: 'Payment Received',
    message: '₹999 credited to your wallet.',
    time: '15 min ago',
    read: false,
  },
  {
    id: 3,
    type: 'project',
    title: 'Project Update',
    message: 'Milestone "Design Phase" marked as complete.',
    time: '1 hr ago',
    read: false,
  },
  {
    id: 4,
    type: 'kyc',
    title: 'KYC Approved',
    message: 'Your KYC documents have been verified successfully.',
    time: '3 hr ago',
    read: true,
  },
  {
    id: 5,
    type: 'message',
    title: 'New Message',
    message: 'Priya Sharma sent you a message in Project Alpha.',
    time: 'Yesterday',
    read: true,
  },
  {
    id: 6,
    type: 'system',
    title: 'Subscription Renewal',
    message: 'Your Premium plan renews in 3 days.',
    time: 'Yesterday',
    read: true,
  },
];

/* ---- icon + color per type ---- */
const TYPE_CONFIG = {
  subscription: { emoji: '🔔', color: 'var(--brand-cyan)',  bg: 'rgba(50,220,253,0.12)' },
  payment:      { emoji: '💰', color: 'var(--brand-gold)',  bg: 'rgba(253,196,73,0.12)' },
  project:      { emoji: '📁', color: 'var(--color-primary)', bg: 'rgba(26,159,224,0.12)' },
  kyc:          { emoji: '✅', color: 'var(--color-success)', bg: 'rgba(100,255,218,0.10)' },
  message:      { emoji: '💬', color: 'var(--color-accent)', bg: 'rgba(245,166,35,0.10)' },
  system:       { emoji: '⚙️', color: 'var(--color-text-muted)', bg: 'var(--color-bg-hover)' },
};

/* ---- Close Icon ---- */
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function NotificationPanel({
  isOpen        = false,
  onClose,
  notifications = SAMPLE_NOTIFS,
  onMarkAllRead,
  onMarkRead,
}) {
  /* close on Escape */
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && isOpen) onClose?.(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  /* prevent body scroll when panel is open */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <style>{`
        /* ---- overlay ---- */
        .saas-notif-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          z-index: calc(var(--z-modal) - 1);
          opacity: 0;
          pointer-events: none;
          transition: opacity var(--transition-base);
          backdrop-filter: blur(2px);
        }
        .saas-notif-overlay.open {
          opacity: 1;
          pointer-events: all;
        }

        /* ---- panel ---- */
        .saas-notif-panel {
          position: fixed;
          top: 0;
          right: 0;
          height: 100vh;
          width: 380px;
          max-width: 100vw;
          background: var(--color-bg-card);
          border-left: 1px solid var(--color-border);
          box-shadow: -24px 0 64px rgba(0,0,0,0.5);
          z-index: var(--z-modal);
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform var(--transition-base);
          font-family: var(--font-family);
        }
        .saas-notif-panel.open {
          transform: translateX(0);
        }

        /* ---- panel header ---- */
        .saas-notif-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-5) var(--space-6);
          border-bottom: 1px solid var(--color-border);
          flex-shrink: 0;
        }
        .saas-notif-header-left {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }
        .saas-notif-title {
          font-size: var(--font-size-base);
          font-weight: var(--font-weight-bold);
          color: var(--color-text);
        }
        .saas-notif-count-badge {
          background: var(--color-danger);
          color: #fff;
          font-size: 11px;
          font-weight: var(--font-weight-bold);
          padding: 1px 7px;
          border-radius: var(--radius-full);
          line-height: 1.6;
        }
        .saas-notif-close {
          background: none;
          border: none;
          color: var(--color-text-muted);
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background var(--transition-fast), color var(--transition-fast);
        }
        .saas-notif-close:hover {
          background: var(--color-bg-hover);
          color: var(--color-text);
        }

        /* ---- mark all read ---- */
        .saas-notif-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-3) var(--space-6);
          border-bottom: 1px solid var(--color-border);
          flex-shrink: 0;
        }
        .saas-notif-toolbar-label {
          font-size: var(--font-size-xs);
          color: var(--color-text-muted);
        }
        .saas-notif-mark-all {
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-semibold);
          color: var(--color-primary);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          font-family: var(--font-family);
          transition: opacity var(--transition-fast);
        }
        .saas-notif-mark-all:hover { opacity: 0.75; }

        /* ---- list ---- */
        .saas-notif-list {
          flex: 1;
          overflow-y: auto;
          padding: var(--space-3) 0;
        }
        .saas-notif-list::-webkit-scrollbar { width: 4px; }
        .saas-notif-list::-webkit-scrollbar-track { background: transparent; }
        .saas-notif-list::-webkit-scrollbar-thumb {
          background: var(--color-border-strong);
          border-radius: var(--radius-full);
        }

        /* ---- single item ---- */
        .saas-notif-item {
          display: flex;
          align-items: flex-start;
          gap: var(--space-3);
          padding: var(--space-4) var(--space-6);
          cursor: pointer;
          transition: background var(--transition-fast);
          position: relative;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
        }
        .saas-notif-item:hover {
          background: var(--color-bg-hover);
        }
        .saas-notif-item.unread {
          background: rgba(26,159,224,0.04);
        }
        .saas-notif-item.unread:hover {
          background: rgba(26,159,224,0.08);
        }
        /* unread left accent */
        .saas-notif-item.unread::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 60%;
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
          background: var(--color-primary);
        }

        .saas-notif-icon {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .saas-notif-body { flex: 1; min-width: 0; }
        .saas-notif-item-title {
          font-size: 13px;
          font-weight: var(--font-weight-semibold);
          color: var(--color-text);
          margin-bottom: 2px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .saas-notif-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--color-primary);
          flex-shrink: 0;
        }
        .saas-notif-message {
          font-size: 12px;
          color: var(--color-text-secondary);
          line-height: 1.5;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }
        .saas-notif-time {
          font-size: 11px;
          color: var(--color-text-muted);
          margin-top: 4px;
          display: block;
        }

        /* ---- separator between read / unread ---- */
        .saas-notif-section-label {
          padding: var(--space-2) var(--space-6) var(--space-1);
          font-size: 10px;
          font-weight: var(--font-weight-semibold);
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        /* ---- empty state ---- */
        .saas-notif-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: var(--space-3);
          padding: var(--space-8);
          text-align: center;
        }
        .saas-notif-empty-icon {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-full);
          background: var(--color-bg-input);
          border: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
        }
        .saas-notif-empty-title {
          font-size: 14px;
          font-weight: var(--font-weight-semibold);
          color: var(--color-text);
        }
        .saas-notif-empty-sub {
          font-size: 12px;
          color: var(--color-text-muted);
        }

        /* ---- footer ---- */
        .saas-notif-footer {
          padding: var(--space-4) var(--space-6);
          border-top: 1px solid var(--color-border);
          flex-shrink: 0;
        }
        .saas-notif-view-all {
          display: block;
          width: 100%;
          padding: var(--space-3);
          background: var(--color-bg-input);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-md);
          color: var(--color-text-secondary);
          font-size: 13px;
          font-weight: var(--font-weight-semibold);
          font-family: var(--font-family);
          cursor: pointer;
          text-align: center;
          transition: border-color var(--transition-fast), color var(--transition-fast),
                      background var(--transition-fast);
        }
        .saas-notif-view-all:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
          background: rgba(26,159,224,0.06);
        }
      `}</style>

      {/* backdrop */}
      <div
        className={`saas-notif-overlay${isOpen ? ' open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* panel */}
      <aside
        className={`saas-notif-panel${isOpen ? ' open' : ''}`}
        role="dialog"
        aria-label="Notifications"
        aria-modal="true"
      >
        {/* header */}
        <div className="saas-notif-header">
          <div className="saas-notif-header-left">
            <span className="saas-notif-title">Notifications</span>
            {unreadCount > 0 && (
              <span className="saas-notif-count-badge">{unreadCount} new</span>
            )}
          </div>
          <button className="saas-notif-close" onClick={onClose} aria-label="Close notifications">
            <CloseIcon />
          </button>
        </div>

        {/* toolbar */}
        <div className="saas-notif-toolbar">
          <span className="saas-notif-toolbar-label">
            {notifications.length} notifications
          </span>
          {unreadCount > 0 && (
            <button className="saas-notif-mark-all" onClick={onMarkAllRead}>
              Mark all as read
            </button>
          )}
        </div>

        {/* list */}
        <div className="saas-notif-list">
          {notifications.length === 0 ? (
            <div className="saas-notif-empty">
              <div className="saas-notif-empty-icon">🔔</div>
              <div className="saas-notif-empty-title">All caught up!</div>
              <div className="saas-notif-empty-sub">No new notifications right now.</div>
            </div>
          ) : (
            <>
              {/* Unread section */}
              {notifications.some(n => !n.read) && (
                <div className="saas-notif-section-label">New</div>
              )}
              {notifications.filter(n => !n.read).map(notif => (
                <NotifItem key={notif.id} notif={notif} onMarkRead={onMarkRead} />
              ))}

              {/* Read section */}
              {notifications.some(n => n.read) && (
                <div className="saas-notif-section-label" style={{ marginTop: 8 }}>Earlier</div>
              )}
              {notifications.filter(n => n.read).map(notif => (
                <NotifItem key={notif.id} notif={notif} onMarkRead={onMarkRead} />
              ))}
            </>
          )}
        </div>

        {/* footer */}
        <div className="saas-notif-footer">
          <button className="saas-notif-view-all">View all notifications</button>
        </div>
      </aside>
    </>
  );
}

/* ---- sub-component ---- */
function NotifItem({ notif, onMarkRead }) {
  const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.system;

  return (
    <button
      className={`saas-notif-item${!notif.read ? ' unread' : ''}`}
      onClick={() => onMarkRead?.(notif.id)}
    >
      <div
        className="saas-notif-icon"
        style={{ background: cfg.bg }}
      >
        {cfg.emoji}
      </div>
      <div className="saas-notif-body">
        <div className="saas-notif-item-title">
          {notif.title}
          {!notif.read && <span className="saas-notif-dot" />}
        </div>
        <div className="saas-notif-message">{notif.message}</div>
        <span className="saas-notif-time">{notif.time}</span>
      </div>
    </button>
  );
}
