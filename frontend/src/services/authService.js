import { API_ENDPOINTS } from '../constants/api';

/**
 * authService — All authentication API calls.
 *
 * Stub implementations return realistic shapes so the UI works end-to-end.
 * Replace each TODO block with a real fetch/axios call when the backend is ready.
 */

const authService = {
  /**
   * Login with email and password.
   * Returns { token, user: { name, email, role } }
   * role: 'freelancer' | 'client' | 'admin'
   *
   * STUB RULE: email containing 'freelancer' → freelancer portal,
   *            everything else              → client portal.
   */
  login: async (email, password) => {
    // TODO: replace with real API call
    // const res = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password }),
    // });
    // if (!res.ok) throw new Error('Invalid credentials');
    // return res.json(); // expected shape: { token, user: { name, email, role } }

    console.log('[authService.login] stub called with:', email);
    const role = email.includes('freelancer') ? 'freelancer' : 'client';
    return {
      token: 'stub-token-' + Date.now(),
      user:  { name: 'Demo User', email, role },
    };
  },

  /**
   * Social OAuth login.
   * provider : 'google' | 'facebook' | 'github'
   * role     : 'freelancer' | 'client'  ← REQUIRED — caller must supply this
   *            because social providers do not return a SaaS role.
   *
   * Returns { token, user: { name, email, role } }
   *
   * TODO (backend ready): replace the stub with a real OAuth redirect/popup flow.
   * Example popup flow:
   *   const authUrl = `${API_BASE}/auth/oauth/${provider}?role=${role}`;
   *   const popup = window.open(authUrl, '_blank', 'width=500,height=600');
   *   // listen for postMessage: { token, user }
   */
  socialLogin: async (provider, role) => {
    if (!role) throw new Error('role is required for social login');

    console.log(`[authService.socialLogin] provider=${provider} role=${role}`);

    // Stub: return a realistic shape so navigation works immediately
    return {
      token: `stub-${provider}-token-` + Date.now(),
      user:  {
        name:  `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        email: `user@${provider}.com`,
        role,           // ← role comes from the caller, NOT hardcoded
      },
    };
  },

  /**
   * Register a new user.
   */
  register: async (userData) => {
    // TODO: replace with real API call
    console.log('[authService.register] stub called with:', userData);
    return { success: true };
  },

  /**
   * Send forgot-password email.
   */
  forgotPassword: async (email) => {
    // TODO: replace with real API call
    console.log('[authService.forgotPassword] stub called with:', email);
    return { success: true };
  },

  /**
   * Reset password with token from email link.
   */
  resetPassword: async (token, newPassword) => {
    // TODO: replace with real API call
    console.log('[authService.resetPassword] stub called');
    return { success: true };
  },

  /**
   * Logout — clears server-side session if needed.
   */
  logout: async () => {
    // TODO: call logout endpoint to invalidate JWT on server
    console.log('[authService.logout] stub called');
    return { success: true };
  },
};

export default authService;
