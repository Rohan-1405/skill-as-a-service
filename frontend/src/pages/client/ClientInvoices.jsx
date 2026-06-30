// ============================================================
// SkillAsAService — ClientInvoices.jsx
// Now uses ClientLayout — sidebar + header from there.
// Author: Praveen Gorla  |  Day 8
// ============================================================

import React, { useState } from 'react';
import ClientLayout from './ClientLayout';

// ── Icons ─────────────────────────────────────────────────────
const Icons = {
  Invoice:  () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  Download: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Eye:      () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Search:   () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  Close:    () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Print:    () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  Check:    () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
};

// ── Mock Invoice Data ─────────────────────────────────────────
const INVOICES = [
  {
    id: 'INV-2026-0018', subscription: 'Standard Plan — Arjun Sharma',
    freelancer: 'Arjun Sharma', client: 'Praveen Gorla',
    date: '17 Jun 2026', dueDate: '17 Jun 2026',
    subtotal: 5084.75, gst: 915.25, total: 6000.00,
    status: 'Paid', gateway: 'Razorpay',
    items: [{ description: 'Standard Plan — Monthly Subscription', qty: 1, rate: 5084.75, amount: 5084.75 }],
  },
  {
    id: 'INV-2026-0017', subscription: 'Basic Plan — Priya Menon',
    freelancer: 'Priya Menon', client: 'Praveen Gorla',
    date: '10 Jun 2026', dueDate: '10 Jun 2026',
    subtotal: 2542.37, gst: 457.63, total: 3000.00,
    status: 'Paid', gateway: 'UPI',
    items: [{ description: 'Basic Plan — Monthly Subscription', qty: 1, rate: 2542.37, amount: 2542.37 }],
  },
  {
    id: 'INV-2026-0016', subscription: 'Premium Plan — Rohan Gupta',
    freelancer: 'Rohan Gupta', client: 'Praveen Gorla',
    date: '05 Jun 2026', dueDate: '05 Jun 2026',
    subtotal: 10169.49, gst: 1830.51, total: 12000.00,
    status: 'Paid', gateway: 'Stripe',
    items: [{ description: 'Premium Plan — Monthly Subscription', qty: 1, rate: 10169.49, amount: 10169.49 }],
  },
  {
    id: 'INV-2026-0014', subscription: 'Standard Plan — Arjun Sharma',
    freelancer: 'Arjun Sharma', client: 'Praveen Gorla',
    date: '17 May 2026', dueDate: '17 May 2026',
    subtotal: 5084.75, gst: 915.25, total: 6000.00,
    status: 'Paid', gateway: 'Razorpay',
    items: [{ description: 'Standard Plan — Monthly Subscription', qty: 1, rate: 5084.75, amount: 5084.75 }],
  },
  {
    id: 'INV-2026-0009', subscription: 'Basic Plan — Priya Menon',
    freelancer: 'Priya Menon', client: 'Praveen Gorla',
    date: '10 May 2026', dueDate: '10 May 2026',
    subtotal: 2542.37, gst: 457.63, total: 3000.00,
    status: 'Refunded', gateway: 'UPI',
    items: [{ description: 'Basic Plan — Monthly Subscription', qty: 1, rate: 2542.37, amount: 2542.37 }],
  },
];

const STATUS_STYLE = {
  Paid:     { color: 'var(--color-success)', bg: 'rgba(100,255,218,0.10)' },
  Pending:  { color: 'var(--brand-gold)',    bg: 'rgba(253,196,73,0.12)'  },
  Refunded: { color: 'var(--brand-cyan)',    bg: 'rgba(50,220,253,0.10)'  },
  Overdue:  { color: 'var(--color-danger)',  bg: 'rgba(255,83,112,0.10)'  },
};

// ── Invoice Detail Modal ──────────────────────────────────────
function InvoiceDetailModal({ invoice, onClose }) {
  if (!invoice) return null;
  const st = STATUS_STYLE[invoice.status] || STATUS_STYLE.Pending;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 400,
        }}
      />
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(680px, 95vw)',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 16,
        zIndex: 401,
        fontFamily: 'var(--font-family)',
        animation: 'invoiceModalIn 200ms ease',
      }}>
        <style>{`
          @keyframes invoiceModalIn {
            from { opacity: 0; transform: translate(-50%, -48%) scale(0.97); }
            to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          }
          @media print {
            .invoice-no-print { display: none !important; }
          }
        `}</style>

        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9,
              background: 'rgba(26,159,224,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icons.Invoice />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)' }}>{invoice.id}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{invoice.date}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }} className="invoice-no-print">
            <button
              onClick={() => window.print()}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 8,
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-secondary)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'var(--font-family)',
              }}
            >
              <Icons.Print /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'transparent', border: '1px solid var(--color-border)',
                borderRadius: 8, color: 'var(--color-text-muted)',
                width: 36, height: 36, display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer',
              }}
            >
              <Icons.Close />
            </button>
          </div>
        </div>

        {/* Invoice Body */}
        <div style={{ padding: '28px 32px' }}>

          {/* From / To */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>From</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>SkillAsAService</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>Fusion5 Technologies Pvt Ltd</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Hyderabad, Telangana, India</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>GST: 36AABCF1234A1Z5</div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Billed To</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>{invoice.client}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>Freelancer: {invoice.freelancer}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Subscription: {invoice.subscription}</div>
            </div>
          </div>

          {/* Invoice meta */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16, padding: '16px 20px',
            background: 'var(--color-bg-secondary)',
            borderRadius: 10, marginBottom: 24,
          }}>
            {[
              { label: 'Invoice No.', value: invoice.id },
              { label: 'Invoice Date', value: invoice.date },
              { label: 'Status', value: invoice.status, isStatus: true },
            ].map(m => (
              <div key={m.label}>
                <div style={{ fontSize: 10, color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>{m.label}</div>
                {m.isStatus ? (
                  <span style={{
                    fontSize: 12, fontWeight: 700,
                    color: st.color, background: st.bg,
                    padding: '3px 10px', borderRadius: 999,
                  }}>{m.value}</span>
                ) : (
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>{m.value}</div>
                )}
              </div>
            ))}
          </div>

          {/* Line items */}
          <div style={{ marginBottom: 24, border: '1px solid var(--color-border)', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr',
              padding: '10px 16px',
              background: 'var(--color-bg-secondary)',
              borderBottom: '1px solid var(--color-border)',
            }}>
              {['Description', 'Qty', 'Rate', 'Amount'].map(h => (
                <div key={h} style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</div>
              ))}
            </div>
            {invoice.items.map((item, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr',
                padding: '14px 16px',
                borderBottom: i < invoice.items.length - 1 ? '1px solid var(--color-border)' : 'none',
              }}>
                <div style={{ fontSize: 13, color: 'var(--color-text)', fontWeight: 500 }}>{item.description}</div>
                <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{item.qty}</div>
                <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>₹{item.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: 260 }}>
              {[
                { label: 'Subtotal',  value: `₹${invoice.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` },
                { label: 'GST (18%)', value: `₹${invoice.gst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{r.label}</span>
                  <span style={{ fontSize: 13, color: 'var(--color-text)', fontWeight: 500 }}>{r.value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0' }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)' }}>Total</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-primary)' }}>
                  ₹{invoice.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {invoice.gateway && (
            <div style={{
              marginTop: 24, padding: '14px 16px',
              background: 'rgba(100,255,218,0.05)',
              border: '1px solid rgba(100,255,218,0.15)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ color: 'var(--color-success)', fontSize: 18 }}>✅</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-success)' }}>Payment Received</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Paid via {invoice.gateway} on {invoice.date}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function ClientInvoices() {
  const [search, setSearch]             = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedInvoice, setSelected]  = useState(null);

  const filtered = INVOICES.filter(inv => {
    const matchSearch = search === '' ||
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.freelancer.toLowerCase().includes(search.toLowerCase()) ||
      inv.subscription.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPaid     = INVOICES.filter(i => i.status === 'Paid').reduce((s, i) => s + i.total, 0);
  const totalRefunded = INVOICES.filter(i => i.status === 'Refunded').reduce((s, i) => s + i.total, 0);

  return (
    <ClientLayout pageTitle="Invoices" pageSubtitle="Your billing history">
      <style>{`
        .inv-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px; margin-bottom: 24px;
        }
        .inv-row:hover { background: var(--color-bg-hover) !important; }
        @media (max-width: 640px) {
          .inv-stats-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 420px) {
          .inv-stats-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div style={{ padding: '28px' }}>

        {/* ── Summary Stats ── */}
        <div className="inv-stats-grid">
          {[
            { label: 'Total Invoices', value: INVOICES.length,                                             icon: '🧾', color: 'var(--color-primary)',  bg: 'rgba(26,159,224,0.10)' },
            { label: 'Total Paid',     value: `₹${totalPaid.toLocaleString('en-IN')}`,                    icon: '✅', color: 'var(--color-success)', bg: 'rgba(100,255,218,0.08)' },
            { label: 'Total Refunded', value: `₹${totalRefunded.toLocaleString('en-IN')}`,                icon: '🔄', color: 'var(--brand-cyan)',    bg: 'rgba(50,220,253,0.10)'  },
          ].map(s => (
            <div key={s.label} style={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 12, padding: '20px 20px',
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Invoice List Card ── */}
        <div style={{
          background: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 14, overflow: 'hidden',
        }}>
          {/* Toolbar */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 12,
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>Invoice History</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', display: 'flex' }}>
                  <Icons.Search />
                </span>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search invoices…"
                  style={{
                    background: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 8, padding: '7px 12px 7px 32px',
                    color: 'var(--color-text)', fontSize: 13,
                    outline: 'none', width: 200,
                    fontFamily: 'var(--font-family)',
                  }}
                />
              </div>
              {['All', 'Paid', 'Refunded', 'Pending'].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)} style={{
                  padding: '5px 13px', borderRadius: 999,
                  border: statusFilter === s ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                  background: statusFilter === s ? 'rgba(26,159,224,0.12)' : 'transparent',
                  color: statusFilter === s ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'var(--font-family)',
                }}>{s}</button>
              ))}
            </div>
          </div>

          {/* Table header row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.6fr 1.8fr 1fr 1fr 1fr 1fr',
            padding: '10px 20px',
            background: 'var(--color-bg-secondary)',
            borderBottom: '1px solid var(--color-border)',
          }}>
            {['Invoice #', 'Subscription', 'Date', 'Amount', 'Status', 'Actions'].map(h => (
              <div key={h} style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</div>
            ))}
          </div>

          {/* Table rows */}
          {filtered.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13 }}>
              No invoices found.
            </div>
          ) : (
            filtered.map((inv, i) => {
              const st = STATUS_STYLE[inv.status] || STATUS_STYLE.Pending;
              return (
                <div
                  key={inv.id}
                  className="inv-row"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.6fr 1.8fr 1fr 1fr 1fr 1fr',
                    padding: '14px 20px',
                    borderBottom: i < filtered.length - 1 ? '1px solid var(--color-border)' : 'none',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'background 150ms',
                  }}
                  onClick={() => setSelected(inv)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(26,159,224,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icons.Invoice />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)' }}>{inv.id}</span>
                  </div>

                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inv.subscription}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>via {inv.gateway || '—'}</div>
                  </div>

                  <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{inv.date}</div>

                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)' }}>
                    ₹{inv.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>

                  <div>
                    <span style={{
                      fontSize: 11, fontWeight: 700,
                      color: st.color, background: st.bg,
                      padding: '3px 10px', borderRadius: 999,
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                    }}>
                      {inv.status === 'Paid' && <Icons.Check />}
                      {inv.status}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setSelected(inv)}
                      title="View Invoice"
                      style={{
                        width: 30, height: 30, borderRadius: 6,
                        background: 'rgba(26,159,224,0.10)',
                        border: '1px solid rgba(26,159,224,0.20)',
                        color: 'var(--color-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <Icons.Eye />
                    </button>
                    <button
                      onClick={() => window.print()}
                      title="Download PDF"
                      style={{
                        width: 30, height: 30, borderRadius: 6,
                        background: 'rgba(100,255,218,0.08)',
                        border: '1px solid rgba(100,255,218,0.15)',
                        color: 'var(--color-success)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <Icons.Download />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div style={{ marginTop: 16, fontSize: 12, color: 'var(--color-text-muted)', textAlign: 'center' }}>
          All amounts include 18% GST · Invoices are auto-generated on successful payments
        </div>
      </div>

      <InvoiceDetailModal
        invoice={selectedInvoice}
        onClose={() => setSelected(null)}
      />
    </ClientLayout>
  );
}