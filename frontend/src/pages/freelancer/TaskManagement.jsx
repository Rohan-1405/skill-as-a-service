import React, { useState } from "react";

const initialTasks = [
  {
    id: 1,
    title: "Design landing page wireframes",
    project: "E-Commerce Redesign",
    assignee: "Praveen G.",
    priority: "high",
    status: "active",
    due: "2026-06-25",
    milestone: "UI Phase",
  },
  {
    id: 2,
    title: "Integrate Stripe payment gateway",
    project: "SkillAsAService",
    assignee: "Rohan K.",
    priority: "high",
    status: "pending",
    due: "2026-06-22",
    milestone: "Payment Module",
  },
  {
    id: 3,
    title: "Write unit tests for auth service",
    project: "SkillAsAService",
    assignee: "Lohith S.",
    priority: "medium",
    status: "review",
    due: "2026-06-23",
    milestone: "Auth Module",
  },
  {
    id: 4,
    title: "Setup CI/CD pipeline",
    project: "DevOps Setup",
    assignee: "Rohan K.",
    priority: "medium",
    status: "completed",
    due: "2026-06-20",
    milestone: "Infrastructure",
  },
  {
    id: 5,
    title: "Create subscription plan UI",
    project: "SkillAsAService",
    assignee: "Praveen G.",
    priority: "low",
    status: "active",
    due: "2026-06-26",
    milestone: "Subscription Module",
  },
  {
    id: 6,
    title: "Database schema optimization",
    project: "SkillAsAService",
    assignee: "Rohan K.",
    priority: "low",
    status: "pending",
    due: "2026-06-28",
    milestone: "DB Layer",
  },
];

const STATUSES = ["all", "pending", "active", "review", "completed"];
const PRIORITIES = ["all", "high", "medium", "low"];

const priorityColor = {
  high: { bg: "rgba(255,83,112,.12)", color: "#FF5370" },
  medium: { bg: "rgba(245,166,35,.12)", color: "#F5A623" },
  low: { bg: "rgba(100,255,218,.10)", color: "#64FFDA" },
};

const statusClass = {
  active: "status-active",
  pending: "status-pending",
  review: "status-review",
  completed: "status-completed",
  cancelled: "status-cancelled",
};

const statusLabel = {
  active: "Active",
  pending: "Pending",
  review: "In Review",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function TaskManagement() {
  const [tasks, setTasks] = useState(initialTasks);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [form, setForm] = useState({
    title: "",
    project: "",
    assignee: "",
    priority: "medium",
    status: "pending",
    due: "",
    milestone: "",
  });

  const filtered = tasks.filter((t) => {
    const matchStatus = filterStatus === "all" || t.status === filterStatus;
    const matchPriority = filterPriority === "all" || t.priority === filterPriority;
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.project.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchPriority && matchSearch;
  });

  const counts = {
    all: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    active: tasks.filter((t) => t.status === "active").length,
    review: tasks.filter((t) => t.status === "review").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  function openAdd() {
    setEditTask(null);
    setForm({ title: "", project: "", assignee: "", priority: "medium", status: "pending", due: "", milestone: "" });
    setShowModal(true);
  }

  function openEdit(task) {
    setEditTask(task);
    setForm({ ...task });
    setShowModal(true);
  }

  function handleSave() {
    if (!form.title.trim()) return;
    if (editTask) {
      setTasks((prev) => prev.map((t) => (t.id === editTask.id ? { ...t, ...form } : t)));
    } else {
      setTasks((prev) => [...prev, { ...form, id: Date.now() }]);
    }
    setShowModal(false);
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function changeStatus(id, status) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", padding: "32px 40px", fontFamily: "var(--font-family)" }}>
      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--color-text)", marginBottom: 4 }}>Task Management</h1>
          <p style={{ fontSize: 13, color: "var(--color-text-muted)" }}>Manage and track all project tasks</p>
        </div>
        <button
          onClick={openAdd}
          style={{
            background: "var(--gradient-blue)", color: "#fff", border: "none",
            borderRadius: "var(--radius-sm)", padding: "10px 20px",
            fontSize: 14, fontWeight: 600, cursor: "pointer",
            boxShadow: "var(--shadow-btn)", display: "flex", alignItems: "center", gap: 8,
          }}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Add Task
        </button>
      </div>

      {/* ── Stat Tabs ── */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            style={{
              padding: "8px 18px", borderRadius: "var(--radius-full)",
              border: filterStatus === s ? "1.5px solid var(--color-primary)" : "1.5px solid var(--color-border)",
              background: filterStatus === s ? "rgba(26,159,224,.12)" : "var(--color-bg-card)",
              color: filterStatus === s ? "var(--color-primary)" : "var(--color-text-secondary)",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}
          >
            {s === "all" ? "All" : statusLabel[s]}
            <span style={{
              marginLeft: 8, background: filterStatus === s ? "var(--color-primary)" : "var(--color-border)",
              color: "#fff", borderRadius: "var(--radius-full)", padding: "1px 7px", fontSize: 11,
            }}>{counts[s] ?? 0}</span>
          </button>
        ))}
      </div>

      {/* ── Filters ── */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)", fontSize: 14 }}>🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks or projects..."
            style={{
              width: "100%", background: "var(--color-bg-input)", border: "1.5px solid var(--color-border)",
              borderRadius: "var(--radius-sm)", padding: "9px 12px 9px 36px",
              color: "var(--color-text)", fontSize: 13, outline: "none",
            }}
          />
        </div>
        {/* Priority filter */}
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          style={{
            background: "var(--color-bg-input)", border: "1.5px solid var(--color-border)",
            borderRadius: "var(--radius-sm)", padding: "9px 14px",
            color: "var(--color-text)", fontSize: 13, outline: "none", cursor: "pointer",
          }}
        >
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>{p === "all" ? "All Priorities" : p.charAt(0).toUpperCase() + p.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* ── Task Table ── */}
      <div style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        {/* Table Header */}
        <div style={{
          display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 100px 110px 120px 100px",
          padding: "12px 20px", borderBottom: "1px solid var(--color-border)",
          background: "var(--color-bg-secondary)",
        }}>
          {["Task", "Project", "Assignee", "Priority", "Status", "Due Date", "Actions"].map((h) => (
            <span key={h} style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: ".06em" }}>{h}</span>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center", color: "var(--color-text-muted)", fontSize: 14 }}>
            No tasks found. Try adjusting your filters.
          </div>
        ) : (
          filtered.map((task, i) => (
            <div
              key={task.id}
              style={{
                display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 100px 110px 120px 100px",
                padding: "14px 20px", alignItems: "center",
                borderBottom: i < filtered.length - 1 ? "1px solid var(--color-border)" : "none",
                transition: "background .15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-bg-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {/* Title */}
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text)", marginBottom: 2 }}>{task.title}</p>
                <p style={{ fontSize: 12, color: "var(--color-text-muted)" }}>📍 {task.milestone}</p>
              </div>

              {/* Project */}
              <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{task.project}</span>

              {/* Assignee */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: "var(--gradient-blue)", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0,
                }}>
                  {task.assignee.charAt(0)}
                </div>
                <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{task.assignee}</span>
              </div>

              {/* Priority */}
              <span style={{
                display: "inline-flex", alignItems: "center", padding: "3px 10px",
                borderRadius: "var(--radius-full)", fontSize: 11, fontWeight: 600,
                background: priorityColor[task.priority]?.bg,
                color: priorityColor[task.priority]?.color,
              }}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>

              {/* Status */}
              <select
                value={task.status}
                onChange={(e) => changeStatus(task.id, e.target.value)}
                style={{
                  background: "var(--color-bg-input)", border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-sm)", padding: "4px 8px",
                  color: "var(--color-text)", fontSize: 12, cursor: "pointer", outline: "none",
                }}
              >
                {["pending", "active", "review", "completed", "cancelled"].map((s) => (
                  <option key={s} value={s}>{statusLabel[s]}</option>
                ))}
              </select>

              {/* Due Date */}
              <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{task.due}</span>

              {/* Actions */}
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => openEdit(task)}
                  style={{
                    background: "rgba(26,159,224,.12)", color: "var(--color-primary)",
                    border: "none", borderRadius: "var(--radius-sm)",
                    padding: "5px 10px", fontSize: 12, cursor: "pointer", fontWeight: 600,
                  }}
                >Edit</button>
                <button
                  onClick={() => deleteTask(task.id)}
                  style={{
                    background: "rgba(255,83,112,.10)", color: "var(--color-danger)",
                    border: "none", borderRadius: "var(--radius-sm)",
                    padding: "5px 10px", fontSize: 12, cursor: "pointer", fontWeight: 600,
                  }}
                >Del</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Add/Edit Modal ── */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,.7)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999,
        }}>
          <div style={{
            background: "var(--color-bg-card)", border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)", padding: "28px 32px", width: 500,
            boxShadow: "var(--shadow-card)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--color-text)" }}>
                {editTask ? "Edit Task" : "Add New Task"}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "var(--color-text-muted)", fontSize: 20, cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "Task Title", key: "title", placeholder: "Enter task title" },
                { label: "Project", key: "project", placeholder: "Project name" },
                { label: "Assignee", key: "assignee", placeholder: "Assignee name" },
                { label: "Milestone", key: "milestone", placeholder: "Milestone name" },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-secondary)", display: "block", marginBottom: 6 }}>{label}</label>
                  <input
                    value={form[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    style={{
                      width: "100%", background: "var(--color-bg-input)", border: "1.5px solid var(--color-border)",
                      borderRadius: "var(--radius-sm)", padding: "9px 12px",
                      color: "var(--color-text)", fontSize: 13, outline: "none",
                    }}
                  />
                </div>
              ))}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-secondary)", display: "block", marginBottom: 6 }}>Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
                    style={{ width: "100%", background: "var(--color-bg-input)", border: "1.5px solid var(--color-border)", borderRadius: "var(--radius-sm)", padding: "9px 10px", color: "var(--color-text)", fontSize: 13, outline: "none" }}
                  >
                    {["high", "medium", "low"].map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-secondary)", display: "block", marginBottom: 6 }}>Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    style={{ width: "100%", background: "var(--color-bg-input)", border: "1.5px solid var(--color-border)", borderRadius: "var(--radius-sm)", padding: "9px 10px", color: "var(--color-text)", fontSize: 13, outline: "none" }}
                  >
                    {["pending", "active", "review", "completed"].map((s) => <option key={s} value={s}>{statusLabel[s]}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-secondary)", display: "block", marginBottom: 6 }}>Due Date</label>
                  <input
                    type="date"
                    value={form.due}
                    onChange={(e) => setForm((f) => ({ ...f, due: e.target.value }))}
                    style={{ width: "100%", background: "var(--color-bg-input)", border: "1.5px solid var(--color-border)", borderRadius: "var(--radius-sm)", padding: "9px 10px", color: "var(--color-text)", fontSize: 13, outline: "none", colorScheme: "dark" }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24 }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: "var(--color-bg-input)", color: "var(--color-text)", border: "1.5px solid var(--color-border)", borderRadius: "var(--radius-sm)", padding: "9px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
              >Cancel</button>
              <button
                onClick={handleSave}
                style={{ background: "var(--gradient-blue)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", padding: "9px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: "var(--shadow-btn)" }}
              >{editTask ? "Save Changes" : "Add Task"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
