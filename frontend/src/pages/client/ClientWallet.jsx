// ============================================================
// SkillAsAService — ClientWallet.jsx  (Day 7 — Lohith)
// Route: /client/wallet  |  Portal: Client
// Shows wallet balance, spending stats, add funds, tx history
// ============================================================

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { CLIENT_NAV } from "../../constants/navItems";
import "../../styles/wallet.css";

// ── Mock data ── replace with API calls ──────────────────────
const WALLET = {
  available:  12400.00,
  totalAdded:  45000.00,
  totalSpent:  32600.00,
  thisMonth:    9999.00,
};

const TRANSACTIONS = [
  { id: 1,  type: "debit",  description: "Subscription — Arjun Sharma (Standard Plan) renewal",  amount: 9999,  date: "18 Jun 2026", status: "completed", ref: "TXN-002341" },
  { id: 2,  type: "credit", description: "Wallet top-up via Razorpay",                            amount: 10000, date: "15 Jun 2026", status: "completed", ref: "TXN-002328" },
  { id: 3,  type: "debit",  description: "Subscription — Divya Nair (Premium Plan)",              amount: 19999, date: "12 Jun 2026", status: "completed", ref: "TXN-002311" },
  { id: 4,  type: "credit", description: "Wallet top-up via UPI",                                 amount: 20000, date: "10 Jun 2026", status: "completed", ref: "TXN-002298" },
  { id: 5,  type: "debit",  description: "Subscription — Sneha Mehta (Basic Plan) renewal",       amount: 4999,  date: "09 Jun 2026", status: "completed", ref: "TXN-002285" },
  { id: 6,  type: "credit", description: "Refund — cancelled subscription",                       amount: 4999,  date: "07 Jun 2026", status: "completed", ref: "TXN-002271" },
  { id: 7,  type: "debit",  description: "Subscription — Arjun Sharma (Standard Plan)",           amount: 9999,  date: "05 Jun 2026", status: "pending",   ref: "TXN-002264" },
  { id: 8,  type: "credit", description: "Wallet top-up via HDFC Net Banking",                    amount: 15000, date: "03 Jun 2026", status: "completed", ref: "TXN-002251" },
];

const STAT_CARDS = [
  { label: "Total Added",    value: WALLET.totalAdded,  color: "var(--color-success)",  icon: "↑" },
  { label: "Total Spent",    value: WALLET.totalSpent,  color: "var(--color-danger)",    icon: "↓" },
  { label: "This Month",     value: WALLET.thisMonth,   color: "var(--color-highlight)", icon: "📅" },
];

const fmt = (n) => "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2 });

const StatusBadge = ({ status }) => (
  <span className={`wl-badge wl-badge-${status}`}>
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

const TxIcon = ({ type }) => (
  <div className={`wl-tx-icon wl-tx-icon-${type}`}>
    {type === "credit" ? (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
      </svg>
    ) : (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
      </svg>
    )}
  </div>
);

export default function ClientWallet() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const filtered = TRANSACTIONS.filter((tx) => {
    if (filter === "credits")  return tx.type === "credit";
    if (filter === "debits")   return tx.type === "debit";
    if (filter === "pending")  return tx.status === "pending";
    return true;
  });

  return (
    <DashboardLayout
      navItems={CLIENT_NAV}
      portalName="Client Portal"
      pageTitle="Wallet"
      pageSubtitle="Manage your balance and payment history"
    >
      <div className="wl-page">

        {/* ── Top row: balance hero + stat cards ── */}
        <div className="wl-top-row">

          {/* Balance hero card */}
          <div className="wl-balance-card wl-balance-card-client">
            <div className="wl-balance-label">Wallet Balance</div>
            <div className="wl-balance-amount">{fmt(WALLET.available)}</div>
            <div className="wl-balance-sub">
              <span className="wl-balance-hint">
                Use your balance to pay for subscriptions
              </span>
            </div>
            <div className="wl-balance-actions">
              <button className="wl-btn wl-btn-primary"
                onClick={() => navigate("/client/wallet/deposit")}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add Funds
              </button>
            </div>
          </div>

          {/* Stat cards */}
          <div className="wl-stats-grid wl-stats-grid-3">
            {STAT_CARDS.map((s) => (
              <div key={s.label} className="wl-stat-card">
                <div className="wl-stat-icon" style={{ color: s.color }}>{s.icon}</div>
                <div className="wl-stat-value" style={{ color: s.color }}>
                  {fmt(s.value)}
                </div>
                <div className="wl-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Transaction history ── */}
        <div className="wl-tx-section">
          <div className="wl-tx-header">
            <h3 className="wl-tx-title">Transaction History</h3>
            <div className="wl-filter-tabs">
              {["all", "credits", "debits", "pending"].map((f) => (
                <button key={f}
                  className={`wl-filter-tab${filter === f ? " wl-filter-tab-active" : ""}`}
                  onClick={() => setFilter(f)}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="wl-tx-table-wrap">
            <table className="wl-tx-table">
              <thead>
                <tr>
                  <th>Transaction</th>
                  <th>Reference</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="wl-tx-empty">
                      No transactions found for this filter.
                    </td>
                  </tr>
                ) : (
                  filtered.map((tx) => (
                    <tr key={tx.id} className="wl-tx-row">
                      <td>
                        <div className="wl-tx-desc-cell">
                          <TxIcon type={tx.type} />
                          <span className="wl-tx-desc">{tx.description}</span>
                        </div>
                      </td>
                      <td className="wl-tx-ref">{tx.ref}</td>
                      <td className="wl-tx-date">{tx.date}</td>
                      <td className={`wl-tx-amount wl-tx-amount-${tx.type}`}>
                        {tx.type === "credit" ? "+" : "−"}{fmt(tx.amount)}
                      </td>
                      <td><StatusBadge status={tx.status} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}