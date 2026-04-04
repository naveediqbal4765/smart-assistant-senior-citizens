// ============================================================
// context/AuthContext.js - Global Authentication State
// Provides auth state (user, token) to all components
// Handles login, logout, and token persistence
// ============================================================

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

// Create the Auth Context
const AuthContext = createContext(null);

// ============================================================
// AuthProvider - Wraps the app and provides auth state
// ============================================================
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);           // Current logged-in user object
  const [token, setToken] = useState(null);         // JWT access token
  const [isLoading, setIsLoading] = useState(true); // Loading state during auth check

  // ---- Load user from localStorage on app start ----
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser)); // Parse stored user JSON
        api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`; // Set auth header
      } catch (error) {
        // Clear corrupted data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false); // Done checking stored auth
  }, []);

  // ============================================================
  // login - Stores token and user after successful login
  // @param {string} accessToken - JWT token from API
  // @param {Object} userData - User object from API
  // @param {boolean} remember - Whether to persist in localStorage
  // ============================================================
  const login = useCallback((accessToken, userData, remember = false) => {
    setToken(accessToken);
    setUser(userData);

    // Set Authorization header for all future API requests
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    // Persist to localStorage if "Remember Me" is checked
    if (remember) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      // Use sessionStorage for non-persistent sessions
      sessionStorage.setItem("accessToken", accessToken);
      sessionStorage.setItem("user", JSON.stringify(userData));
    }
  }, []);

  // ============================================================
  // logout - Clears all auth state and redirects to login
  // ============================================================
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);

    // Clear stored auth data
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("user");

    // Remove auth header
    delete api.defaults.headers.common["Authorization"];

    toast.success("Logged out successfully");
  }, []);

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

  // ---- Context value exposed to all children ----
  const contextValue = {
    user,           // Current user object
    token,          // JWT access token
    isLoading,      // True while checking stored auth
    isAuthenticated: !!token, // Boolean: is user logged in?
    login,          // Function to log in
    logout,         // Function to log out
    updateUser,     // Function to update user data
    getDashboardRoute, // Get dashboard URL by role
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
