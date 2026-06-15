# SkillAsAService — Frontend

> **Sell Your Skills As A Subscription**
> Subscribe • Learn • Grow

A subscription-based freelancer marketplace platform built with React JS.
Freelancers sell services as recurring subscriptions. Clients subscribe, collaborate, and manage projects.

---

## Project Info

| Field | Detail |
|---|---|
| Company | Fusion5 Technologies Pvt Ltd |
| Start Date | 11 June 2026 |
| Deadline | 22 June 2026 |
| Frontend Dev 1 | Lohith Sai Ram |
| Frontend Dev 2 | Praveen Gorla |
| Backend Dev | Rohan |
| Tech Stack | React 18, React Router v6, CSS Variables |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

App runs at `http://localhost:3000`

---

## Brand Colors

Sourced from the official SkillAsAService logo. **Never hardcode these hex values in components — always use the CSS variable.**

| Color | Hex | Variable | Use |
|---|---|---|---|
| Dark Navy | `#191C25` | `--brand-dark` | Sidebar background |
| Primary Blue | `#035AE1` | `--color-primary` | Buttons, links, focus states |
| Cyan | `#32DCFD` | `--brand-cyan` | Gradients, hover accents |
| Gold | `#FDC449` | `--brand-gold` | Premium badges, highlights |

---

## Folder Structure

```
src/
├── assets/
│   └── logos/
│       └── logo.png              ← Official brand logo
│
├── components/
│   ├── auth/                     ← Auth-specific components
│   │   ├── LoginForm.jsx         ← Email/password form with validation
│   │   └── SocialLoginButtons.jsx← Google / Facebook / GitHub buttons
│   │
│   └── common/                   ← Shared reusable components (use these everywhere)
│       ├── AppButton.jsx         ← Button — variants: primary, secondary, danger, outline, gold, ghost
│       ├── AppInput.jsx          ← Input — with label, error, left icon, right element
│       ├── AppCard.jsx           ← Card panel — optional title header and accent border
│       ├── AlertMessage.jsx      ← Inline alert — success, danger, warning, info
│       └── PageLoader.jsx        ← Full-page spinner for async loading
│
├── constants/
│   └── api.js                    ← All API base URLs and endpoint paths
│
├── context/
│   └── AuthContext.jsx           ← Global auth state (user, token, login, logout)
│
├── hooks/
│   └── useAuth.js                ← Convenience hook: const { user } = useAuth()
│
├── layouts/
│   └── AuthLayout.jsx            ← Centered card layout for all auth pages
│
├── pages/
│   ├── auth/
│   │   ├── Login.jsx             ← /login route
│   │   └── ForgotPassword.jsx    ← /forgot-password route
│   └── dashboard/
│       └── Dashboard.jsx         ← /dashboard route (stub — full build Day 3)
│
├── routes/
│   └── AppRoutes.jsx             ← All route definitions in one place
│
├── services/
│   └── authService.js            ← Auth API calls (stub — wire up Day 2)
│
└── styles/
    ├── variables.css             ← ★ Brand design tokens — edit here, apply everywhere
    ├── global.css                ← Base reset, typography, scrollbar, utility classes
    ├── auth.css                  ← Auth page styles (card, form, inputs, buttons)
    └── main.css                  ← Imports variables → global → auth
```

---

## Reusable Components

### AppButton

```jsx
import AppButton from '../components/common/AppButton';

// Primary (gradient blue — default)
<AppButton type="submit" fullWidth>Sign In</AppButton>

// Loading state
<AppButton isLoading>Sign In</AppButton>

// Variants
<AppButton variant="secondary">Cancel</AppButton>
<AppButton variant="danger">Delete</AppButton>
<AppButton variant="outline">View Profile</AppButton>
<AppButton variant="gold">Upgrade to Premium</AppButton>
<AppButton variant="ghost" size="sm">Learn more</AppButton>
```

**Props:** `variant`, `size` (sm/md/lg), `type`, `onClick`, `disabled`, `isLoading`, `fullWidth`, `className`, `style`

---

### AppInput

```jsx
import AppInput from '../components/common/AppInput';

<AppInput
  label="Email Address"
  type="email"
  name="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="you@example.com"
  error={errors.email}       // shows red border + message
  required
  leftIcon={<EmailIcon />}
/>
```

**Props:** `label`, `type`, `name`, `value`, `onChange`, `onBlur`, `placeholder`, `error`, `helpText`, `required`, `disabled`, `readOnly`, `leftIcon`, `rightElement`

---

### AppCard

```jsx
import AppCard from '../components/common/AppCard';

<AppCard
  title="Subscription Plans"
  subtitle="Choose a plan that suits you"
  accentColor="blue"          // "blue" | "cyan" | "gold"
  headerRight={<AppButton size="sm">Add Plan</AppButton>}
>
  {/* card content */}
</AppCard>
```

**Props:** `title`, `subtitle`, `headerRight`, `accentColor`, `noPadding`, `className`, `style`

---

### AlertMessage

```jsx
import AlertMessage from '../components/common/AlertMessage';

<AlertMessage type="danger"  message="Invalid email or password." />
<AlertMessage type="success" message="Profile updated successfully." onClose={() => setMsg('')} />
<AlertMessage type="warning" message="Your subscription expires in 3 days." />
<AlertMessage type="info"    message="Verification email sent." />
```

**Props:** `type`, `message`, `onClose`

---

### PageLoader

```jsx
import PageLoader from '../components/common/PageLoader';

// Inside any page that is waiting for data
if (isLoading) return <PageLoader message="Loading your dashboard..." />;
```

**Props:** `message`

---

## CSS Variables — Quick Reference

Use these in every component. No hardcoded hex values.

```css
/* Colors */
var(--color-primary)        /* #035AE1 — main brand blue */
var(--color-primary-dark)   /* #0247B8 — hover state */
var(--color-primary-light)  /* #EBF3FF — light bg tint */
var(--brand-cyan)           /* #32DCFD — accent */
var(--brand-gold)           /* #FDC449 — premium/highlight */
var(--color-danger)         /* #EF4444 — errors */
var(--color-success)        /* #10B981 — success */

/* Text */
var(--color-text)           /* #1A2035 — body text */
var(--color-text-muted)     /* #64748B — secondary/placeholder */

/* Backgrounds */
var(--color-bg)             /* #F4F6FA — page bg */
var(--color-bg-card)        /* #FFFFFF — card bg */

/* Sidebar */
var(--sidebar-bg)           /* #191C25 — sidebar bg (brand dark) */
var(--sidebar-bg-active)    /* #035AE1 — active menu item */

/* Spacing */
var(--space-1) → var(--space-16)   /* 4px → 64px */

/* Border radius */
var(--radius-md)   /* 8px  — inputs, buttons */
var(--radius-lg)   /* 12px — cards */
var(--radius-xl)   /* 16px — auth card */

/* Shadows */
var(--shadow-card)  /* card shadow with brand blue tint */
var(--shadow-btn)   /* blue glow on primary button */
```

---

## Consistency Rules

These rules apply to **every file in this project**. Both Lohith and Praveen follow these.

1. **Never hardcode a color.** Use `var(--color-primary)`, not `#035AE1`.
2. **Never hardcode spacing.** Use `var(--space-4)` not `16px` (unless it's a one-off border).
3. **Use shared components.** `AppButton` instead of raw `<button>`, `AppInput` instead of raw `<input>`.
4. **All API calls go in `services/`.** Never write `fetch(...)` directly inside a component.
5. **All route paths are defined in `AppRoutes.jsx`** — never navigate to a hardcoded string without checking routes first.
6. **File you don't own? Ask before touching.**

| File | Owner |
|---|---|
| `src/styles/variables.css` | Lohith |
| `src/components/common/*` | Lohith |
| `src/constants/api.js` | Lohith |
| `src/context/AuthContext.jsx` | Lohith |
| `src/pages/auth/Login.jsx` | Lohith |
| `src/pages/auth/ForgotPassword.jsx` | Lohith |
| `src/App.js` / `src/routes/AppRoutes.jsx` | Praveen |
| `src/pages/auth/Register.jsx` | Praveen (Day 1) |

---

## Milestone Progress

| Milestone | Target | Status |
|---|---|---|
| **M1** — Auth & Setup | 13 Jun | 🟡 In progress |
| **M2** — Profile & Subscription | 16 Jun | ⚪ Upcoming |
| **M3** — Wallet & Payment | 18 Jun | ⚪ Upcoming |
| **M4** — Projects & Chat | 20 Jun | ⚪ Upcoming |
| **M5** — Testing & Deploy | 22 Jun | ⚪ Upcoming |

### Day-by-day (Lohith's tasks)

| Day | Task | Status |
|---|---|---|
| Day 1 | Project structure, Auth UI (Login, Forgot Password) | ✅ Done |
| Day 2 | Email verification UI, wire auth APIs | ⚪ Next |
| Day 3 | Dashboard layout, sidebar navigation | ⚪ Upcoming |
| Day 4 | Freelancer profile UI | ⚪ Upcoming |
| Day 5 | Subscription plans UI | ⚪ Upcoming |

---

## Current Routes

| Path | Component | Status |
|---|---|---|
| `/` | → redirects to `/login` | ✅ |
| `/login` | `Login.jsx` | ✅ |
| `/forgot-password` | `ForgotPassword.jsx` | ✅ |
| `/dashboard` | `Dashboard.jsx` | 🟡 Stub |
| `/register` | `Register.jsx` | ⚪ Praveen Day 1 |

---

*Fusion5 Technologies Pvt Ltd — SkillAsAService Frontend — June 2026*
