import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login             from '../pages/auth/Login';
import ForgotPassword    from '../pages/auth/ForgotPassword';
import ResetPassword     from '../pages/auth/ResetPassword';
import EmailVerification from '../pages/auth/EmailVerification';
import DashboardHome     from '../pages/dashboard/DashboardHome';
import Profile           from '../pages/dashboard/Profile';
import SubscriptionPlans from '../pages/dashboard/SubscriptionPlans';
import Marketplace       from '../pages/client/Marketplace';
import WalletDashboard   from '../pages/dashboard/WalletDashboard';
import ClientWallet      from '../pages/client/ClientWallet';
import DepositFunds      from '../pages/dashboard/DepositFunds';
import WithdrawalRequest from '../pages/dashboard/WithdrawalRequest';
import PaymentConfirm    from '../pages/client/payment/PaymentConfirm';
import PaymentSuccess    from '../pages/client/payment/PaymentSuccess';
import PaymentFailed     from '../pages/client/payment/PaymentFailed';
import Projects          from '../pages/dashboard/Projects';
import ProjectDetail     from '../pages/dashboard/ProjectDetail';
import ChatPage          from '../pages/dashboard/ChatPage';
import KYCVerification  from '../pages/dashboard/KYCVerification';
import Analytics        from '../pages/dashboard/Analytics';
import Settings         from '../pages/dashboard/Settings';
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

      {/* ══════════════════════════════════
          FREELANCER PORTAL
          navItems = FREELANCER_NAV (default)
          ══════════════════════════════════ */}
      <Route path="/dashboard"     element={<DashboardHome />} />
      <Route path="/profile"       element={<Profile />} />
      <Route path="/subscriptions" element={<SubscriptionPlans />} />
      <Route path="/subscribers"   element={<ComingSoon title="Subscribers"   day={5}  />} />
      <Route path="/projects"      element={<Projects />} />
      <Route path="/projects/:id"  element={<ProjectDetail />} />
      <Route path="/chat"          element={<ChatPage />} />
      <Route path="/wallet"              element={<WalletDashboard />} />
      <Route path="/wallet/deposit"      element={<DepositFunds />} />
      <Route path="/withdrawals"         element={<WithdrawalRequest />} />
      <Route path="/analytics"     element={<Analytics />} />
      <Route path="/notifications" element={<ComingSoon title="Notifications"  day={11} />} />
      <Route path="/kyc"           element={<KYCVerification />} />
      <Route path="/settings"      element={<Settings />} />

      {/* ══════════════════════════════════
          CLIENT PORTAL
          All routes pass portal="client" so
          ComingSoon uses CLIENT_NAV sidebar
          ══════════════════════════════════ */}
      <Route path="/client/browse"         element={<Marketplace />} />
      <Route path="/client/dashboard"      element={<ComingSoon title="Client Dashboard"   day={6}  portal="client" />} />
      <Route path="/client/subscriptions"  element={<ComingSoon title="My Subscriptions"   day={6}  portal="client" />} />
      <Route path="/client/projects"       element={<ComingSoon title="Projects"            day={9}  portal="client" />} />
      <Route path="/client/chat"           element={<ChatPage />} />
      <Route path="/client/wallet"              element={<ClientWallet />} />
      <Route path="/client/wallet/deposit"      element={<DepositFunds />} />
      <Route path="/client/payment/confirm"     element={<PaymentConfirm />} />
      <Route path="/client/payment/success"     element={<PaymentSuccess />} />
      <Route path="/client/payment/failed"      element={<PaymentFailed />} />
      <Route path="/client/notifications"  element={<ComingSoon title="Notifications"       day={11} portal="client" />} />
      <Route path="/client/settings"       element={<ComingSoon title="Settings"            day={11} portal="client" />} />

      {/* Catch-all → freelancer dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;