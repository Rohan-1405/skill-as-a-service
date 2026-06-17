import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login             from '../pages/auth/Login';
import ForgotPassword    from '../pages/auth/ForgotPassword';
import ResetPassword     from '../pages/auth/ResetPassword';
import EmailVerification from '../pages/auth/EmailVerification';
import DashboardHome     from '../pages/dashboard/DashboardHome';
import Profile           from '../pages/dashboard/Profile';
import SubscriptionPlans from '../pages/dashboard/SubscriptionPlans';
import ComingSoon        from '../pages/ComingSoon';

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
      <Route path="/profile"      element={<Profile />} />

      {/* Coming soon placeholders */}
      <Route path="/subscriptions" element={<SubscriptionPlans />} />
      <Route path="/subscribers"   element={<ComingSoon title="Subscribers"        day={5} />} />
      <Route path="/projects"      element={<ComingSoon title="Projects"           day={9} />} />
      <Route path="/chat"          element={<ComingSoon title="Messages"           day={10} />} />
      <Route path="/wallet"        element={<ComingSoon title="Wallet"             day={7} />} />
      <Route path="/withdrawals"   element={<ComingSoon title="Withdrawals"        day={7} />} />
      <Route path="/analytics"     element={<ComingSoon title="Analytics"          day={8} />} />
      <Route path="/notifications" element={<ComingSoon title="Notifications"      day={11} />} />
      <Route path="/settings"      element={<ComingSoon title="Settings"           day={11} />} />

      {/* Catch-all → dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;