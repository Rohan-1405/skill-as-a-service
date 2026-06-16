import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login             from '../pages/auth/Login';
import ForgotPassword    from '../pages/auth/ForgotPassword';
import ResetPassword     from '../pages/auth/ResetPassword';
import EmailVerification from '../pages/auth/EmailVerification';
import DashboardHome     from '../pages/dashboard/DashboardHome';
import Profile           from '../pages/dashboard/Profile';
import ComingSoon        from '../pages/ComingSoon';

/**
 * AppRoutes v2 — changes:
 *  - All sidebar nav paths (/profile, /wallet, etc.) now route to <ComingSoon>
 *    instead of falling to the catch-all which was redirecting to /login.
 *    This is why clicking sidebar items was taking you back to login.
 *  - Catch-all now stays on /dashboard (not /login) when no route matches
 *
 * TO ADD A REAL PAGE: replace ComingSoon with the actual component and import it.
 */

const AppRoutes = () => {
  return (
    <Routes>
      {/* Default */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* ── Auth pages ── */}
      <Route path="/login"           element={<Login />} />
      <Route path="/register"        element={<Navigate to="/login" replace />} />
      <Route path="/verify-email"    element={<EmailVerification />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password"  element={<ResetPassword />} />

      {/* ── Freelancer portal ── */}
      <Route path="/dashboard"    element={<DashboardHome />} />

      {/* Coming soon placeholders — prevents redirect to login when clicking sidebar */}
      <Route path="/profile"       element={<Profile />} />
      <Route path="/subscriptions" element={<ComingSoon title="Subscription Plans"  day={5} />} />
      <Route path="/subscribers"   element={<ComingSoon title="Subscribers"         day={5} />} />
      <Route path="/projects"      element={<ComingSoon title="Projects"            day={9} />} />
      <Route path="/chat"          element={<ComingSoon title="Messages"            day={10} />} />
      <Route path="/wallet"        element={<ComingSoon title="Wallet"              day={7} />} />
      <Route path="/withdrawals"   element={<ComingSoon title="Withdrawals"         day={7} />} />
      <Route path="/analytics"     element={<ComingSoon title="Analytics"           day={8} />} />
      <Route path="/notifications" element={<ComingSoon title="Notifications"       day={11} />} />
      <Route path="/settings"      element={<ComingSoon title="Settings"            day={11} />} />

      {/* Catch-all → dashboard (not login) */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;