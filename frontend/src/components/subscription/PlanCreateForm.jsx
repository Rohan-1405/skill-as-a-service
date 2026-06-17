import React, { useState } from "react";

const BILLING_CYCLES = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
];

export default function PlanCreateForm({ planType, initialData, onSave, onCancel, submitLabel = "Save Plan" }) {
  const [form, setForm] = useState({ ...initialData });
  const [errors, setErrors] = useState({});

  // ── Generic change ──────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ── Features (dynamic list) ─────────────────────────────────────
  const handleFeatureChange = (index, value) => {
    const updated = [...form.features];
    updated[index] = value;
    setForm((prev) => ({ ...prev, features: updated }));
    // Clear the features error as soon as user types anything
    if (errors.features) setErrors((prev) => ({ ...prev, features: "" }));
  };

  const addFeature = () => {
    if (form.features.length < 10) {
      setForm((prev) => ({ ...prev, features: [...prev.features, ""] }));
    }
  };

  const removeFeature = (index) => {
    const updated = form.features.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, features: updated.length ? updated : [""] }));
  };

  // ── Validation ──────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.plan_name.trim()) e.plan_name = "Plan name is required.";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0)
      e.price = "Enter a valid price greater than 0.";
    if (!form.description.trim()) e.description = "Description is required.";
    if (!form.delivery_days || isNaN(form.delivery_days) || Number(form.delivery_days) < 1)
      e.delivery_days = "Enter valid delivery days (min 1).";
    if (!form.requests || isNaN(form.requests) || Number(form.requests) < 1)
      e.requests = "Enter number of requests (min 1).";
    if (form.revisions === "" || isNaN(form.revisions) || Number(form.revisions) < 0)
      e.revisions = "Enter revisions (0 = none).";
    const filledFeatures = form.features.filter((f) => f.trim());
    if (filledFeatures.length === 0) e.features = "Add at least one feature.";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    // Clean empty features
    const cleaned = { ...form, features: form.features.filter((f) => f.trim()) };
    onSave(cleaned);
  };

  return (
    <form className="pcf-form" onSubmit={handleSubmit} noValidate>
      <div className="pcf-grid">

        {/* ── Left Column ── */}
        <div className="pcf-col">

          {/* Plan Name */}
          <div className="input-group">
            <label className="input-label">Plan Name *</label>
            <div className="input-wrap">
              <span className="input-icon">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 0 1 0 2.828l-7 7a2 2 0 0 1-2.828 0l-7-7A2 2 0 0 1 3 12V7a4 4 0 0 1 4-4z" />
                </svg>
              </span>
              <input
                type="text"
                name="plan_name"
                className={`input-field ${errors.plan_name ? "is-error" : ""}`}
                placeholder="e.g. Basic Plan"
                value={form.plan_name}
                onChange={handleChange}
              />
            </div>
            {errors.plan_name && <span className="input-error">⚠ {errors.plan_name}</span>}
          </div>

          {/* Price + Billing Cycle */}
          <div className="pcf-row-2">
            <div className="input-group">
              <label className="input-label">Monthly Price (₹) *</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.062.208 1.7.896 1.7 1.865h1.052c.113-1.666-1.22-2.84-2.752-2.983V1H8.634v1.35c-2.072.177-3.6 1.353-3.6 3.09 0 1.49.95 2.465 2.78 2.948l.82.207v3.494c-1.113-.232-1.85-1.018-1.85-2.029H4zm2.08-5.874c0-.953.702-1.795 1.82-1.953V6.44c-1.196-.37-1.82-.862-1.82-1.533zm1.876 5.171v-3.443c1.35.37 2.02.89 2.02 1.74 0 .916-.75 1.638-2.02 1.703z" />
                  </svg>
                </span>
                <input
                  type="number"
                  name="price"
                  className={`input-field ${errors.price ? "is-error" : ""}`}
                  placeholder="e.g. 2999"
                  min="1"
                  value={form.price}
                  onChange={handleChange}
                />
              </div>
              {errors.price && <span className="input-error">⚠ {errors.price}</span>}
            </div>

            <div className="input-group">
              <label className="input-label">Billing Cycle *</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15" />
                  </svg>
                </span>
                <select
                  name="billing_cycle"
                  className="input-field pcf-select"
                  value={form.billing_cycle}
                  onChange={handleChange}
                >
                  {BILLING_CYCLES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="input-group">
            <label className="input-label">Plan Description *</label>
            <textarea
              name="description"
              rows={4}
              className={`input-field no-icon pcf-textarea ${errors.description ? "is-error" : ""}`}
              placeholder="Describe what clients get with this plan..."
              value={form.description}
              onChange={handleChange}
            />
            {errors.description && <span className="input-error">⚠ {errors.description}</span>}
          </div>

          {/* Status */}
          <div className="input-group">
            <label className="input-label">Plan Status</label>
            <div className="pcf-toggle-group">
              {["active", "paused"].map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`pcf-toggle-btn ${form.status === s ? "pcf-toggle-active" : ""}`}
                  onClick={() => setForm((prev) => ({ ...prev, status: s }))}
                >
                  {s === "active" ? "🟢 Active" : "⏸ Paused"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Column ── */}
        <div className="pcf-col">

          {/* Delivery + Requests + Revisions */}
          <div className="pcf-row-3">
            <div className="input-group">
              <label className="input-label">Delivery (Days) *</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeLinecap="round" />
                    <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round" />
                    <line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round" />
                    <line x1="3" y1="10" x2="21" y2="10" strokeLinecap="round" />
                  </svg>
                </span>
                <input
                  type="number"
                  name="delivery_days"
                  className={`input-field ${errors.delivery_days ? "is-error" : ""}`}
                  placeholder="7"
                  min="1"
                  value={form.delivery_days}
                  onChange={handleChange}
                />
              </div>
              {errors.delivery_days && <span className="input-error">⚠ {errors.delivery_days}</span>}
            </div>

            <div className="input-group">
              <label className="input-label">No. of Requests *</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
                  </svg>
                </span>
                <input
                  type="number"
                  name="requests"
                  className={`input-field ${errors.requests ? "is-error" : ""}`}
                  placeholder="5"
                  min="1"
                  value={form.requests}
                  onChange={handleChange}
                />
              </div>
              {errors.requests && <span className="input-error">⚠ {errors.requests}</span>}
            </div>

            <div className="input-group">
              <label className="input-label">Revisions *</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <polyline points="1 4 1 10 7 10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3.51 15a9 9 0 1 0 .49-3.53" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <input
                  type="number"
                  name="revisions"
                  className={`input-field ${errors.revisions ? "is-error" : ""}`}
                  placeholder="2"
                  min="0"
                  value={form.revisions}
                  onChange={handleChange}
                />
              </div>
              {errors.revisions && <span className="input-error">⚠ {errors.revisions}</span>}
            </div>
          </div>

          {/* Features List */}
          <div className="input-group">
            <label className="input-label">What's Included (Features) *</label>
            {form.features.map((feat, i) => (
              <div key={i} className="pcf-feature-row">
                <div className="input-wrap" style={{ flex: 1 }}>
                  <span className="input-icon">
                    <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16" style={{ color: "var(--color-success)" }}>
                      <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    className="input-field"
                    placeholder={`Feature ${i + 1}, e.g. 3 page designs`}
                    value={feat}
                    onChange={(e) => handleFeatureChange(i, e.target.value)}
                  />
                </div>
                {form.features.length > 1 && (
                  <button
                    type="button"
                    className="pcf-feature-remove"
                    onClick={() => removeFeature(i)}
                    title="Remove feature"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            {errors.features && <span className="input-error">⚠ {errors.features}</span>}
            {form.features.length < 10 && (
              <button type="button" className="pcf-add-feature-btn" onClick={addFeature}>
                + Add Feature
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="pcf-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
