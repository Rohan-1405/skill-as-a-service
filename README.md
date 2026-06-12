# SkillAsAService — Frontend (Merged)

A unified React frontend combining work from **Lohith** (design system, auth components, folder architecture) and **Praveen Gorla** (Register page, routing, validation, social login UI). Both developers' code has been updated to conform to the shared design-system tokens defined in `variables.css`.

---

## What Was Merged

### From Lohith's Codebase (7z — `skillasaservice-frontend-day2`)
- **Folder structure** — adopted as the canonical structure for the merged project
- **`src/styles/variables.css`** — design-system tokens (colors, typography, spacing, shadows, radii). All color values in the entire project now reference these variables only
- **`src/styles/global.css`** — base reset and body styles
- **`src/styles/auth.css`** — auth card layout, form field styles, button styles (`.btn-primary`, `.btn-social`, etc.)
- **`src/styles/main.css`** — CSS import order file
- **`src/components/common/`** — shared components: `AppButton`, `AppInput`, `AppCard`, `AlertMessage`, `PageLoader`
- **`src/components/auth/`** — `LoginForm.jsx`, `SocialLoginButtons.jsx`
- **`src/layouts/AuthLayout.jsx`** — centered dark card wrapper for all auth pages
- **`src/context/AuthContext.jsx`** — global auth state (user, token, isAuthenticated, login, logout)
- **`src/hooks/useAuth.js`** — convenience hook wrapping `AuthContext`
- **`src/services/authService.js`** — stub API service (ready to wire to Spring Boot)
- **`src/constants/api.js`** — all API endpoint paths
- **`src/pages/auth/Login.jsx`**, `ForgotPassword.jsx`, `EmailVerification.jsx` — complete auth pages
- **`src/pages/dashboard/Dashboard.jsx`** — dashboard stub

### From Praveen's Codebase (rar — `frontend`)
- **`src/pages/auth/Register.jsx`** — full registration page with:
  - Role selector (Freelancer / Client)
  - Real-time Formik + Yup validation
  - Password strength meter (5-segment bar)
  - Password rules checklist
  - Social login buttons (Google / Facebook / GitHub)
  - Form completion progress bar
  - Responsive two-column layout (brand hero left + form right)
- **`src/utils/validators.js`** — Yup schemas: `registerSchema`, `loginSchema`, `forgotPasswordSchema`, `resetPasswordSchema`; helper functions: `getPasswordStrength`, `getFieldStatus`, `getPasswordRules`
- **`src/constants/routes.js`** — ROUTES constants for all current and upcoming routes
- **Route guards** — `PrivateRoute` (checks auth + role) and `PublicRoute` (redirects if already logged in) added to `AppRoutes.jsx`
- **Lazy loading** — Register, FreelancerDashboard, and ClientDashboard are lazy-loaded via `React.Suspense`
- **Dashboard stubs** — `FreelancerDashboard.jsx` and `ClientDashboard.jsx` (Day 3 full build)
- **Toast notifications** — `react-toastify` integrated into `App.js` using design-system token colors

---

## Design System Updates Applied to Praveen's Code

All hardcoded color values in Praveen's code have been replaced with design-system variables:

| Old (Praveen's hardcode) | New (design-system variable) |
|---|---|
| `#1A1D2E` | `var(--color-bg)` |
| `#232740` | `var(--color-bg-secondary)` |
| `#2B2F4A` | `var(--color-bg-card)` |
| `#1E2238` | `var(--color-bg-input)` |
| `#353A5C` | `var(--color-border)` |
| `#A0AABF` | `var(--color-text-secondary)` |
| `#6B7490` | `var(--color-text-muted)` |
| `#1E7FE8` / `#1254B7` | `var(--color-primary)` / `var(--gradient-blue)` |
| `#F5A623` | `var(--color-accent)` |
| `#22C55E` | `var(--color-success)` |
| `#EF4444` | `var(--color-danger)` |
| `Poppins, sans-serif` | `var(--font-family)` (Inter) |

A new **`register.css`** file was created for the two-column Register layout, following the same class-naming convention as `auth.css`.

---

## Project Structure

```
skillasaservice-frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── App.js                        ← BrowserRouter + AuthProvider + ToastContainer
│   ├── index.js
│   ├── assets/logos/logo.png
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx         ← Lohith
│   │   │   └── SocialLoginButtons.jsx ← Lohith
│   │   └── common/
│   │       ├── AppButton.jsx         ← Lohith
│   │       ├── AppCard.jsx           ← Lohith
│   │       ├── AppInput.jsx          ← Lohith
│   │       ├── AlertMessage.jsx      ← Lohith
│   │       └── PageLoader.jsx        ← Lohith
│   ├── constants/
│   │   ├── api.js                    ← Lohith (API endpoints)
│   │   └── routes.js                 ← Praveen (route path constants)
│   ├── context/
│   │   └── AuthContext.jsx           ← Lohith
│   ├── hooks/
│   │   └── useAuth.js                ← Lohith
│   ├── layouts/
│   │   └── AuthLayout.jsx            ← Lohith
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx             ← Lohith
│   │   │   ├── Register.jsx          ← Praveen (updated to design tokens)
│   │   │   ├── ForgotPassword.jsx    ← Lohith
│   │   │   └── EmailVerification.jsx ← Lohith (updated to handle ?email= param)
│   │   ├── client/
│   │   │   └── ClientDashboard.jsx   ← Praveen stub (updated to AppCard)
│   │   ├── dashboard/
│   │   │   └── Dashboard.jsx         ← Lohith stub
│   │   └── freelancer/
│   │       └── FreelancerDashboard.jsx ← Praveen stub (updated to AppCard)
│   ├── routes/
│   │   └── AppRoutes.jsx             ← Merged (Lohith base + Praveen guards + lazy)
│   ├── services/
│   │   └── authService.js            ← Lohith
│   ├── styles/
│   │   ├── variables.css             ← Lohith (SINGLE SOURCE OF TRUTH for all colors)
│   │   ├── global.css                ← Lohith
│   │   ├── auth.css                  ← Lohith
│   │   ├── register.css              ← New (Praveen's Register layout, design-token aligned)
│   │   └── main.css                  ← Import orchestrator
│   └── utils/
│       └── validators.js             ← Praveen (updated strength colors to CSS vars)
├── package.json                      ← All deps from both (Formik, Yup, react-icons, etc.)
└── README.md
```

---

## Auth Flow

```
/register  →  /verify-email?email=...  →  /login  →  /dashboard
```

- **PublicRoute**: redirects authenticated users away from auth pages based on their role
- **PrivateRoute**: blocks unauthenticated access and enforces role-based routing

---

## Getting Started

```bash
npm install
npm start
```

> Requires Node.js 18+. The app runs on http://localhost:3000.

---

## Key Rules (from Lohith's design system)

1. **Never hardcode a color** — always use a variable from `variables.css`
2. **Never hardcode a font** — always use `var(--font-family)`
3. **New colors** must be added to `variables.css` first
4. **New shared components** go in `src/components/common/`
5. **New auth-specific CSS** goes in `src/styles/auth.css` or a new CSS file imported in `main.css`

---

## Dependencies Added (from Praveen's code)

| Package | Version | Purpose |
|---|---|---|
| `formik` | ^2.4.5 | Form state management + validation |
| `yup` | ^1.3.3 | Validation schema builder |
| `react-icons` | ^5.0.1 | FiUser, FiMail, FcGoogle, FaGithub, etc. |
| `react-toastify` | ^10.0.4 | Toast notifications |
| `axios` | ^1.6.7 | HTTP client (ready for API integration) |
| `@reduxjs/toolkit` | ^2.2.1 | Redux state management (Day 3+) |
| `react-redux` | ^9.1.0 | React bindings for Redux |
