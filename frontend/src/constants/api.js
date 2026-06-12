/**
 * api.js — Central API configuration for SkillAsAService.
 *
 * All API base URLs and endpoint paths go here.
 * Components and services import from this file — never hardcode URLs.
 *
 * Owner: Lohith — update when backend URLs change.
 */

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  /* Auth Service */
  AUTH: {
    LOGIN:            `${API_BASE_URL}/auth/login`,
    REGISTER:         `${API_BASE_URL}/auth/register`,
    LOGOUT:           `${API_BASE_URL}/auth/logout`,
    FORGOT_PASSWORD:  `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD:   `${API_BASE_URL}/auth/reset-password`,
    VERIFY_EMAIL:     `${API_BASE_URL}/auth/verify-email`,
    REFRESH_TOKEN:    `${API_BASE_URL}/auth/refresh`,
  },

  /* User / Profile Service */
  USER: {
    PROFILE:          `${API_BASE_URL}/users/profile`,
    UPDATE_PROFILE:   `${API_BASE_URL}/users/profile`,
  },

  /* Subscription Service (Milestone 2) */
  SUBSCRIPTION: {
    PLANS:            `${API_BASE_URL}/subscriptions/plans`,
    SUBSCRIBE:        `${API_BASE_URL}/subscriptions/subscribe`,
    MY_SUBSCRIPTIONS: `${API_BASE_URL}/subscriptions/my`,
  },

  /* Wallet Service (Milestone 3) */
  WALLET: {
    BALANCE:          `${API_BASE_URL}/wallet/balance`,
    DEPOSIT:          `${API_BASE_URL}/wallet/deposit`,
    WITHDRAW:         `${API_BASE_URL}/wallet/withdraw`,
    TRANSACTIONS:     `${API_BASE_URL}/wallet/transactions`,
  },

  /* Project Service (Milestone 4) */
  PROJECTS: {
    LIST:             `${API_BASE_URL}/projects`,
    CREATE:           `${API_BASE_URL}/projects`,
    DETAIL:           (id) => `${API_BASE_URL}/projects/${id}`,
    TASKS:            (id) => `${API_BASE_URL}/projects/${id}/tasks`,
  },

  /* Chat Service (Milestone 4) */
  CHAT: {
    ROOMS:            `${API_BASE_URL}/chat/rooms`,
    MESSAGES:         (roomId) => `${API_BASE_URL}/chat/rooms/${roomId}/messages`,
  },
};

export default API_ENDPOINTS;
