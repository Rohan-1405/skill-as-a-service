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
const ClientDashboard      = lazy(() => import('../pages/client/ClientDashboard'));
const SubscriptionPurchase = lazy(() => import('../pages/client/SubscriptionPurchase'));
const WalletPage           = lazy(() => import('../pages/wallet/WalletPage'));
const InvoicesPage         = lazy(() => import('../pages/wallet/InvoicesPage'));

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
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--color-bg)',
      flexDirection: 'column', gap: '20px', textAlign: 'center', padding: '20px',
      fontFamily: 'var(--font-family)',
    }}>
      <div style={{ fontSize: '4rem', fontWeight: '800', color: 'var(--color-primary)' }}>404</div>
      <h2 style={{ color: 'var(--color-text)', fontWeight: 700 }}>Page Not Found</h2>
      <p style={{ color: 'var(--color-text-muted)' }}>The page you're looking for doesn't exist.</p>
      <a href="/" style={{
        background: 'var(--gradient-blue)', color: '#fff',
        padding: '11px 28px', borderRadius: 'var(--radius-sm)',
        fontWeight: '600', textDecoration: 'none', boxShadow: 'var(--shadow-btn)',
      }}>Go Home</a>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ROUTE ARCHITECTURE:
//   • All specific paths declared BEFORE their wildcard siblings
//   • Client sub-pages (/wallet, /invoices) are explicit routes
//   • Old PascalCase paths redirect to correct kebab-case URLs
// ─────────────────────────────────────────────────────────────
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

      {/* ── FREELANCER (specific first, wildcard last) ── */}
      <Route path="/freelancer/dashboard"     element={<FreelancerDashboard />} />
      <Route path="/freelancer/profile"       element={<FreelancerProfile />} />
      <Route path="/freelancer/plan-creation" element={<PlanCreationForms />} />
      <Route path="/FreelancerDashboard"      element={<FreelancerDashboard />} />
      <Route path="/FreelancerProfile"        element={<FreelancerProfile />} />
      <Route path="/freelancer/*"             element={<FreelancerDashboard />} />

      {/* ── CLIENT (specific first, wildcard last) ── */}
      <Route path="/client/dashboard"         element={<ClientDashboard />} />
      <Route path="/client/wallet"            element={<WalletPage />} />
      <Route path="/client/invoices"          element={<InvoicesPage />} />
      <Route path="/client/:id/subscribe"     element={<SubscriptionPurchase />} />
      <Route path="/ClientDashboard"          element={<ClientDashboard />} />
      <Route path="/client/*"                 element={<ClientDashboard />} />

      {/* Legacy PascalCase redirects */}
      <Route path="/WalletPage"   element={<Navigate to="/client/wallet"   replace />} />
      <Route path="/InvoicesPage" element={<Navigate to="/client/invoices" replace />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  </Suspense>
);

export default AppRoutes;
