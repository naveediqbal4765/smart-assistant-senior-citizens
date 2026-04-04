// ============================================================
// components/common/ProtectedRoute.js
// Route guard: checks authentication + role-based access
// ============================================================

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuth();

  // Not authenticated → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated but role not allowed → redirect to login
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/login" replace />;
  }

  // All checks passed → render the protected component
  return children;
};

export default ProtectedRoute;
