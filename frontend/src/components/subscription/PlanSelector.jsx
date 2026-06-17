import React, { useState } from "react";

const COLOR_MAP = {
  basic:    { badge: "badge-cyan",  accent: "card-accent-cyan" },
  standard: { badge: "badge-blue",  accent: "card-accent-blue" },
  premium:  { badge: "badge-gold",  accent: "card-accent-gold" },
};

export default function PlanSelector({ freelancer, plans, currentPlan, onSelect }) {
  const [hovered, setHovered] = useState(null);

  const initials = freelancer.name.split(" ").map((n) => n[0]).join("").toUpperCase();

  return (
    <div className="ps-wrap">
      {/* Freelancer Info Bar */}
      <div className="card ps-fl-bar">
        <div className="ps-fl-info">
          <div className="ps-fl-avatar">{initials}</div>
          <div>
            <h2 className="ps-fl-name">{freelancer.name}</h2>
            <p className="ps-fl-title">{freelancer.title}</p>
            <div className="ps-fl-meta">
              <span className="ps-rating">
                ★ {freelancer.rating}
                <span className="ps-reviews">({freelancer.reviews} reviews)</span>
              </span>
              <span className="ps-location">📍 {freelancer.location}</span>
            </div>
          </div>
        </div>
        <div className="ps-fl-skills">
          {freelancer.skills.map((s) => (
            <span key={s} className="badge badge-muted">{s}</span>
          ))}
        </div>
      </div>

      {/* Plans */}
      <h3 className="ps-section-title">Choose a Subscription Plan</h3>
      <div className="ps-plans-grid">
        {plans.map((plan) => {
          const colors = COLOR_MAP[plan.type] || COLOR_MAP.basic;
          const isSelected = currentPlan?.id === plan.id;
          const isHovered = hovered === plan.id;
          const isPopular = plan.type === "standard";

          return (
            <div
              key={plan.id}
              className={`card ${colors.accent} ps-plan-card ${isSelected ? "ps-plan-selected" : ""}`}
              onMouseEnter={() => setHovered(plan.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {isPopular && (
                <div className="ps-popular-badge">⭐ Most Popular</div>
              )}

              <div className="card-header ps-plan-header">
                <div>
                  <span className={`badge ${colors.badge}`} style={{ marginBottom: "6px", display: "inline-flex" }}>
                    {plan.plan_name}
                  </span>
                  <div className="ps-plan-price">
                    <span className="ps-price-val">₹{plan.price.toLocaleString("en-IN")}</span>
                    <span className="ps-price-per">/month</span>
                  </div>
                </div>
              </div>

              <div className="card-body ps-plan-body">
                <p className="ps-plan-desc">{plan.description}</p>

                {/* Stats */}
                <div className="ps-plan-stats">
                  <div className="ps-plan-stat">
                    <span className="ps-stat-v">{plan.delivery_days}d</span>
                    <span className="ps-stat-l">Delivery</span>
                  </div>
                  <div className="ps-plan-stat">
                    <span className="ps-stat-v">{plan.requests}</span>
                    <span className="ps-stat-l">Requests</span>
                  </div>
                  <div className="ps-plan-stat">
                    <span className="ps-stat-v">{plan.revisions}</span>
                    <span className="ps-stat-l">Revisions</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="ps-features">
                  {plan.features.map((f, i) => (
                    <li key={i} className="ps-feature">
                      <svg width="13" height="13" fill="currentColor" viewBox="0 0 16 16" style={{ color: "var(--color-success)", flexShrink: 0 }}>
                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  className={`btn btn-lg ps-select-btn ${isSelected ? "btn-primary" : "btn-outline"}`}
                  onClick={() => onSelect(plan)}
                >
                  {isSelected ? "✓ Selected — Continue" : "Select Plan"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <p className="ps-cancel-note">
        🔒 Cancel anytime. No contracts. Subscription renews monthly.
      </p>
    </div>
  );
}
