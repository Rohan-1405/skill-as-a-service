import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

// ── Auth pages (eager) ────────────────────────────────────────
import Login             from '../pages/auth/Login';
import ForgotPassword    from '../pages/auth/ForgotPassword';
import EmailVerification from '../pages/auth/EmailVerification';
import Dashboard         from '../pages/dashboard/Dashboard';
import PlanCreationForms from '../pages/freelancer/PlanCreationForms';

// ── Lazy-loaded pages ─────────────────────────────────────────
const Register             = lazy(() => import('../pages/auth/Register'));
const FreelancerDashboard  = lazy(() => import('../pages/freelancer/FreelancerDashboard'));
const FreelancerProfile    = lazy(() => import('../pages/freelancer/FreelancerProfile'));

// ── Praveen Day 9 & 10 ────────────────────────────────────────
const TaskManagement = lazy(() => import('../pages/freelancer/TaskManagement'));
const GroupChat      = lazy(() => import('../pages/freelancer/GroupChat'));

// ── Client pages ──────────────────────────────────────────────
const ClientDashboard      = lazy(() => import('../pages/client/ClientDashboard'));
const ClientSubscriptions  = lazy(() => import('../pages/client/ClientSubscriptions'));
const ClientProjects       = lazy(() => import('../pages/client/ClientProjects'));
const ClientMessages       = lazy(() => import('../pages/client/ClientMessages'));
const ClientProfile        = lazy(() => import('../pages/client/ClientProfile'));
const ClientSettings       = lazy(() => import('../pages/client/ClientSettings'));
const ClientWallet         = lazy(() => import('../pages/client/ClientWallet'));
const ClientInvoices       = lazy(() => import('../pages/client/ClientInvoices'));
const SubscriptionPurchase = lazy(() => import('../pages/client/SubscriptionPurchase'));

// ── Route Guards ──────────────────────────────────────────────
function PrivateRoute({ children, role }) {
  const { isAuthenticated } = useAuthContext();
  const userRole = localStorage.getItem('saas_role');
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && userRole !== role) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuthContext();
  const role = localStorage.getItem('saas_role');
  if (isAuthenticated) {
    if (role === 'freelancer') return <Navigate to="/freelancer/dashboard" replace />;
    if (role === 'client')     return <Navigate to="/client/dashboard"     replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', flexDirection: 'column', gap: '20px', textAlign: 'center', padding: '20px', fontFamily: 'var(--font-family)' }}>
      <div style={{ fontSize: '4rem', fontWeight: '800', color: 'var(--color-primary)' }}>404</div>
      <h2 style={{ color: 'var(--color-text)', fontWeight: 700 }}>Page Not Found</h2>
      <p style={{ color: 'var(--color-text-muted)' }}>The page you're looking for doesn't exist.</p>
      <a href="/" style={{ background: 'var(--gradient-blue)', color: '#fff', padding: '11px 28px', borderRadius: 'var(--radius-sm)', fontWeight: '600', textDecoration: 'none', boxShadow: 'var(--shadow-btn)' }}>Go Home</a>
    </div>
  );
}

const AppRoutes = () => (
  <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--color-bg)' }} />}>
    <Routes>

      {/* Root */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ── PUBLIC AUTH ── */}
      <Route path="/login"           element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register"        element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/verify-email"    element={<EmailVerification />} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />

      {/* Generic dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* ── FREELANCER (specific before wildcard) ── */}
      <Route path="/freelancer/dashboard"     element={<FreelancerDashboard />} />
      <Route path="/freelancer/profile"       element={<FreelancerProfile />} />
      <Route path="/freelancer/plan-creation" element={<PlanCreationForms />} />
      <Route path="/freelancer/tasks"         element={<TaskManagement />} />
      <Route path="/freelancer/group-chat"    element={<GroupChat />} />
      {/* Legacy PascalCase redirects */}
      <Route path="/FreelancerDashboard"      element={<FreelancerDashboard />} />
      <Route path="/FreelancerProfile"        element={<FreelancerProfile />} />
      <Route path="/freelancer/*"             element={<FreelancerDashboard />} />

      {/* ── CLIENT (specific before wildcard) ── */}
      <Route path="/client/dashboard"         element={<ClientDashboard />} />
      <Route path="/client/subscriptions"     element={<ClientSubscriptions />} />
      <Route path="/client/projects"          element={<ClientProjects />} />
      <Route path="/client/messages"          element={<ClientMessages />} />
      <Route path="/client/profile"           element={<ClientProfile />} />
      <Route path="/client/settings"          element={<ClientSettings />} />
      <Route path="/client/wallet"            element={<ClientWallet />} />
      <Route path="/client/invoices"          element={<ClientInvoices />} />
      <Route path="/client/:id/subscribe"     element={<SubscriptionPurchase />} />

      {/* Legacy redirects */}
      <Route path="/ClientDashboard"          element={<ClientDashboard />} />
      <Route path="/client/WalletPage"        element={<Navigate to="/client/wallet"   replace />} />
      <Route path="/client/InvoicesPage"      element={<Navigate to="/client/invoices" replace />} />
      <Route path="/WalletPage"               element={<Navigate to="/client/wallet"   replace />} />
      <Route path="/InvoicesPage"             element={<Navigate to="/client/invoices" replace />} />

      {/* Wildcard fallback for client */}
      <Route path="/client/*"                 element={<ClientDashboard />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  </Suspense>
);

export default AppRoutes;