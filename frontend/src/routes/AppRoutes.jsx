import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login             from '../pages/auth/Login';
import ForgotPassword    from '../pages/auth/ForgotPassword';
import EmailVerification from '../pages/auth/EmailVerification';
import Dashboard         from '../pages/dashboard/Dashboard';

/**
 * AppRoutes — Central routing configuration.
 *
 * Auth flow per UI Flow document:
 *   Register → /verify-email → /login → /dashboard
 *
 * Current routes (Milestone 1):
 *   /                  → /login
 *   /login             → Login page
 *   /register          → Register page (Praveen)
 *   /verify-email      → Email Verification page
 *   /forgot-password   → Forgot Password page
 *   /dashboard         → Dashboard (stub, full build Day 3)
 *
 * Upcoming routes (add as milestones progress):
 *   /profile           → Freelancer / Client Profile
 *   /subscriptions     → Subscription marketplace
 *   /wallet            → Wallet management
 *   /projects          → Project management
 *   /chat              → Chat system
 *   /admin/*           → Admin dashboard
 */

const AppRoutes = () => {
  return (
    <Routes>
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Auth flow: Register → Verify → Login */}
      <Route path="/login"            element={<Login />} />
      <Route path="/register"         element={<Navigate to="/login" replace />} />  {/* Praveen replaces this */}
      <Route path="/verify-email"     element={<EmailVerification />} />
      <Route path="/forgot-password"  element={<ForgotPassword />} />

      {/* Dashboard (Milestone 1 stub) */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Catch-all → back to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
