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
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import RoleSelectionPage from "./pages/auth/RoleSelectionPage";
import VerifyOTPPage from "./pages/auth/VerifyOTPPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

// ---- Module 2: User Profile Management ----
import ProfilePage from "./pages/profile/ProfilePage";

// Elder Pages
import ElderDashboard from "./pages/elder/ElderDashboard";
import ElderMessages from "./pages/elder/ElderMessages";
import ElderSleepTimer from "./pages/elder/ElderSleepTimer";
import ElderMedicationReminder from "./pages/elder/ElderMedicationReminder";
import ElderTaskRequest from "./pages/elder/ElderTaskRequest";
import ElderHealthHistory from "./pages/elder/ElderHealthHistory";
import ElderLabReports from "./pages/elder/ElderLabReports";
import ElderPrescriptions from "./pages/elder/ElderPrescriptions";
import ElderSupport from "./pages/elder/ElderSupport";
import ElderPhysicalRehabilitation from "./pages/elder/ElderPhysicalRehabilitation";
import ElderMyProfile from "./pages/elder/ElderMyProfile";
import ElderSettings from "./pages/elder/ElderSettings";

// Caregiver Pages
import CaregiverDashboard from "./pages/caregiver/CaregiverDashboard";
import CaregiverTaskManagement from "./pages/caregiver/CaregiverTaskManagement";

// Volunteer Pages
import VolunteerDashboard from "./pages/volunteer/VolunteerDashboard";
import VolunteerTaskList from "./pages/volunteer/VolunteerTaskList";

// ---- Module 3: Task Request System Pages ----
import TaskDetailPage from "./pages/task/TaskDetailPage";
import TaskHistoryPage from "./pages/task/TaskHistoryPage";
import TaskNotificationsPage from "./pages/task/TaskNotificationsPage";
import TaskRatingPage from "./pages/task/TaskRatingPage";
import VolunteerProfilePage from "./pages/task/VolunteerProfilePage";
import TaskAnalyticsPage from "./pages/task/TaskAnalyticsPage";
import CaregiverNotificationsPage from "./pages/task/CaregiverNotificationsPage";
import CaregiverTaskAnalyticsPage from "./pages/task/CaregiverTaskAnalyticsPage";
import VolunteerNotificationsPage from "./pages/task/VolunteerNotificationsPage";
import VolunteerTaskAnalyticsPage from "./pages/task/VolunteerTaskAnalyticsPage";
import VolunteerRatingsPage from "./pages/task/VolunteerRatingsPage";
import ElderTaskRequestNotificationsPage from "./pages/task/ElderTaskRequestNotificationsPage";

// Common Pages
import TestDashboardsPage from "./pages/common/TestDashboardsPage";
import NotFoundPage from "./pages/common/NotFoundPage";

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
            duration: 2000,
            style: {
              fontSize: "12px",
              fontWeight: "500",
              borderRadius: "6px",
              padding: "8px 12px",
            },
            success: {
              style: { background: "#22c55e", color: "#fff" },
            },
            error: {
              style: { background: "#ef4444", color: "#fff" },
            },
          }}
          limit={1}
        />

        <Routes>
          {/* ---- Default Route: Redirect to Login ---- */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* ---- Public Auth Routes ---- */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/select-role" element={<RoleSelectionPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-otp" element={<VerifyOTPPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* ---- Module 2: User Profile Management ---- */}
          <Route path="/profile" element={<ProfilePage />} />

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
          <Route path="/elder-messages" element={<ElderMessages />} />
          <Route path="/elder-sleep-timer" element={<ElderSleepTimer />} />
          <Route path="/elder-medication-reminder" element={<ElderMedicationReminder />} />
          <Route path="/elder-task-request" element={<ElderTaskRequest />} />
          <Route path="/elder-health-history" element={<ElderHealthHistory />} />
          <Route path="/elder-lab-reports" element={<ElderLabReports />} />
          <Route path="/elder-prescriptions" element={<ElderPrescriptions />} />
          <Route path="/elder-support" element={<ElderSupport />} />
          <Route path="/elder-physical-rehabilitation" element={<ElderPhysicalRehabilitation />} />
          <Route path="/elder-my-profile" element={<ElderMyProfile />} />
          <Route path="/elder-settings" element={<ElderSettings />} />
          <Route path="/caregiver-dashboard" element={<CaregiverDashboard />} />
          <Route path="/caregiver-task-management" element={<CaregiverTaskManagement />} />
          <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
          <Route path="/volunteer-task-list" element={<VolunteerTaskList />} />

          {/* ---- Module 3: Task Request System Routes ---- */}
          <Route path="/task-detail/:id" element={<TaskDetailPage />} />
          <Route path="/task-history" element={<TaskHistoryPage />} />
          <Route path="/task-notifications" element={<TaskNotificationsPage />} />
          <Route path="/task-rating" element={<TaskRatingPage />} />
          <Route path="/volunteer-profile/:volunteerId" element={<VolunteerProfilePage />} />
          <Route path="/task-analytics" element={<TaskAnalyticsPage />} />
          <Route path="/caregiver-notifications" element={<CaregiverNotificationsPage />} />
          <Route path="/caregiver-task-analytics" element={<CaregiverTaskAnalyticsPage />} />
          <Route path="/volunteer-notifications" element={<VolunteerNotificationsPage />} />
          <Route path="/volunteer-task-analytics" element={<VolunteerTaskAnalyticsPage />} />
          <Route path="/volunteer-ratings" element={<VolunteerRatingsPage />} />
          <Route path="/elder-task-request-notifications" element={<ElderTaskRequestNotificationsPage />} />

          {/* ---- 404 Not Found ---- */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
