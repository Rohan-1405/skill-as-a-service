import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { FREELANCER_NAV } from "../../constants/navItems";
import "../../styles/projects.css";

/* ─── Mock project detail data ───────────────────────── */
const MOCK_PROJECT = {
  id: "p1",
  title: "E-Commerce Platform Redesign",
  client: "Rahul Verma",
  clientInitials: "RV",
  clientColor: "#1A9FE0",
  status: "active",
  priority: "high",
  progress: 68,
  dueDate: "2026-07-10",
  startDate: "2026-05-01",
  description: "Full redesign of an existing e-commerce platform with a new design system, improved checkout flow, and a mobile-first approach. Includes component library documentation and handoff assets.",
  tags: ["React JS", "UI/UX", "Figma", "Tailwind"],
  budget: 85000,
  spent: 58000,
  milestones: [
    { id: "m1", title: "Discovery & Research",    dueDate: "2026-05-15", status: "completed", tasks: 6,  tasksDone: 6 },
    { id: "m2", title: "Design System & Wireframes", dueDate: "2026-06-01", status: "completed", tasks: 8,  tasksDone: 8 },
    { id: "m3", title: "Frontend Development",     dueDate: "2026-07-01", status: "active",    tasks: 10, tasksDone: 6 },
    { id: "m4", title: "QA & Handoff",             dueDate: "2026-07-10", status: "pending",   tasks: 4,  tasksDone: 0 },
  ],
  tasks: [
    { id: "t1", title: "Set up React project structure",       status: "done",        priority: "high",   milestone: "m3", dueDate: "2026-06-05" },
    { id: "t2", title: "Build global CSS variable system",     status: "done",        priority: "medium", milestone: "m3", dueDate: "2026-06-08" },
    { id: "t3", title: "Product listing page components",      status: "done",        priority: "high",   milestone: "m3", dueDate: "2026-06-15" },
    { id: "t4", title: "Cart & checkout flow",                 status: "in_progress", priority: "high",   milestone: "m3", dueDate: "2026-06-25" },
    { id: "t5", title: "Payment integration (Razorpay)",       status: "in_progress", priority: "high",   milestone: "m3", dueDate: "2026-06-28" },
    { id: "t6", title: "Order confirmation + email templates", status: "todo",        priority: "medium", milestone: "m3", dueDate: "2026-07-01" },
    { id: "t7", title: "Mobile responsiveness pass",           status: "todo",        priority: "high",   milestone: "m4", dueDate: "2026-07-05" },
    { id: "t8", title: "Cross-browser testing",               status: "todo",        priority: "medium", milestone: "m4", dueDate: "2026-07-07" },
    { id: "t9", title: "Figma handoff & component docs",      status: "todo",        priority: "low",    milestone: "m4", dueDate: "2026-07-09" },
  ],
  files: [
    { id: "f1", name: "Design_System_v2.fig",    size: "12.4 MB", type: "fig",  uploadedAt: "2026-06-01" },
    { id: "f2", name: "Wireframes_Final.pdf",     size: "3.8 MB",  type: "pdf",  uploadedAt: "2026-06-03" },
    { id: "f3", name: "Product_Spec_Sheet.xlsx",  size: "540 KB",  type: "xlsx", uploadedAt: "2026-06-10" },
    { id: "f4", name: "Frontend_Codebase.zip",    size: "22.1 MB", type: "zip",  uploadedAt: "2026-06-18" },
  ],
  team: [
    { initials: "RV", name: "Rahul Verma",  role: "Client",         color: "#1A9FE0" },
    { initials: "LS", name: "Lohith Sai",   role: "You (Dev)",      color: "#64FFDA" },
    { initials: "MP", name: "Meera Patel",  role: "UI Designer",    color: "#FDC449" },
  ],
};

const STATUS_META = {
  active:    { label: "Active",     color: "#64FFDA", bg: "rgba(100,255,218,0.1)" },
  review:    { label: "In Review",  color: "#FDC449", bg: "rgba(253,196,73,0.1)"  },
  draft:     { label: "Draft",      color: "#8892B0", bg: "rgba(136,146,176,0.1)" },
  completed: { label: "Completed",  color: "#1A9FE0", bg: "rgba(26,159,224,0.1)"  },
  cancelled: { label: "Cancelled",  color: "#FF5370", bg: "rgba(255,83,112,0.1)"  },
  pending:   { label: "Pending",    color: "#8892B0", bg: "rgba(136,146,176,0.1)" },
};

const TASK_STATUS = {
  done:        { label: "Done",        color: "#64FFDA", bg: "rgba(100,255,218,0.1)" },
  in_progress: { label: "In Progress", color: "#FDC449", bg: "rgba(253,196,73,0.1)"  },
  todo:        { label: "To Do",       color: "#8892B0", bg: "rgba(136,146,176,0.1)" },
};

const PRIORITY_META = {
  high:   { label: "High",   color: "#FF5370" },
  medium: { label: "Medium", color: "#FDC449" },
  low:    { label: "Low",    color: "#64FFDA" },
};

const FILE_ICONS = {
  pdf:  { icon: "PDF", color: "#FF5370", bg: "rgba(255,83,112,0.12)" },
  fig:  { icon: "FIG", color: "#B388FF", bg: "rgba(179,136,255,0.12)" },
  xlsx: { icon: "XLS", color: "#64FFDA", bg: "rgba(100,255,218,0.12)" },
  zip:  { icon: "ZIP", color: "#FDC449", bg: "rgba(253,196,73,0.12)"  },
  png:  { icon: "IMG", color: "#1A9FE0", bg: "rgba(26,159,224,0.12)"  },
  jpg:  { icon: "IMG", color: "#1A9FE0", bg: "rgba(26,159,224,0.12)"  },
  doc:  { icon: "DOC", color: "#4DB8F0", bg: "rgba(77,184,240,0.12)"  },
};

const fmtDate  = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const fmtMoney = (n) => "₹" + n.toLocaleString("en-IN");

/* ─── Add Task Modal ─────────────────────────────────── */
function AddTaskModal({ milestones, onClose, onAdd }) {
  const [form, setForm] = useState({ title: "", status: "todo", priority: "medium", milestone: milestones[0]?.id || "", dueDate: "" });
  const [errors, setErrors] = useState({});
  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: "" })); };

  const handleAdd = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Task title is required";
    if (!form.dueDate)      e.dueDate = "Due date is required";
    setErrors(e);
    if (Object.keys(e).length) return;
    onAdd({ ...form, id: "t" + Date.now() });
    onClose();
  };

  return (
    <div className="pr-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="pr-modal pr-modal-sm">
        <div className="pr-modal-head">
          <h2 className="pr-modal-title">Add Task</h2>
          <button className="pr-modal-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="pr-modal-body">
          <div className="pr-field">
            <label className="pr-label">Task Title <span className="pr-req">*</span></label>
            <input className={`pr-input${errors.title ? " error" : ""}`} placeholder="e.g. Build cart page"
              value={form.title} maxLength={150} onChange={(e) => set("title", e.target.value.slice(0, 150))} />
            {errors.title && <span className="pr-error">{errors.title}</span>}
          </div>
          <div className="pr-grid-2">
            <div className="pr-field">
              <label className="pr-label">Status</label>
              <select className="pr-input" value={form.status} onChange={(e) => set("status", e.target.value)}>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
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
          <div className="pr-grid-2">
            <div className="pr-field">
              <label className="pr-label">Milestone</label>
              <select className="pr-input" value={form.milestone} onChange={(e) => set("milestone", e.target.value)}>
                {milestones.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
              </select>
            </div>
            <div className="pr-field">
              <label className="pr-label">Due Date <span className="pr-req">*</span></label>
              <input className={`pr-input${errors.dueDate ? " error" : ""}`} type="date"
                value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)} />
              {errors.dueDate && <span className="pr-error">{errors.dueDate}</span>}
            </div>
          </div>
        </div>
        <div className="pr-modal-foot">
          <button className="pr-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="pr-btn-primary" onClick={handleAdd}>Add Task</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Status transition config ───────────────────────── */
const STATUS_TRANSITIONS = {
  draft:     { action: "Start Project",       nextStatus: "active",    btnClass: "pr-btn-primary",  icon: "play"    },
  active:    { action: "Submit for Review",   nextStatus: "review",    btnClass: "pr-btn-warning",  icon: "send"    },
  review:    { action: "Awaiting Approval",   nextStatus: null,        btnClass: "pr-btn-disabled", icon: "clock"   },
  completed: { action: "Project Completed",   nextStatus: null,        btnClass: "pr-btn-success",  icon: "check"   },
  cancelled: { action: "Project Cancelled",   nextStatus: null,        btnClass: "pr-btn-danger",   icon: "x"       },
};

/* ─── Status Action Button ───────────────────────────── */
function StatusActionBtn({ status, onTransition }) {
  const t = STATUS_TRANSITIONS[status];
  if (!t) return null;

  const icons = {
    play:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
    send:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    clock: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    check: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
    x:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  };

  return (
    <button
      className={`pr-status-action-btn ${t.btnClass}`}
      onClick={() => t.nextStatus && onTransition(t.nextStatus)}
      disabled={!t.nextStatus}
      title={t.nextStatus ? `Move to ${STATUS_META[t.nextStatus]?.label}` : t.action}
    >
      {icons[t.icon]}
      {t.action}
    </button>
  );
}

/* ─── Cancel Confirm Modal ───────────────────────────── */
function CancelModal({ projectTitle, onConfirm, onClose }) {
  const [reason, setReason] = useState("");
  return (
    <div className="pr-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="pr-modal pr-modal-sm">
        <div className="pr-modal-head">
          <h2 className="pr-modal-title">Cancel Project?</h2>
          <button className="pr-modal-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="pr-modal-body">
          <div className="pr-cancel-warning">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p>You are about to cancel <strong>{projectTitle}</strong>. This will notify the client and cannot be undone easily.</p>
          </div>
          <div className="pr-field">
            <label className="pr-label">Reason for cancellation <span className="pr-req">*</span></label>
            <textarea className="pr-textarea" rows={3} placeholder="e.g. Client requested cancellation, scope change…"
              value={reason} maxLength={300}
              onChange={(e) => setReason(e.target.value.slice(0, 300))} />
            <span className="pr-char-count">{reason.length}/300</span>
          </div>
        </div>
        <div className="pr-modal-foot">
          <button className="pr-btn-ghost" onClick={onClose}>Keep Project</button>
          <button
            className="pr-btn-cancel-confirm"
            onClick={() => { if (reason.trim()) onConfirm(); }}
            disabled={!reason.trim()}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            Yes, Cancel Project
          </button>
        </div>
      </div>
    </div>
  );
}
export default function ProjectDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [project, setProject] = useState(MOCK_PROJECT);
  const [activeSection, setActiveSection] = useState("overview");
  const [taskFilter, setTaskFilter] = useState("all");
  const [showAddTask, setShowAddTask] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [statusToast, setStatusToast] = useState(null);

  const handleStatusChange = (nextStatus) => {
    setProject((prev) => ({ ...prev, status: nextStatus }));
    const labels = { active: "Project started!", review: "Submitted for client review.", completed: "Project marked complete!", cancelled: "Project cancelled." };
    setStatusToast(labels[nextStatus] || "Status updated.");
    setTimeout(() => setStatusToast(null), 3500);
  };

  const handleCancel = () => {
    setShowCancel(false);
    handleStatusChange("cancelled");
  };

  const sm = STATUS_META[project.status];
  const pm = PRIORITY_META[project.priority];

  const filteredTasks = project.tasks.filter((t) =>
    taskFilter === "all" || t.status === taskFilter
  );

  const taskCounts = {
    all:         project.tasks.length,
    done:        project.tasks.filter((t) => t.status === "done").length,
    in_progress: project.tasks.filter((t) => t.status === "in_progress").length,
    todo:        project.tasks.filter((t) => t.status === "todo").length,
  };

  const toggleTask = (taskId) => {
    setProject((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === taskId ? { ...t, status: t.status === "done" ? "todo" : "done" } : t
      ),
    }));
  };

  const handleAddTask = (task) => {
    setProject((prev) => ({ ...prev, tasks: [...prev.tasks, task] }));
  };

  const handleFileDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    const newFiles = files.map((f) => ({
      id: "f" + Date.now() + Math.random(),
      name: f.name, size: f.size > 1048576 ? (f.size / 1048576).toFixed(1) + " MB" : Math.round(f.size / 1024) + " KB",
      type: f.name.split(".").pop().toLowerCase(),
      uploadedAt: new Date().toISOString().slice(0, 10),
    }));
    setProject((prev) => ({ ...prev, files: [...prev.files, ...newFiles] }));
  };

  const SECTIONS = ["overview", "tasks", "milestones", "files"];

  return (
    <DashboardLayout navItems={FREELANCER_NAV} pageTitle={project.title} pageSubtitle={`Client: ${project.client}`}>
      <div className="py-page pr-page">

        {/* ── Back + breadcrumb ── */}
        <div className="pr-detail-breadcrumb">
          <button className="pr-back-btn" onClick={() => navigate("/projects")}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Back to Projects
          </button>
        </div>

        {/* ── Project header card ── */}
        <div className="pr-detail-header">
          <div className="pr-detail-header-left">
            <div className="pr-detail-title-row">
              <h1 className="pr-detail-title">{project.title}</h1>
              <span className="pr-status-badge pr-status-badge-lg" style={{ color: sm.color, background: sm.bg }}>
                {sm.label}
              </span>
              <span className="pr-priority-dot pr-priority-dot-lg" style={{ background: pm.color }} title={pm.label + " priority"} />
            </div>
            <p className="pr-detail-desc">{project.description}</p>
            <div className="pr-detail-tags">
              {project.tags.map((t) => <span key={t} className="pr-tag">{t}</span>)}
            </div>
          </div>

          <div className="pr-detail-header-right">
            {/* Team members */}
            <div className="pr-team-row">
              {project.team.map((m) => (
                <div key={m.name} className="pr-team-member" title={`${m.name} · ${m.role}`}>
                  <div className="pr-team-avatar" style={{ background: m.color }}>{m.initials}</div>
                </div>
              ))}
              <span className="pr-team-label">{project.team.length} members</span>
            </div>

            {/* Key dates */}
            <div className="pr-detail-dates">
              <div className="pr-date-item">
                <span className="pr-date-label">Start</span>
                <span className="pr-date-val">{fmtDate(project.startDate)}</span>
              </div>
              <div className="pr-date-sep" />
              <div className="pr-date-item">
                <span className="pr-date-label">Due</span>
                <span className="pr-date-val">{fmtDate(project.dueDate)}</span>
              </div>
            </div>

            {/* ── Status action buttons ── */}
            <div className="pr-status-actions">
              <StatusActionBtn status={project.status} onTransition={handleStatusChange} />
              {["draft","active","review"].includes(project.status) && (
                <button className="pr-btn-cancel" onClick={() => setShowCancel(true)}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  Cancel Project
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Progress + budget stat strip ── */}
        <div className="pr-detail-stats">
          <div className="pr-detail-stat-card">
            <p className="pr-detail-stat-label">Overall Progress</p>
            <p className="pr-detail-stat-val">{project.progress}%</p>
            <div className="pr-progress-track pr-progress-track-lg">
              <div className="pr-progress-fill" style={{ width: `${project.progress}%`, background: "var(--color-primary)" }} />
            </div>
          </div>
          <div className="pr-detail-stat-card">
            <p className="pr-detail-stat-label">Tasks Completed</p>
            <p className="pr-detail-stat-val">{taskCounts.done}<span className="pr-detail-stat-sub">/{project.tasks.length}</span></p>
          </div>
          <div className="pr-detail-stat-card">
            <p className="pr-detail-stat-label">Milestones Done</p>
            <p className="pr-detail-stat-val">
              {project.milestones.filter((m) => m.status === "completed").length}
              <span className="pr-detail-stat-sub">/{project.milestones.length}</span>
            </p>
          </div>
          <div className="pr-detail-stat-card">
            <p className="pr-detail-stat-label">Budget Used</p>
            <p className="pr-detail-stat-val pr-budget-val">
              {fmtMoney(project.spent)}
              <span className="pr-detail-stat-sub"> / {fmtMoney(project.budget)}</span>
            </p>
            <div className="pr-progress-track pr-progress-track-lg">
              <div className="pr-progress-fill" style={{ width: `${Math.round(project.spent / project.budget * 100)}%`, background: "var(--color-warning)" }} />
            </div>
          </div>
        </div>

        {/* ── Section nav ── */}
        <div className="pr-section-nav">
          {SECTIONS.map((s) => (
            <button key={s} className={`pr-section-tab${activeSection === s ? " active" : ""}`}
              onClick={() => setActiveSection(s)}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* ════ OVERVIEW ════ */}
        {activeSection === "overview" && (
          <div className="pr-overview-grid">
            {/* Milestone summary */}
            <div className="pr-section-card">
              <div className="pr-section-card-head">
                <h3 className="pr-section-card-title">Milestones</h3>
                <button className="pr-section-tab-link" onClick={() => setActiveSection("milestones")}>View all →</button>
              </div>
              {project.milestones.map((m) => {
                const mSm = STATUS_META[m.status];
                return (
                  <div key={m.id} className="pr-milestone-row">
                    <div className={`pr-milestone-dot ${m.status}`} />
                    <div className="pr-milestone-info">
                      <p className="pr-milestone-title">{m.title}</p>
                      <p className="pr-milestone-meta">{m.tasksDone}/{m.tasks} tasks · Due {fmtDate(m.dueDate)}</p>
                    </div>
                    <span className="pr-status-badge" style={{ color: mSm.color, background: mSm.bg, fontSize: "11px" }}>{mSm.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Recent tasks */}
            <div className="pr-section-card">
              <div className="pr-section-card-head">
                <h3 className="pr-section-card-title">Recent Tasks</h3>
                <button className="pr-section-tab-link" onClick={() => setActiveSection("tasks")}>View all →</button>
              </div>
              {project.tasks.slice(0, 5).map((t) => {
                const ts = TASK_STATUS[t.status];
                return (
                  <div key={t.id} className="pr-task-row">
                    <button className={`pr-task-check${t.status === "done" ? " done" : ""}`}
                      onClick={() => toggleTask(t.id)} title="Toggle done">
                      {t.status === "done" && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                    </button>
                    <p className={`pr-task-title${t.status === "done" ? " done" : ""}`}>{t.title}</p>
                    <span className="pr-priority-dot pr-priority-dot-xs" style={{ background: PRIORITY_META[t.priority].color }} />
                    <span className="pr-task-badge" style={{ color: ts.color, background: ts.bg }}>{ts.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Files */}
            <div className="pr-section-card">
              <div className="pr-section-card-head">
                <h3 className="pr-section-card-title">Files</h3>
                <button className="pr-section-tab-link" onClick={() => setActiveSection("files")}>View all →</button>
              </div>
              {project.files.slice(0, 3).map((f) => {
                const fi = FILE_ICONS[f.type] || { icon: "FILE", color: "#8892B0", bg: "rgba(136,146,176,0.12)" };
                return (
                  <div key={f.id} className="pr-file-row">
                    <div className="pr-file-icon" style={{ color: fi.color, background: fi.bg }}>{fi.icon}</div>
                    <div className="pr-file-info">
                      <p className="pr-file-name">{f.name}</p>
                      <p className="pr-file-meta">{f.size} · {fmtDate(f.uploadedAt)}</p>
                    </div>
                    <button className="pr-file-dl" title="Download">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Team */}
            <div className="pr-section-card">
              <div className="pr-section-card-head">
                <h3 className="pr-section-card-title">Team Members</h3>
              </div>
              {project.team.map((m) => (
                <div key={m.name} className="pr-team-detail-row">
                  <div className="pr-team-avatar pr-team-avatar-lg" style={{ background: m.color }}>{m.initials}</div>
                  <div>
                    <p className="pr-team-name">{m.name}</p>
                    <p className="pr-team-role">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════ TASKS ════ */}
        {activeSection === "tasks" && (
          <div className="pr-section-card pr-tasks-section">
            <div className="pr-section-card-head">
              <div className="pr-task-filter-tabs">
                {[["all","All"],["todo","To Do"],["in_progress","In Progress"],["done","Done"]].map(([k,l]) => (
                  <button key={k} className={`pr-tab pr-tab-sm${taskFilter === k ? " active" : ""}`}
                    onClick={() => setTaskFilter(k)}>
                    {l} <span className="pr-tab-count">{taskCounts[k]}</span>
                  </button>
                ))}
              </div>
              <button className="pr-btn-primary pr-btn-sm-size" onClick={() => setShowAddTask(true)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Task
              </button>
            </div>

            {filteredTasks.length === 0 ? (
              <p className="pr-empty-sub" style={{ padding: "24px 0", textAlign: "center" }}>No tasks in this category yet.</p>
            ) : (
              <div className="pr-full-task-list">
                {filteredTasks.map((t) => {
                  const ts = TASK_STATUS[t.status];
                  const pm2 = PRIORITY_META[t.priority];
                  const mileLabel = project.milestones.find((m) => m.id === t.milestone)?.title || "";
                  return (
                    <div key={t.id} className="pr-full-task-row">
                      <button className={`pr-task-check${t.status === "done" ? " done" : ""}`}
                        onClick={() => toggleTask(t.id)}>
                        {t.status === "done" && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"/></svg>}
                      </button>
                      <div className="pr-full-task-info">
                        <p className={`pr-task-title${t.status === "done" ? " done" : ""}`}>{t.title}</p>
                        <p className="pr-full-task-meta">
                          <span className="pr-milestone-chip">{mileLabel}</span>
                          · Due {fmtDate(t.dueDate)}
                        </p>
                      </div>
                      <span className="pr-priority-dot" style={{ background: pm2.color }} title={pm2.label} />
                      <span className="pr-task-badge pr-task-badge-lg" style={{ color: ts.color, background: ts.bg }}>{ts.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ════ MILESTONES ════ */}
        {activeSection === "milestones" && (
          <div className="pr-milestones-list">
            {project.milestones.map((m, idx) => {
              const mSm = STATUS_META[m.status];
              const pct = m.tasks > 0 ? Math.round(m.tasksDone / m.tasks * 100) : 0;
              return (
                <div key={m.id} className="pr-milestone-card">
                  <div className="pr-milestone-card-num">{idx + 1}</div>
                  <div className="pr-milestone-card-body">
                    <div className="pr-milestone-card-head">
                      <h3 className="pr-milestone-card-title">{m.title}</h3>
                      <span className="pr-status-badge" style={{ color: mSm.color, background: mSm.bg }}>{mSm.label}</span>
                    </div>
                    <div className="pr-milestone-card-meta">
                      <span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                        {m.tasksDone}/{m.tasks} tasks
                      </span>
                      <span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        Due {fmtDate(m.dueDate)}
                      </span>
                    </div>
                    <div className="pr-milestone-progress">
                      <div className="pr-progress-track pr-progress-track-lg">
                        <div className="pr-progress-fill" style={{ width: `${pct}%`, background: pct === 100 ? "var(--color-success)" : "var(--color-primary)" }} />
                      </div>
                      <span className="pr-progress-pct">{pct}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ════ FILES ════ */}
        {activeSection === "files" && (
          <div className="pr-files-section">
            {/* Drop zone */}
            <div
              className={`pr-drop-zone${dragOver ? " drag-over" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <p className="pr-drop-title">Drag &amp; drop files here</p>
              <p className="pr-drop-sub">or</p>
              <label className="pr-btn-outline pr-upload-label">
                Browse Files
                <input type="file" multiple style={{ display: "none" }}
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    const newFiles = files.map((f) => ({
                      id: "f" + Date.now() + Math.random(),
                      name: f.name, size: f.size > 1048576 ? (f.size / 1048576).toFixed(1) + " MB" : Math.round(f.size / 1024) + " KB",
                      type: f.name.split(".").pop().toLowerCase(),
                      uploadedAt: new Date().toISOString().slice(0, 10),
                    }));
                    setProject((prev) => ({ ...prev, files: [...prev.files, ...newFiles] }));
                  }}
                />
              </label>
              <p className="pr-drop-hint">Max 50 MB per file · PDF, ZIP, Fig, XLS, IMG, DOC</p>
            </div>

            {/* File list */}
            <div className="pr-files-grid">
              {project.files.map((f) => {
                const fi = FILE_ICONS[f.type] || { icon: "FILE", color: "#8892B0", bg: "rgba(136,146,176,0.12)" };
                return (
                  <div key={f.id} className="pr-file-card">
                    <div className="pr-file-card-icon" style={{ color: fi.color, background: fi.bg }}>{fi.icon}</div>
                    <div className="pr-file-card-info">
                      <p className="pr-file-name">{f.name}</p>
                      <p className="pr-file-meta">{f.size} · {fmtDate(f.uploadedAt)}</p>
                    </div>
                    <div className="pr-file-card-actions">
                      <button className="pr-file-dl" title="Download">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      </button>
                      <button className="pr-file-delete" title="Delete"
                        onClick={() => setProject((prev) => ({ ...prev, files: prev.files.filter((x) => x.id !== f.id) }))}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {showAddTask && (
          <AddTaskModal
            milestones={project.milestones}
            onClose={() => setShowAddTask(false)}
            onAdd={handleAddTask}
          />
        )}

        {showCancel && (
          <CancelModal
            projectTitle={project.title}
            onConfirm={handleCancel}
            onClose={() => setShowCancel(false)}
          />
        )}

        {/* ── Status toast ── */}
        {statusToast && (
          <div className="pr-status-toast">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            {statusToast}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}