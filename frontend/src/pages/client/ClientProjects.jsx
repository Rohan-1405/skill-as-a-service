// ============================================================
// SkillAsAService — ClientProjects.jsx
// Route: /client/projects
// Client view of all their projects with freelancers.
// ============================================================

import React, { useState } from 'react';
import ClientLayout from './ClientLayout';

const INIT_PROJECTS = [
  { id: 1, title: 'E-commerce Redesign',      freelancer: 'Arjun Sharma', skill: 'Full Stack Dev', status: 'Active',    progress: 65,  due: '2026-06-25', budget: '₹18,000', milestones: 4, done: 3, avatar: 'AS', color: '#1A9FE0' },
  { id: 2, title: 'Mobile App UI',             freelancer: 'Priya Menon',  skill: 'UI/UX Design',  status: 'Review',    progress: 90,  due: '2026-06-20', budget: '₹12,000', milestones: 3, done: 3, avatar: 'PM', color: '#32DCFD' },
  { id: 3, title: 'CI/CD Pipeline Setup',      freelancer: 'Rohan Gupta',  skill: 'DevOps',        status: 'Pending',   progress: 20,  due: '2026-06-30', budget: '₹25,000', milestones: 5, done: 1, avatar: 'RG', color: '#FDC449' },
  { id: 4, title: 'SEO Optimization',          freelancer: 'Arjun Sharma', skill: 'Full Stack Dev', status: 'Completed', progress: 100, due: '2026-06-10', budget: '₹8,000',  milestones: 2, done: 2, avatar: 'AS', color: '#1A9FE0' },
  { id: 5, title: 'Content Strategy Q3',       freelancer: 'Divya Nair',   skill: 'Content',       status: 'Pending',   progress: 10,  due: '2026-07-15', budget: '₹6,000',  milestones: 3, done: 0, avatar: 'DN', color: '#64FFDA' },
  { id: 6, title: 'Brand Identity Refresh',    freelancer: 'Priya Menon',  skill: 'UI/UX Design',  status: 'Active',    progress: 45,  due: '2026-07-05', budget: '₹15,000', milestones: 4, done: 2, avatar: 'PM', color: '#32DCFD' },
];

const STATUS_CFG = {
  Active:    { color: '#1A9FE0', bg: 'rgba(26,159,224,0.12)'  },
  Review:    { color: '#FDC449', bg: 'rgba(253,196,73,0.12)'  },
  Pending:   { color: '#8892B0', bg: 'rgba(136,146,176,0.10)' },
  Completed: { color: '#64FFDA', bg: 'rgba(100,255,218,0.10)' },
};

function Modal({ title, onClose, children, footer }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
      <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 16, padding: '28px 32px', width: '100%', maxWidth: 520, boxShadow: 'var(--shadow-card)', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: 20, cursor: 'pointer' }}>✕</button>
        </div>
        {children}
        {footer && <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 22 }}>{footer}</div>}
      </div>
    </div>
  );
}

const inputStyle = { width: '100%', background: 'var(--color-bg-input)', border: '1.5px solid var(--color-border)', borderRadius: 8, padding: '9px 12px', color: 'var(--color-text)', fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-family)' };
const labelStyle = { fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 6 };

export default function ClientProjects() {
  const [projects, setProjects] = useState(INIT_PROJECTS);
  const [view, setView]       = useState('grid');
  const [filter, setFilter]   = useState('All');
  const [search, setSearch]   = useState('');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast]     = useState(null);
  const [form, setForm]       = useState({ title: '', freelancer: '', skill: '', due: '', budget: '' });
  const [formErr, setFormErr] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const filtered = projects.filter(p => {
    const matchFilter = filter === 'All' || p.status === filter;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.freelancer.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleCreate = () => {
    if (!form.title.trim() || !form.freelancer.trim()) { setFormErr('Title and freelancer are required.'); return; }
    const newP = { id: Date.now(), title: form.title, freelancer: form.freelancer, skill: form.skill || 'General', status: 'Pending', progress: 0, due: form.due || 'TBD', budget: form.budget || 'TBD', milestones: 0, done: 0, avatar: form.freelancer.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase(), color: '#1A9FE0' };
    setProjects(prev => [newP, ...prev]);
    setShowModal(false);
    setForm({ title: '', freelancer: '', skill: '', due: '', budget: '' });
    setFormErr('');
    showToast('Project created successfully!');
  };

  const counts = { All: projects.length, Active: projects.filter(p => p.status === 'Active').length, Review: projects.filter(p => p.status === 'Review').length, Pending: projects.filter(p => p.status === 'Pending').length, Completed: projects.filter(p => p.status === 'Completed').length };

  return (
    <ClientLayout pageTitle="Projects" pageSubtitle="All your projects with freelancers">
      <style>{`
        .cp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
        .cp-list { display: flex; flex-direction: column; gap: 12px; }
        @media (max-width: 600px) { .cp-grid { grid-template-columns: 1fr; } }
        .cp-card { background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: 14px; transition: border-color 200ms; }
        .cp-card:hover { border-color: rgba(26,159,224,0.3); }
      `}</style>

      <div style={{ padding: '28px' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 200px' }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..." style={{ ...inputStyle, paddingLeft: 34 }} />
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--color-text-muted)', pointerEvents: 'none' }}>🔍</span>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {['grid', 'list'].map(v => (
              <button key={v} onClick={() => setView(v)} style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid var(--color-border)', background: view === v ? 'rgba(26,159,224,0.12)' : 'var(--color-bg-card)', color: view === v ? 'var(--color-primary)' : 'var(--color-text-muted)', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {v === 'grid' ? '⊞' : '☰'}
              </button>
            ))}
          </div>
          <button onClick={() => setShowModal(true)} style={{ padding: '8px 18px', borderRadius: 8, background: 'var(--gradient-blue)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-family)', boxShadow: 'var(--shadow-btn)', whiteSpace: 'nowrap' }}>+ New Project</button>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {['All', 'Active', 'Review', 'Pending', 'Completed'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-family)', background: filter === f ? 'var(--gradient-blue)' : 'var(--color-bg-card)', border: filter === f ? 'none' : '1px solid var(--color-border)', color: filter === f ? '#fff' : 'var(--color-text-secondary)', boxShadow: filter === f ? 'var(--shadow-btn)' : 'none' }}>
              {f} <span style={{ opacity: 0.7 }}>({counts[f]})</span>
            </button>
          ))}
        </div>

        {/* Projects */}
        <div className={view === 'grid' ? 'cp-grid' : 'cp-list'}>
          {filtered.map(p => {
            const st = STATUS_CFG[p.status] || STATUS_CFG.Pending;
            return (
              <div key={p.id} className="cp-card">
                <div style={{ padding: '18px 20px' }}>
                  {/* Header row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>{p.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: `linear-gradient(135deg, ${p.color}, rgba(26,159,224,0.3))`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{p.avatar}</div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{p.freelancer} · {p.skill}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: st.color, background: st.bg, padding: '3px 10px', borderRadius: 999, flexShrink: 0 }}>{p.status}</span>
                  </div>
                  {/* Progress */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 5 }}>
                      <span>Progress</span>
                      <span>{p.progress}%</span>
                    </div>
                    <div style={{ height: 5, background: 'var(--color-border)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${p.progress}%`, background: p.progress === 100 ? 'var(--color-success)' : 'var(--gradient-blue)', borderRadius: 3, transition: 'width 400ms ease' }} />
                    </div>
                  </div>
                  {/* Meta */}
                  <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--color-text-muted)' }}>
                    <span>📅 Due: {p.due === 'TBD' ? 'TBD' : new Date(p.due).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    <span>💰 {p.budget}</span>
                    <span>🎯 {p.done}/{p.milestones} milestones</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-text-muted)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📁</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 8 }}>No projects found</div>
            <button onClick={() => setShowModal(true)} style={{ marginTop: 8, padding: '9px 22px', borderRadius: 999, background: 'var(--gradient-blue)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-family)', boxShadow: 'var(--shadow-btn)' }}>Create a Project</button>
          </div>
        )}
      </div>

      {/* New Project Modal */}
      {showModal && (
        <Modal title="New Project" onClose={() => { setShowModal(false); setFormErr(''); }} footer={[
          <button key="cancel" onClick={() => { setShowModal(false); setFormErr(''); }} style={{ padding: '9px 22px', borderRadius: 8, background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-family)' }}>Cancel</button>,
          <button key="create" onClick={handleCreate} style={{ padding: '9px 22px', borderRadius: 8, background: 'var(--gradient-blue)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-family)', boxShadow: 'var(--shadow-btn)' }}>Create Project</button>,
        ]}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {formErr && <div style={{ background: 'rgba(255,83,112,0.1)', border: '1px solid rgba(255,83,112,0.3)', borderRadius: 8, padding: '8px 12px', color: 'var(--color-danger)', fontSize: 12 }}>{formErr}</div>}
            {[
              { label: 'Project Title *', key: 'title', placeholder: 'e.g. E-commerce Redesign' },
              { label: 'Freelancer Name *', key: 'freelancer', placeholder: 'e.g. Arjun Sharma' },
              { label: 'Skill / Domain', key: 'skill', placeholder: 'e.g. Full Stack Dev' },
              { label: 'Budget', key: 'budget', placeholder: 'e.g. ₹15,000' },
            ].map(f => (
              <div key={f.key}>
                <label style={labelStyle}>{f.label}</label>
                <input value={form[f.key]} onChange={e => { setForm(prev => ({ ...prev, [f.key]: e.target.value })); setFormErr(''); }} placeholder={f.placeholder} style={inputStyle} />
              </div>
            ))}
            <div>
              <label style={labelStyle}>Due Date</label>
              <input type="date" value={form.due} onChange={e => setForm(prev => ({ ...prev, due: e.target.value }))} style={inputStyle} />
            </div>
          </div>
        </Modal>
      )}

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: 'rgba(100,255,218,0.15)', border: '1px solid rgba(100,255,218,0.4)', color: '#64FFDA', padding: '12px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-family)', zIndex: 2000, boxShadow: 'var(--shadow-card)' }}>
          {toast}
        </div>
      )}
    </ClientLayout>
  );
}
