import React, { createContext, useContext, useState } from 'react';

/**
 * AuthContext v2 — Global authentication state.
 *
 * Changes:
 *  - login() now stores user with name + role
 *  - A MOCK_USER is seeded so the dashboard shows real data without a backend
 *    Replace MOCK_USER with the real API response when Rohan's endpoints are live
 *
 * Provides: { user, token, isAuthenticated, login, logout }
 */

// ── STUB: remove this when Rohan's login API is ready ───────────────────────
const MOCK_USER = {
  id:     1,
  name:   'Lohith Sai Ram',   // ← your actual name shows in dashboard title
  email:  'lohith@example.com',
  role:   'FREELANCER',        // FREELANCER | CLIENT | ADMIN | KYC_TEAM | SUPPORT
  avatar: null,                // set to a URL string when profile pic is added
};
// ────────────────────────────────────────────────────────────────────────────

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Seed with mock user so dashboard works without login for now
  const [user, setUser]   = useState(
    localStorage.getItem('saas_token') ? MOCK_USER : MOCK_USER  // always seed during dev
  );
  const [token, setToken] = useState(
    localStorage.getItem('saas_token') || 'dev-stub-token'      // always authed during dev
  );

  const isAuthenticated = !!token;

  const login = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem('saas_token', accessToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('saas_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside <AuthProvider>');
  return ctx;
};

export default AuthContext;
