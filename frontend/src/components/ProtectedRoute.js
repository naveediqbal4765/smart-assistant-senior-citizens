// ============================================================
// components/ProtectedRoute.js
// Protected Route Wrapper Component
// Checks if user is authenticated before allowing access
// Redirects to login if not authenticated
// ============================================================

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute Component
 * Wraps routes that require authentication
 * 
 * Usage:
 * <ProtectedRoute>
 *   <DashboardPage />
 * </ProtectedRoute>
 * 
 * @param {React.ReactNode} children - Component to render if authenticated
 * @param {string} requiredRole - Optional: specific role required (e.g., "elder")
 * @returns {React.ReactNode} Either the protected component or redirect to login
 */
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "4px solid #bae4c7",
              borderTop: "4px solid #52b788",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }}
          />
          <p style={{ color: "#1c382a", fontSize: "16px", fontWeight: 600 }}>
            Loading...
          </p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if specific role is required
  if (requiredRole && user?.role !== requiredRole) {
    // User is authenticated but doesn't have the required role
    // Redirect to their appropriate dashboard
    const dashboardRoutes = {
      elder: "/dashboard/elder",
      caregiver: "/dashboard/caregiver",
      volunteer: "/dashboard/volunteer",
    };

    return <Navigate to={dashboardRoutes[user?.role] || "/login"} replace />;
  }

  // User is authenticated and has required role (if specified)
  return children;
};

export default ProtectedRoute;
