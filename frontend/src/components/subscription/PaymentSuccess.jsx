import React from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess({ freelancer, plan }) {
  const navigate = useNavigate();

  const invoiceNo = `INV-${Date.now().toString().slice(-8)}`;
  const startDate = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const renewDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="suc-wrap">
      <div className="card suc-card">

        {/* Animated checkmark */}
        <div className="suc-icon-ring">
          <div className="suc-icon-circle">
            <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ color: "var(--color-success)" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="suc-title">Subscription Activated! 🎉</h1>
        <p className="suc-sub">
          You're now subscribed to <strong>{freelancer.name}</strong>'s{" "}
          <strong>{plan.plan_name} Plan</strong>. You can start submitting requests right away.
        </p>

        {/* Subscription Details */}
        <div className="suc-details-card">
          <div className="suc-detail-row">
            <span className="suc-detail-label">Invoice No.</span>
            <span className="suc-detail-val">{invoiceNo}</span>
          </div>
          <div className="suc-detail-row">
            <span className="suc-detail-label">Plan</span>
            <span className="suc-detail-val">{plan.plan_name}</span>
          </div>
          <div className="suc-detail-row">
            <span className="suc-detail-label">Started</span>
            <span className="suc-detail-val">{startDate}</span>
          </div>
          <div className="suc-detail-row">
            <span className="suc-detail-label">Next Renewal</span>
            <span className="suc-detail-val">{renewDate}</span>
          </div>
          <div className="suc-detail-row">
            <span className="suc-detail-label">Requests Available</span>
            <span className="suc-detail-val suc-highlight">{plan.requests}/month</span>
          </div>
        </div>

        {/* Actions */}
        <div className="suc-actions">
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate("/client/projects")}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
            </svg>
            Create Your First Project
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/client/subscriptions")}
          >
            View My Subscriptions
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => window.print()}
          >
            🖨 Download Invoice
          </button>
        </div>

        <p className="suc-note">
          A confirmation email has been sent. You can manage or cancel this subscription anytime
          from <strong>My Subscriptions</strong>.
        </p>
      </div>
    </div>
  );
}