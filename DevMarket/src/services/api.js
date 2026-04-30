import axios from 'axios';

/**
 * Centralized Axios instance for all API communication.
 *
 * - Base URL sourced from environment variable (VITE_API_BASE_URL)
 * - Request interceptor: auto-attaches Authorization header if token exists
 * - Response interceptor: global error handling for 401, 403, 500+
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ========================
// REQUEST INTERCEPTOR
// ========================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ========================
// RESPONSE INTERCEPTOR
// ========================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token expired or invalid — clear auth and redirect to login
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
      return Promise.reject(new Error('Session expired. Please log in again.'));
    }

    if (status === 403) {
      console.error('[API] Forbidden: You do not have permission to access this resource.');
      return Promise.reject(new Error('Access denied. You do not have permission.'));
    }

    if (status >= 500) {
      console.error('[API] Server error:', error.response?.data);
      return Promise.reject(new Error('Server error. Please try again later.'));
    }

    return Promise.reject(error);
  }
);

export default api;
