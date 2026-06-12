import { API_ENDPOINTS } from '../constants/api';

/**
 * authService — All authentication API calls.
 *
 * Day 2: Replace stub implementations with real fetch/axios calls
 * targeting the Spring Boot auth microservice.
 *
 * Usage:
 *   import authService from '../services/authService';
 *   const result = await authService.login(email, password);
 */

const authService = {
  /**
   * Login with email and password.
   * Returns { token, user } on success.
   */
  login: async (email, password) => {
    // TODO (Day 2): Replace with real API call
    // const res = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password }),
    // });
    // if (!res.ok) throw new Error('Invalid credentials');
    // return res.json();
    console.log('[authService.login] stub called with:', email);
    return { token: 'stub-token', user: { email, name: 'User' } };
  },

  /**
   * Register a new user.
   */
  register: async (userData) => {
    // TODO (Day 2): Replace with real API call
    console.log('[authService.register] stub called with:', userData);
    return { success: true };
  },

  /**
   * Send forgot-password email.
   */
  forgotPassword: async (email) => {
    // TODO (Day 2): Replace with real API call
    console.log('[authService.forgotPassword] stub called with:', email);
    return { success: true };
  },

  /**
   * Reset password with token from email link.
   */
  resetPassword: async (token, newPassword) => {
    // TODO (Day 2): Replace with real API call
    console.log('[authService.resetPassword] stub called');
    return { success: true };
  },

  /**
   * Logout — clears server-side session if needed.
   */
  logout: async () => {
    // TODO (Day 2): Call logout endpoint to invalidate JWT on server
    console.log('[authService.logout] stub called');
    return { success: true };
  },
};

export default authService;
