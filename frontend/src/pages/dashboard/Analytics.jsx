import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import AppCard from '../../components/common/AppCard';
import { FREELANCER_NAV } from '../../constants/navItems';

/* ─────────────────────────────────────────
   Analytics Page — Freelancer Portal
   All data is stub. Wire to backend Analytics
   Service APIs when ready (SRS Module 13).
   API endpoint ref: GET /api/analytics/freelancer
───────────────────────────────────────── */

/* ── STUB DATA ── */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const STUB = {
  totalEarnings: 87400,
  earningsChange: +12.4,
  totalSubscribers: 14,
  subscribersChange: +3,
  profileViews: 1284,
  viewsChange: +22.1,
  activeProjects: 5,
  projectsChange: 0,

  earningsByMonth: [
    { month: 'Jan', amount: 9999 },
    { month: 'Feb', amount: 14999 },
    { month: 'Mar', amount: 12499 },
    { month: 'Apr', amount: 17999 },
    { month: 'May', amount: 13999 },
    { month: 'Jun', amount: 17905 },
  ],

  subscribersByMonth: [
    { month: 'Jan', count: 4 },
    { month: 'Feb', count: 6 },
    { month: 'Mar', count: 7 },
    { month: 'Apr', count: 9 },
    { month: 'May', count: 11 },
    { month: 'Jun', count: 14 },
  ],

  profileViewsByMonth: [
    { month: 'Jan', count: 140 },
    { month: 'Feb', count: 198 },
    { month: 'Mar', count: 175 },
    { month: 'Apr', count: 243 },
    { month: 'May', count: 276 },
    { month: 'Jun', count: 252 },
  ],

  planBreakdown: [
    { name: 'Basic',    subscribers: 5, revenue: 24995,  color: 'var(--color-info)' },
    { name: 'Standard', subscribers: 7, revenue: 69993,  color: 'var(--color-primary)' },
    { name: 'Premium',  subscribers: 2, revenue: 39998,  color: 'var(--color-highlight)' },
  ],

  recentSubscribers: [
    { name: 'Arjun Mehta',   plan: 'Standard', date: '20 Jun 2026', avatar: 'AM' },
    { name: 'Priya Sharma',  plan: 'Premium',  date: '17 Jun 2026', avatar: 'PS' },
    { name: 'Kiran Reddy',   plan: 'Basic',    date: '14 Jun 2026', avatar: 'KR' },
    { name: 'Sneha Nair',    plan: 'Standard', date: '11 Jun 2026', avatar: 'SN' },
    { name: 'Vivek Kumar',   plan: 'Standard', date: '08 Jun 2026', avatar: 'VK' },
  ],

  topSkillsViewed: [
    { skill: 'React', views: 421 },
    { skill: 'Spring Boot', views: 318 },
    { skill: 'Node.js', views: 204 },
    { skill: 'TypeScript', views: 187 },
    { skill: 'Docker', views: 154 },
  ],
};

/* ─── Helpers ─── */
const formatINR = (n) => '₹' + n.toLocaleString('en-IN');

const ChangeTag = ({ val }) => {
  if (val === 0) return <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>No change</span>;
  const up = val > 0;
  return (
    <span style={{
      fontSize: 11,
      fontWeight: 600,
      color: up ? 'var(--color-success)' : 'var(--color-danger)',
      display: 'inline-flex', alignItems: 'center', gap: 2,
    }}>
      {up ? '▲' : '▼'} {Math.abs(val)}{typeof val === 'number' && !Number.isInteger(val) ? '%' : ''}
    </span>
  );
};

/* ─── Mini bar chart ─── */
const BarChart = ({ data, valueKey, color, formatTip }) => {
  const [hovered, setHovered] = useState(null);
  const max = Math.max(...data.map((d) => d[valueKey]));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120, padding: '8px 0' }}>
      {data.map((d, i) => {
        const pct = max === 0 ? 0 : (d[valueKey] / max) * 100;
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end', position: 'relative' }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {hovered === i && (
              <div style={{
                position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
                background: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
                borderRadius: 6, padding: '4px 8px', fontSize: 11, color: 'var(--color-text)',
                whiteSpace: 'nowrap', marginBottom: 4, zIndex: 10,
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}>
                {formatTip ? formatTip(d[valueKey]) : d[valueKey]}
              </div>
            )}
            <div style={{
              width: '100%',
              height: `${Math.max(pct, 4)}%`,
              background: color,
              opacity: hovered === i ? 1 : 0.7,
              borderRadius: '3px 3px 0 0',
              transition: 'opacity 0.15s',
              minHeight: 4,
            }} />
            <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{d.month}</span>
          </div>
        );
      })}
    </div>
  );
};

/* ─── Line chart (SVG) ─── */
const LineChart = ({ data, valueKey, color }) => {
  const W = 400, H = 100, PAD = 10;
  const vals = data.map((d) => d[valueKey]);
  const max = Math.max(...vals) || 1;
  const min = Math.min(...vals);
  const pts = vals.map((v, i) => {
    const x = PAD + (i / (vals.length - 1)) * (W - PAD * 2);
    const y = H - PAD - ((v - min) / (max - min || 1)) * (H - PAD * 2);
    return `${x},${y}`;
  });
  const polyline = pts.join(' ');
  const area = `${PAD},${H - PAD} ${polyline} ${W - PAD},${H - PAD}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 100, display: 'block' }}>
      <defs>
        <linearGradient id={`grad-${valueKey}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#grad-${valueKey})`} />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((pt, i) => {
        const [x, y] = pt.split(',').map(Number);
        return <circle key={i} cx={x} cy={y} r="3" fill={color} />;
      })}
    </svg>
  );
};

/* ─── Export CSV stub ─── */
const exportCSV = () => {
  const rows = [
    ['Month', 'Earnings (₹)', 'Subscribers', 'Profile Views'],
    ...STUB.earningsByMonth.map((d, i) => [
      d.month,
      d.amount,
      STUB.subscribersByMonth[i].count,
      STUB.profileViewsByMonth[i].count,
    ]),
  ];
  const csv = rows.map((r) => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = 'analytics-report.csv'; a.click();
  URL.revokeObjectURL(url);
};

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
const Analytics = () => {
  const [range, setRange] = useState('6m');

  const planTotal = STUB.planBreakdown.reduce((s, p) => s + p.revenue, 0);

  return (
    <DashboardLayout navItems={FREELANCER_NAV} portalName="Freelancer Portal" pageSubtitle="Analytics">

      {/* Header + Export */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1>Analytics</h1>
          <p>Track your earnings, subscribers, and profile performance.</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Range selector */}
          <div style={{ display: 'flex', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
            {['1m', '3m', '6m'].map((r) => (
              <button key={r} type="button"
                onClick={() => setRange(r)}
                style={{
                  padding: '6px 14px',
                  background: range === r ? 'var(--color-primary)' : 'transparent',
                  color: range === r ? '#fff' : 'var(--color-text-secondary)',
                  border: 'none',
                  fontSize: 12,
                  fontWeight: range === r ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
              >
                {r === '1m' ? '1 Month' : r === '3m' ? '3 Months' : '6 Months'}
              </button>
            ))}
          </div>
          <button type="button" onClick={exportCSV}
            style={{
              padding: '6px 16px',
              background: 'none',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-secondary)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 12,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="stat-grid" style={{ marginBottom: 'var(--space-5)' }}>
        {[
          { label: 'Total Earnings', value: formatINR(STUB.totalEarnings), change: STUB.earningsChange, color: 'var(--brand-gold)', bg: 'rgba(253,196,73,0.1)' },
          { label: 'Active Subscribers', value: STUB.totalSubscribers, change: STUB.subscribersChange, color: 'var(--color-info)', bg: 'rgba(50,220,253,0.1)' },
          { label: 'Profile Views', value: STUB.profileViews.toLocaleString(), change: STUB.viewsChange, color: 'var(--color-primary)', bg: 'rgba(26,159,224,0.1)' },
          { label: 'Active Projects', value: STUB.activeProjects, change: STUB.projectsChange, color: 'var(--color-success)', bg: 'rgba(100,255,218,0.1)' },
        ].map((s) => (
          <div key={s.label} className="stat-card" style={{ '--stat-accent': s.color }}>
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </div>
            <div className="stat-body">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <div style={{ marginTop: 4 }}>
                <ChangeTag val={s.change} />
                <span style={{ fontSize: 10, color: 'var(--color-text-muted)', marginLeft: 4 }}>vs last period</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-5)', marginBottom: 'var(--space-5)' }}>

        {/* Earnings chart */}
        <AppCard title="Monthly Earnings" subtitle={`Last 6 months · Total ${formatINR(STUB.totalEarnings)}`}>
          <BarChart
            data={STUB.earningsByMonth}
            valueKey="amount"
            color="var(--brand-gold)"
            formatTip={(v) => formatINR(v)}
          />
        </AppCard>

        {/* Subscriber growth */}
        <AppCard title="Subscriber Growth" subtitle="Cumulative active subscribers">
          <LineChart data={STUB.subscribersByMonth} valueKey="count" color="var(--color-info)" />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            {STUB.subscribersByMonth.map((d) => (
              <span key={d.month} style={{ fontSize: 10, color: 'var(--color-text-muted)', flex: 1, textAlign: 'center' }}>{d.month}</span>
            ))}
          </div>
        </AppCard>

        {/* Profile views */}
        <AppCard title="Profile Views" subtitle="Monthly unique profile visits">
          <BarChart
            data={STUB.profileViewsByMonth}
            valueKey="count"
            color="var(--color-primary)"
          />
        </AppCard>
      </div>

      {/* ── Plan Breakdown + Recent Subscribers ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-5)', marginBottom: 'var(--space-5)' }}>

        {/* Plan revenue breakdown */}
        <AppCard title="Revenue by Plan" subtitle="Share of total revenue per tier">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
            {STUB.planBreakdown.map((plan) => {
              const pct = planTotal === 0 ? 0 : Math.round((plan.revenue / planTotal) * 100);
              return (
                <div key={plan.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: plan.color, display: 'inline-block' }} />
                      <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text)' }}>{plan.name}</span>
                      <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>({plan.subscribers} subs)</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text)' }}>{formatINR(plan.revenue)}</span>
                      <span style={{ fontSize: 11, color: 'var(--color-text-muted)', marginLeft: 6 }}>{pct}%</span>
                    </div>
                  </div>
                  <div style={{ height: 6, background: 'var(--color-bg-input)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: plan.color, borderRadius: 3, transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </AppCard>

        {/* Top skills viewed */}
        <AppCard title="Top Skills Viewed" subtitle="Skills clients searched to find your profile">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
            {STUB.topSkillsViewed.map((s, i) => {
              const maxViews = STUB.topSkillsViewed[0].views;
              const pct = Math.round((s.views / maxViews) * 100);
              return (
                <div key={s.skill}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 11, color: 'var(--color-text-muted)', width: 16, textAlign: 'right' }}>#{i + 1}</span>
                      <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text)' }}>{s.skill}</span>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{s.views} views</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--color-bg-input)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: 'var(--color-primary)', borderRadius: 2 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </AppCard>
      </div>

      {/* ── Recent Subscribers ── */}
      <AppCard title="Recent Subscribers" subtitle="Latest clients who subscribed to your plans">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {STUB.recentSubscribers.map((s, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)',
              padding: 'var(--space-3) 0',
              borderBottom: i < STUB.recentSubscribers.length - 1 ? '1px solid var(--color-border)' : 'none',
            }}>
              {/* Avatar */}
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(26,159,224,0.12)',
                color: 'var(--color-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 600, flexShrink: 0,
              }}>
                {s.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text)' }}>{s.name}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{s.date}</div>
              </div>
              <span style={{
                padding: '3px 10px',
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 600,
                background: s.plan === 'Basic' ? 'rgba(50,220,253,0.1)' : s.plan === 'Standard' ? 'rgba(26,159,224,0.1)' : 'rgba(253,196,73,0.1)',
                color: s.plan === 'Basic' ? 'var(--color-info)' : s.plan === 'Standard' ? 'var(--color-primary)' : 'var(--color-highlight)',
              }}>
                {s.plan}
              </span>
            </div>
          ))}
        </div>
      </AppCard>

      {/* Stub note */}
      <p style={{ marginTop: 'var(--space-4)', fontSize: 12, color: 'var(--color-text-muted)', textAlign: 'center' }}>
        📊 All data above is demo data. Real analytics will populate once the Analytics Service API is integrated.
      </p>
    </DashboardLayout>
  );
};

export default Analytics;