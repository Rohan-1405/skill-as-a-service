import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { CLIENT_NAV } from "../../../constants/navItems";
import "../../../styles/payment.css";

const fmt = (n) => "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 0 });

/* Confetti particle */
const CONFETTI_COLORS = ["#1A9FE0", "#32DCFD", "#FDC449", "#64FFDA", "#FF5370"];
function Confetti() {
  return (
    <div className="pay-confetti" aria-hidden="true">
      {Array.from({ length: 28 }).map((_, i) => (
        <span
          key={i}
          className="pay-confetti-piece"
          style={{
            left: `${(i * 37) % 100}%`,
            background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            animationDelay: `${(i * 0.09).toFixed(2)}s`,
            width: i % 3 === 0 ? "10px" : "7px",
            height: i % 3 === 0 ? "10px" : "14px",
            borderRadius: i % 2 === 0 ? "50%" : "2px",
          }}
        />
      ))}
    </div>
  );
}

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { state } = useLocation();

  /* Fallback mock data if navigated directly */
  const data = state || {
    orderId: "ORD-2026-08471",
    plan: "Standard",
    freelancer: "Arjun Sharma",
    amount: 9999,
  };

  const now = new Date();
  const nextRenewal = new Date(now);
  nextRenewal.setMonth(nextRenewal.getMonth() + 1);
  const fmtDate = (d) => d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  const txnId = "TXN" + Math.random().toString(36).substring(2, 10).toUpperCase();

  /* Countdown for auto-redirect */
  const [count, setCount] = useState(10);
  useEffect(() => {
    if (count <= 0) { navigate("/client/subscriptions"); return; }
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count, navigate]);

  return (
    <DashboardLayout navItems={CLIENT_NAV} pageTitle="Payment Successful" pageSubtitle="Your subscription is now active">
      <div className="py-page pay-page">
        <Confetti />

        <div className="pay-result-wrap">
          {/* ── Success icon ── */}
          <div className="pay-result-icon pay-result-icon--success">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1 className="pay-result-title">Payment Successful!</h1>
          <p className="pay-result-sub">
            Your <strong>{data.plan} Plan</strong> subscription with <strong>{data.freelancer}</strong> is now active. You can start collaborating right away.
          </p>

          {/* ── Receipt card ── */}
          <div className="pay-receipt">
            <p className="pay-receipt-title">Payment Receipt</p>

            <div className="pay-receipt-rows">
              <div className="pay-receipt-row">
                <span className="pay-receipt-label">Status</span>
                <span className="pay-receipt-val">
                  <span className="pay-badge-success">✓ Paid</span>
                </span>
              </div>
              <div className="pay-receipt-row">
                <span className="pay-receipt-label">Amount Paid</span>
                <span className="pay-receipt-val pay-receipt-amount">{fmt(data.amount)}</span>
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
                <span className="pay-receipt-label">Transaction ID</span>
                <span className="pay-receipt-val pay-mono">{txnId}</span>
              </div>
              <div className="pay-receipt-row">
                <span className="pay-receipt-label">Date &amp; Time</span>
                <span className="pay-receipt-val">{fmtDate(now)}, {now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
              <div className="pay-receipt-row">
                <span className="pay-receipt-label">Next Renewal</span>
                <span className="pay-receipt-val">{fmtDate(nextRenewal)}</span>
              </div>
            </div>
          </div>

          {/* ── What's next ── */}
          <div className="pay-next-steps">
            <p className="pay-next-title">What happens next?</p>
            <div className="pay-next-list">
              <div className="pay-next-item">
                <div className="pay-next-num">1</div>
                <div>
                  <p className="pay-next-head">Freelancer Notified</p>
                  <p className="pay-next-desc">{data.freelancer} has been notified and will reach out within 24 hours.</p>
                </div>
              </div>
              <div className="pay-next-item">
                <div className="pay-next-num">2</div>
                <div>
                  <p className="pay-next-head">Project Workspace Ready</p>
                  <p className="pay-next-desc">Your shared project workspace is now accessible under Projects.</p>
                </div>
              </div>
              <div className="pay-next-item">
                <div className="pay-next-num">3</div>
                <div>
                  <p className="pay-next-head">Receipt Emailed</p>
                  <p className="pay-next-desc">A payment receipt has been sent to your registered email address.</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="pay-result-actions">
            <button className="pay-btn-primary" onClick={() => navigate("/client/subscriptions")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /></svg>
              View My Subscriptions
            </button>
            <button className="pay-btn-outline" onClick={() => navigate("/client/projects")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
              Go to Projects
            </button>
            <button className="pay-btn-ghost pay-btn-sm" onClick={() => window.print()}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
              Print Receipt
            </button>
          </div>

          <p className="pay-redirect-note">
            Redirecting to your subscriptions in <strong>{count}s</strong>…
            <button className="pay-link" onClick={() => navigate("/client/subscriptions")}>Go now</button>
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}