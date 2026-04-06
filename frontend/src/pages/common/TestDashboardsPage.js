// ============================================================
// pages/TestDashboardsPage.js - Test Dashboard Access
// ============================================================

import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";

const TestDashboardsPage = () => {
  const navigate = useNavigate();

  const dashboards = [
    {
      id: "elder",
      name: "Elder Dashboard",
      description: "View health metrics, SOS alerts, and caregiver info",
      color: "#52b788",
      icon: "👴",
    },
    {
      id: "caregiver",
      name: "Caregiver Dashboard",
      description: "Monitor assigned elders and manage schedules",
      color: "#2d6a4f",
      icon: "🏥",
    },
    {
      id: "volunteer",
      name: "Volunteer Dashboard",
      description: "View available tasks and manage availability",
      color: "#1b4332",
      icon: "🤝",
    },
  ];

  const handleAccessDashboard = (dashboardId) => {
    // Set mock user data in localStorage
    const mockUsers = {
      elder: {
        userId: "elder_123",
        email: "elder@example.com",
        fullName: "John Doe",
        role: "elder",
      },
      caregiver: {
        userId: "caregiver_123",
        email: "caregiver@example.com",
        fullName: "Jane Smith",
        role: "caregiver",
      },
      volunteer: {
        userId: "volunteer_123",
        email: "volunteer@example.com",
        fullName: "Mike Johnson",
        role: "volunteer",
      },
    };

    // Set mock token
    localStorage.setItem("token", "mock_jwt_token_for_testing");
    localStorage.setItem("user", JSON.stringify(mockUsers[dashboardId]));

    // Navigate to dashboard
    if (dashboardId === "elder") {
      navigate("/elder-dashboard");
    } else if (dashboardId === "caregiver") {
      navigate("/caregiver-dashboard");
    } else if (dashboardId === "volunteer") {
      navigate("/volunteer-dashboard");
    }
  };

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Header */}
      <Header showBorder={true} />

      {/* Main Content */}
      <div style={{ paddingTop: "100px", padding: "40px 20px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Title */}
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h1 style={{ fontSize: "32px", fontWeight: 700, color: "#1C382A", margin: "0 0 10px 0" }}>
              Test Dashboards
            </h1>
            <p style={{ fontSize: "16px", color: "#666", margin: "0" }}>
              Click on any dashboard below to access it without authentication
            </p>
          </div>

          {/* Dashboard Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "30px",
              marginBottom: "50px",
            }}
          >
            {dashboards.map((dashboard) => (
              <div
                key={dashboard.id}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px",
                  padding: "30px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  border: `3px solid ${dashboard.color}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                }}
                onClick={() => handleAccessDashboard(dashboard.id)}
              >
                {/* Icon */}
                <div style={{ fontSize: "48px", marginBottom: "15px" }}>{dashboard.icon}</div>

                {/* Title */}
                <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1C382A", margin: "0 0 10px 0" }}>
                  {dashboard.name}
                </h2>

                {/* Description */}
                <p style={{ fontSize: "14px", color: "#666", margin: "0 0 20px 0", lineHeight: "1.6" }}>
                  {dashboard.description}
                </p>

                {/* Button */}
                <button
                  style={{
                    width: "100%",
                    padding: "12px 20px",
                    backgroundColor: dashboard.color,
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.9";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  Access Dashboard →
                </button>
              </div>
            ))}
          </div>

          {/* Info Box */}
          <div
            style={{
              backgroundColor: "#FFF3CD",
              border: "2px solid #FFC107",
              borderRadius: "8px",
              padding: "20px",
              marginBottom: "30px",
            }}
          >
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#856404", margin: "0 0 10px 0" }}>
              ⚠️ Testing Mode
            </h3>
            <p style={{ fontSize: "14px", color: "#856404", margin: "0" }}>
              This page provides direct access to dashboards for testing purposes. In production, users must authenticate
              with email and password. Mock user data is stored in localStorage for this session.
            </p>
          </div>

          {/* Features List */}
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", padding: "30px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#1C382A", margin: "0 0 20px 0" }}>
              Available Features
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
              {/* Elder Features */}
              <div>
                <h4 style={{ fontSize: "16px", fontWeight: 600, color: "#52b788", margin: "0 0 10px 0" }}>
                  👴 Elder Dashboard
                </h4>
                <ul style={{ fontSize: "14px", color: "#666", margin: "0", paddingLeft: "20px" }}>
                  <li>Health metrics display</li>
                  <li>SOS emergency button</li>
                  <li>Caregiver information</li>
                  <li>Medical history</li>
                  <li>Emergency contacts</li>
                </ul>
              </div>

              {/* Caregiver Features */}
              <div>
                <h4 style={{ fontSize: "16px", fontWeight: 600, color: "#2d6a4f", margin: "0 0 10px 0" }}>
                  🏥 Caregiver Dashboard
                </h4>
                <ul style={{ fontSize: "14px", color: "#666", margin: "0", paddingLeft: "20px" }}>
                  <li>Assigned elders list</li>
                  <li>Real-time alerts</li>
                  <li>Schedule management</li>
                  <li>Health monitoring</li>
                  <li>Communication tools</li>
                </ul>
              </div>

              {/* Volunteer Features */}
              <div>
                <h4 style={{ fontSize: "16px", fontWeight: 600, color: "#1b4332", margin: "0 0 10px 0" }}>
                  🤝 Volunteer Dashboard
                </h4>
                <ul style={{ fontSize: "14px", color: "#666", margin: "0", paddingLeft: "20px" }}>
                  <li>Available tasks</li>
                  <li>Availability management</li>
                  <li>Skills showcase</li>
                  <li>Ratings and reviews</li>
                  <li>Location-based matching</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDashboardsPage;
