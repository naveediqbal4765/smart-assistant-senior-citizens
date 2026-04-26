// ============================================================
// frontend/src/services/apiInterceptor.js
// API Interceptor for Automatic Token Refresh
// Handles token expiration and automatic refresh
// ============================================================

import axios from "axios";

/**
 * Create API instance with interceptors
 * Handles automatic token refresh on 401 responses
 *
 * @param {Function} getAuthToken - Function to get current auth token
 * @param {Function} getRefreshToken - Function to get refresh token
 * @param {Function} setAuthToken - Function to set new auth token
 * @param {Function} onTokenRefresh - Callback when token is refreshed
 * @param {Function} onLogout - Callback when logout is needed
 * @returns {AxiosInstance} Configured axios instance
 */
const createAPIInterceptor = (
  getAuthToken,
  getRefreshToken,
  setAuthToken,
  onTokenRefresh,
  onLogout
) => {
  // Create axios instance
  const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Track if we're currently refreshing token
  let isRefreshing = false;
  let failedQueue = [];

  /**
   * Process queued requests after token refresh
   * @param {string} token - New access token
   */
  const processQueue = (token) => {
    failedQueue.forEach((prom) => {
      prom.resolve(token);
    });
    failedQueue = [];
  };

  // ============================================================
  // REQUEST INTERCEPTOR
  // ============================================================
  api.interceptors.request.use(
    (config) => {
      // Get current auth token
      const token = getAuthToken();

      // Add token to Authorization header if available
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      console.error("[API Interceptor] Request error:", error);
      return Promise.reject(error);
    }
  );

  // ============================================================
  // RESPONSE INTERCEPTOR
  // ============================================================
  api.interceptors.response.use(
    (response) => {
      // Success response - return as is
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // Handle 401 Unauthorized (token expired)
      if (error.response?.status === 401 && !originalRequest._retry) {
        // Prevent infinite loop
        originalRequest._retry = true;

        // If already refreshing, queue this request
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(api(originalRequest));
              },
              reject: (err) => reject(err),
            });
          });
        }

        // Start token refresh
        isRefreshing = true;

        try {
          const refreshToken = getRefreshToken();

          if (!refreshToken) {
            // No refresh token available - logout user
            console.warn("[API Interceptor] No refresh token available");
            isRefreshing = false;
            onLogout();
            return Promise.reject(error);
          }

          // Call refresh token endpoint
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/auth/refresh-token`,
            { refreshToken },
            {
              timeout: 10000,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const { accessToken, refreshToken: newRefreshToken } = response.data.data;

          // Update tokens
          setAuthToken(accessToken, newRefreshToken);

          // Notify about token refresh
          if (onTokenRefresh) {
            onTokenRefresh(accessToken, newRefreshToken);
          }

          // Process queued requests
          processQueue(accessToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error("[API Interceptor] Token refresh failed:", refreshError);

          // Refresh failed - logout user
          processQueue(null);
          onLogout();

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // Handle other errors
      if (error.response?.status === 403) {
        console.error("[API Interceptor] Forbidden - access denied");
      }

      if (error.response?.status === 404) {
        console.error("[API Interceptor] Not found");
      }

      if (error.response?.status === 500) {
        console.error("[API Interceptor] Server error");
      }

      return Promise.reject(error);
    }
  );

  return api;
};

export default createAPIInterceptor;
