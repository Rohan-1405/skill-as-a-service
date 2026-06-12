import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

// ---- Auth Pages ----
import Login             from '../pages/auth/Login';
import ForgotPassword    from '../pages/auth/ForgotPassword';
import EmailVerification from '../pages/auth/EmailVerification';
import Dashboard         from '../pages/dashboard/Dashboard';

// ---- Praveen's Pages (lazy) ----
const Register            = lazy(() => import('../pages/auth/Register'));
const FreelancerDashboard = lazy(() => import('../pages/freelancer/FreelancerDashboard'));
const ClientDashboard     = lazy(() => import('../pages/client/ClientDashboard'));

// ---- Route Guards ----
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
    if (role === 'client')     return <Navigate to="/client/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

// ---- 404 ----
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
        background: 'var(--gradient-blue)',
        color: '#fff', padding: '11px 28px',
        borderRadius: 'var(--radius-sm)',
        fontWeight: '600', textDecoration: 'none',
        boxShadow: 'var(--shadow-btn)',
      }}>Go Home</a>
    </div>
  );
}

/**
 * AppRoutes — Central routing.
 *
 * Auth flow: Register → /verify-email → /login → /dashboard
 *
 * Routes:
 *   /                      → /login
 *   /login                 → Login page (Lohith)
 *   /register              → Register page (Praveen)
 *   /verify-email          → Email Verification
 *   /forgot-password       → Forgot Password
 *   /dashboard             → Dashboard stub
 *   /freelancer/*          → FreelancerDashboard (Praveen, private)
 *   /client/*              → ClientDashboard (Praveen, private)
 */
const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />

    <Route path="/login"          element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/register"       element={<PublicRoute><Register /></PublicRoute>} />
    <Route path="/verify-email"   element={<EmailVerification />} />
    <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />

    <Route path="/dashboard" element={<Dashboard />} />

    <Route path="/freelancer/*" element={
      <PrivateRoute role="freelancer"><FreelancerDashboard /></PrivateRoute>
    } />
    <Route path="/client/*" element={
      <PrivateRoute role="client"><ClientDashboard /></PrivateRoute>
    } />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
