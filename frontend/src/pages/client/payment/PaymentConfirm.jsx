import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { CLIENT_NAV } from "../../../constants/navItems";
import "../../../styles/payment.css";

/* ─── Mock data (replace with router state / API later) ─── */
const MOCK_ORDER = {
  freelancer: {
    name: "Arjun Sharma",
    initials: "AS",
    color: "#1A9FE0",
    title: "Full Stack Developer",
    rating: 4.9,
    reviews: 128,
    location: "Bangalore",
  },
  plan: {
    name: "Standard",
    price: 9999,
    badge: "Most Popular",
    billingCycle: "month",
    features: [
      "5 active projects",
      "Priority support",
      "Weekly video calls",
      "UI/UX feedback",
      "Code reviews",
    ],
  },
  orderId: "ORD-2026-08471",
  tax: 0,
};

const fmt = (n) =>
  "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 0 });

const METHODS = [
  {
    id: "upi",
    label: "UPI",
    desc: "Pay via any UPI app",
    icon: (
      <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="8" fill="#5F259F" />
        <text x="24" y="31" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="800" fontFamily="sans-serif">UPI</text>
      </svg>
    ),
  },
  {
    id: "card",
    label: "Credit / Debit Card",
    desc: "Visa, Mastercard, RuPay",
    icon: (
      <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="8" fill="#1A9FE0" />
        <rect x="6" y="14" width="36" height="20" rx="3" fill="none" stroke="#fff" strokeWidth="2" />
        <rect x="6" y="20" width="36" height="6" fill="#fff" opacity="0.3" />
        <rect x="10" y="27" width="10" height="3" rx="1" fill="#fff" opacity="0.7" />
      </svg>
    ),
  },
  {
    id: "netbanking",
    label: "Net Banking",
    desc: "All major Indian banks",
    icon: (
      <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="8" fill="#0D6EAE" />
        <rect x="8" y="24" width="4" height="12" fill="#fff" rx="1" />
        <rect x="16" y="18" width="4" height="18" fill="#fff" rx="1" />
        <rect x="24" y="21" width="4" height="15" fill="#fff" rx="1" />
        <rect x="32" y="15" width="4" height="21" fill="#fff" rx="1" />
        <rect x="6" y="36" width="36" height="3" rx="1" fill="#fff" opacity="0.5" />
        <polygon points="24,6 36,14 12,14" fill="#FDC449" />
      </svg>
    ),
  },
  {
    id: "wallet",
    label: "Wallet Balance",
    desc: "Available: ₹12,450",
    icon: (
      <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="8" fill="#32DCFD" opacity="0.15" />
        <rect x="6" y="14" width="36" height="24" rx="4" fill="none" stroke="#32DCFD" strokeWidth="2.5" />
        <rect x="28" y="22" width="10" height="8" rx="2" fill="#32DCFD" opacity="0.8" />
        <circle cx="33" cy="26" r="2" fill="#fff" />
      </svg>
    ),
  },
];

export default function PaymentConfirm() {
  const navigate = useNavigate();
  const [method, setMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [paying, setPaying] = useState(false);
  const [upiError, setUpiError] = useState("");

  const order = MOCK_ORDER;
  const total = order.plan.price + order.tax;

  const handlePay = () => {
    if (method === "upi") {
      if (!upiId.trim()) { setUpiError("Please enter your UPI ID"); return; }
      if (!/^[\w.\-]+@[\w]+$/.test(upiId.trim())) { setUpiError("Enter a valid UPI ID (e.g. name@okaxis)"); return; }
      setUpiError("");
    }
    if (!agreed) return;
    setPaying(true);
    /* Simulate Razorpay / API call */
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success for demo
      navigate(success ? "/client/payment/success" : "/client/payment/failed", {
        state: { orderId: order.orderId, plan: order.plan.name, freelancer: order.freelancer.name, amount: total },
      });
    }, 2200);
  };

  return (
    <DashboardLayout navItems={CLIENT_NAV} pageTitle="Confirm Payment" pageSubtitle="Review your order before paying">
      <div className="py-page pay-page">

        {/* ── Breadcrumb ── */}
        <div className="pay-breadcrumb">
          <span className="pay-bc-done">Browse</span>
          <span className="pay-bc-sep">›</span>
          <span className="pay-bc-done">Select Plan</span>
          <span className="pay-bc-sep">›</span>
          <span className="pay-bc-active">Confirm &amp; Pay</span>
          <span className="pay-bc-sep">›</span>
          <span className="pay-bc-pending">Done</span>
        </div>

        <div className="pay-layout">
          {/* ══ LEFT ══ */}
          <div className="pay-left">

            {/* Order summary card */}
            <div className="pay-card">
              <p className="pay-card-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 12h8M8 8h8M8 16h4" /></svg>
                Order Summary
              </p>

              <div className="pay-freelancer-row">
                <div className="pay-avatar" style={{ background: order.freelancer.color }}>
                  {order.freelancer.initials}
                </div>
                <div className="pay-freelancer-info">
                  <p className="pay-freelancer-name">{order.freelancer.name}</p>
                  <p className="pay-freelancer-title">{order.freelancer.title}</p>
                  <div className="pay-freelancer-meta">
                    <span className="pay-star">★ {order.freelancer.rating}</span>
                    <span className="pay-dot" />
                    <span>{order.freelancer.reviews} reviews</span>
                    <span className="pay-dot" />
                    <span>📍 {order.freelancer.location}</span>
                  </div>
                </div>
                <div className="pay-plan-badge">{order.plan.badge}</div>
              </div>

              <div className="pay-plan-row">
                <div className="pay-plan-left">
                  <p className="pay-plan-name">{order.plan.name} Plan</p>
                  <p className="pay-plan-cycle">Billed monthly · Auto-renews</p>
                </div>
                <p className="pay-plan-price">{fmt(order.plan.price)}<span>/mo</span></p>
              </div>

              <div className="pay-features">
                {order.plan.features.map((f) => (
                  <div key={f} className="pay-feature-row">
                    <svg className="pay-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    {f}
                  </div>
                ))}
              </div>

              <div className="pay-divider" />

              <div className="pay-total-rows">
                <div className="pay-total-row">
                  <span>Subscription</span><span>{fmt(order.plan.price)}</span>
                </div>
                <div className="pay-total-row">
                  <span>GST / Tax</span><span className="pay-free">Free</span>
                </div>
                <div className="pay-divider" />
                <div className="pay-total-row pay-total-final">
                  <span>Total Due Today</span><span>{fmt(total)}</span>
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="pay-card">
              <p className="pay-card-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>
                Payment Method
              </p>

              <div className="pay-methods">
                {METHODS.map((m) => (
                  <label key={m.id} className={`pay-method${method === m.id ? " pay-method-active" : ""}`}>
                    <input type="radio" name="payMethod" value={m.id} checked={method === m.id}
                      onChange={() => { setMethod(m.id); setUpiError(""); }} />
                    <div className="pay-method-icon">{m.icon}</div>
                    <div className="pay-method-text">
                      <span className="pay-method-label">{m.label}</span>
                      <span className="pay-method-desc">{m.desc}</span>
                    </div>
                    <div className={`pay-method-radio${method === m.id ? " checked" : ""}`} />
                  </label>
                ))}
              </div>

              {/* UPI input */}
              {method === "upi" && (
                <div className="pay-upi-field">
                  <label className="pay-upi-label">Enter UPI ID</label>
                  <div className="pay-upi-wrap">
                    <input
                      className={`pay-upi-input${upiError ? " error" : ""}`}
                      type="text" placeholder="yourname@okaxis"
                      value={upiId} maxLength={50}
                      onChange={(e) => { setUpiId(e.target.value.replace(/\s/g, "").slice(0, 50)); setUpiError(""); }}
                    />
                    <button className="pay-upi-verify">Verify</button>
                  </div>
                  {upiError && <span className="pay-upi-error">⚠ {upiError}</span>}
                  <p className="pay-upi-hint">Supported: GPay, PhonePe, Paytm, BHIM, and all UPI apps</p>
                </div>
              )}

              {/* Wallet method info */}
              {method === "wallet" && (
                <div className="pay-wallet-info">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
                  Your wallet balance of <strong>₹12,450</strong> is sufficient for this payment. The amount will be deducted instantly.
                </div>
              )}

              {/* Net banking info */}
              {method === "netbanking" && (
                <div className="pay-wallet-info">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
                  You'll be redirected to your bank's secure portal after clicking Pay Now.
                </div>
              )}
            </div>

            {/* T&C agreement */}
            <label className="pay-agree">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
              <span>
                I agree to the <a href="#terms" className="pay-link">Terms of Service</a> and <a href="#privacy" className="pay-link">Privacy Policy</a>. I understand this subscription will auto-renew monthly until cancelled.
              </span>
            </label>
          </div>

          {/* ══ RIGHT ── sticky sidebar ══ */}
          <div className="pay-right">
            <div className="pay-summary-card">
              <p className="pay-summary-title">Payment Summary</p>

              <div className="pay-summary-amount">
                <span className="pay-summary-sym">₹</span>
                <span className="pay-summary-val">{order.plan.price.toLocaleString("en-IN")}</span>
                <span className="pay-summary-mo">/mo</span>
              </div>
              <p className="pay-summary-plan">{order.plan.name} Plan · {order.freelancer.name}</p>

              <div className="pay-summary-rows">
                <div className="pay-summary-row"><span>Plan price</span><span>{fmt(order.plan.price)}</span></div>
                <div className="pay-summary-row"><span>Tax</span><span className="pay-free">₹0</span></div>
                <div className="pay-summary-divider" />
                <div className="pay-summary-row pay-summary-total"><span>Total</span><span>{fmt(total)}</span></div>
              </div>

              <button
                className={`pay-btn-primary${paying ? " loading" : ""}${!agreed ? " disabled" : ""}`}
                onClick={handlePay}
                disabled={paying || !agreed}
              >
                {paying ? (
                  <><span className="pay-spinner" /> Processing…</>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>
                    Pay {fmt(total)}
                  </>
                )}
              </button>

              <div className="pay-trust-badges">
                <div className="pay-trust-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  256-bit SSL encrypted
                </div>
                <div className="pay-trust-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                  Powered by Razorpay
                </div>
                <div className="pay-trust-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                  Receipt sent to email
                </div>
              </div>

              <button className="pay-btn-ghost" onClick={() => navigate(-1)}>
                ← Go Back
              </button>
            </div>

            {/* Order ID */}
            <p className="pay-order-id">Order ID: <strong>{order.orderId}</strong></p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}