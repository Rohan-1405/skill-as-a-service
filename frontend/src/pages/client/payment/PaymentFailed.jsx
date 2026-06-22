import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { CLIENT_NAV } from "../../../constants/navItems";
import "../../../styles/payment.css";

const fmt = (n) => "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 0 });

const FAILURE_REASONS = [
  { code: "INSUFFICIENT_FUNDS",    label: "Insufficient funds",       detail: "Your account doesn't have enough balance for this transaction." },
  { code: "BANK_DECLINED",         label: "Bank declined",            detail: "Your bank declined the transaction. Please contact your bank or try a different payment method." },
  { code: "TIMEOUT",               label: "Payment timed out",        detail: "The payment session expired. Please try again." },
  { code: "GENERIC",               label: "Payment failed",           detail: "Something went wrong while processing your payment. No amount has been deducted." },
];

export default function PaymentFailed() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [retrying, setRetrying] = useState(false);

  const data = state || {
    orderId: "ORD-2026-08471",
    plan: "Standard",
    freelancer: "Arjun Sharma",
    amount: 9999,
    failureCode: "GENERIC",
  };

  const reason = FAILURE_REASONS.find((r) => r.code === data.failureCode) || FAILURE_REASONS[3];

  const handleRetry = () => {
    setRetrying(true);
    setTimeout(() => navigate("/client/payment/confirm", { state: data }), 800);
  };

  const now = new Date();
  const fmtDate = (d) => d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const failRef = "FAIL" + Math.random().toString(36).substring(2, 10).toUpperCase();

  return (
    <DashboardLayout navItems={CLIENT_NAV} pageTitle="Payment Failed" pageSubtitle="Don't worry — no amount was deducted">
      <div className="py-page pay-page">
        <div className="pay-result-wrap">

          {/* ── Failure icon ── */}
          <div className="pay-result-icon pay-result-icon--fail">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>

          <h1 className="pay-result-title">Payment Failed</h1>
          <p className="pay-result-sub">
            {reason.detail} <strong>No amount has been deducted</strong> from your account.
          </p>

          {/* ── Failure details card ── */}
          <div className="pay-receipt pay-receipt--fail">
            <p className="pay-receipt-title">Transaction Details</p>

            <div className="pay-receipt-rows">
              <div className="pay-receipt-row">
                <span className="pay-receipt-label">Status</span>
                <span className="pay-receipt-val">
                  <span className="pay-badge-fail">✗ Failed</span>
                </span>
              </div>
              <div className="pay-receipt-row">
                <span className="pay-receipt-label">Reason</span>
                <span className="pay-receipt-val">{reason.label}</span>
              </div>
              <div className="pay-receipt-row">
                <span className="pay-receipt-label">Amount</span>
                <span className="pay-receipt-val">{fmt(data.amount)} <span className="pay-not-charged">(not charged)</span></span>
              </div>
              <div className="pay-receipt-row">
                <span className="pay-receipt-label">Plan</span>
                <span className="pay-receipt-val">{data.plan} Plan</span>
              </div>
              <div className="pay-receipt-row">
                <span className="pay-receipt-label">Freelancer</span>
                <span className="pay-receipt-val">{data.freelancer}</span>
              </div>
              <div className="pay-receipt-row">
                <span className="pay-receipt-label">Order ID</span>
                <span className="pay-receipt-val pay-mono">{data.orderId}</span>
              </div>
              <div className="pay-receipt-row">
                <span className="pay-receipt-label">Failure Ref</span>
                <span className="pay-receipt-val pay-mono">{failRef}</span>
              </div>
              <div className="pay-receipt-row">
                <span className="pay-receipt-label">Date &amp; Time</span>
                <span className="pay-receipt-val">{fmtDate(now)}, {now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            </div>
          </div>

          {/* ── Suggestions ── */}
          <div className="pay-fail-tips">
            <p className="pay-fail-tips-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
              What you can try
            </p>
            <ul className="pay-tips-list">
              <li>Check that your card or UPI has sufficient balance</li>
              <li>Try a different payment method (UPI, Net Banking, Wallet)</li>
              <li>Ensure your internet connection is stable before retrying</li>
              <li>Contact your bank if the issue persists</li>
              <li>If your account was debited, it will be refunded within 5–7 business days</li>
            </ul>
          </div>

          {/* ── Actions ── */}
          <div className="pay-result-actions">
            <button
              className={`pay-btn-primary${retrying ? " loading" : ""}`}
              onClick={handleRetry}
              disabled={retrying}
            >
              {retrying ? (
                <><span className="pay-spinner" /> Loading…</>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
                  Retry Payment
                </>
              )}
            </button>
            <button className="pay-btn-outline" onClick={() => navigate("/client/browse")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              Browse Other Freelancers
            </button>
            <button className="pay-btn-ghost pay-btn-sm" onClick={() => navigate("/client/dashboard")}>
              Back to Dashboard
            </button>
          </div>

          {/* Support note */}
          <div className="pay-support-note">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.35 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
            Need help? Contact us at <a href="mailto:support@skillasaservice.com" className="pay-link">support@skillasaservice.com</a> with your Failure Ref: <strong>{failRef}</strong>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}