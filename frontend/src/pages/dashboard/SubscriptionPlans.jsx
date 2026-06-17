import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { FREELANCER_NAV } from '../../constants/navItems';
import '../../styles/subscription-plans.css';

/* ─────────────────────────────────────────
   DEMO MODE — set false when API is ready
───────────────────────────────────────── */
const DEMO_MODE = true;

const DEMO_PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: 4999,
    period: '/month',
    color: 'var(--color-info)',
    colorBg: 'rgba(50,220,253,0.08)',
    colorBorder: 'rgba(50,220,253,0.25)',
    features: [
      'Up to 2 active projects',
      'Email support',
      'Basic code reviews',
      'GitHub access',
    ],
    status: 'published',
    subscribers: 0,
    popular: false,
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 9999,
    period: '/month',
    color: 'var(--color-primary)',
    colorBg: 'rgba(26,159,224,0.08)',
    colorBorder: 'rgba(26,159,224,0.3)',
    features: [
      'Up to 5 active projects',
      'Priority support',
      'Weekly video calls',
      'Code reviews',
      'UI/UX feedback',
    ],
    status: 'published',
    subscribers: 0,
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 19999,
    period: '/month',
    color: 'var(--color-highlight)',
    colorBg: 'rgba(253,196,73,0.08)',
    colorBorder: 'rgba(253,196,73,0.25)',
    features: [
      'Unlimited projects',
      'Dedicated support',
      'Daily standups',
      'Full-stack delivery',
      'Source code ownership',
    ],
    status: 'published',
    subscribers: 0,
    popular: false,
  },
];

/* ─────────────────────────────────────────
   EMPTY EDITOR STATE
───────────────────────────────────────── */
const EMPTY_PLAN = {
  id: null,
  name: '',
  price: '',
  features: [],
  status: 'draft',
  popular: false,
};

/* ─────────────────────────────────────────
   CHECK ICON
───────────────────────────────────────── */
const CheckIcon = ({ color = 'var(--color-success)' }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/* ─────────────────────────────────────────
   PLAN CARD
───────────────────────────────────────── */
const PlanCard = ({ plan, onEdit, onDelete, publishedCount }) => {
  const [delState, setDelState] = useState(false);
  const isPublished = plan.status === 'published';

  return (
    <div
      className={`sp-card${plan.popular ? ' sp-card--popular' : ''}`}
      style={{ '--plan-color': plan.color, '--plan-border': plan.colorBorder, '--plan-bg': plan.colorBg }}
    >
      {/* Popular badge */}
      {plan.popular && (
        <div className="sp-card-popular-badge">Most Popular</div>
      )}

      {/* Header */}
      <div className="sp-card-header">
        <div className="sp-card-tier" style={{ color: plan.color }}>{plan.name}</div>
        <div className="sp-card-price">
          <span className="sp-card-currency">₹</span>
          <span className="sp-card-amount">{plan.price.toLocaleString('en-IN')}</span>
          <span className="sp-card-period">{plan.period}</span>
        </div>
      </div>

      {/* Features */}
      <ul className="sp-card-features">
        {plan.features.map((f, i) => (
          <li key={i} className="sp-card-feature">
            <CheckIcon color={plan.color} />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="sp-card-footer">
        {/* Subscribers */}
        <div className="sp-card-subs">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span>{plan.subscribers} subscriber{plan.subscribers !== 1 ? 's' : ''}</span>
        </div>

        {/* Status badge — display only, change via Edit */}
        <div className={`sp-status-badge${isPublished ? ' sp-status-badge--published' : ''}`}>
          <span className="sp-status-dot" />
          {isPublished ? 'Published' : 'Draft'}
        </div>
      </div>

      {/* Actions */}
      <div className="sp-card-actions">
        <button className="sp-btn-edit" onClick={() => onEdit(plan)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Edit
        </button>

        {delState ? (
          <div className="sp-del-confirm">
            <span>Delete?</span>
            <button className="sp-btn-del-yes" onClick={() => onDelete(plan.id)}>Yes</button>
            <button className="sp-btn-del-no" onClick={() => setDelState(false)}>No</button>
          </div>
        ) : (
          <button className="sp-btn-delete" onClick={() => setDelState(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   PLAN EDITOR (slide-in panel)
───────────────────────────────────────── */
const PlanEditor = ({ plan, onSave, onCancel, publishedCount }) => {
  const isEdit    = !!plan.id;
  const isCurrentlyPublished = plan.status === 'published';
  // At limit = 3 published and this plan is NOT one of them (new plan or draft being edited)
  const atPublishLimit = publishedCount >= 3 && !isCurrentlyPublished;

  const [name,     setName]     = useState(plan.name);
  const [price,    setPrice]    = useState(plan.price === '' ? '' : String(plan.price));
  const [features, setFeatures] = useState([...plan.features]);
  const [status,   setStatus]   = useState(plan.status);
  const [popular,  setPopular]  = useState(plan.popular);
  const [featInput, setFeatInput] = useState('');
  const [saving,   setSaving]   = useState(false);
  const [errors,   setErrors]   = useState({});

  // Add feature on Enter only — comma is allowed inside feature text
  const handleFeatKeyDown = (e) => {
    if (e.key === 'Enter' && featInput.trim()) {
      e.preventDefault();
      if (features.length >= 10) return;
      setFeatures([...features, featInput.trim()]);
      setFeatInput('');
    }
  };

  const removeFeature = (i) => setFeatures(features.filter((_, idx) => idx !== i));

  const validate = () => {
    const errs = {};
    if (!name.trim())         errs.name    = 'Plan name is required.';
    if (name.trim().length > 40) errs.name = 'Max 40 characters.';
    if (!price || isNaN(Number(price)) || Number(price) <= 0)
                              errs.price   = 'Enter a valid price.';
    if (features.length === 0) errs.features = 'Add at least one feature.';
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    onSave({
      ...plan,
      name:     name.trim(),
      price:    Number(price),
      features,
      status,
      popular,
    });
    setSaving(false);
  };

  return (
    <div className="sp-editor-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="sp-editor">

        {/* Editor header */}
        <div className="sp-editor-header">
          <div>
            <div className="sp-editor-title">{isEdit ? 'Edit Plan' : 'Create Plan'}</div>
            <div className="sp-editor-subtitle">
              {isEdit ? `Editing "${plan.name}"` : 'Fill in the details for your new subscription plan'}
            </div>
          </div>
          <button className="sp-editor-close" onClick={onCancel} aria-label="Close editor">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Fields */}
        <div className="sp-editor-body">

          {/* Plan name */}
          <div className="sp-field">
            <label className="sp-field-label">Plan Name <span className="sp-field-req">*</span></label>
            <input
              className={`sp-field-input${errors.name ? ' sp-field-input--error' : ''}`}
              type="text"
              placeholder="e.g. Basic, Standard, Premium"
              value={name}
              maxLength={40}
              onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })); }}
            />
            <div className="sp-field-row">
              {errors.name
                ? <span className="sp-field-error">{errors.name}</span>
                : <span />}
              <span className="sp-char-count">{name.length}/40</span>
            </div>
          </div>

          {/* Price */}
          <div className="sp-field">
            <label className="sp-field-label">Price (₹/month) <span className="sp-field-req">*</span></label>
            <div className="sp-price-wrap">
              <span className="sp-price-prefix">₹</span>
              <input
                className={`sp-field-input sp-price-input${errors.price ? ' sp-field-input--error' : ''}`}
                type="number"
                placeholder="e.g. 4999"
                value={price}
                min="1"
                onChange={(e) => { setPrice(e.target.value); setErrors((p) => ({ ...p, price: '' })); }}
              />
            </div>
            {errors.price && <span className="sp-field-error">{errors.price}</span>}
          </div>

          {/* Features */}
          <div className="sp-field">
            <label className="sp-field-label">
              Features <span className="sp-field-req">*</span>
              <span className="sp-field-hint">— press Enter to add (max 10)</span>
            </label>

            {/* Added features */}
            {features.length > 0 && (
              <ul className="sp-feat-list">
                {features.map((f, i) => (
                  <li key={i} className="sp-feat-item">
                    <CheckIcon />
                    <span>{f}</span>
                    <button className="sp-feat-remove" onClick={() => removeFeature(i)} aria-label="Remove feature">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {features.length < 10 && (
              <input
                className={`sp-field-input${errors.features ? ' sp-field-input--error' : ''}`}
                type="text"
                placeholder="Type a feature and press Enter…"
                value={featInput}
                onChange={(e) => { setFeatInput(e.target.value); setErrors((p) => ({ ...p, features: '' })); }}
                onKeyDown={handleFeatKeyDown}
              />
            )}
            {errors.features && <span className="sp-field-error">{errors.features}</span>}
          </div>

          {/* Status */}
          <div className="sp-field">
            <label className="sp-field-label">Visibility</label>
            <div className="sp-toggle-row">
              <button
                className={`sp-toggle-switch${status === 'published' ? ' sp-toggle-switch--on' : ''}${atPublishLimit ? ' sp-toggle-switch--disabled' : ''}`}
                onClick={() => {
                  if (atPublishLimit && status !== 'published') return;
                  setStatus(status === 'published' ? 'draft' : 'published');
                }}
                role="switch"
                aria-checked={status === 'published'}
                aria-label="Toggle plan visibility"
                disabled={atPublishLimit && status !== 'published'}
                title={atPublishLimit && status !== 'published' ? 'Max 3 plans can be published. Unpublish one first.' : ''}
              >
                <span className="sp-toggle-knob" />
              </button>
              <span className={`sp-toggle-label${status === 'published' ? ' sp-toggle-label--on' : ''}`}>
                {status === 'published' ? 'Published' : 'Draft'}
              </span>
              {atPublishLimit && status !== 'published' && (
                <span className="sp-toggle-limit-warn">Max 3 reached</span>
              )}
            </div>
            <p className="sp-vis-hint">
              {status === 'published'
                ? 'Clients can see and subscribe to this plan.'
                : 'This plan is hidden from clients until published.'}
            </p>
          </div>

          {/* Mark as popular */}
          <div className="sp-field">
            <label className="sp-popular-label">
              <input
                type="checkbox"
                checked={popular}
                onChange={(e) => setPopular(e.target.checked)}
                className="sp-popular-checkbox"
              />
              <span>Mark as "Most Popular"</span>
              <span className="sp-field-hint">— highlights this plan to clients</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="sp-editor-footer">
          <button className="sp-editor-cancel" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
          <button
            className={`sp-editor-save${saving ? ' sp-editor-save--saving' : ''}`}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="sp-spinner" />
                Saving…
              </>
            ) : (
              isEdit ? 'Save Changes' : 'Create Plan'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   EMPTY STATE
───────────────────────────────────────── */
const EmptyState = ({ onCreate }) => (
  <div className="sp-empty">
    <div className="sp-empty-icon">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    </div>
    <h3 className="sp-empty-title">No subscription plans yet</h3>
    <p className="sp-empty-sub">
      Create your first plan so clients can subscribe to your services.
    </p>
    <button className="sp-btn-create" onClick={onCreate}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      Create Your First Plan
    </button>
  </div>
);

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
const SubscriptionPlans = () => {
  const [plans,      setPlans]      = useState(DEMO_MODE ? DEMO_PLANS : []);
  const [editor,     setEditor]     = useState(null);   // null = closed, object = open
  const [toast,      setToast]      = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Open editor for new plan
  const handleCreate = () => setEditor({ ...EMPTY_PLAN });

  // Open editor for existing plan
  const handleEdit = (plan) => setEditor({ ...plan, features: [...plan.features] });

  // Save (create or update)
  const handleSave = (updated) => {
    if (updated.id) {
      // Edit
      setPlans((prev) => prev.map((p) => p.id === updated.id ? updated : p));
      showToast(`"${updated.name}" plan updated.`);
    } else {
      // Create — assign id + defaults
      const newPlan = {
        ...updated,
        id: `plan-${Date.now()}`,
        subscribers: 0,
        colorBg: 'rgba(26,159,224,0.08)',
        colorBorder: 'rgba(26,159,224,0.25)',
        color: 'var(--color-primary)',
        period: '/month',
      };
      setPlans((prev) => [...prev, newPlan]);
      showToast(`"${newPlan.name}" plan created!`);
    }
    setEditor(null);
  };

  // Delete
  const handleDelete = (id) => {
    const plan = plans.find((p) => p.id === id);
    setPlans((prev) => prev.filter((p) => p.id !== id));
    showToast(`"${plan?.name}" plan deleted.`, 'danger');
  };

  // Toggle published/draft
  const handleToggleStatus = (id) => {
    setPlans((prev) => prev.map((p) =>
      p.id === id ? { ...p, status: p.status === 'published' ? 'draft' : 'published' } : p
    ));
  };

  const publishedCount = plans.filter((p) => p.status === 'published').length;
  const totalSubs = plans.reduce((sum, p) => sum + p.subscribers, 0);

  return (
    <DashboardLayout
      navItems={FREELANCER_NAV}
      portalName="Freelancer Portal"
      pageSubtitle="Subscription Plans"
    >
      {/* ── Page header ── */}
      <div className="sp-page-header">
        <div className="sp-page-header-left">
          <h1 className="sp-page-title">Subscription Plans</h1>
          <p className="sp-page-sub">
            Manage the plans clients can subscribe to.
            {plans.length > 0 && (
              <span className="sp-page-meta">
                {publishedCount} published · {plans.length - publishedCount} draft · {totalSubs} total subscribers
              </span>
            )}
          </p>
        </div>
        {plans.length > 0 && (
          <button className="sp-btn-create" onClick={handleCreate}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create Plan
          </button>
        )}
      </div>

      {/* ── Plans grid or empty state ── */}
      {plans.length === 0 ? (
        <EmptyState onCreate={handleCreate} />
      ) : (
        <div className="sp-grid">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onEdit={handleEdit}
              onDelete={handleDelete}
              publishedCount={publishedCount}
            />
          ))}
        </div>
      )}

      {/* ── Plan editor panel ── */}
      {editor && (
        <PlanEditor
          plan={editor}
          onSave={handleSave}
          onCancel={() => setEditor(null)}
          publishedCount={publishedCount}
        />
      )}

      {/* ── Toast notification ── */}
      {toast && (
        <div className={`sp-toast sp-toast--${toast.type}`}>
          {toast.type === 'success' ? '✓' : '✕'} {toast.msg}
        </div>
      )}
    </DashboardLayout>
  );
};

export default SubscriptionPlans;