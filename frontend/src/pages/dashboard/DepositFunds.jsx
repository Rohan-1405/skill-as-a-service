// ============================================================
// SkillAsAService — DepositFunds.jsx  (Day 7 — Lohith)
// Route: /wallet/deposit        (Freelancer)
//        /client/wallet/deposit (Client)
// Add funds to wallet via payment method
// ============================================================

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Visa, Mastercard, Amex, Googlepay } from "react-pay-icons";
import DashboardLayout from "../../layouts/DashboardLayout";
import { FREELANCER_NAV, CLIENT_NAV } from "../../constants/navItems";
import "../../styles/wallet-forms.css";

// ── Inline SVG logos for India-specific payment methods ──
const UpiLogo = ({ height = 18 }) => (
  <svg height={height} viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg" aria-label="UPI">
    <rect width="200" height="80" rx="6" fill="#fff"/>
    <text x="10" y="62" fontFamily="Arial Black,Arial" fontWeight="900" fontSize="58" fill="#6B3FA0">U</text>
    <text x="70" y="62" fontFamily="Arial Black,Arial" fontWeight="900" fontSize="58" fill="#F37121">P</text>
    <text x="132" y="62" fontFamily="Arial Black,Arial" fontWeight="900" fontSize="58" fill="#00A651">I</text>
    <text x="158" y="30" fontFamily="Arial" fontSize="16" fill="#888">®</text>
  </svg>
);
const PhonePeLogo = ({ height = 18 }) => (
  <svg height={height} viewBox="0 0 240 80" xmlns="http://www.w3.org/2000/svg" aria-label="PhonePe">
    <rect width="240" height="80" rx="6" fill="#5F259F"/>
    <text x="12" y="58" fontFamily="Arial Black,Arial" fontWeight="900" fontSize="44" fill="#fff">Phone</text>
    <text x="162" y="58" fontFamily="Arial Black,Arial" fontWeight="900" fontSize="44" fill="#04C5C1">Pe</text>
  </svg>
);
const PaytmLogo = ({ height = 18 }) => (
  <svg height={height} viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg" aria-label="Paytm">
    <rect width="200" height="80" rx="6" fill="#fff"/>
    <text x="8" y="58" fontFamily="Arial Black,Arial" fontWeight="900" fontSize="48" fill="#00B9F1">Pay</text>
    <text x="104" y="58" fontFamily="Arial Black,Arial" fontWeight="900" fontSize="48" fill="#21297A">tm</text>
  </svg>
);
const BhimLogo = ({ height = 18 }) => (
  <svg height={height} viewBox="0 0 160 80" xmlns="http://www.w3.org/2000/svg" aria-label="BHIM">
    <rect width="160" height="80" rx="6" fill="#fff"/>
    <text x="8" y="58" fontFamily="Arial Black,Arial" fontWeight="900" fontSize="48" fill="#FF6600">BH</text>
    <text x="88" y="58" fontFamily="Arial Black,Arial" fontWeight="900" fontSize="48" fill="#00A859">IM</text>
  </svg>
);
const RuPayLogo = ({ height = 18 }) => (
  <svg height={height} viewBox="0 0 220 80" xmlns="http://www.w3.org/2000/svg" aria-label="RuPay">
    <rect width="220" height="80" rx="6" fill="#fff"/>
    <text x="8" y="60" fontFamily="Arial Black,Arial" fontWeight="900" fontSize="52" fill="#E31837">Ru</text>
    <text x="108" y="60" fontFamily="Arial Black,Arial" fontWeight="900" fontSize="52" fill="#003087">Pay</text>
  </svg>
);

const PRESET_AMOUNTS = [500, 1000, 2000, 5000];
const BANKS = [
  "State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank",
  "Kotak Mahindra Bank", "Punjab National Bank", "Bank of Baroda", "Yes Bank",
];

const fmtCard = (v) =>
  v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

const fmt = (n) => "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });

export default function DepositFunds() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const isClient  = location.pathname.startsWith("/client");

  const navItems   = isClient ? CLIENT_NAV   : FREELANCER_NAV;
  const portalName = isClient ? "Client Portal" : "Freelancer Portal";
  const backRoute  = isClient ? "/client/wallet" : "/wallet";

  const [step,      setStep]      = useState("form"); // "form" | "success"
  const [amount,    setAmount]    = useState("");
  const [custom,    setCustom]    = useState(false);
  const [payMethod, setPayMethod] = useState("card");
  const [loading,   setLoading]   = useState(false);
  const [errors,    setErrors]    = useState({});
  const [ref,       setRef]       = useState("");

  // Card fields
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const setCardF = (k, v) => { setCard(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, ["card_" + k]: "" })); };

  // UPI
  const [upiId, setUpiId] = useState("");
  // Net banking
  const [bank, setBank]   = useState("");

  const numAmt = parseFloat(amount) || 0;

  const validate = () => {
    const e = {};
    if (!numAmt || numAmt < 100)   e.amount = "Minimum deposit is ₹100.";
    if (numAmt > 100000)           e.amount = "Maximum single deposit is ₹1,00,000.";
    if (payMethod === "card") {
      if (card.number.replace(/\s/g, "").length !== 16) e.card_number = "Enter valid 16-digit card number.";
      if (!/^\d{2}\/\d{2}$/.test(card.expiry))          e.card_expiry = "Enter expiry as MM/YY.";
      if (!/^\d{3,4}$/.test(card.cvv))                  e.card_cvv    = "Enter 3 or 4 digit CVV.";
      if (!card.name.trim())                             e.card_name   = "Cardholder name required.";
    }
    if (payMethod === "upi" && !/^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/.test(upiId))
      e.upiId = "Enter a valid UPI ID (e.g. name@upi).";
    if (payMethod === "netbanking" && !bank) e.bank = "Please select a bank.";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRef("DEP-" + Date.now().toString().slice(-8));
      setStep("success");
    }, 2000);
  };

  // ── Success screen ──
  if (step === "success") {
    return (
      <DashboardLayout navItems={navItems} portalName={portalName}
        pageTitle="Funds Added" pageSubtitle="Your wallet has been topped up">
        <div className="wf-success-wrap">
          <div className="wf-success-card">
            <div className="wf-success-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h2 className="wf-success-title">Funds Added Successfully! 🎉</h2>
            <p className="wf-success-sub">
              <strong>{fmt(numAmt)}</strong> has been added to your wallet. Your new balance will reflect shortly.
            </p>
            <div className="wf-success-details">
              {[
                ["Reference No.", ref],
                ["Amount Added",  fmt(numAmt)],
                ["Payment Via",   payMethod === "card" ? "Credit/Debit Card" : payMethod === "upi" ? "UPI" : payMethod === "netbanking" ? "Net Banking" : "Wallet"],
                ["Date & Time",   new Date().toLocaleString("en-IN")],
              ].map(([l, v]) => (
                <div key={l} className="wf-success-row">
                  <span className="wf-success-label">{l}</span>
                  <span className="wf-success-val">{v}</span>
                </div>
              ))}
            </div>
            <div className="wf-success-actions">
              <button className="wf-btn wf-btn-primary" onClick={() => navigate(backRoute)}>
                Back to Wallet
              </button>
              <button className="wf-btn wf-btn-ghost" onClick={() => { setStep("form"); setAmount(""); setErrors({}); }}>
                Add More Funds
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ── Form ──
  return (
    <DashboardLayout navItems={navItems} portalName={portalName}
      pageTitle="Add Funds" pageSubtitle="Top up your wallet balance">
      <form className="wf-page" onSubmit={handleSubmit} noValidate>
        <div className="wf-layout">

          {/* ── LEFT: form ── */}
          <div className="wf-left">

            {/* Step 1: Amount */}
            <div className="wf-section">
              <h3 className="wf-section-title">
                <span className="wf-step-num">1</span> Enter Amount
              </h3>

              {/* Preset buttons */}
              <div className="wf-preset-row">
                {PRESET_AMOUNTS.map(p => (
                  <button type="button" key={p}
                    className={`wf-preset-btn${amount == p && !custom ? " wf-preset-btn-active" : ""}`}
                    onClick={() => { setAmount(String(p)); setCustom(false); setErrors(p => ({ ...p, amount: "" })); }}>
                    ₹{p.toLocaleString("en-IN")}
                  </button>
                ))}
                <button type="button"
                  className={`wf-preset-btn${custom ? " wf-preset-btn-active" : ""}`}
                  onClick={() => { setCustom(true); setAmount(""); }}>
                  Custom
                </button>
              </div>

              {/* Amount input */}
              <div className="wf-amount-wrap">
                <span className="wf-amount-sym">₹</span>
                <input
                  className={`wf-amount-input${errors.amount ? " wf-input-error" : ""}`}
                  type="number" min="100" max="100000"
                  placeholder="0.00"
                  value={amount}
                  onChange={e => { setAmount(e.target.value); setCustom(true); setErrors(p => ({ ...p, amount: "" })); }}
                />
              </div>
              {errors.amount && <span className="wf-error">⚠ {errors.amount}</span>}
              <p className="wf-hint">Min ₹100 · Max ₹1,00,000 per transaction</p>
            </div>

            {/* Step 2: Payment method */}
            <div className="wf-section">
              <h3 className="wf-section-title">
                <span className="wf-step-num">2</span> Payment Method
              </h3>

              <div className="wf-method-list">

                {/* Card */}
                <div className={`wf-method-option${payMethod === "card" ? " wf-method-active" : ""}`}>
                  <label className="wf-method-row" onClick={() => { setPayMethod("card"); setErrors({}); }}>
                    <div className={`wf-radio-dot${payMethod === "card" ? " wf-radio-active" : ""}`} />
                    <span className="wf-method-label">Credit / Debit Card</span>
                    <div className="wf-method-logos">
                      <Visa style={{ width: 34, height: "auto" }} />
                      <Mastercard style={{ width: 28, height: "auto" }} />
                      <Amex style={{ width: 28, height: "auto" }} />
                      <RuPayLogo height={18} />
                    </div>
                  </label>
                  {payMethod === "card" && (
                    <div className="wf-method-body">
                      <div className="wf-field">
                        <label className="wf-label">Card Number</label>
                        <div className="wf-card-wrap">
                          <svg className="wf-card-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2">
                            <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                          </svg>
                          <input className={`wf-input${errors.card_number ? " wf-input-error" : ""}`}
                            placeholder="1234  5678  9012  3456"
                            value={card.number} maxLength={19}
                            style={{ paddingLeft: 40, paddingRight: 32, fontFamily: "monospace", letterSpacing: "0.08em" }}
                            onChange={e => setCardF("number", fmtCard(e.target.value))} />
                          <svg className="wf-card-lock" width="13" height="13" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                          </svg>
                        </div>
                        {errors.card_number && <span className="wf-error">⚠ {errors.card_number}</span>}
                      </div>
                      <div className="wf-grid-2">
                        <div className="wf-field">
                          <label className="wf-label">Expiry Date</label>
                          <input className={`wf-input${errors.card_expiry ? " wf-input-error" : ""}`}
                            placeholder="MM / YY" maxLength={5} value={card.expiry}
                            onChange={e => {
                              let v = e.target.value.replace(/\D/g, "");
                              if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2, 4);
                              setCardF("expiry", v);
                            }} />
                          {errors.card_expiry && <span className="wf-error">⚠ {errors.card_expiry}</span>}
                        </div>
                        <div className="wf-field">
                          <label className="wf-label">CVV</label>
                          <input className={`wf-input${errors.card_cvv ? " wf-input-error" : ""}`}
                            placeholder="•••" type="password" maxLength={4} value={card.cvv}
                            onChange={e => setCardF("cvv", e.target.value.replace(/\D/g, ""))} />
                          {errors.card_cvv && <span className="wf-error">⚠ {errors.card_cvv}</span>}
                        </div>
                      </div>
                      <div className="wf-field">
                        <label className="wf-label">Cardholder Name</label>
                        <input className={`wf-input${errors.card_name ? " wf-input-error" : ""}`}
                          placeholder="As printed on card" value={card.name}
                          onChange={e => setCardF("name", e.target.value)} />
                        {errors.card_name && <span className="wf-error">⚠ {errors.card_name}</span>}
                      </div>
                      <div className="wf-secure-note">
                        🔒 Your card details are encrypted with 256-bit SSL. We never store your CVV.
                      </div>
                    </div>
                  )}
                </div>

                {/* UPI */}
                <div className={`wf-method-option${payMethod === "upi" ? " wf-method-active" : ""}`}>
                  <label className="wf-method-row" onClick={() => { setPayMethod("upi"); setErrors({}); }}>
                    <div className={`wf-radio-dot${payMethod === "upi" ? " wf-radio-active" : ""}`} />
                    <span className="wf-method-label">UPI</span>
                    <div className="wf-method-logos">
                      <UpiLogo height={18} />
                      <Googlepay style={{ width: 44, height: "auto" }} />
                      <PhonePeLogo height={18} />
                      <PaytmLogo height={18} />
                      <BhimLogo height={18} />
                    </div>
                  </label>
                  {payMethod === "upi" && (
                    <div className="wf-method-body">
                      <div className="wf-field">
                        <label className="wf-label">UPI ID</label>
                        <input className={`wf-input${errors.upiId ? " wf-input-error" : ""}`}
                          placeholder="yourname@okaxis"
                          value={upiId}
                          onChange={e => { setUpiId(e.target.value); setErrors(p => ({ ...p, upiId: "" })); }} />
                        {errors.upiId && <span className="wf-error">⚠ {errors.upiId}</span>}
                      </div>
                      <p className="wf-method-note">
                        After clicking Add Funds, a collect request will be sent to your UPI app. Approve within 10 minutes.
                      </p>
                    </div>
                  )}
                </div>

                {/* Net Banking */}
                <div className={`wf-method-option${payMethod === "netbanking" ? " wf-method-active" : ""}`}>
                  <label className="wf-method-row" onClick={() => { setPayMethod("netbanking"); setErrors({}); }}>
                    <div className={`wf-radio-dot${payMethod === "netbanking" ? " wf-radio-active" : ""}`} />
                    <span className="wf-method-label">Net Banking</span>
                  </label>
                  {payMethod === "netbanking" && (
                    <div className="wf-method-body">
                      <div className="wf-field">
                        <label className="wf-label">Select Bank</label>
                        <select className={`wf-input wf-select${errors.bank ? " wf-input-error" : ""}`}
                          value={bank} onChange={e => { setBank(e.target.value); setErrors(p => ({ ...p, bank: "" })); }}>
                          <option value="">— Choose your bank —</option>
                          {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                        {errors.bank && <span className="wf-error">⚠ {errors.bank}</span>}
                      </div>
                      <p className="wf-method-note">
                        You will be redirected to your bank's secure login page to complete the transaction.
                      </p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* ── RIGHT: summary ── */}
          <div className="wf-right">
            <div className="wf-summary">
              <h3 className="wf-summary-title">Summary</h3>

              <div className="wf-summary-amount">
                <span className="wf-summary-amount-label">Amount to add</span>
                <span className="wf-summary-amount-val">
                  {numAmt > 0 ? fmt(numAmt) : "—"}
                </span>
              </div>

              <div className="wf-divider" />

              <div className="wf-summary-rows">
                <div className="wf-summary-row">
                  <span>Deposit amount</span>
                  <span>{numAmt > 0 ? fmt(numAmt) : "—"}</span>
                </div>
                <div className="wf-summary-row">
                  <span>Transaction fee</span>
                  <span className="wf-free">Free</span>
                </div>
                <div className="wf-summary-row wf-summary-row-total">
                  <span>You pay</span>
                  <span>{numAmt > 0 ? fmt(numAmt) : "—"}</span>
                </div>
              </div>

              <div className="wf-divider" />

              <button type="submit" className="wf-submit-btn" disabled={loading || !numAmt}>
                {loading ? (
                  <><span className="wf-spinner" /> Processing…</>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    {numAmt > 0 ? `Add ${fmt(numAmt)}` : "Add Funds"}
                  </>
                )}
              </button>

              <div className="wf-trust">
                <span>🔒 256-bit SSL encrypted</span>
                <span>🛡️ Powered by Razorpay</span>
                <span>📄 Receipt sent to email</span>
              </div>
            </div>
          </div>

        </div>
      </form>
    </DashboardLayout>
  );
}