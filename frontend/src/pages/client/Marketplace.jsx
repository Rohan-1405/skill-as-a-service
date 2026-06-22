// ============================================================
// SkillAsAService — Marketplace.jsx  (Day 6 — Lohith)
// Route: /client/browse
// Client browses and discovers freelancers.
// Click card → /freelancer/:id/profile
// ============================================================

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { CLIENT_NAV } from "../../constants/navItems";
import "../../styles/marketplace.css";

// ── Mock freelancer data (replace with API later) ──────────────────────────
const MOCK_FREELANCERS = [
  {
    id: 1,
    name: "Arjun Sharma",
    title: "Full Stack Developer",
    rating: 4.9,
    reviews: 128,
    location: "Bangalore, India",
    skills: ["React JS", "Node.js", "MySQL", "Spring Boot"],
    startingPrice: 4999,
    planTiers: ["basic", "standard", "premium"],
    badge: "top",
    completionRate: 98,
    responseTime: "within 2 hrs",
    available: true,
  },
  {
    id: 2,
    name: "Priya Kumar",
    title: "UI/UX Designer",
    rating: 4.8,
    reviews: 94,
    location: "Mumbai, India",
    skills: ["Figma", "UI/UX", "React JS", "Prototyping"],
    startingPrice: 6999,
    planTiers: ["basic", "standard", "premium"],
    badge: null,
    completionRate: 96,
    responseTime: "within 4 hrs",
    available: true,
  },
  {
    id: 3,
    name: "Rahul Verma",
    title: "Backend Engineer",
    rating: 4.7,
    reviews: 41,
    location: "Hyderabad, India",
    skills: ["Spring Boot", "Java", "AWS", "Docker"],
    startingPrice: 7499,
    planTiers: ["standard", "premium"],
    badge: "new",
    completionRate: 94,
    responseTime: "within 6 hrs",
    available: true,
  },
  {
    id: 4,
    name: "Sneha Mehta",
    title: "DevOps Engineer",
    rating: 5.0,
    reviews: 67,
    location: "Pune, India",
    skills: ["Docker", "Kubernetes", "CI/CD", "AWS"],
    startingPrice: 9999,
    planTiers: ["basic", "standard", "premium"],
    badge: "top",
    completionRate: 100,
    responseTime: "within 1 hr",
    available: true,
  },
  {
    id: 5,
    name: "Aditya Kaur",
    title: "Python Developer",
    rating: 4.6,
    reviews: 33,
    location: "Chennai, India",
    skills: ["Python", "Django", "Machine Learning", "FastAPI"],
    startingPrice: 5499,
    planTiers: ["basic", "standard"],
    badge: null,
    completionRate: 92,
    responseTime: "within 8 hrs",
    available: false,
  },
  {
    id: 6,
    name: "Nikhil Patel",
    title: "Mobile Developer",
    rating: 4.5,
    reviews: 18,
    location: "Ahmedabad, India",
    skills: ["Flutter", "React Native", "Dart", "Firebase"],
    startingPrice: 8499,
    planTiers: ["standard", "premium"],
    badge: "new",
    completionRate: 90,
    responseTime: "within 3 hrs",
    available: true,
  },
  {
    id: 7,
    name: "Divya Nair",
    title: "Data Scientist",
    rating: 4.9,
    reviews: 55,
    location: "Bangalore, India",
    skills: ["Python", "TensorFlow", "SQL", "Power BI"],
    startingPrice: 11999,
    planTiers: ["standard", "premium"],
    badge: "top",
    completionRate: 97,
    responseTime: "within 2 hrs",
    available: true,
  },
  {
    id: 8,
    name: "Karan Singh",
    title: "Blockchain Developer",
    rating: 4.7,
    reviews: 22,
    location: "Delhi, India",
    skills: ["Solidity", "Web3.js", "Node.js", "Ethereum"],
    startingPrice: 14999,
    planTiers: ["premium"],
    badge: null,
    completionRate: 93,
    responseTime: "within 12 hrs",
    available: true,
  },
  {
    id: 9,
    name: "Meera Joshi",
    title: "QA Engineer",
    rating: 4.6,
    reviews: 37,
    location: "Hyderabad, India",
    skills: ["Selenium", "Cypress", "JIRA", "Postman"],
    startingPrice: 4499,
    planTiers: ["basic", "standard"],
    badge: null,
    completionRate: 95,
    responseTime: "within 4 hrs",
    available: true,
  },
];

const AVATAR_COLORS = [
  "#185FA5", "#0F6E56", "#534AB7", "#993C1D",
  "#3B6D11", "#854F0B", "#A32D2D", "#185FA5", "#0F6E56",
];

const SKILL_CHIPS = [
  "All", "React JS", "Node.js", "UI/UX", "Python",
  "DevOps", "Spring Boot", "Flutter", "Data Science", "Blockchain",
];

const SORT_OPTIONS = [
  { value: "top",        label: "Top Rated"          },
  { value: "newest",     label: "Newest"              },
  { value: "price_asc",  label: "Price: Low to High"  },
  { value: "price_desc", label: "Price: High to Low"  },
];

const getInitials = (name) =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

const StarRating = ({ rating }) => (
  <span className="mk-star-row">
    <svg width="12" height="12" viewBox="0 0 24 24"
      fill="var(--color-highlight)" stroke="none" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
    {rating.toFixed(1)}
  </span>
);

// ── Grid card ──────────────────────────────────────────────────────────────
const FreelancerCard = ({ freelancer, index, onClick }) => {
  const bg = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return (
    <div className="mk-card mk-card-grid" onClick={onClick}
      role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onClick()}
      aria-label={`View ${freelancer.name}'s profile`}>

      {/* Badge row — sits above avatar in normal flow, no overlap */}
      {(freelancer.badge === "top" || freelancer.badge === "new") && (
        <div className="mk-badge-row">
          {freelancer.badge === "top" && <span className="mk-badge mk-badge-top">⭐ Top Rated</span>}
          {freelancer.badge === "new" && <span className="mk-badge mk-badge-new">✦ New</span>}
        </div>
      )}

      <div className="mk-card-top">
        <div className="mk-avatar-wrap">
          <div className="mk-avatar" style={{ background: bg }}>{getInitials(freelancer.name)}</div>
          {freelancer.available && <span className="mk-avail-dot" title="Available now" />}
        </div>
        <div className="mk-card-info">
          <div className="mk-name">{freelancer.name}</div>
          <div className="mk-title">{freelancer.title}</div>
          <StarRating rating={freelancer.rating} />
        </div>
      </div>

      <div className="mk-skills">
        {freelancer.skills.slice(0, 3).map((s) => (
          <span key={s} className="mk-skill-tag">{s}</span>
        ))}
        {freelancer.skills.length > 3 && (
          <span className="mk-skill-tag mk-skill-more">+{freelancer.skills.length - 3}</span>
        )}
      </div>

      <div className="mk-card-meta">
        <span>{freelancer.reviews} reviews</span>
        <span className="mk-meta-dot">·</span>
        <span>📍 {freelancer.location.split(",")[0]}</span>
      </div>

      <div className="mk-card-footer">
        <div className="mk-price">
          <span className="mk-price-from">from</span>
          <span className="mk-price-amt">₹{freelancer.startingPrice.toLocaleString("en-IN")}</span>
          <span className="mk-price-per">/mo</span>
        </div>
        <button className="mk-view-btn" onClick={(e) => { e.stopPropagation(); onClick(); }}>
          View Profile
        </button>
      </div>
    </div>
  );
};

// ── List row ───────────────────────────────────────────────────────────────
const FreelancerRow = ({ freelancer, index, onClick }) => {
  const bg = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return (
    <div className="mk-card mk-card-list" onClick={onClick}
      role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onClick()}
      aria-label={`View ${freelancer.name}'s profile`}>

      <div className="mk-avatar-list-wrap">
        <div className="mk-avatar mk-avatar-list" style={{ background: bg }}>{getInitials(freelancer.name)}</div>
        {freelancer.available && <span className="mk-avail-dot mk-avail-dot-list" title="Available now" />}
      </div>

      <div className="mk-list-info">
        <div className="mk-list-top">
          <span className="mk-name">{freelancer.name}</span>
          {freelancer.badge === "top" && <span className="mk-badge mk-badge-top mk-badge-inline">⭐ Top Rated</span>}
          {freelancer.badge === "new" && <span className="mk-badge mk-badge-new mk-badge-inline">✦ New</span>}
        </div>
        <div className="mk-title">{freelancer.title}</div>
        <div className="mk-list-meta">
          <StarRating rating={freelancer.rating} />
          <span className="mk-meta-dot">·</span>
          <span>{freelancer.reviews} reviews</span>
          <span className="mk-meta-dot">·</span>
          <span>📍 {freelancer.location}</span>
          <span className="mk-meta-dot">·</span>
          <span>⚡ {freelancer.responseTime}</span>
        </div>
        <div className="mk-skills">
          {freelancer.skills.slice(0, 4).map((s) => (
            <span key={s} className="mk-skill-tag">{s}</span>
          ))}
        </div>
      </div>

      <div className="mk-list-right">
        <div className="mk-price">
          <span className="mk-price-from">from</span>
          <span className="mk-price-amt">₹{freelancer.startingPrice.toLocaleString("en-IN")}</span>
          <span className="mk-price-per">/mo</span>
        </div>
        <button className="mk-view-btn" onClick={(e) => { e.stopPropagation(); onClick(); }}>
          View Profile
        </button>
        <div className="mk-completion">✅ {freelancer.completionRate}% completion</div>
      </div>
    </div>
  );
};

// ── Empty state ────────────────────────────────────────────────────────────
const EmptyState = ({ onReset }) => (
  <div className="mk-empty">
    <div className="mk-empty-icon">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
        stroke="var(--color-text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        <line x1="8" y1="11" x2="14" y2="11"/>
      </svg>
    </div>
    <h3 className="mk-empty-title">No freelancers found</h3>
    <p className="mk-empty-sub">Try adjusting your filters or search term.</p>
    <button className="mk-empty-btn" onClick={onReset}>Clear all filters</button>
  </div>
);

// ══════════════════════════════════════════════════════════════════
//  MAIN PAGE
// ══════════════════════════════════════════════════════════════════
export default function Marketplace() {
  const navigate = useNavigate();

  const [search,      setSearch]      = useState("");
  const [activeSkill, setActiveSkill] = useState("All");
  const [sort,        setSort]        = useState("top");
  const [viewMode,    setViewMode]    = useState("grid");
  const [tiers,       setTiers]       = useState({ basic: true, standard: true, premium: true });
  const [maxPrice,    setMaxPrice]    = useState(20000);
  const [availOnly,   setAvailOnly]   = useState(false);
  const [minRating,   setMinRating]   = useState(0);
  const [drawerOpen,  setDrawerOpen]  = useState(false);

  const filtered = useMemo(() => {
    let list = MOCK_FREELANCERS;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((f) =>
        f.name.toLowerCase().includes(q) ||
        f.title.toLowerCase().includes(q) ||
        f.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (activeSkill !== "All") {
      list = list.filter((f) =>
        f.skills.some((s) => s.toLowerCase() === activeSkill.toLowerCase())
      );
    }

    const activeTiers = Object.keys(tiers).filter((k) => tiers[k]);
    if (activeTiers.length < 3) {
      list = list.filter((f) => f.planTiers.some((t) => activeTiers.includes(t)));
    }

    list = list.filter((f) => f.startingPrice <= maxPrice);
    if (availOnly)    list = list.filter((f) => f.available);
    if (minRating > 0) list = list.filter((f) => f.rating >= minRating);

    switch (sort) {
      case "top":        return [...list].sort((a, b) => b.rating - a.rating);
      case "newest":     return [...list].sort((a, b) => b.id - a.id);
      case "price_asc":  return [...list].sort((a, b) => a.startingPrice - b.startingPrice);
      case "price_desc": return [...list].sort((a, b) => b.startingPrice - a.startingPrice);
      default:           return list;
    }
  }, [search, activeSkill, sort, tiers, maxPrice, availOnly, minRating]);

  const resetFilters = () => {
    setSearch(""); setActiveSkill("All"); setSort("top");
    setTiers({ basic: true, standard: true, premium: true });
    setMaxPrice(20000); setAvailOnly(false); setMinRating(0);
  };

  return (
    <DashboardLayout navItems={CLIENT_NAV} portalName="Client Portal"
      pageTitle="Browse Freelancers" pageSubtitle="Find the right talent for your project">
      <div className="mk-page">

        {/* Search + Sort */}
        <div className="mk-search-bar">
          <div className="mk-search-wrap">
            <svg className="mk-search-icon" width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input className="mk-search-input" type="search"
              placeholder="Search by name, skill, or title…"
              value={search} onChange={(e) => setSearch(e.target.value)}
              aria-label="Search freelancers" />
            {search && (
              <button className="mk-search-clear" onClick={() => setSearch("")} aria-label="Clear search">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>
          <select className="mk-sort-select" value={sort}
            onChange={(e) => setSort(e.target.value)} aria-label="Sort freelancers">
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Skill chips + More Filters button */}
        <div className="mk-chips-row" role="group" aria-label="Filter by skill">
          {SKILL_CHIPS.map((chip) => (
            <button key={chip}
              className={`mk-chip${activeSkill === chip ? " mk-chip-active" : ""}`}
              onClick={() => setActiveSkill(chip)} aria-pressed={activeSkill === chip}>
              {chip}
            </button>
          ))}
          {/* More Filters — only visible on tablet/mobile via CSS */}
          <button className="mk-more-filters-btn" onClick={() => setDrawerOpen(true)}
            aria-label="Open filters">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
              <line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
            More Filters
            {/* Badge showing active filter count */}
            {(() => {
              const count = (!tiers.basic || !tiers.standard || !tiers.premium ? 1 : 0)
                + (maxPrice < 20000 ? 1 : 0)
                + (minRating > 0 ? 1 : 0)
                + (availOnly ? 1 : 0);
              return count > 0 ? <span className="mk-filter-badge">{count}</span> : null;
            })()}
          </button>
        </div>

        {/* Filter drawer — slide up on mobile/tablet */}
        {drawerOpen && (
          <div className="mk-drawer-overlay" onClick={() => setDrawerOpen(false)} aria-hidden="true" />
        )}
        <div className={`mk-filter-drawer${drawerOpen ? " mk-filter-drawer-open" : ""}`}
          role="dialog" aria-label="Filters" aria-modal="true">
          <div className="mk-drawer-header">
            <span className="mk-drawer-title">Filters</span>
            <button className="mk-drawer-close" onClick={() => setDrawerOpen(false)}
              aria-label="Close filters">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div className="mk-drawer-body">
            <div className="mk-filter-group">
              <div className="mk-filter-title">Plan tier</div>
              {["basic", "standard", "premium"].map((tier) => (
                <label key={tier} className="mk-filter-option">
                  <input type="checkbox" checked={tiers[tier]}
                    onChange={(e) => setTiers((p) => ({ ...p, [tier]: e.target.checked }))} />
                  <span className="mk-filter-label-text">
                    {tier.charAt(0).toUpperCase() + tier.slice(1)}
                  </span>
                  <span className="mk-filter-count">
                    {MOCK_FREELANCERS.filter((f) => f.planTiers.includes(tier)).length}
                  </span>
                </label>
              ))}
            </div>
            <div className="mk-filter-group">
              <div className="mk-filter-title">Starting price</div>
              <input type="range" min="0" max="20000" step="500"
                value={maxPrice} className="mk-range"
                onChange={(e) => setMaxPrice(Number(e.target.value))} />
              <div className="mk-range-labels">
                <span>₹0</span>
                <span>₹{maxPrice.toLocaleString("en-IN")}</span>
              </div>
            </div>
            <div className="mk-filter-group">
              <div className="mk-filter-title">Minimum rating</div>
              {[0, 4, 4.5, 5].map((r) => (
                <label key={r} className="mk-filter-option">
                  <input type="radio" name="drawer-rating" checked={minRating === r}
                    onChange={() => setMinRating(r)} />
                  <span className="mk-filter-label-text">
                    {r === 0 ? "All ratings" : `${r}★ & above`}
                  </span>
                </label>
              ))}
            </div>
            <div className="mk-filter-group">
              <div className="mk-filter-title">Availability</div>
              <label className="mk-filter-option">
                <input type="checkbox" checked={availOnly}
                  onChange={(e) => setAvailOnly(e.target.checked)} />
                <span className="mk-filter-label-text">Available now</span>
              </label>
            </div>
          </div>
          <div className="mk-drawer-footer">
            <button className="mk-drawer-clear" onClick={() => {
              setTiers({ basic: true, standard: true, premium: true });
              setMaxPrice(20000); setAvailOnly(false); setMinRating(0);
            }}>Clear filters</button>
            <button className="mk-drawer-apply" onClick={() => setDrawerOpen(false)}>
              Show {filtered.length} results
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="mk-body">

          {/* Sidebar */}
          <aside className="mk-sidebar" aria-label="Filters">

            <div className="mk-filter-group">
              <div className="mk-filter-title">Plan tier</div>
              {["basic", "standard", "premium"].map((tier) => (
                <label key={tier} className="mk-filter-option">
                  <input type="checkbox" checked={tiers[tier]}
                    onChange={(e) => setTiers((p) => ({ ...p, [tier]: e.target.checked }))} />
                  <span className="mk-filter-label-text">
                    {tier.charAt(0).toUpperCase() + tier.slice(1)}
                  </span>
                  <span className="mk-filter-count">
                    {MOCK_FREELANCERS.filter((f) => f.planTiers.includes(tier)).length}
                  </span>
                </label>
              ))}
            </div>

            <div className="mk-filter-group">
              <div className="mk-filter-title">Starting price</div>
              <input type="range" min="0" max="20000" step="500"
                value={maxPrice} className="mk-range"
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                aria-label={`Max price ₹${maxPrice}`} />
              <div className="mk-range-labels">
                <span>₹0</span>
                <span>₹{maxPrice.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="mk-filter-group">
              <div className="mk-filter-title">Minimum rating</div>
              {[0, 4, 4.5, 5].map((r) => (
                <label key={r} className="mk-filter-option">
                  <input type="radio" name="rating" checked={minRating === r}
                    onChange={() => setMinRating(r)} />
                  <span className="mk-filter-label-text">
                    {r === 0 ? "All ratings" : `${r}★ & above`}
                  </span>
                </label>
              ))}
            </div>

            <div className="mk-filter-group">
              <div className="mk-filter-title">Availability</div>
              <label className="mk-filter-option">
                <input type="checkbox" checked={availOnly}
                  onChange={(e) => setAvailOnly(e.target.checked)} />
                <span className="mk-filter-label-text">Available now</span>
              </label>
            </div>

            <button className="mk-clear-btn" onClick={resetFilters}>Clear all filters</button>
          </aside>

          {/* Main */}
          <div className="mk-main">
            <div className="mk-results-header">
              <span className="mk-results-count">
                <strong>{filtered.length}</strong>
                {filtered.length === 1 ? " freelancer" : " freelancers"} found
              </span>
              <div className="mk-view-toggle" role="group" aria-label="View mode">
                <button className={`mk-view-btn${viewMode === "grid" ? " mk-view-btn-active" : ""}`}
                  onClick={() => setViewMode("grid")} aria-label="Grid view"
                  aria-pressed={viewMode === "grid"} title="Grid view">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/>
                    <rect x="14" y="14" width="7" height="7" rx="1"/>
                  </svg>
                </button>
                <button className={`mk-view-btn${viewMode === "list" ? " mk-view-btn-active" : ""}`}
                  onClick={() => setViewMode("list")} aria-label="List view"
                  aria-pressed={viewMode === "list"} title="List view">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6"/>
                    <line x1="8" y1="12" x2="21" y2="12"/>
                    <line x1="8" y1="18" x2="21" y2="18"/>
                    <line x1="3" y1="6" x2="3.01" y2="6"/>
                    <line x1="3" y1="12" x2="3.01" y2="12"/>
                    <line x1="3" y1="18" x2="3.01" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>

            {filtered.length === 0 ? (
              <EmptyState onReset={resetFilters} />
            ) : viewMode === "grid" ? (
              <div className="mk-grid">
                {filtered.map((f, i) => (
                  <FreelancerCard key={f.id} freelancer={f} index={i}
                    onClick={() => navigate(`/freelancer/${f.id}/profile`)} />
                ))}
              </div>
            ) : (
              <div className="mk-list">
                {filtered.map((f, i) => (
                  <FreelancerRow key={f.id} freelancer={f} index={i}
                    onClick={() => navigate(`/freelancer/${f.id}/profile`)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}