import React, { createContext, useContext, useState } from 'react';

/**
 * AuthContext — Global authentication state.
 *
 * Provides: { user, token, isAuthenticated, login, logout }
 *
 * login(userData, accessToken, role)
 *   - role must be 'freelancer' | 'client' | 'admin'
 *   - writes saas_token + saas_role to localStorage so PrivateRoute works
 */

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,  setUser]  = useState(() => {
    try { return JSON.parse(localStorage.getItem('saas_user')) || null; } catch { return null; }
  });
  const [token, setToken] = useState(localStorage.getItem('saas_token') || null);

  const isAuthenticated = !!token;

  /**
   * Call this after a successful login or social-auth callback.
   * @param {object} userData  - { name, email, ... } from the backend
   * @param {string} accessToken
   * @param {string} role      - 'freelancer' | 'client' | 'admin'
   */
  const login = (userData, accessToken, role) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem('saas_token', accessToken);
    // ── FIX B4: write role so PrivateRoute guard can read it ──
    if (role) {
      localStorage.setItem('saas_role', role);
    }
    // Persist user object so page-refresh restores name/email
    localStorage.setItem('saas_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('saas_token');
    localStorage.removeItem('saas_role');
    localStorage.removeItem('saas_user');
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
