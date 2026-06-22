// ============================================================
// SkillAsAService — WithdrawalRequest.jsx  (Day 7 — Lohith)
// Route: /withdrawals  |  Portal: Freelancer only
// Submit a payout request → goes to Admin for approval
// ============================================================

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { FREELANCER_NAV } from "../../constants/navItems";
import "../../styles/wallet-forms.css";

const AVAILABLE_BALANCE = 24850.00;

const PAYOUT_METHODS = [
  {
    id: "bank",
    label: "Bank Transfer (IMPS/NEFT)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <line x1="2" y1="10" x2="22" y2="10"/>
      </svg>
    ),
    desc: "1–3 business days · Free",
  },
  {
    id: "upi",
    label: "UPI Transfer",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2"/>
        <line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
    desc: "Instant · Free",
  },
  {
    id: "paypal",
    label: "PayPal",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M8 12h8M12 8v8"/>
      </svg>
    ),
    desc: "1–2 business days · Fee may apply",
  },
  {
    id: "wise",
    label: "Wise (formerly TransferWise)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9"/>
      </svg>
    ),
    desc: "1–2 business days · Low fees",
  },
];

const fmt = (n) => "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });

const Field = ({ label, required, error, hint, children }) => (
  <div className="wf-field">
    <label className="wf-label">
      {label}
      {required && <span className="wf-req"> *</span>}
      {hint && <span className="wf-hint"> — {hint}</span>}
    </label>
    {children}
    {error && <span className="wf-error">⚠ {error}</span>}
  </div>
);

export default function WithdrawalRequest() {
  const navigate = useNavigate();

  const [step,      setStep]      = useState("form"); // "form" | "success"
  const [amount,    setAmount]    = useState("");
  const [method,    setMethod]    = useState("bank");
  const [note,      setNote]      = useState("");
  const [loading,   setLoading]   = useState(false);
  const [errors,    setErrors]    = useState({});
  const [ref,       setRef]       = useState("");

  // Bank fields
  const [bank, setBank] = useState({ accountNumber: "", confirmAccount: "", ifsc: "", holderName: "", bankName: "" });
  const setBankF = (k, v) => { setBank(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, ["bank_" + k]: "" })); };

  // UPI
  const [upiId, setUpiId] = useState("");
  // PayPal
  const [paypalEmail, setPaypalEmail] = useState("");
  // Wise
  const [wiseEmail, setWiseEmail] = useState("");

  const numAmt = Math.min(parseFloat(amount) || 0, AVAILABLE_BALANCE);

  const validate = () => {
    const e = {};
    if (!numAmt || numAmt < 500)             e.amount = "Minimum withdrawal is ₹500.";
    if (numAmt > AVAILABLE_BALANCE)          e.amount = `Cannot exceed available balance of ${fmt(AVAILABLE_BALANCE)}.`;

    if (method === "bank") {
      if (!bank.accountNumber.trim())          e.bank_accountNumber  = "Account number is required.";
      if (bank.accountNumber !== bank.confirmAccount) e.bank_confirmAccount = "Account numbers do not match.";
      if (!bank.ifsc.trim())                   e.bank_ifsc           = "IFSC code is required.";
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bank.ifsc.toUpperCase())) e.bank_ifsc = "Enter valid IFSC (e.g. HDFC0001234).";
      if (!bank.holderName.trim())             e.bank_holderName     = "Account holder name is required.";
      if (!bank.bankName.trim())               e.bank_bankName       = "Bank name is required.";
    }
    if (method === "upi" && !/^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/.test(upiId))
      e.upiId = "Enter a valid UPI ID (e.g. name@upi).";
    if (method === "paypal" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paypalEmail))
      e.paypalEmail = "Enter a valid PayPal email address.";
    if (method === "wise" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(wiseEmail))
      e.wiseEmail = "Enter a valid Wise email address.";

    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRef("WDR-" + Date.now().toString().slice(-8));
      setStep("success");
    }, 2000);
  };

  const methodLabel = PAYOUT_METHODS.find(m => m.id === method)?.label || "";

  // ── Success screen ──
  if (step === "success") {
    return (
      <DashboardLayout navItems={FREELANCER_NAV} portalName="Freelancer Portal"
        pageTitle="Request Submitted" pageSubtitle="Your withdrawal is under review">
        <div className="wf-success-wrap">
          <div className="wf-success-card">
            <div className="wf-success-icon wf-success-icon-pending">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                stroke="var(--color-highlight)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <h2 className="wf-success-title">Withdrawal Request Submitted!</h2>
            <p className="wf-success-sub">
              Your request for <strong>{fmt(numAmt)}</strong> has been submitted and is awaiting admin approval.
              You will be notified via email once it's processed (typically 1–3 business days).
            </p>
            <div className="wf-success-details">
              {[
                ["Reference No.",  ref],
                ["Amount",         fmt(numAmt)],
                ["Payout Method",  methodLabel],
                ["Status",         "Pending Admin Review"],
                ["Submitted At",   new Date().toLocaleString("en-IN")],
              ].map(([l, v]) => (
                <div key={l} className="wf-success-row">
                  <span className="wf-success-label">{l}</span>
                  <span className="wf-success-val" style={v === "Pending Admin Review" ? { color: "var(--color-highlight)" } : {}}>
                    {v}
                  </span>
                </div>
              ))}
            </div>
            <div className="wf-admin-note">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              Your request will be reviewed by our admin team. The funds will be transferred to your selected payout method upon approval.
            </div>
            <div className="wf-success-actions">
              <button className="wf-btn wf-btn-primary" onClick={() => navigate("/wallet")}>
                Back to Wallet
              </button>
              <button className="wf-btn wf-btn-ghost" onClick={() => navigate("/withdrawals")}>
                View All Requests
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ── Form ──
  return (
    <DashboardLayout navItems={FREELANCER_NAV} portalName="Freelancer Portal"
      pageTitle="Withdraw Funds" pageSubtitle="Request a payout to your preferred method">
      <form className="wf-page" onSubmit={handleSubmit} noValidate>
        <div className="wf-layout">

          {/* ── LEFT ── */}
          <div className="wf-left">

            {/* Balance info bar */}
            <div className="wf-balance-bar">
              <div>
                <div className="wf-balance-bar-label">Available for withdrawal</div>
                <div className="wf-balance-bar-amount">{fmt(AVAILABLE_BALANCE)}</div>
              </div>
              <button type="button" className="wf-withdraw-all-btn"
                onClick={() => { setAmount(String(AVAILABLE_BALANCE)); setErrors(p => ({ ...p, amount: "" })); }}>
                Withdraw all
              </button>
            </div>

            {/* Step 1: Amount */}
            <div className="wf-section">
              <h3 className="wf-section-title">
                <span className="wf-step-num">1</span> Withdrawal Amount
              </h3>
              <div className="wf-amount-wrap">
                <span className="wf-amount-sym">₹</span>
                <input
                  className={`wf-amount-input${errors.amount ? " wf-input-error" : ""}`}
                  type="number" min="500" max={AVAILABLE_BALANCE}
                  placeholder="0.00"
                  value={amount}
                  onChange={e => {
                    const raw = e.target.value;
                    if (raw === "" || raw === "-") { setAmount(""); setErrors(p => ({ ...p, amount: "" })); return; }
                    const num = parseFloat(raw);
                    if (isNaN(num)) return;
                    const clamped = Math.min(num, AVAILABLE_BALANCE);
                    setAmount(String(clamped));
                    setErrors(p => ({ ...p, amount: "" }));
                  }}
                />
              </div>
              {errors.amount && <span className="wf-error">⚠ {errors.amount}</span>}
              <p className="wf-hint">Min ₹500 · Max {fmt(AVAILABLE_BALANCE)} (your available balance)</p>
            </div>

            {/* Step 2: Payout method */}
            <div className="wf-section">
              <h3 className="wf-section-title">
                <span className="wf-step-num">2</span> Payout Method
              </h3>

              <div className="wf-method-list">
                {PAYOUT_METHODS.map(m => (
                  <div key={m.id} className={`wf-method-option${method === m.id ? " wf-method-active" : ""}`}>
                    <label className="wf-method-row" onClick={() => { setMethod(m.id); setErrors({}); }}>
                      <div className={`wf-radio-dot${method === m.id ? " wf-radio-active" : ""}`} />
                      <span className="wf-method-icon">{m.icon}</span>
                      <div className="wf-method-info">
                        <span className="wf-method-label">{m.label}</span>
                        <span className="wf-method-desc">{m.desc}</span>
                      </div>
                    </label>

                    {/* Expanded fields */}
                    {method === m.id && (
                      <div className="wf-method-body">

                        {/* Bank Transfer */}
                        {m.id === "bank" && (
                          <>
                            <div className="wf-grid-2">
                              <Field label="Account Number" required error={errors.bank_accountNumber}>
                                <input className={`wf-input${errors.bank_accountNumber ? " wf-input-error" : ""}`}
                                  placeholder="Enter account number"
                                  value={bank.accountNumber} maxLength={18}
                                  onChange={e => setBankF("accountNumber", e.target.value.replace(/\D/g, "").slice(0, 18))} />
                              </Field>
                              <Field label="Confirm Account Number" required error={errors.bank_confirmAccount}>
                                <input className={`wf-input${errors.bank_confirmAccount ? " wf-input-error" : ""}`}
                                  placeholder="Re-enter account number"
                                  value={bank.confirmAccount} maxLength={18}
                                  onChange={e => setBankF("confirmAccount", e.target.value.replace(/\D/g, "").slice(0, 18))} />
                              </Field>
                            </div>
                            <div className="wf-grid-2">
                              <Field label="IFSC Code" required error={errors.bank_ifsc}>
                                <input className={`wf-input${errors.bank_ifsc ? " wf-input-error" : ""}`}
                                  placeholder="e.g. HDFC0001234"
                                  value={bank.ifsc} maxLength={11}
                                  style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
                                  onChange={e => setBankF("ifsc", e.target.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 11))} />
                              </Field>
                              <Field label="Bank Name" required error={errors.bank_bankName}>
                                <input className={`wf-input${errors.bank_bankName ? " wf-input-error" : ""}`}
                                  placeholder="e.g. HDFC Bank"
                                  value={bank.bankName} maxLength={60}
                                  onChange={e => setBankF("bankName", e.target.value.slice(0, 60))} />
                              </Field>
                            </div>
                            <Field label="Account Holder Name" required error={errors.bank_holderName}
                              hint="must match your bank records">
                              <input className={`wf-input${errors.bank_holderName ? " wf-input-error" : ""}`}
                                placeholder="Full name as in bank account"
                                value={bank.holderName} maxLength={80}
                                onChange={e => setBankF("holderName", e.target.value.replace(/[^a-zA-Z\s.'-]/g, "").slice(0, 80))} />
                            </Field>
                            <div className="wf-method-note">
                              ⏱ Bank transfers take 1–3 business days after admin approval.
                            </div>
                          </>
                        )}

                        {/* UPI */}
                        {m.id === "upi" && (
                          <>
                            <Field label="UPI ID" required error={errors.upiId}>
                              <input className={`wf-input${errors.upiId ? " wf-input-error" : ""}`}
                                placeholder="yourname@okaxis"
                                value={upiId} maxLength={50}
                                onChange={e => { setUpiId(e.target.value.slice(0, 50)); setErrors(p => ({ ...p, upiId: "" })); }} />
                            </Field>
                            <div className="wf-method-note">
                              ⚡ UPI transfers are instant after admin approval.
                            </div>
                          </>
                        )}

                        {/* PayPal */}
                        {m.id === "paypal" && (
                          <>
                            <Field label="PayPal Email Address" required error={errors.paypalEmail}>
                              <input className={`wf-input${errors.paypalEmail ? " wf-input-error" : ""}`}
                                type="email" placeholder="your@paypal.com"
                                value={paypalEmail} maxLength={100}
                                onChange={e => { setPaypalEmail(e.target.value.slice(0, 100)); setErrors(p => ({ ...p, paypalEmail: "" })); }} />
                            </Field>
                            <div className="wf-method-note">
                              ℹ️ PayPal fees and currency conversion rates may apply. Transfers take 1–2 business days.
                            </div>
                          </>
                        )}

                        {/* Wise */}
                        {m.id === "wise" && (
                          <>
                            <Field label="Wise Email Address" required error={errors.wiseEmail}>
                              <input className={`wf-input${errors.wiseEmail ? " wf-input-error" : ""}`}
                                type="email" placeholder="your@wise.com"
                                value={wiseEmail} maxLength={100}
                                onChange={e => { setWiseEmail(e.target.value.slice(0, 100)); setErrors(p => ({ ...p, wiseEmail: "" })); }} />
                            </Field>
                            <div className="wf-method-note">
                              🌍 Wise offers competitive exchange rates for international transfers. Takes 1–2 business days.
                            </div>
                          </>
                        )}

                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3: Note */}
            <div className="wf-section">
              <h3 className="wf-section-title">
                <span className="wf-step-num">3</span> Remarks <span className="wf-optional">(optional)</span>
              </h3>
              <textarea className="wf-textarea" rows={3}
                placeholder="Any notes for the admin regarding this withdrawal request…"
                value={note} maxLength={500}
                onChange={e => setNote(e.target.value.slice(0, 500))} />
            </div>

          </div>

          {/* ── RIGHT: summary ── */}
          <div className="wf-right">
            <div className="wf-summary">
              <h3 className="wf-summary-title">Withdrawal Summary</h3>

              <div className="wf-summary-amount">
                <span className="wf-summary-amount-label">You will receive</span>
                <span className="wf-summary-amount-val">
                  {numAmt > 0 ? fmt(numAmt) : "—"}
                </span>
              </div>

              <div className="wf-divider" />

              <div className="wf-summary-rows">
                <div className="wf-summary-row">
                  <span>Withdrawal amount</span>
                  <span>{numAmt > 0 ? fmt(numAmt) : "—"}</span>
                </div>
                <div className="wf-summary-row">
                  <span>Platform fee</span>
                  <span className="wf-free">Free</span>
                </div>
                <div className="wf-summary-row">
                  <span>Available after</span>
                  <span>{numAmt > 0 ? fmt(AVAILABLE_BALANCE - numAmt) : fmt(AVAILABLE_BALANCE)}</span>
                </div>
                <div className="wf-summary-row wf-summary-row-total">
                  <span>You receive</span>
                  <span>{numAmt > 0 ? fmt(numAmt) : "—"}</span>
                </div>
              </div>

              <div className="wf-divider" />

              {/* Admin approval notice */}
              <div className="wf-approval-note">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="var(--color-highlight)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>Requires admin approval. Processing time: 1–3 business days after approval.</span>
              </div>

              <button type="submit" className="wf-submit-btn wf-submit-btn-withdraw"
                disabled={loading || !numAmt}>
                {loading ? (
                  <><span className="wf-spinner" /> Submitting…</>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                    {numAmt > 0 ? `Request ${fmt(numAmt)}` : "Submit Request"}
                  </>
                )}
              </button>

              <div className="wf-trust">
                <span>🔒 Secure & encrypted</span>
                <span>✅ Admin reviewed</span>
                <span>📧 Email confirmation sent</span>
              </div>
            </div>
          </div>

        </div>
      </form>
    </DashboardLayout>
  );
}