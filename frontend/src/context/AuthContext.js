// ============================================================
// context/AuthContext.js - Global Authentication State
// Provides auth state (user, token) to all components
// Handles login, logout, and token persistence
// Supports Remember Me functionality with secure tokens
// ============================================================

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import createAPIInterceptor from "../services/apiInterceptor";
import toast from "react-hot-toast";

// Create the Auth Context
const AuthContext = createContext(null);

// ============================================================
// AuthProvider - Wraps the app and provides auth state
// ============================================================
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);           // Current logged-in user object
  const [token, setToken] = useState(null);         // JWT access token
  const [rememberMeToken, setRememberMeToken] = useState(null); // Remember Me token
  const [isLoading, setIsLoading] = useState(true); // Loading state during auth check
  const [isAutoLoggingIn, setIsAutoLoggingIn] = useState(false); // Auto-login in progress

  // ---- Auto-login with Remember Me token on app start ----
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // First, check if we have a valid JWT token
        const storedToken = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
        const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");

        if (storedToken && storedUser) {
          // We have a valid session
          try {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
          } catch (error) {
            console.error("Error parsing stored user:", error);
            // Clear corrupted data
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            sessionStorage.removeItem("accessToken");
            sessionStorage.removeItem("user");
          }
        } else {
          // No valid JWT, check for Remember Me token
          const storedRememberMeToken = localStorage.getItem("rememberMeToken");

          if (storedRememberMeToken) {
            // Try to auto-login with Remember Me token
            setIsAutoLoggingIn(true);
            try {
              const response = await api.post("/auth/verify-remember-me", {
                rememberMeToken: storedRememberMeToken,
              });

              if (response.data.success) {
                // Auto-login successful
                const { token: newToken, user: userData } = response.data.data;

                setToken(newToken);
                setUser(userData);
                setRememberMeToken(storedRememberMeToken);
                api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

                // Store the new JWT token
                localStorage.setItem("accessToken", newToken);
                localStorage.setItem("user", JSON.stringify(userData));
                localStorage.setItem("rememberMeToken", storedRememberMeToken);

                console.log("[AuthContext] Auto-login successful with Remember Me token");
              } else {
                // Remember Me token invalid or expired
                localStorage.removeItem("rememberMeToken");
              }
            } catch (error) {
              console.error("[AuthContext] Auto-login failed:", error);
              // Clear invalid Remember Me token
              localStorage.removeItem("rememberMeToken");
            } finally {
              setIsAutoLoggingIn(false);
            }
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // ============================================================
  // login - Stores token and user after successful login
  // @param {string} accessToken - JWT token from API
  // @param {Object} userData - User object from API
  // @param {string} rememberToken - Remember Me token (optional)
  // @param {boolean} remember - Whether to persist in localStorage
  // ============================================================
  const login = useCallback((accessToken, userData, rememberToken = null, remember = false) => {
    setToken(accessToken);
    setUser(userData);

    // Set Authorization header for all future API requests
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    // Persist to localStorage if "Remember Me" is checked
    if (remember) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(userData));

      // Store Remember Me token if provided
      if (rememberToken) {
        localStorage.setItem("rememberMeToken", rememberToken);
        setRememberMeToken(rememberToken);
      }
    } else {
      // Use sessionStorage for non-persistent sessions
      sessionStorage.setItem("accessToken", accessToken);
      sessionStorage.setItem("user", JSON.stringify(userData));

      // Don't store Remember Me token if not requested
      localStorage.removeItem("rememberMeToken");
      setRememberMeToken(null);
    }
  }, []);

  // ============================================================
  // logout - Clears all auth state and redirects to login
  // Also calls backend logout endpoint to clear Remember Me token
  // ============================================================
  const logout = useCallback(async () => {
    try {
      // Call backend logout endpoint to clear Remember Me token
      if (token) {
        try {
          await api.post("/auth/logout");
        } catch (error) {
          console.error("[AuthContext] Backend logout failed:", error);
          // Continue with local logout even if backend fails
        }
      }
    } finally {
      // Clear local state
      setToken(null);
      setUser(null);
      setRememberMeToken(null);

      // Clear all stored auth data
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("rememberMeToken");
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("user");

      // Remove auth header
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // ============================================================
  // updateUser - Updates user data in state and storage
  // Used after profile updates
  // ============================================================
  const updateUser = useCallback((updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);

    // Update in whichever storage is being used
    if (localStorage.getItem("user")) {
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } else {
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
    }
  }, [user]);

  // ---- Get dashboard route based on user role ----
  const getDashboardRoute = useCallback((role) => {
    const routes = {
      elder: "/dashboard/elder",
      caregiver: "/dashboard/caregiver",
      volunteer: "/dashboard/volunteer",
    };
    return routes[role] || "/login";
  }, []);

  // ---- Check if user has Remember Me enabled ----
  const hasRememberMe = useCallback(() => {
    return !!localStorage.getItem("rememberMeToken");
  }, []);

  // ---- Context value exposed to all children ----
  const contextValue = {
    user,                    // Current user object
    token,                   // JWT access token
    rememberMeToken,         // Remember Me token
    isLoading,               // True while checking stored auth
    isAutoLoggingIn,         // True while auto-login in progress
    isAuthenticated: !!token, // Boolean: is user logged in?
    login,                   // Function to log in
    logout,                  // Function to log out
    updateUser,              // Function to update user data
    getDashboardRoute,       // Get dashboard URL by role
    hasRememberMe,           // Check if Remember Me is enabled
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {/* Don't render children until auth check is complete */}
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

// ============================================================
// useAuth - Custom hook to access auth context
// Usage: const { user, login, logout } = useAuth();
// ============================================================
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
