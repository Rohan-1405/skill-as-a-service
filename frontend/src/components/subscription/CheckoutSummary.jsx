// ============================================================
// SkillAsAService — CheckoutSummary.jsx
// Author: Praveen Gorla  |  Day 6
// FIX: Added inline detail forms for UPI, Card, Net Banking
// ============================================================

import React, { useState } from "react";

const PAYMENT_METHODS = [
  { id: "wallet",     label: "Wallet Balance",      sub: "Available: ₹8,500",           icon: "💳" },
  { id: "upi",        label: "UPI",                 sub: "Google Pay, PhonePe, Paytm",   icon: "📱" },
  { id: "card",       label: "Credit / Debit Card", sub: "Visa, Mastercard, RuPay",      icon: "🏦" },
  { id: "netbanking", label: "Net Banking",          sub: "All major banks",              icon: "🏛️" },
];

const UPI_APPS = [
  { id: "gpay",    label: "Google Pay",  icon: "🟢" },
  { id: "phonepe", label: "PhonePe",     icon: "🟣" },
  { id: "paytm",   label: "Paytm",       icon: "🔵" },
  { id: "bhim",    label: "BHIM UPI",    icon: "🔶" },
];

const BANKS = [
  "State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank",
  "Kotak Mahindra Bank", "Punjab National Bank", "Bank of Baroda",
  "Canara Bank", "Union Bank of India", "Indian Bank",
];

// ── UPI Form ────────────────────────────────────────────────
function UpiForm({ data, onChange }) {
  return (
    <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 14 }}>
      {/* UPI App selection */}
      <div>
        <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginBottom: 8, fontWeight: 500 }}>Select App (Optional)</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
          {UPI_APPS.map(app => (
            <button key={app.id} type="button"
              onClick={() => onChange("upi_app", app.id)}
              style={{
                padding: "8px 4px", borderRadius: 8, border: "1.5px solid",
                borderColor: data.upi_app === app.id ? "var(--color-primary)" : "var(--color-border)",
                background: data.upi_app === app.id ? "rgba(26,159,224,0.10)" : "var(--color-bg-secondary)",
                color: "var(--color-text)", cursor: "pointer", textAlign: "center",
                fontFamily: "var(--font-family)",
              }}>
              <div style={{ fontSize: 18, marginBottom: 2 }}>{app.icon}</div>
              <div style={{ fontSize: 10, fontWeight: 600 }}>{app.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* UPI ID */}
      <div>
        <label style={{ fontSize: 12, color: "var(--color-text-secondary)", fontWeight: 500, display: "block", marginBottom: 6 }}>
          UPI ID *
        </label>
        <input
          type="text"
          placeholder="yourname@upi  e.g. 9876543210@gpay"
          value={data.upi_id || ""}
          onChange={e => onChange("upi_id", e.target.value)}
          style={{
            width: "100%", boxSizing: "border-box",
            background: "var(--color-bg-input)", border: "1.5px solid var(--color-border)",
            borderRadius: "var(--radius-sm)", padding: "10px 12px",
            color: "var(--color-text)", fontSize: 13, fontFamily: "var(--font-family)", outline: "none",
          }}
        />
        <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 4 }}>
          Enter your UPI ID or scan QR code at payment step
        </div>
      </div>
    </div>
  );
}

// ── Card Form ───────────────────────────────────────────────
function CardForm({ data, onChange }) {
  const [showCvv, setShowCvv] = useState(false);

  const formatCardNumber = (val) => {
    return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  };
  const formatExpiry = (val) => {
    const cleaned = val.replace(/\D/g, "").slice(0, 4);
    if (cleaned.length >= 3) return cleaned.slice(0,2) + "/" + cleaned.slice(2);
    return cleaned;
  };

  return (
    <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Card Number */}
      <div>
        <label style={labelStyle}>Card Number *</label>
        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="1234  5678  9012  3456"
            value={data.card_number || ""}
            onChange={e => onChange("card_number", formatCardNumber(e.target.value))}
            maxLength={19}
            style={{ ...inputStyle, paddingRight: 48 }}
          />
          <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 18 }}>💳</span>
        </div>
      </div>

      {/* Card Holder */}
      <div>
        <label style={labelStyle}>Card Holder Name *</label>
        <input
          type="text"
          placeholder="Name as on card"
          value={data.card_name || ""}
          onChange={e => onChange("card_name", e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Expiry + CVV */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={labelStyle}>Expiry Date *</label>
          <input
            type="text"
            placeholder="MM/YY"
            value={data.expiry || ""}
            onChange={e => onChange("expiry", formatExpiry(e.target.value))}
            maxLength={5}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>CVV *</label>
          <div style={{ position: "relative" }}>
            <input
              type={showCvv ? "text" : "password"}
              placeholder="•••"
              value={data.cvv || ""}
              onChange={e => onChange("cvv", e.target.value.replace(/\D/g,"").slice(0,4))}
              maxLength={4}
              style={{ ...inputStyle, paddingRight: 44 }}
            />
            <button type="button" onClick={() => setShowCvv(v => !v)}
              style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--color-text-muted)", cursor: "pointer", fontSize: 13 }}>
              {showCvv ? "Hide" : "Show"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ fontSize: 11, color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
        🔒 Your card details are encrypted and secure
      </div>
    </div>
  );
}

// ── Net Banking Form ─────────────────────────────────────────
function NetBankingForm({ data, onChange }) {
  return (
    <div style={{ marginTop: 16 }}>
      <label style={labelStyle}>Select Your Bank *</label>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 6, marginTop: 8 }}>
        {BANKS.map(bank => (
          <button key={bank} type="button"
            onClick={() => onChange("bank", bank)}
            style={{
              padding: "10px 12px", borderRadius: 8, border: "1.5px solid",
              borderColor: data.bank === bank ? "var(--color-primary)" : "var(--color-border)",
              background: data.bank === bank ? "rgba(26,159,224,0.10)" : "var(--color-bg-secondary)",
              color: data.bank === bank ? "var(--color-primary)" : "var(--color-text-secondary)",
              cursor: "pointer", textAlign: "left", fontSize: 12,
              fontWeight: data.bank === bank ? 600 : 400,
              fontFamily: "var(--font-family)",
              display: "flex", alignItems: "center", gap: 8,
            }}>
            <span>{data.bank === bank ? "🔵" : "⚪"}</span>
            {bank}
          </button>
        ))}
      </div>
      {data.bank && (
        <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: "rgba(26,159,224,0.06)", border: "1px solid rgba(26,159,224,0.15)", fontSize: 12, color: "var(--color-text-secondary)" }}>
          ℹ️ You will be redirected to {data.bank}'s secure portal to complete payment.
        </div>
      )}
    </div>
  );
}

// ── Wallet Balance ───────────────────────────────────────────
function WalletInfo({ total }) {
  const balance = 8500;
  const sufficient = balance >= total;
  return (
    <div style={{ marginTop: 16, padding: "14px 16px", borderRadius: 8, background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Wallet Balance</span>
        <span style={{ fontSize: 15, fontWeight: 700, color: "var(--color-success)" }}>₹{balance.toLocaleString("en-IN")}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Amount to Pay</span>
        <span style={{ fontSize: 15, fontWeight: 700, color: "var(--color-text)" }}>₹{total.toLocaleString("en-IN")}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Balance After</span>
        <span style={{ fontSize: 15, fontWeight: 700, color: sufficient ? "var(--color-primary)" : "var(--color-danger)" }}>
          {sufficient ? `₹${(balance - total).toLocaleString("en-IN")}` : "Insufficient Balance"}
        </span>
      </div>
      {!sufficient && (
        <div style={{ marginTop: 10, fontSize: 12, color: "var(--color-danger)", padding: "8px 12px", background: "rgba(255,83,112,0.08)", borderRadius: 6 }}>
          ⚠ Your wallet balance is low. Please add funds or choose another payment method.
        </div>
      )}
    </div>
  );
}

const labelStyle = { fontSize: 12, color: "var(--color-text-secondary)", fontWeight: 500, display: "block", marginBottom: 6 };
const inputStyle = {
  width: "100%", boxSizing: "border-box",
  background: "var(--color-bg-input)", border: "1.5px solid var(--color-border)",
  borderRadius: "var(--radius-sm)", padding: "10px 12px",
  color: "var(--color-text)", fontSize: 13, fontFamily: "var(--font-family)", outline: "none",
};

// ── Main Component ───────────────────────────────────────────
export default function CheckoutSummary({ freelancer, plan, onConfirm, onBack }) {
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [paymentData, setPaymentData]     = useState({});
  const [loading, setLoading]             = useState(false);
  const [agreed, setAgreed]               = useState(false);
  const [error, setError]                 = useState("");

  const gst   = Math.round(plan.price * 0.18);
  const total  = plan.price + gst;

  const handlePaymentChange = (field, value) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  const validatePayment = () => {
    if (paymentMethod === "upi" && !paymentData.upi_id?.trim()) {
      return "Please enter your UPI ID.";
    }
    if (paymentMethod === "card") {
      if (!paymentData.card_number || paymentData.card_number.replace(/\s/g,"").length < 16) return "Enter a valid 16-digit card number.";
      if (!paymentData.card_name?.trim()) return "Enter the card holder name.";
      if (!paymentData.expiry || paymentData.expiry.length < 5) return "Enter a valid expiry date (MM/YY).";
      if (!paymentData.cvv || paymentData.cvv.length < 3) return "Enter a valid CVV.";
    }
    if (paymentMethod === "netbanking" && !paymentData.bank) {
      return "Please select your bank.";
    }
    return "";
  };

  const handleConfirm = () => {
    const payErr = validatePayment();
    if (payErr) { setError(payErr); return; }
    if (!agreed) { setError("Please agree to the terms before subscribing."); return; }
    setError("");
    setLoading(true);
    setTimeout(() => { setLoading(false); onConfirm(); }, 1800);
  };

  return (
    <div className="co-wrap">
      <div className="co-grid">

        {/* Left: Payment Method + Detail Form */}
        <div className="co-left">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Choose Payment Method</h3>
            </div>
            <div className="card-body">
              <div className="co-methods">
                {PAYMENT_METHODS.map((m) => (
                  <button key={m.id} type="button"
                    className={`co-method-btn ${paymentMethod === m.id ? "co-method-active" : ""}`}
                    onClick={() => { setPaymentMethod(m.id); setError(""); setPaymentData({}); }}
                  >
                    <span className="co-method-icon">{m.icon}</span>
                    <div className="co-method-info">
                      <span className="co-method-label">{m.label}</span>
                      <span className="co-method-sub">{m.sub}</span>
                    </div>
                    <div className={`co-method-radio ${paymentMethod === m.id ? "co-radio-active" : ""}`} />
                  </button>
                ))}
              </div>

              {/* ── Inline Detail Forms ── */}
              <div style={{ marginTop: 4 }}>
                {paymentMethod === "wallet"     && <WalletInfo total={total} />}
                {paymentMethod === "upi"        && <UpiForm data={paymentData} onChange={handlePaymentChange} />}
                {paymentMethod === "card"       && <CardForm data={paymentData} onChange={handlePaymentChange} />}
                {paymentMethod === "netbanking" && <NetBankingForm data={paymentData} onChange={handlePaymentChange} />}
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="co-terms">
            <label className="co-terms-label">
              <input type="checkbox" checked={agreed}
                onChange={(e) => { setAgreed(e.target.checked); setError(""); }}
                className="co-checkbox"
              />
              <span>
                I agree to the{" "}
                <a href="#" className="co-link">Terms of Service</a> and{" "}
                <a href="#" className="co-link">Subscription Policy</a>. My subscription will renew automatically each month.
              </span>
            </label>
            {error && <p className="input-error" style={{ marginTop: "8px" }}>⚠ {error}</p>}
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="co-right">
          <div className="card card-accent-blue co-summary-card">
            <div className="card-header">
              <h3 className="card-title">Order Summary</h3>
            </div>
            <div className="card-body">
              <div className="co-summary-fl">
                <div className="co-summary-avatar">
                  {freelancer.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                </div>
                <div>
                  <p className="co-summary-fl-name">{freelancer.name}</p>
                  <p className="co-summary-fl-title">{freelancer.title}</p>
                </div>
              </div>

              <div className="co-divider" />

              <div className="co-summary-plan">
                <span className="badge badge-blue">{plan.plan_name} Plan</span>
                <div className="co-plan-stats">
                  <span>📅 {plan.delivery_days} day delivery</span>
                  <span>📋 {plan.requests} requests/month</span>
                  <span>🔄 {plan.revisions} revisions</span>
                </div>
              </div>

              <div className="co-divider" />

              <div className="co-price-rows">
                <div className="co-price-row">
                  <span>Subscription ({plan.billing_cycle})</span>
                  <span>₹{plan.price.toLocaleString("en-IN")}</span>
                </div>
                <div className="co-price-row">
                  <span>GST (18%)</span>
                  <span>₹{gst.toLocaleString("en-IN")}</span>
                </div>
                <div className="co-divider" />
                <div className="co-price-row co-price-total">
                  <span>Total Due Today</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Selected method summary */}
              <div style={{ marginTop: 12, padding: "8px 12px", borderRadius: 6, background: "var(--color-bg-secondary)", fontSize: 12, color: "var(--color-text-secondary)", display: "flex", alignItems: "center", gap: 6 }}>
                <span>{PAYMENT_METHODS.find(m => m.id === paymentMethod)?.icon}</span>
                Paying via {PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label}
              </div>

              <p className="co-renews-note">
                🔁 Renews on{" "}
                {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </p>

              <button className="btn btn-primary btn-lg co-confirm-btn" onClick={handleConfirm} disabled={loading}>
                {loading ? (
                  <><span className="spinner" /> Processing...</>
                ) : (
                  <>
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                    Subscribe Now — ₹{total.toLocaleString("en-IN")}
                  </>
                )}
              </button>

              <button className="btn btn-secondary co-back-btn" onClick={onBack} disabled={loading}>
                ← Change Plan
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
