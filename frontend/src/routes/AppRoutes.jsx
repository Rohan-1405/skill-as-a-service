import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

// ── Auth pages (Lohith) ──────────────────────────────────────
import Login             from '../pages/auth/Login';
import ForgotPassword    from '../pages/auth/ForgotPassword';
import EmailVerification from '../pages/auth/EmailVerification';
import Dashboard         from '../pages/dashboard/Dashboard';

// ── Praveen's pages ──────────────────────────────────────────
// Day 1-2
const Register = lazy(() => import('../pages/auth/Register'));
// Day 3
const FreelancerDashboard = lazy(() => import('../pages/freelancer/FreelancerDashboard'));
const ClientDashboard     = lazy(() => import('../pages/client/ClientDashboard'));
// Day 4
const FreelancerProfile   = lazy(() => import('../pages/freelancer/FreelancerProfile'));
// Day 5  — Praveen's standalone plan creation forms page
import PlanCreationForms  from '../pages/freelancer/PlanCreationForms';
// Day 6  — Praveen's subscription purchase flow
import SubscriptionPurchase from '../pages/client/SubscriptionPurchase';
import WalletPage from '../pages/wallet/WalletPage';

// ── Route Guards ─────────────────────────────────────────────
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
// ROUTE ORDER RULE: specific paths ALWAYS before /* wildcards
// ─────────────────────────────────────────────────────────────
const AppRoutes = () => (
  <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--color-bg)' }} />}>
    <Routes>

      {/* Root */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Auth — public */}
      <Route path="/login"            element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register"         element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/verify-email"     element={<EmailVerification />} />
      <Route path="/forgot-password"  element={<PublicRoute><ForgotPassword /></PublicRoute>} />

      {/* Generic dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Dev preview shortcuts (no auth guard) */}
      <Route path="/FreelancerDashboard" element={<FreelancerDashboard />} />
      <Route path="/FreelancerProfile"   element={<FreelancerProfile />} />
      <Route path="/ClientDashboard"     element={<ClientDashboard />} />

      {/*
        ── SPECIFIC freelancer routes ──
        Must be declared BEFORE /freelancer/* wildcard.
      */}
      {/* Praveen Day 5 — standalone plan creation forms page */}
      <Route path="/freelancer/plan-creation" element={<PlanCreationForms />} />

      {/*
        ── SPECIFIC client routes ──
        Must be declared BEFORE /client/* wildcard.

        FIX: was /freelancer/:id/subscribe (wrong — subscribing is a CLIENT action)
             AND was placed after /freelancer/* wildcard so it never matched.
        CORRECTED: /client/:id/subscribe, placed before /client/* wildcard.
      */}
      {/* Praveen Day 6 — subscription purchase flow */}
      <Route path="/client/:id/subscribe" element={<SubscriptionPurchase />} />
      <Route path="/WalletPage" element={<WalletPage />} />

      {/*
        ── WILDCARD routes — always last ──
        These catch everything under /freelancer/ and /client/ that
        wasn't matched by a specific route above.
      */}
      <Route path="/freelancer/*" element={<FreelancerDashboard />} />
      <Route path="/client/*"     element={<ClientDashboard />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  </Suspense>
);

export default AppRoutes;
