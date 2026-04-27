import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import Logo from "../../assets/images/Logo.png";



const ElderDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          backgroundColor: "#1C382A",
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
            <h1 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "clamp(16px, 3vw, 22px)", color: "#FFFFFF", margin: "0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Smart Assistant
            </h1>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 400, fontSize: "clamp(10px, 1.5vw, 13px)", color: "#BAE4C7", margin: "0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Care for Seniors, By Community
            </p>
          </div>
        </div>

        {/* Profile Button - Top Right */}
        <button
          onClick={() => navigate("/profile")}
          style={{
            padding: "10px 16px",
            backgroundColor: "#52b788",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "13px",
            fontFamily: "Montserrat, sans-serif",
            transition: "all 0.3s ease",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#2d6a4f")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#52b788")}
        >
          My Profile
        </button>
      </div>

      {/* Main Content */}
      <div className="page-bg min-h-screen p-6" style={{ flex: 1 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#1b4332" }}>
              Elder Dashboard
            </h1>
          </div>

          {/* Module 3: Task Request System */}
          <div style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1b4332", marginBottom: "20px" }}>
              📋 Module 3: Task Request System
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
              {/* Task Request */}
              <button
                onClick={() => navigate("/elder-task-request")}
                style={{
                  padding: "20px",
                  backgroundColor: "#52b788",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "14px",
                  fontFamily: "Montserrat, sans-serif",
                  transition: "all 0.3s ease",
                  textAlign: "center",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#2d6a4f")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#52b788")}
              >
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>📝</div>
                Create Task Request
              </button>

              {/* Task History */}
              <button
                onClick={() => navigate("/task-history")}
                style={{
                  padding: "20px",
                  backgroundColor: "#52b788",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "14px",
                  fontFamily: "Montserrat, sans-serif",
                  transition: "all 0.3s ease",
                  textAlign: "center",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#2d6a4f")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#52b788")}
              >
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>📜</div>
                Task History
              </button>

              {/* Notifications */}
              <button
                onClick={() => navigate("/task-notifications")}
                style={{
                  padding: "20px",
                  backgroundColor: "#52b788",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "14px",
                  fontFamily: "Montserrat, sans-serif",
                  transition: "all 0.3s ease",
                  textAlign: "center",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#2d6a4f")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#52b788")}
              >
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>🔔</div>
                Notifications
              </button>

              {/* Volunteer Ratings */}
              <button
                onClick={() => navigate("/task-rating")}
                style={{
                  padding: "20px",
                  backgroundColor: "#52b788",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "14px",
                  fontFamily: "Montserrat, sans-serif",
                  transition: "all 0.3s ease",
                  textAlign: "center",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#2d6a4f")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#52b788")}
              >
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>⭐</div>
                Volunteer Ratings
              </button>

              {/* Analytics */}
              <button
                onClick={() => navigate("/task-analytics")}
                style={{
                  padding: "20px",
                  backgroundColor: "#52b788",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "14px",
                  fontFamily: "Montserrat, sans-serif",
                  transition: "all 0.3s ease",
                  textAlign: "center",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#2d6a4f")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#52b788")}
              >
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>📊</div>
                Task Analytics
              </button>
            </div>
          </div>

          <p style={{ textAlign: "center", marginTop: "40px", fontSize: "0.9rem", color: "#6b7280" }}>
            Elder Dashboard - Module Skeleton
          </p>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ElderDashboard;
