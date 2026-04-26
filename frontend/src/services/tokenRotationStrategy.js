// ============================================================
// frontend/src/services/tokenRotationStrategy.js
// Token Rotation Strategy Implementation
// Handles automatic token refresh and rotation
// ============================================================

/**
 * Token Rotation Strategy
 * Implements automatic token refresh before expiration
 * Prevents token expiration during user activity
 */
class TokenRotationStrategy {
  constructor() {
    this.refreshThreshold = 2 * 60 * 1000; // Refresh 2 minutes before expiration
    this.refreshTimer = null;
    this.isRefreshing = false;
    this.onTokenRefresh = null;
    this.onLogout = null;
  }

  /**
   * Initialize token rotation strategy
   * @param {string} accessToken - Current access token
   * @param {Function} onRefresh - Callback when token is refreshed
   * @param {Function} onLogout - Callback when logout is needed
   */
  initialize(accessToken, onRefresh, onLogout) {
    this.onTokenRefresh = onRefresh;
    this.onLogout = onLogout;

    if (accessToken) {
      this.scheduleTokenRefresh(accessToken);
    }
  }

  /**
   * Schedule token refresh before expiration
   * @param {string} accessToken - JWT access token
   */
  scheduleTokenRefresh(accessToken) {
    // Clear existing timer
    this.clearRefreshTimer();

    try {
      // Decode token to get expiration
      const decoded = this.decodeToken(accessToken);
      if (!decoded || !decoded.exp) {
        console.warn("[TokenRotation] Invalid token format");
        return;
      }

      // Calculate time until expiration
      const expirationTime = decoded.exp * 1000; // Convert to milliseconds
      const now = Date.now();
      const timeUntilExpiration = expirationTime - now;

      // Calculate when to refresh (2 minutes before expiration)
      const refreshTime = timeUntilExpiration - this.refreshThreshold;

      if (refreshTime > 0) {
        console.log(
          `[TokenRotation] Token will refresh in ${Math.round(refreshTime / 1000)} seconds`
        );

        // Schedule refresh
        this.refreshTimer = setTimeout(() => {
          this.performTokenRefresh();
        }, refreshTime);
      } else if (timeUntilExpiration > 0) {
        // Token expires soon, refresh immediately
        console.warn("[TokenRotation] Token expires soon, refreshing immediately");
        this.performTokenRefresh();
      } else {
        // Token already expired
        console.warn("[TokenRotation] Token already expired");
        if (this.onLogout) {
          this.onLogout();
        }
      }
    } catch (error) {
      console.error("[TokenRotation] Error scheduling refresh:", error);
    }
  }

  /**
   * Perform token refresh
   * Called automatically before token expiration
   */
  async performTokenRefresh() {
    if (this.isRefreshing) {
      console.log("[TokenRotation] Refresh already in progress");
      return;
    }

    this.isRefreshing = true;

    try {
      console.log("[TokenRotation] Performing automatic token refresh");

      // Get refresh token from storage
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        console.warn("[TokenRotation] No refresh token available");
        if (this.onLogout) {
          this.onLogout();
        }
        return;
      }

      // Call refresh endpoint
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/auth/refresh-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        }
      );

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
      }

      const data = await response.json();
      const { accessToken, refreshToken: newRefreshToken } = data.data;

      // Update tokens
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      // Notify about refresh
      if (this.onTokenRefresh) {
        this.onTokenRefresh(accessToken, newRefreshToken);
      }

      // Schedule next refresh
      this.scheduleTokenRefresh(accessToken);

      console.log("[TokenRotation] Token refreshed successfully");
    } catch (error) {
      console.error("[TokenRotation] Token refresh failed:", error);

      // Logout on refresh failure
      if (this.onLogout) {
        this.onLogout();
      }
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Decode JWT token without verification
   * @param {string} token - JWT token
   * @returns {Object|null} Decoded payload or null
   */
  decodeToken(token) {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        return null;
      }

      const decoded = JSON.parse(atob(parts[1]));
      return decoded;
    } catch (error) {
      console.error("[TokenRotation] Error decoding token:", error);
      return null;
    }
  }

  /**
   * Clear refresh timer
   */
  clearRefreshTimer() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  /**
   * Reset strategy (on logout)
   */
  reset() {
    this.clearRefreshTimer();
    this.isRefreshing = false;
    this.onTokenRefresh = null;
    this.onLogout = null;
  }

  /**
   * Get token expiration time
   * @param {string} token - JWT token
   * @returns {number} Milliseconds until expiration (0 if expired)
   */
  getTokenExpirationTime(token) {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) {
        return 0;
      }

      const expirationTime = decoded.exp * 1000;
      const timeRemaining = expirationTime - Date.now();
      return Math.max(0, timeRemaining);
    } catch (error) {
      return 0;
    }
  }

  /**
   * Check if token is expired
   * @param {string} token - JWT token
   * @returns {boolean} True if token is expired
   */
  isTokenExpired(token) {
    return this.getTokenExpirationTime(token) === 0;
  }

  /**
   * Get token expiration date
   * @param {string} token - JWT token
   * @returns {Date|null} Expiration date or null
   */
  getTokenExpirationDate(token) {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) {
        return null;
      }

      return new Date(decoded.exp * 1000);
    } catch (error) {
      return null;
    }
  }
}

// Export singleton instance
export default new TokenRotationStrategy();
