// ============================================================
// SkillAsAService — WalletPage.jsx
// Author: Praveen Gorla  |  Day 7
//
// Full Wallet Page with:
//   - Balance overview cards
//   - Transaction history table
//   - Deposit & Withdrawal modals (Praveen's Day 7 deliverable)
//   - Toast notifications for success/error
//   - Tab filter for transaction history
//   - Uses project design tokens (variables.css)
// ============================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import DashboardHeader from '../../components/common/DashboardHeader';
import NotificationPanel, { SAMPLE_NOTIFS } from '../../components/common/NotificationPanel';
import DepositModal from '../../components/wallet/DepositModal';
import WithdrawalModal from '../../components/wallet/WithdrawalModal';
import logo from '../../assets/logos/logo.png';

// ── Icon set ────────────────────────────────────────────────
const Icons = {
  Wallet:    () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z"/></svg>,
  ArrowUp:   () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 19V5m-7 7 7-7 7 7"/></svg>,
  ArrowDown: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14m7-7-7 7-7-7"/></svg>,
  Clock:     () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  Filter:    () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
};

// ── Mock Data ────────────────────────────────────────────────
const INITIAL_BALANCE = 12450;

const INITIAL_TRANSACTIONS = [
  { id: 1, type: 'credit',   description: 'Deposit via Razorpay',            amount: 5000,  date: '17 Jun 2026', status: 'Completed', gateway: 'Razorpay' },
  { id: 2, type: 'debit',    description: 'Subscription — Arjun Sharma',     amount: 5999,  date: '16 Jun 2026', status: 'Completed', gateway: '' },
  { id: 3, type: 'credit',   description: 'Deposit via UPI',                  amount: 10000, date: '14 Jun 2026', status: 'Completed', gateway: 'UPI' },
  { id: 4, type: 'debit',    description: 'Withdrawal to Bank Account',       amount: 8000,  date: '12 Jun 2026', status: 'Processing', gateway: '' },
  { id: 5, type: 'credit',   description: 'Refund — Cancelled Subscription',  amount: 2999,  date: '10 Jun 2026', status: 'Completed', gateway: '' },
  { id: 6, type: 'debit',    description: 'Subscription — Priya Menon',       amount: 2999,  date: '08 Jun 2026', status: 'Completed', gateway: '' },
  { id: 7, type: 'credit',   description: 'Deposit via Paytm',                amount: 3000,  date: '05 Jun 2026', status: 'Completed', gateway: 'Paytm' },
  { id: 8, type: 'debit',    description: 'Withdrawal to UPI',                amount: 2000,  date: '01 Jun 2026', status: 'Completed', gateway: '' },
];

const STATUS_STYLE = {
  Completed:  { color: 'var(--color-success)', bg: 'rgba(100,255,218,0.10)' },
  Processing: { color: 'var(--brand-gold)',    bg: 'rgba(253,196,73,0.12)' },
  Failed:     { color: 'var(--color-danger)',  bg: 'rgba(255,83,112,0.10)' },
  Pending:    { color: 'var(--color-text-muted)', bg: 'rgba(160,170,191,0.10)' },
};

const TABS = ['All', 'Credits', 'Debits', 'Pending'];

// ── Toast Component ──────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  const isSuccess = toast.type === 'success';
  return (
    <div style={{
      position: 'fixed', bottom: 28, right: 28,
      background: isSuccess ? 'rgba(100,255,218,0.12)' : 'rgba(255,83,112,0.12)',
      border: `1px solid ${isSuccess ? 'rgba(100,255,218,0.3)' : 'rgba(255,83,112,0.3)'}`,
      borderRadius: 10, padding: '14px 20px',
      display: 'flex', alignItems: 'center', gap: 10,
      zIndex: 9999, boxShadow: 'var(--shadow-card)',
      fontFamily: 'var(--font-family)',
      animation: 'slideInRight 250ms ease',
      maxWidth: 360,
    }}>
      <span style={{ fontSize: 20 }}>{isSuccess ? '✅' : '❌'}</span>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: isSuccess ? 'var(--color-success)' : 'var(--color-danger)', marginBottom: 2 }}>
          {toast.title}
        </div>
        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{toast.message}</div>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────
export default function WalletPage() {
  const { logout } = useAuthContext();
  const navigate   = useNavigate();

  // Header state
  const [notifOpen, setNotifOpen]         = useState(false);
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFS);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Wallet state
  const [balance, setBalance]             = useState(INITIAL_BALANCE);
  const [transactions, setTransactions]   = useState(INITIAL_TRANSACTIONS);
  const [activeTab, setActiveTab]         = useState('All');

  // Modal state
  const [depositOpen, setDepositOpen]     = useState(false);
  const [withdrawOpen, setWithdrawOpen]   = useState(false);

  // Toast state
  const [toast, setToast]                 = useState(null);

  const showToast = (type, title, message) => {
    setToast({ type, title, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSignOut = () => { logout(); navigate('/login'); };

  const handleMarkRead    = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const handleMarkAllRead = ()   => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  // ── Deposit success ──────────────────────────────────────────
  const handleDepositSuccess = ({ amount, gateway }) => {
    setBalance(prev => prev + amount);
    const newTx = {
      id: Date.now(),
      type: 'credit',
      description: `Deposit via ${gateway.charAt(0).toUpperCase() + gateway.slice(1)}`,
      amount,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Completed',
      gateway,
    };
    setTransactions(prev => [newTx, ...prev]);
    showToast('success', 'Deposit Successful!', `₹${amount.toLocaleString()} added to your wallet`);
  };

  // ── Withdrawal success ───────────────────────────────────────
  const handleWithdrawalSuccess = ({ amount, method }) => {
    setBalance(prev => prev - amount);
    const newTx = {
      id: Date.now(),
      type: 'debit',
      description: `Withdrawal to ${method.toUpperCase()}`,
      amount,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Processing',
      gateway: '',
    };
    setTransactions(prev => [newTx, ...prev]);
    showToast('success', 'Request Submitted!', `₹${amount.toLocaleString()} withdrawal is pending admin approval`);
  };

  // ── Filter transactions ─────────────────────────────────────
  const filteredTx = transactions.filter(tx => {
    if (activeTab === 'Credits')  return tx.type === 'credit';
    if (activeTab === 'Debits')   return tx.type === 'debit';
    if (activeTab === 'Pending')  return tx.status === 'Processing' || tx.status === 'Pending';
    return true;
  });

  const totalDeposited    = transactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
  const totalWithdrawn    = transactions.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);
  const pendingWithdrawals= transactions.filter(t => t.status === 'Processing' && t.type === 'debit').reduce((s, t) => s + t.amount, 0);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)', fontFamily: 'var(--font-family)' }}>

      {/* ── SIDEBAR ─────────────────────────────────────────── */}
      <aside style={{
        width: 240, flexShrink: 0,
        background: 'var(--color-bg-secondary)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh',
        overflowY: 'auto',
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <img
              src={logo}
              alt="SkillAsAService Logo"
              style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'contain' }}
            />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.2 }}>SkillAsAService</div>
              <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>Wallet</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0 12px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 8px 8px' }}>Main Menu</div>
          {[
            { label: 'Dashboard',   icon: '🏠', active: false, path: '/client/dashboard' },
            { label: 'Browse',      icon: '🔍', active: false, path: null },
            { label: 'Subscriptions',icon: '📋',active: false, path: null },
            { label: 'Projects',    icon: '📁', active: false, path: null },
            { label: 'Wallet',      icon: '💰', active: true,  path: '/client/wallet'    },
            { label: 'Invoices',    icon: '🧾', active: false, path: '/client/invoices'  },
            { label: 'Messages',    icon: '💬', active: false, path: null },
            { label: 'Settings',    icon: '⚙️', active: false, path: null },
          ].map(item => (
            <button
              key={item.label}
              onClick={() => item.path && navigate(item.path)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                padding: '10px 12px', marginBottom: 2, borderRadius: 8,
                background: item.active ? 'rgba(26,159,224,0.12)' : 'transparent',
                border: item.active ? '1px solid rgba(26,159,224,0.20)' : '1px solid transparent',
                color: item.active ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                cursor: 'pointer', textAlign: 'left',
                fontSize: 13, fontWeight: item.active ? 600 : 400,
                fontFamily: 'var(--font-family)',
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'var(--gradient-blue)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>C</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Client User</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>client@example.com</div>
            </div>
          </div>
          <button onClick={handleSignOut} style={{
            width: '100%', padding: '8px',
            background: 'transparent', border: '1px solid var(--color-border)',
            borderRadius: 6, color: 'var(--color-danger)',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'var(--font-family)',
          }}>Sign Out</button>
        </div>
      </aside>

      {/* ── MAIN ────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader
          pageTitle="Wallet"
          pageSubtitle="Manage your funds"
          notifCount={unreadCount}
          onNotifClick={() => setNotifOpen(true)}
          userRole="client"
          userName="Client User"
          onSignOut={handleSignOut}
        />

        {/* CSS for animations */}
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(40px); }
            to   { opacity: 1; transform: translateX(0); }
          }
        `}</style>

        <main style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>

          {/* ── Balance Hero ───────────────────────────────── */}
          <div style={{
            background: 'linear-gradient(135deg, #1A9FE0 0%, #0D6EAE 60%, #191C25 100%)',
            borderRadius: 16, padding: '28px 32px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 20,
            marginBottom: 24,
            boxShadow: '0 8px 32px rgba(26,159,224,0.25)',
            border: '1px solid rgba(26,159,224,0.3)',
          }}>
            <div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 6 }}>Total Wallet Balance</div>
              <div style={{ fontSize: 38, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
                ₹{balance.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
                Updated just now
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setDepositOpen(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '11px 22px', borderRadius: 10,
                  background: '#fff', border: 'none',
                  color: 'var(--color-primary)',
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'var(--font-family)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                }}
              >
                <Icons.ArrowDown /> Add Money
              </button>
              <button
                onClick={() => setWithdrawOpen(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '11px 22px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)',
                  color: '#fff',
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'var(--font-family)',
                }}
              >
                <Icons.ArrowUp /> Withdraw
              </button>
            </div>
          </div>

          {/* ── Stats Row ──────────────────────────────────── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16, marginBottom: 24,
          }}>
            {[
              { label: 'Total Deposited',     value: `₹${totalDeposited.toLocaleString()}`,     icon: '⬇️', color: 'var(--color-success)',  bg: 'rgba(100,255,218,0.07)' },
              { label: 'Total Withdrawn',     value: `₹${totalWithdrawn.toLocaleString()}`,     icon: '⬆️', color: 'var(--color-danger)',   bg: 'rgba(255,83,112,0.07)'  },
              { label: 'Pending Withdrawals', value: `₹${pendingWithdrawals.toLocaleString()}`, icon: '⏳', color: 'var(--brand-gold)',     bg: 'rgba(253,196,73,0.07)'  },
            ].map(stat => (
              <div key={stat.label} style={{
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 12, padding: '18px 20px',
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: stat.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, flexShrink: 0,
                }}>{stat.icon}</div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>{stat.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: stat.color }}>{stat.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Transaction History ────────────────────────── */}
          <div style={{
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 14, overflow: 'hidden',
          }}>
            {/* Table header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10,
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>Transaction History</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {TABS.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '5px 13px', borderRadius: 999,
                      border: activeTab === tab ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                      background: activeTab === tab ? 'rgba(26,159,224,0.12)' : 'transparent',
                      color: activeTab === tab ? 'var(--color-primary)' : 'var(--color-text-muted)',
                      fontSize: 11, fontWeight: 600, cursor: 'pointer',
                      fontFamily: 'var(--font-family)',
                    }}
                  >{tab}</button>
                ))}
              </div>
            </div>

            {/* Table */}
            {filteredTx.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13 }}>
                No transactions found for this filter.
              </div>
            ) : (
              <div>
                {/* Header row */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr',
                  padding: '10px 20px',
                  background: 'var(--color-bg-secondary)',
                  borderBottom: '1px solid var(--color-border)',
                }}>
                  {['Description', 'Date', 'Amount', 'Status'].map(h => (
                    <div key={h} style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      {h}
                    </div>
                  ))}
                </div>

                {filteredTx.map((tx, i) => {
                  const st = STATUS_STYLE[tx.status] || STATUS_STYLE.Pending;
                  return (
                    <div
                      key={tx.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr 1fr 1fr',
                        padding: '14px 20px',
                        borderBottom: i < filteredTx.length - 1 ? '1px solid var(--color-border)' : 'none',
                        alignItems: 'center',
                        transition: 'background 150ms',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {/* Description */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: 9,
                          background: tx.type === 'credit' ? 'rgba(100,255,218,0.10)' : 'rgba(255,83,112,0.10)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 16, flexShrink: 0,
                        }}>
                          {tx.type === 'credit' ? '⬇️' : '⬆️'}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginBottom: 2 }}>{tx.description}</div>
                          {tx.gateway && (
                            <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>via {tx.gateway}</div>
                          )}
                        </div>
                      </div>

                      {/* Date */}
                      <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{tx.date}</div>

                      {/* Amount */}
                      <div style={{
                        fontSize: 14, fontWeight: 700,
                        color: tx.type === 'credit' ? 'var(--color-success)' : 'var(--color-danger)',
                      }}>
                        {tx.type === 'credit' ? '+' : '−'}₹{tx.amount.toLocaleString()}
                      </div>

                      {/* Status */}
                      <div>
                        <span style={{
                          fontSize: 11, fontWeight: 700,
                          color: st.color, background: st.bg,
                          padding: '3px 10px', borderRadius: 999,
                          display: 'inline-block',
                        }}>{tx.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ── Modals ──────────────────────────────────────────── */}
      <DepositModal
        isOpen={depositOpen}
        onClose={() => setDepositOpen(false)}
        onSuccess={handleDepositSuccess}
      />

      <WithdrawalModal
        isOpen={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        onSuccess={handleWithdrawalSuccess}
        walletBalance={balance}
      />

      {/* ── Notification Panel ───────────────────────────── */}
      <NotificationPanel
        isOpen={notifOpen}
        onClose={() => setNotifOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkRead}
        onMarkAllRead={handleMarkAllRead}
      />

      {/* ── Toast ───────────────────────────────────────── */}
      <Toast toast={toast} />
    </div>
  );
}
