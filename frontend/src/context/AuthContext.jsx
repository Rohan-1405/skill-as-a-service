import React, { createContext, useContext, useState } from 'react';

/**
 * AuthContext — Global authentication state.
 *
 * Provides: { user, token, isAuthenticated, login, logout }
 *
 * Usage:
 *   import { useAuthContext } from '../context/AuthContext';
 *   const { user, isAuthenticated } = useAuthContext();
 *
 * Day 2 / API integration: replace the stub login/logout with authService calls.
 */

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(localStorage.getItem('saas_token') || null);

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
