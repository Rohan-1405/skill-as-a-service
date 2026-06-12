// ============================================================
// SkillAsAService — Route Constants
// Author: Praveen Gorla
// ============================================================

export const ROUTES = {
  // Public
  HOME:             '/',
  LOGIN:            '/login',
  REGISTER:         '/register',
  FORGOT_PASSWORD:  '/forgot-password',
  VERIFY_EMAIL:     '/verify-email',

  // Freelancer
  FREELANCER_DASHBOARD:  '/freelancer/dashboard',
  FREELANCER_PROFILE:    '/freelancer/profile',
  FREELANCER_PLANS:      '/freelancer/plans',
  FREELANCER_PROJECTS:   '/freelancer/projects',
  FREELANCER_WALLET:     '/freelancer/wallet',
  FREELANCER_ANALYTICS:  '/freelancer/analytics',
  FREELANCER_MESSAGES:   '/freelancer/messages',

  // Client
  CLIENT_DASHBOARD:      '/client/dashboard',
  CLIENT_BROWSE:         '/client/browse',
  CLIENT_SUBSCRIPTIONS:  '/client/subscriptions',
  CLIENT_PROJECTS:       '/client/projects',
  CLIENT_WALLET:         '/client/wallet',
  CLIENT_MESSAGES:       '/client/messages',

  // Admin
  ADMIN_DASHBOARD:       '/admin/dashboard',
  ADMIN_USERS:           '/admin/users',
  ADMIN_KYC:             '/admin/kyc',
  ADMIN_PAYMENTS:        '/admin/payments',
  ADMIN_CMS:             '/admin/cms',
};

export default ROUTES;
