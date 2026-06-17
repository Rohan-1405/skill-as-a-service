// ============================================================
// SkillAsAService — PlanCreationForms.jsx
// Author: Praveen Gorla  |  Day 5
// UPDATE: Added Edit, Delete and Extend Plan actions on saved
//         plans (previously only had Show/Hide Preview + the
//         Active/Paused toggle — no real edit/delete affordance).
//
//   • Edit         -> re-opens the pre-filled form for that plan
//   • Delete       -> removes the saved plan (inline confirm step)
//   • Extend Plan  -> pushes the plan's "valid until" date forward
//                     by 30 days (plans don't expire in the BRD,
//                     this is a renewal-style convenience action)
// ============================================================

import React, { useState } from "react";
import PlanCreateForm from "../../components/subscription/PlanCreateForm";
import "../../styles/subscription.css";

const PLAN_TYPES = [
  { id: "basic",    label: "Basic",    icon: "🔵", color: "cyan", desc: "Entry-level plan for new clients" },
  { id: "standard", label: "Standard", icon: "⭐", color: "blue", desc: "Most popular — balanced value" },
  { id: "premium",  label: "Premium",  icon: "👑", color: "gold", desc: "High-value dedicated capacity" },
];

const EMPTY_PLAN = {
  plan_name: "",
  price: "",
  billing_cycle: "monthly",
  description: "",
  delivery_days: "",
  revisions: "",
  requests: "",
  features: [""],
  status: "active",
};

const EXTEND_DAYS = 30;

const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function PlanCreationForms() {
  const [activePlan, setActivePlan]     = useState("basic");
  const [savedPlans, setSavedPlans]     = useState({ basic: null, standard: null, premium: null });
  const [isEditing, setIsEditing]       = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [alert, setAlert]               = useState({ msg: "", type: "success" }); // type: success | danger | info

  const currentMeta = PLAN_TYPES.find((p) => p.id === activePlan);
  const savedCount  = Object.values(savedPlans).filter(Boolean).length;
  const currentPlan = savedPlans[activePlan];

  const showAlert = (msg, type = "success", ttl = 5000) => {
    setAlert({ msg, type });
    setTimeout(() => setAlert({ msg: "", type }), ttl);
  };

  // ── Save (create OR update) ───────────────────────────────────
  const handleSave = (data) => {
    const validUntil = currentPlan?.valid_until || addDays(new Date(), EXTEND_DAYS);
    const updated = { ...data, valid_until: validUntil, updated_at: new Date().toISOString() };

    setSavedPlans((prev) => ({ ...prev, [activePlan]: updated }));
    setIsEditing(false);
    setDeleteConfirm(false);

    showAlert(
      currentPlan
        ? `✅ ${data.plan_name} updated successfully.`
        : `✅ ${data.plan_name} saved successfully! Price: ₹${Number(data.price).toLocaleString("en-IN")}/month`
    );
  };

  const handleFormCancel = () => {
    setIsEditing(false);
    setAlert({ msg: "", type: "success" });
  };

  const handleTabSwitch = (planId) => {
    setActivePlan(planId);
    setIsEditing(false);
    setDeleteConfirm(false);
    setAlert({ msg: "", type: "success" });
  };

  // ── Edit ─────────────────────────────────────────────────────
  const handleEdit = () => {
    setDeleteConfirm(false);
    setIsEditing(true);
  };

  // ── Delete ───────────────────────────────────────────────────
  const handleDeleteRequest = () => setDeleteConfirm(true);
  const handleDeleteCancel  = () => setDeleteConfirm(false);

  const handleDeleteConfirm = () => {
    const name = currentPlan?.plan_name || currentMeta.label;
    setSavedPlans((prev) => ({ ...prev, [activePlan]: null }));
    setDeleteConfirm(false);
    setIsEditing(false);
    showAlert(`🗑️ ${name} plan was deleted.`, "danger");
  };

  // ── Extend ───────────────────────────────────────────────────
  const handleExtend = () => {
    if (!currentPlan) return;
    const newValidUntil = addDays(currentPlan.valid_until || new Date(), EXTEND_DAYS);
    setSavedPlans((prev) => ({
      ...prev,
      [activePlan]: { ...currentPlan, valid_until: newValidUntil },
    }));
    showAlert(`⏳ ${currentPlan.plan_name} extended by ${EXTEND_DAYS} days. New validity: ${formatDate(newValidUntil)}`);
  };

  const alertClass = alert.type === "danger" ? "alert-danger" : alert.type === "info" ? "alert-info" : "alert-success";
  const showForm = !currentPlan || isEditing;

  return (
    <div className="pcforms-page">

      {/* ── Page Header ── */}
      <div className="pcforms-header">
        <div>
          <h1 className="pcforms-title">Plan Creation Forms</h1>
          <p className="pcforms-subtitle">
            Create your Basic, Standard and Premium subscription plans.
            Clients will see these on your profile.
          </p>
        </div>
        <span className="sp-badge-count">{savedCount}/3 Plans Saved</span>
      </div>

      {/* ── Plan Type Tabs ── */}
      <div className="pcforms-tabs">
        {PLAN_TYPES.map((plan) => (
          <button
            key={plan.id}
            className={`pcforms-tab ${activePlan === plan.id ? "pcforms-tab-active" : ""}`}
            onClick={() => handleTabSwitch(plan.id)}
          >
            <span className="pcforms-tab-icon">{plan.icon}</span>
            <span className="pcforms-tab-label">{plan.label}</span>
            {savedPlans[plan.id] && (
              <span className="pcforms-tab-saved">✓</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Alert ── */}
      {alert.msg && (
        <div className={`alert ${alertClass} sp-alert`} style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          {alert.msg}
        </div>
      )}

      {/* ── Active Plan Section ── */}
      <div className="pcforms-form-card">
        <div className="pcforms-form-header">
          <div>
            <h2 className="pcforms-form-title">
              {currentMeta.icon} {currentMeta.label} Plan
            </h2>
            <p className="pcforms-form-desc">{currentMeta.desc}</p>
          </div>

          {currentPlan && (
            <div className="pcforms-action-row">
              <span className="badge badge-success">● Saved</span>
              {!isEditing && !deleteConfirm && (
                <>
                  <button type="button" className="btn btn-outline btn-sm" onClick={handleEdit}>
                    ✏️ Edit
                  </button>
                  <button type="button" className="btn pcforms-btn-extend btn-sm" onClick={handleExtend}>
                    ⏳ Extend Plan
                  </button>
                  <button type="button" className="btn btn-danger btn-sm" onClick={handleDeleteRequest}>
                    🗑️ Delete
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* ── Delete confirmation ── */}
        {deleteConfirm && (
          <div className="pcforms-confirm-box">
            <div>
              <strong>Delete this plan?</strong>
              <p>This removes "{currentPlan.plan_name}" from your profile. Clients already subscribed won't be affected, but no one new can subscribe to it.</p>
            </div>
            <div className="pcforms-confirm-actions">
              <button type="button" className="btn btn-secondary btn-sm" onClick={handleDeleteCancel}>Keep Plan</button>
              <button type="button" className="btn btn-danger btn-sm" onClick={handleDeleteConfirm}>Yes, Delete</button>
            </div>
          </div>
        )}

        {/* ── Saved Plan Summary (read view) ── */}
        {currentPlan && !showForm && !deleteConfirm && (
          <div className="pcforms-summary-card">
            <div className="pcforms-summary-validity">
              📅 Valid until <strong>{formatDate(currentPlan.valid_until)}</strong>
              {currentPlan.status === "paused" && <span className="badge badge-muted" style={{ marginLeft: 10 }}>⏸ Paused</span>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 12 }}>
              {[
                { l: "Plan Name",     v: currentPlan.plan_name },
                { l: "Price",         v: `₹${Number(currentPlan.price).toLocaleString("en-IN")}/month` },
                { l: "Billing Cycle", v: currentPlan.billing_cycle },
                { l: "Delivery",      v: `${currentPlan.delivery_days} days` },
                { l: "Requests",      v: currentPlan.requests + "/month" },
                { l: "Revisions",     v: currentPlan.revisions },
              ].map((item) => (
                <div key={item.l}>
                  <div style={{ fontSize: 10, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>{item.l}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text)" }}>{item.v}</div>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 10, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Features Included</div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
                {currentPlan.features.map((f, i) => (
                  <li key={i} style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: "var(--color-success)" }}>✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ── Create / Edit form ── */}
        {showForm && (
          <PlanCreateForm
            key={`${activePlan}-${isEditing ? "edit" : "new"}`}
            planType={activePlan}
            initialData={currentPlan || { ...EMPTY_PLAN, plan_name: currentMeta.label + " Plan" }}
            onSave={handleSave}
            onCancel={handleFormCancel}
            submitLabel={isEditing ? "Update Plan" : "Save Plan"}
          />
        )}
      </div>

      {/* ── Plan Status Summary ── */}
      <div className="pcforms-summary">
        {PLAN_TYPES.map((plan) => (
          <div
            key={plan.id}
            className={`pcforms-summary-item ${savedPlans[plan.id] ? "pcforms-summary-saved" : ""}`}
            onClick={() => handleTabSwitch(plan.id)}
          >
            <span className="pcforms-summary-icon">{plan.icon}</span>
            <span className="pcforms-summary-label">{plan.label}</span>
            <span className="pcforms-summary-status">
              {savedPlans[plan.id]
                ? `₹${Number(savedPlans[plan.id].price).toLocaleString("en-IN")}/mo`
                : "Not created"}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}
