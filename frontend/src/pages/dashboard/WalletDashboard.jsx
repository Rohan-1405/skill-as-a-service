// ============================================================
// SkillAsAService — WalletDashboard.jsx  (Day 7 — Lohith)
// Route: /wallet  |  Portal: Freelancer
// Shows earnings balance, stats, quick actions, tx history
// ============================================================

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { FREELANCER_NAV } from "../../constants/navItems";
import "../../styles/wallet.css";

// ── Mock data ── replace with API calls ──────────────────────
const WALLET = {
  available:  24850.00,
  pending:     3200.00,
  totalEarned: 89450.00,
  withdrawn:   61400.00,
  thisMonth:    8250.00,
};

const TRANSACTIONS = [
  { id: 1,  type: "credit",  description: "Subscription payment — Ravi Kumar (Standard Plan)",   amount: 9999,  date: "18 Jun 2026", status: "completed", ref: "TXN-001823" },
  { id: 2,  type: "credit",  description: "Subscription payment — Priya Singh (Basic Plan)",      amount: 4999,  date: "17 Jun 2026", status: "completed", ref: "TXN-001819" },
  { id: 3,  type: "debit",   description: "Withdrawal to HDFC Bank ••4521",                        amount: 15000, date: "16 Jun 2026", status: "completed", ref: "TXN-001812" },
  { id: 4,  type: "credit",  description: "Subscription payment — Karan Mehta (Premium Plan)",    amount: 19999, date: "15 Jun 2026", status: "completed", ref: "TXN-001804" },
  { id: 5,  type: "debit",   description: "Withdrawal to HDFC Bank ••4521",                        amount: 10000, date: "14 Jun 2026", status: "completed", ref: "TXN-001798" },
  { id: 6,  type: "credit",  description: "Subscription payment — Ananya Sharma (Standard Plan)", amount: 9999,  date: "13 Jun 2026", status: "completed", ref: "TXN-001791" },
  { id: 7,  type: "credit",  description: "Subscription payment — Rohan Verma (Basic Plan)",      amount: 4999,  date: "12 Jun 2026", status: "pending",   ref: "TXN-001785" },
  { id: 8,  type: "credit",  description: "Subscription renewal — Ravi Kumar (Standard Plan)",    amount: 9999,  date: "11 Jun 2026", status: "completed", ref: "TXN-001779" },
  { id: 9,  type: "debit",   description: "Platform fee deduction",                                amount: 450,   date: "10 Jun 2026", status: "completed", ref: "TXN-001773" },
  { id: 10, type: "credit",  description: "Subscription payment — Meera Joshi (Premium Plan)",    amount: 19999, date: "09 Jun 2026", status: "completed", ref: "TXN-001766" },
];

const STAT_CARDS = [
  { label: "Total Earned",      value: WALLET.totalEarned, color: "var(--color-success)",  icon: "↑" },
  { label: "Pending Clearance", value: WALLET.pending,     color: "var(--color-highlight)", icon: "⏳" },
  { label: "Total Withdrawn",   value: WALLET.withdrawn,   color: "var(--color-primary)",   icon: "↓" },
  { label: "This Month",        value: WALLET.thisMonth,   color: "var(--brand-cyan)",       icon: "📅" },
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

export default function WalletDashboard() {
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
      navItems={FREELANCER_NAV}
      portalName="Freelancer Portal"
      pageTitle="Wallet"
      pageSubtitle="Manage your earnings and withdrawals"
    >
      <div className="wl-page">

        {/* ── Top row: balance hero + stat cards ── */}
        <div className="wl-top-row">

          {/* Balance hero card */}
          <div className="wl-balance-card">
            <div className="wl-balance-label">Available Balance</div>
            <div className="wl-balance-amount">{fmt(WALLET.available)}</div>
            <div className="wl-balance-sub">
              <span className="wl-pending-pill">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                {fmt(WALLET.pending)} pending clearance
              </span>
            </div>
            <div className="wl-balance-actions">
              <button className="wl-btn wl-btn-primary"
                onClick={() => navigate("/wallet/deposit")}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add Funds
              </button>
              <button className="wl-btn wl-btn-secondary"
                onClick={() => navigate("/withdrawals")}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                Withdraw
              </button>
            </div>
          </div>

          {/* Stat cards */}
          <div className="wl-stats-grid">
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