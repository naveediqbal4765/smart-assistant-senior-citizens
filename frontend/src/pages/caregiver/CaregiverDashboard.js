import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import Logo from "../../assets/images/Logo.png";

const COLORS = {
  darkGreen: "#1C382A",
  mediumGreen: "#52b788",
  darkMediumGreen: "#2d6a4f",
  veryLightGreen: "#BAE4C7",
  white: "#FFFFFF",
  lightGray: "#f5f5f5",
  darkGray: "#666666",
  red: "#e63946",
  yellow: "#FFC107",
  cardBg: "#f9f9f9",
};

const CaregiverDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showTaskRequestModal, setShowTaskRequestModal] = useState(false);

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          backgroundColor: COLORS.darkGreen,
          padding: "clamp(12px, 2vw, 20px) clamp(16px, 4vw, 40px)",
          display: "flex",
          alignItems: "center",
          gap: "clamp(8px, 2vw, 16px)",
          zIndex: 10,
          flexWrap: "wrap",
          justifyContent: "space-between",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px, 2vw, 16px)" }}>
          <img src={Logo} alt="Logo" style={{ height: Math.min(Math.max(32, window.innerWidth * 0.04), 48), width: 'auto' }} />
          <div style={{ minWidth: "0", flex: "1 1 auto" }}>
            <h1 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "clamp(16px, 3vw, 22px)", color: COLORS.white, margin: "0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Smart Assistant
            </h1>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 400, fontSize: "clamp(10px, 1.5vw, 13px)", color: COLORS.veryLightGreen, margin: "0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Care for Seniors, By Community
            </p>
          </div>
        </div>

        {/* Profile Button - Top Right */}
        <button
          onClick={() => navigate("/profile")}
          style={{
            padding: "10px 16px",
            backgroundColor: COLORS.mediumGreen,
            color: COLORS.white,
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "13px",
            fontFamily: "Montserrat, sans-serif",
            transition: "all 0.3s ease",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.darkMediumGreen)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.mediumGreen)}
        >
          My Profile
        </button>
      </div>

      {/* Main Content */}
      <div className="page-bg min-h-screen p-6" style={{ flex: 1, backgroundColor: COLORS.lightGray }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, color: COLORS.darkGreen }}>
              Caregiver Dashboard
            </h1>
          </div>

          {/* Task Request Card - Single Clickable Card */}
          <div style={{ marginBottom: "40px" }}>
            <button
              onClick={() => setShowTaskRequestModal(true)}
              style={{
                width: "100%",
                padding: "40px",
                backgroundColor: COLORS.white,
                border: `3px solid ${COLORS.mediumGreen}`,
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "24px",
                fontFamily: "Montserrat, sans-serif",
                color: COLORS.darkGreen,
                transition: "all 0.3s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                textAlign: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.veryLightGreen;
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.white;
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
              }}
            >
              Task Request
            </button>
          </div>

          <p style={{ textAlign: "center", marginTop: "40px", fontSize: "0.9rem", color: COLORS.darkGray }}>
            Click on "Task Request" to access all task management features
          </p>
        </div>
      </div>

      {/* Task Request Modal */}
      {showTaskRequestModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => setShowTaskRequestModal(false)}
        >
          <div
            style={{
              backgroundColor: COLORS.white,
              borderRadius: "12px",
              padding: "40px",
              maxWidth: "900px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "30px",
              }}
            >
              <h2
                style={{
                  color: COLORS.darkGreen,
                  margin: "0",
                  fontSize: "28px",
                  fontWeight: 700,
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                Task Request
              </h2>
              <button
                onClick={() => setShowTaskRequestModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "32px",
                  cursor: "pointer",
                  color: COLORS.darkGray,
                  fontWeight: "bold",
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Content - Grid of Buttons */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "20px",
              }}
            >
              {/* Manage Tasks */}
              <button
                onClick={() => {
                  setShowTaskRequestModal(false);
                  navigate("/caregiver-task-management");
                }}
                style={{
                  padding: "30px 20px",
                  backgroundColor: COLORS.mediumGreen,
                  color: COLORS.white,
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "16px",
                  fontFamily: "Montserrat, sans-serif",
                  transition: "all 0.3s ease",
                  textAlign: "center",
                  minHeight: "150px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = COLORS.darkMediumGreen;
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = COLORS.mediumGreen;
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <div style={{ fontSize: "24px", marginBottom: "10px" }}>Manage Tasks</div>
              </button>

              {/* Notifications */}
              <button
                onClick={() => {
                  setShowTaskRequestModal(false);
                  navigate("/task-notifications");
                }}
                style={{
                  padding: "30px 20px",
                  backgroundColor: COLORS.mediumGreen,
                  color: COLORS.white,
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "16px",
                  fontFamily: "Montserrat, sans-serif",
                  transition: "all 0.3s ease",
                  textAlign: "center",
                  minHeight: "150px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = COLORS.darkMediumGreen;
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = COLORS.mediumGreen;
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <div style={{ fontSize: "24px", marginBottom: "10px" }}>Notifications</div>
              </button>

              {/* Analytics */}
              <button
                onClick={() => {
                  setShowTaskRequestModal(false);
                  navigate("/task-analytics");
                }}
                style={{
                  padding: "30px 20px",
                  backgroundColor: COLORS.mediumGreen,
                  color: COLORS.white,
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "16px",
                  fontFamily: "Montserrat, sans-serif",
                  transition: "all 0.3s ease",
                  textAlign: "center",
                  minHeight: "150px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = COLORS.darkMediumGreen;
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = COLORS.mediumGreen;
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <div style={{ fontSize: "24px", marginBottom: "10px" }}>Analytics</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CaregiverDashboard;
