/**
 * navItems.js — Navigation configuration for all portals.
 *
 * Each item shape:
 *   {
 *     label:   string   — Display text
 *     path:    string   — React Router path
 *     icon:    JSX      — SVG icon element
 *     section: string?  — If set, renders a section label ABOVE this item
 *     badge:   number?  — If set and > 0, renders a badge pill on the right
 *   }
 *
 * Usage:
 *   import { FREELANCER_NAV } from '../constants/navItems';
 *   <DashboardLayout navItems={FREELANCER_NAV} portalName="Freelancer Portal">
 *
 * Owner: Lohith — update paths and labels here, not inside Sidebar.jsx.
 */

// ── Icon helpers (inline SVGs — no external dependency) ──────────────────────

const Icon = ({ d, d2, viewBox = '0 0 24 24', children }) => (
  <svg
    width="18"
    height="18"
    viewBox={viewBox}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {d  && <path d={d} />}
    {d2 && <path d={d2} />}
    {children}
  </svg>
);

// Individual icon definitions
const Icons = {
  dashboard: (
    <Icon>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </Icon>
  ),
  profile: (
    <Icon>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </Icon>
  ),
  subscriptions: (
    <Icon>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </Icon>
  ),
  subscribers: (
    <Icon>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Icon>
  ),
  projects: (
    <Icon>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </Icon>
  ),
  messages: (
    <Icon>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </Icon>
  ),
  wallet: (
    <Icon>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M16 12h2" />
      <path d="M2 10h20" />
    </Icon>
  ),
  withdrawals: (
    <Icon>
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </Icon>
  ),
  analytics: (
    <Icon>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6"  y1="20" x2="6"  y2="14" />
    </Icon>
  ),
  settings: (
    <Icon>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </Icon>
  ),
  notifications: (
    <Icon>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </Icon>
  ),
  browse: (
    <Icon>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </Icon>
  ),
  users: (
    <Icon>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Icon>
  ),
  kyc: (
    <Icon>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </Icon>
  ),
  payments: (
    <Icon>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </Icon>
  ),
  cms: (
    <Icon>
      <polyline points="4 7 4 4 20 4 20 7" />
      <line x1="9" y1="20" x2="15" y2="20" />
      <line x1="12" y1="4" x2="12" y2="20" />
    </Icon>
  ),
};

// ── FREELANCER PORTAL NAV ────────────────────────────────────────────────────

export const FREELANCER_NAV = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: Icons.dashboard,
    section: 'Main Menu',
  },
  {
    label: 'My Profile',
    path: '/profile',
    icon: Icons.profile,
  },
  {
    label: 'Subscription Plans',
    path: '/subscriptions',
    icon: Icons.subscriptions,
  },
  {
    label: 'Subscribers',
    path: '/subscribers',
    icon: Icons.subscribers,
  },
  {
    label: 'Projects',
    path: '/projects',
    icon: Icons.projects,
  },
  {
    label: 'Messages',
    path: '/chat',
    icon: Icons.messages,
    badge: 0,   // Replace with real unread count from API
    section: 'Work',
  },
  {
    label: 'Wallet',
    path: '/wallet',
    icon: Icons.wallet,
  },
  {
    label: 'Withdrawals',
    path: '/withdrawals',
    icon: Icons.withdrawals,
  },
  {
    label: 'Analytics',
    path: '/analytics',
    icon: Icons.analytics,
  },
  {
    label: 'Notifications',
    path: '/notifications',
    icon: Icons.notifications,
    section: 'Account',
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: Icons.settings,
  },
];

// ── CLIENT PORTAL NAV ────────────────────────────────────────────────────────

export const CLIENT_NAV = [
  {
    label: 'Dashboard',
    path: '/client/dashboard',
    icon: Icons.dashboard,
    section: 'Main Menu',
  },
  {
    label: 'Browse Freelancers',
    path: '/client/browse',
    icon: Icons.browse,
  },
  {
    label: 'My Subscriptions',
    path: '/client/subscriptions',
    icon: Icons.subscriptions,
  },
  {
    label: 'Projects',
    path: '/client/projects',
    icon: Icons.projects,
  },
  {
    label: 'Messages',
    path: '/client/chat',
    icon: Icons.messages,
    badge: 0,
    section: 'Work',
  },
  {
    label: 'Wallet',
    path: '/client/wallet',
    icon: Icons.wallet,
  },
  {
    label: 'Notifications',
    path: '/client/notifications',
    icon: Icons.notifications,
    section: 'Account',
  },
  {
    label: 'Settings',
    path: '/client/settings',
    icon: Icons.settings,
  },
];

// ── ADMIN PORTAL NAV ─────────────────────────────────────────────────────────

export const ADMIN_NAV = [
  {
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: Icons.dashboard,
    section: 'Overview',
  },
  {
    label: 'Users',
    path: '/admin/users',
    icon: Icons.users,
    section: 'Management',
  },
  {
    label: 'Subscriptions',
    path: '/admin/subscriptions',
    icon: Icons.subscriptions,
  },
  {
    label: 'Payments',
    path: '/admin/payments',
    icon: Icons.payments,
  },
  {
    label: 'Wallet',
    path: '/admin/wallet',
    icon: Icons.wallet,
  },
  {
    label: 'KYC Requests',
    path: '/admin/kyc',
    icon: Icons.kyc,
    badge: 0,
  },
  {
    label: 'CMS',
    path: '/admin/cms',
    icon: Icons.cms,
    section: 'Content',
  },
  {
    label: 'Analytics',
    path: '/admin/analytics',
    icon: Icons.analytics,
    section: 'Reports',
  },
  {
    label: 'Settings',
    path: '/admin/settings',
    icon: Icons.settings,
    section: 'System',
  },
];
