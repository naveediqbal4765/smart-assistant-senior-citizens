// ============================================================
// src/App.js - Root Application Component
// Sets up React Router, Auth Context, and all page routes
// ============================================================

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // Toast notifications

// Context Providers
import { AuthProvider } from "./context/AuthContext";

// Route Guards
import ProtectedRoute from "./components/common/ProtectedRoute";

// Auth Pages
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import VerifyOTPPage from "./pages/VerifyOTPPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

// Dashboard Pages (role-based)
import ElderDashboard from "./pages/ElderDashboard";
import CaregiverDashboard from "./pages/CaregiverDashboard";
import VolunteerDashboard from "./pages/VolunteerDashboard";

// Test Pages
import TestDashboardsPage from "./pages/TestDashboardsPage";

// 404 Page
import NotFoundPage from "./pages/NotFoundPage";

// ============================================================
// App - Root component with routing configuration
// ============================================================
function App() {
  return (
    // AuthProvider wraps everything to provide auth state globally
    <AuthProvider>
      <Router>
        {/* Toast notification container - positioned top-right */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              fontSize: "18px",    // Larger text for seniors
              fontWeight: "600",
              borderRadius: "12px",
              padding: "16px 20px",
            },
            success: {
              style: { background: "#22c55e", color: "#fff" },
            },
            error: {
              style: { background: "#ef4444", color: "#fff" },
            },
          }}
        />

        <Routes>
          {/* ---- Default Route: Redirect to Login ---- */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* ---- Public Auth Routes ---- */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-otp" element={<VerifyOTPPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* ---- Protected Dashboard Routes (require login + correct role) ---- */}

          {/* Elder Dashboard - only accessible by users with role "elder" */}
          <Route
            path="/dashboard/elder"
            element={
              <ProtectedRoute allowedRoles={["elder"]}>
                <ElderDashboard />
              </ProtectedRoute>
            }
          />

          {/* Caregiver Dashboard - only accessible by users with role "caregiver" */}
          <Route
            path="/dashboard/caregiver"
            element={
              <ProtectedRoute allowedRoles={["caregiver"]}>
                <CaregiverDashboard />
              </ProtectedRoute>
            }
          />

          {/* Volunteer Dashboard - only accessible by users with role "volunteer" */}
          <Route
            path="/dashboard/volunteer"
            element={
              <ProtectedRoute allowedRoles={["volunteer"]}>
                <VolunteerDashboard />
              </ProtectedRoute>
            }
          />

          {/* ---- TEST ROUTES (No authentication required - for testing) ---- */}
          <Route path="/test-dashboards" element={<TestDashboardsPage />} />
          <Route path="/test/elder-dashboard" element={<ElderDashboard />} />
          <Route path="/test/caregiver-dashboard" element={<CaregiverDashboard />} />
          <Route path="/test/volunteer-dashboard" element={<VolunteerDashboard />} />
          <Route path="/elder-dashboard" element={<ElderDashboard />} />
          <Route path="/caregiver-dashboard" element={<CaregiverDashboard />} />
          <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />

          {/* ---- 404 Not Found ---- */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
