// ============================================================
// SkillAsAService - App.jsx
// Day 1 | 11:00 AM - 12:00 PM | Praveen Gorla
// Task: React Environment Setup + Routing Configuration
// ============================================================

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';

// ---- Lazy-loaded Auth Pages ----
const Register    = lazy(() => import('./pages/auth/Register'));
const Login       = lazy(() => import('./pages/auth/Login'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const EmailVerify = lazy(() => import('./pages/auth/EmailVerify'));

// ---- Lazy-loaded Dashboards (stubs for Day 1) ----
const FreelancerDashboard = lazy(() => import('./pages/freelancer/FreelancerDashboard'));
const ClientDashboard     = lazy(() => import('./pages/client/ClientDashboard'));

// ---- Page Loading Fallback ----
function PageLoader() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#1A1D2E',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{
        width: '48px', height: '48px',
        background: 'linear-gradient(135deg, #1E7FE8, #1254B7)',
        borderRadius: '12px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.5rem', fontWeight: '800', color: '#fff',
        animation: 'pulse 1.5s ease-in-out infinite'
      }}>S</div>
      <p style={{ color: '#A0AABF', fontSize: '0.9rem' }}>Loading SkillAsAService...</p>
      <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.7;transform:scale(0.95)} }`}</style>
    </div>
  );
}

// ---- Route Guards ----
function PrivateRoute({ children, role }) {
  const token = localStorage.getItem('saas_token');
  const userRole = localStorage.getItem('saas_role');

  if (!token) return <Navigate to="/login" replace />;
  if (role && userRole !== role) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const token = localStorage.getItem('saas_token');
  const role  = localStorage.getItem('saas_role');

  if (token) {
    if (role === 'freelancer') return <Navigate to="/freelancer/dashboard" replace />;
    if (role === 'client')     return <Navigate to="/client/dashboard" replace />;
    if (role === 'admin')      return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
}

// ---- 404 Page ----
function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#1A1D2E', flexDirection: 'column',
      gap: '20px', textAlign: 'center', padding: '20px'
    }}>
      <div style={{ fontSize: '4rem', fontWeight: '800', color: '#1E7FE8' }}>404</div>
      <h2 style={{ color: '#fff', fontFamily: 'Poppins, sans-serif' }}>Page Not Found</h2>
      <p style={{ color: '#A0AABF' }}>The page you are looking for doesn't exist.</p>
      <a href="/" style={{
        background: 'linear-gradient(135deg,#1E7FE8,#1254B7)',
        color: '#fff', padding: '12px 28px', borderRadius: '12px',
        fontWeight: '600', textDecoration: 'none'
      }}>Go Home</a>
    </div>
  );
}

// ---- Main App ----
function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/register" replace />} />

          {/* Public / Auth Routes */}
          <Route path="/register" element={
            <PublicRoute><Register /></PublicRoute>
          } />
          <Route path="/login" element={
            <PublicRoute><Login /></PublicRoute>
          } />
          <Route path="/forgot-password" element={
            <PublicRoute><ForgotPassword /></PublicRoute>
          } />
          <Route path="/verify-email" element={<EmailVerify />} />

          {/* Freelancer Routes */}
          <Route path="/freelancer/*" element={
            <PrivateRoute role="freelancer">
              <FreelancerDashboard />
            </PrivateRoute>
          } />

          {/* Client Routes */}
          <Route path="/client/*" element={
            <PrivateRoute role="client">
              <ClientDashboard />
            </PrivateRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        theme="dark"
        toastStyle={{
          background: '#2B2F4A',
          border: '1px solid #353A5C',
          color: '#fff',
          borderRadius: '12px',
        }}
      />
    </Router>
  );
}

export default App;
