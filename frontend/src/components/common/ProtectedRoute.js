// ============================================================
// components/common/ProtectedRoute.js - Route Guard Component
// Redirects unauthenticated users to login
// Redirects users to correct dashboard based on role
// ============================================================

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// ============================================================
// ProtectedRoute - Wraps routes that require authentication
// @param {Array} allowedRoles - Roles allowed to access this route
// @param {ReactNode} children - The protected page component
// ============================================================
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation(); // Current URL (for redirect after login)

  // ---- Not logged in: redirect to login page ----
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }} // Save current location for post-login redirect
        replace
      />
    );
  }

  // ---- Wrong role: redirect to correct dashboard ----
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    const dashboardRoutes = {
      elder: "/dashboard/elder",
      caregiver: "/dashboard/caregiver",
      volunteer: "/dashboard/volunteer",
    };
    return <Navigate to={dashboardRoutes[user?.role] || "/login"} replace />;
  }

  // ---- Authorized: render the protected component ----
  return children;
};

export default ProtectedRoute;
