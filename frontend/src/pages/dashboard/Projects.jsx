import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { FREELANCER_NAV } from "../../constants/navItems";
import "../../styles/projects.css";

/* ─── Mock Data ─────────────────────────────────────── */
const MOCK_PROJECTS = [
  {
    id: "p1", title: "E-Commerce Platform Redesign", client: "Rahul Verma",
    clientInitials: "RV", clientColor: "#1A9FE0",
    status: "active", priority: "high",
    progress: 68, dueDate: "2026-07-10",
    tasks: { total: 24, done: 16 },
    milestones: { total: 4, done: 2 },
    tags: ["React JS", "UI/UX", "Figma"],
    description: "Full redesign of an existing e-commerce platform with new design system, checkout flow, and mobile-first approach.",
  },
  {
    id: "p2", title: "Mobile Banking App", client: "Sneha Patel",
    clientInitials: "SP", clientColor: "#64FFDA",
    status: "review", priority: "high",
    progress: 91, dueDate: "2026-06-25",
    tasks: { total: 18, done: 17 },
    milestones: { total: 3, done: 3 },
    tags: ["React Native", "Spring Boot", "MySQL"],
    description: "Cross-platform mobile banking application with real-time transaction tracking, UPI integration and biometric auth.",
  },
  {
    id: "p3", title: "SaaS Analytics Dashboard", client: "Vikram Nair",
    clientInitials: "VN", clientColor: "#FDC449",
    status: "active", priority: "medium",
    progress: 34, dueDate: "2026-08-01",
    tasks: { total: 30, done: 10 },
    milestones: { total: 5, done: 1 },
    tags: ["React JS", "Chart.js", "Node.js"],
    description: "Real-time analytics dashboard with customizable widgets, CSV export, and role-based access control.",
  },
  {
    id: "p4", title: "Portfolio Website", client: "Meera Joshi",
    clientInitials: "MJ", clientColor: "#FF5370",
    status: "completed", priority: "low",
    progress: 100, dueDate: "2026-06-01",
    tasks: { total: 12, done: 12 },
    milestones: { total: 2, done: 2 },
    tags: ["React JS", "GSAP", "Figma"],
    description: "Minimalist portfolio website with smooth animations, dark/light toggle, and CMS-powered blog.",
  },
  {
    id: "p5", title: "Inventory Management System", client: "Arjun Sharma",
    clientInitials: "AS", clientColor: "#B388FF",
    status: "draft", priority: "medium",
    progress: 0, dueDate: "2026-09-15",
    tasks: { total: 0, done: 0 },
    milestones: { total: 4, done: 0 },
    tags: ["Spring Boot", "MySQL", "React JS"],
    description: "Enterprise inventory tracking system with barcode scanning, supplier management, and automated reorder alerts.",
  },
  {
    id: "p6", title: "HR Onboarding Portal", client: "Priya Kumar",
    clientInitials: "PK", clientColor: "#FF9800",
    status: "cancelled", priority: "low",
    progress: 22, dueDate: "2026-05-30",
    tasks: { total: 14, done: 3 },
    milestones: { total: 3, done: 0 },
    tags: ["React JS", "Node.js"],
    description: "Employee onboarding portal with document verification, task checklists, and manager dashboards.",
  },
];

const STATUS_TABS = [
  { key: "all",       label: "All Projects" },
  { key: "active",    label: "Active" },
  { key: "review",    label: "In Review" },
  { key: "draft",     label: "Draft" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

const STATUS_META = {
  active:    { label: "Active",     color: "#64FFDA", bg: "rgba(100,255,218,0.1)" },
  review:    { label: "In Review",  color: "#FDC449", bg: "rgba(253,196,73,0.1)"  },
  draft:     { label: "Draft",      color: "#8892B0", bg: "rgba(136,146,176,0.1)" },
  completed: { label: "Completed",  color: "#1A9FE0", bg: "rgba(26,159,224,0.1)"  },
  cancelled: { label: "Cancelled",  color: "#FF5370", bg: "rgba(255,83,112,0.1)"  },
};

const PRIORITY_META = {
  high:   { label: "High",   color: "#FF5370" },
  medium: { label: "Medium", color: "#FDC449" },
  low:    { label: "Low",    color: "#64FFDA" },
};

const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const isOverdue = (d, status) =>
  status !== "completed" && status !== "cancelled" && new Date(d) < new Date();

/* ─── Stat Card ─────────────────────────────────────── */
function StatCard({ label, value, icon, color }) {
  return (
    <div className="pr-stat-card">
      <div className="pr-stat-icon" style={{ background: `${color}18`, color }}>{icon}</div>
      <div>
        <p className="pr-stat-val">{value}</p>
        <p className="pr-stat-label">{label}</p>
      </div>
    </div>
  );
}

/* ─── Project Card ──────────────────────────────────── */
function ProjectCard({ project, onClick }) {
  const sm = STATUS_META[project.status];
  const pm = PRIORITY_META[project.priority];
  const overdue = isOverdue(project.dueDate, project.status);

  return (
    <div className="pr-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}>
      {/* Header */}
      <div className="pr-card-head">
        <div className="pr-card-client">
          <div className="pr-mini-avatar" style={{ background: project.clientColor }}>
            {project.clientInitials}
          </div>
          <span className="pr-card-client-name">{project.client}</span>
        </div>
        <div className="pr-card-badges">
          <span className="pr-priority-dot" style={{ background: pm.color }} title={pm.label + " priority"} />
          <span className="pr-status-badge" style={{ color: sm.color, background: sm.bg }}>{sm.label}</span>
        </div>
      </div>

      {/* Title + description */}
      <h3 className="pr-card-title">{project.title}</h3>
      <p className="pr-card-desc">{project.description}</p>

      {/* Tags */}
      <div className="pr-card-tags">
        {project.tags.slice(0, 3).map((t) => (
          <span key={t} className="pr-tag">{t}</span>
        ))}
      </div>

      {/* Progress bar */}
      <div className="pr-progress-wrap">
        <div className="pr-progress-top">
          <span className="pr-progress-label">Progress</span>
          <span className="pr-progress-pct">{project.progress}%</span>
        </div>
        <div className="pr-progress-track">
          <div className="pr-progress-fill" style={{
            width: `${project.progress}%`,
            background: project.progress === 100
              ? "var(--color-success)"
              : project.progress > 60
                ? "var(--color-primary)"
                : "var(--color-warning)",
          }} />
        </div>
      </div>

      {/* Footer */}
      <div className="pr-card-footer">
        <div className="pr-card-meta">
          <span className="pr-meta-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            {project.tasks.done}/{project.tasks.total} tasks
          </span>
          <span className="pr-meta-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
            {project.milestones.done}/{project.milestones.total} milestones
          </span>
        </div>
        <span className={`pr-due-date${overdue ? " overdue" : ""}`}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          {overdue ? "Overdue · " : ""}{fmtDate(project.dueDate)}
        </span>
      </div>
    </div>
  );
}

/* ─── New Project Modal ──────────────────────────────── */
function NewProjectModal({ onClose, onCreate }) {
  const [form, setForm] = useState({ title: "", client: "", dueDate: "", priority: "medium", description: "" });
  const [errors, setErrors] = useState({});

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: "" })); };

  const validate = () => {
    const e = {};
    if (!form.title.trim())   e.title   = "Project title is required";
    if (!form.client.trim())  e.client  = "Client name is required";
    if (!form.dueDate)        e.dueDate = "Due date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = () => {
    if (!validate()) return;
    onCreate({ ...form, id: "p" + Date.now(), status: "draft", progress: 0, tasks: { total: 0, done: 0 }, milestones: { total: 0, done: 0 }, tags: [], clientInitials: form.client.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(), clientColor: "#1A9FE0" });
    onClose();
  };

  return (
    <div className="pr-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="pr-modal">
        <div className="pr-modal-head">
          <h2 className="pr-modal-title">New Project</h2>
          <button className="pr-modal-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="pr-modal-body">
          <div className="pr-field">
            <label className="pr-label">Project Title <span className="pr-req">*</span></label>
            <input className={`pr-input${errors.title ? " error" : ""}`} placeholder="e.g. E-Commerce Redesign"
              value={form.title} maxLength={100} onChange={(e) => set("title", e.target.value.slice(0, 100))} />
            {errors.title && <span className="pr-error">{errors.title}</span>}
          </div>

          <div className="pr-field">
            <label className="pr-label">Client Name <span className="pr-req">*</span></label>
            <input className={`pr-input${errors.client ? " error" : ""}`} placeholder="e.g. Rahul Verma"
              value={form.client} maxLength={80} onChange={(e) => set("client", e.target.value.slice(0, 80))} />
            {errors.client && <span className="pr-error">{errors.client}</span>}
          </div>

          <div className="pr-grid-2">
            <div className="pr-field">
              <label className="pr-label">Due Date <span className="pr-req">*</span></label>
              <input className={`pr-input${errors.dueDate ? " error" : ""}`} type="date"
                value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)} />
              {errors.dueDate && <span className="pr-error">{errors.dueDate}</span>}
            </div>
            <div className="pr-field">
              <label className="pr-label">Priority</label>
              <select className="pr-input" value={form.priority} onChange={(e) => set("priority", e.target.value)}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="pr-field">
            <label className="pr-label">Description</label>
            <textarea className="pr-textarea" placeholder="Brief description of the project…"
              value={form.description} maxLength={500} rows={3}
              onChange={(e) => set("description", e.target.value.slice(0, 500))} />
            <span className="pr-char-count">{form.description.length}/500</span>
          </div>
        </div>

        <div className="pr-modal-foot">
          <button className="pr-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="pr-btn-primary" onClick={handleCreate}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────── */
export default function Projects() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch]       = useState("");
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects]   = useState(MOCK_PROJECTS);
  const [view, setView]           = useState("grid"); // grid | list

  const filtered = projects.filter((p) => {
    const matchTab    = activeTab === "all" || p.status === activeTab;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchTab && matchSearch;
  });

  const counts = {
    all: projects.length,
    active: projects.filter((p) => p.status === "active").length,
    review: projects.filter((p) => p.status === "review").length,
    draft: projects.filter((p) => p.status === "draft").length,
    completed: projects.filter((p) => p.status === "completed").length,
    cancelled: projects.filter((p) => p.status === "cancelled").length,
  };

  const totalTasks    = projects.reduce((s, p) => s + p.tasks.total, 0);
  const completedProj = projects.filter((p) => p.status === "completed").length;
  const activeProj    = projects.filter((p) => p.status === "active").length;
  const overdueProj   = projects.filter((p) => isOverdue(p.dueDate, p.status)).length;

  return (
    <DashboardLayout navItems={FREELANCER_NAV} pageTitle="Projects" pageSubtitle="Manage your client projects and track progress">
      <div className="py-page pr-page">

        {/* ── Stat strip ── */}
        <div className="pr-stats-row">
          <StatCard label="Total Projects" value={projects.length}
            color="#1A9FE0"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>} />
          <StatCard label="Active Projects" value={activeProj}
            color="#64FFDA"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>} />
          <StatCard label="Completed" value={completedProj}
            color="#FDC449"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>} />
          <StatCard label="Total Tasks" value={totalTasks}
            color="#B388FF"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>} />
          {overdueProj > 0 && (
            <StatCard label="Overdue" value={overdueProj}
              color="#FF5370"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>} />
          )}
        </div>

        {/* ── Toolbar ── */}
        <div className="pr-toolbar">
          <div className="pr-search-wrap">
            <svg className="pr-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input className="pr-search" placeholder="Search projects, clients, tags…"
              value={search} maxLength={80}
              onChange={(e) => setSearch(e.target.value.slice(0, 80))} />
            {search && (
              <button className="pr-search-clear" onClick={() => setSearch("")}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            )}
          </div>

          <div className="pr-toolbar-right">
            {/* View toggle */}
            <div className="pr-view-toggle">
              <button className={`pr-view-btn${view === "grid" ? " active" : ""}`} onClick={() => setView("grid")} title="Grid view">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              </button>
              <button className={`pr-view-btn${view === "list" ? " active" : ""}`} onClick={() => setView("list")} title="List view">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              </button>
            </div>

            <button className="pr-btn-primary" onClick={() => setShowModal(true)}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New Project
            </button>
          </div>
        </div>

        {/* ── Status tabs ── */}
        <div className="pr-tabs">
          {STATUS_TABS.map((t) => (
            <button key={t.key} className={`pr-tab${activeTab === t.key ? " active" : ""}`}
              onClick={() => setActiveTab(t.key)}>
              {t.label}
              <span className="pr-tab-count">{counts[t.key]}</span>
            </button>
          ))}
        </div>

        {/* ── Results count ── */}
        <p className="pr-results-label">
          {filtered.length} {filtered.length === 1 ? "project" : "projects"}
          {search && <span> matching "<strong>{search}</strong>"</span>}
        </p>

        {/* ── Grid / List ── */}
        {filtered.length === 0 ? (
          <div className="pr-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            <p className="pr-empty-title">No projects found</p>
            <p className="pr-empty-sub">
              {search ? "Try a different search term." : 'Click "New Project" to get started.'}
            </p>
            {!search && <button className="pr-btn-primary" onClick={() => setShowModal(true)}>New Project</button>}
          </div>
        ) : view === "grid" ? (
          <div className="pr-grid">
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} onClick={() => navigate(`/projects/${p.id}`)} />
            ))}
          </div>
        ) : (
          <div className="pr-list">
            {/* List header */}
            <div className="pr-list-head">
              <span className="pr-list-col-title">Project</span>
              <span className="pr-list-col">Client</span>
              <span className="pr-list-col">Status</span>
              <span className="pr-list-col">Progress</span>
              <span className="pr-list-col">Tasks</span>
              <span className="pr-list-col">Due Date</span>
              <span className="pr-list-col" />
            </div>
            {filtered.map((p) => {
              const sm = STATUS_META[p.status];
              const pm = PRIORITY_META[p.priority];
              const overdue = isOverdue(p.dueDate, p.status);
              return (
                <div key={p.id} className="pr-list-row" onClick={() => navigate(`/projects/${p.id}`)}>
                  <div className="pr-list-title-cell">
                    <span className="pr-priority-dot" style={{ background: pm.color }} />
                    <div>
                      <p className="pr-list-title">{p.title}</p>
                      <div className="pr-list-tags">
                        {p.tags.slice(0, 2).map((t) => <span key={t} className="pr-tag pr-tag-sm">{t}</span>)}
                      </div>
                    </div>
                  </div>
                  <div className="pr-list-client">
                    <div className="pr-mini-avatar pr-mini-avatar-sm" style={{ background: p.clientColor }}>{p.clientInitials}</div>
                    <span>{p.client}</span>
                  </div>
                  <span className="pr-status-badge" style={{ color: sm.color, background: sm.bg }}>{sm.label}</span>
                  <div className="pr-list-progress">
                    <div className="pr-progress-track pr-progress-track-sm">
                      <div className="pr-progress-fill" style={{ width: `${p.progress}%`, background: p.progress === 100 ? "var(--color-success)" : p.progress > 60 ? "var(--color-primary)" : "var(--color-warning)" }} />
                    </div>
                    <span className="pr-list-pct">{p.progress}%</span>
                  </div>
                  <span className="pr-list-tasks">{p.tasks.done}/{p.tasks.total}</span>
                  <span className={`pr-list-due${overdue ? " overdue" : ""}`}>{fmtDate(p.dueDate)}</span>
                  <button className="pr-list-open" onClick={(e) => { e.stopPropagation(); navigate(`/projects/${p.id}`); }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {showModal && (
          <NewProjectModal
            onClose={() => setShowModal(false)}
            onCreate={(proj) => setProjects((prev) => [proj, ...prev])}
          />
        )}
      </div>
    </DashboardLayout>
  );
}