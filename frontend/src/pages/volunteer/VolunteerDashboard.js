import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";

// ---- SVG Logo: Green cross with red heart ----
const AppLogo = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="30" y="10" width="40" height="80" rx="8" fill="#52b788" />
    <rect x="10" y="30" width="80" height="40" rx="8" fill="#52b788" />
    <rect x="34" y="14" width="32" height="72" rx="6" fill="#74c69d" />
    <rect x="14" y="34" width="72" height="32" rx="6" fill="#74c69d" />
    <circle cx="50" cy="50" r="18" fill="white" />
    <path
      d="M50 58 C50 58 38 50 38 43 C38 39 41 36 44.5 36 C46.5 36 48.5 37.2 50 39 C51.5 37.2 53.5 36 55.5 36 C59 36 62 39 62 43 C62 50 50 58 50 58Z"
      fill="#e63946"
    />
  </svg>
);

const VolunteerDashboard = () => {
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
          justifyContent: "flex-start",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <AppLogo size={Math.min(Math.max(32, window.innerWidth * 0.04), 48)} />
        <div style={{ minWidth: "0", flex: "1 1 auto" }}>
          <h1 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "clamp(16px, 3vw, 22px)", color: "#FFFFFF", margin: "0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            Smart Assistant
          </h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 400, fontSize: "clamp(10px, 1.5vw, 13px)", color: "#BAE4C7", margin: "0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            Care for Seniors, By Community
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="page-bg min-h-screen p-6" style={{ flex: 1 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#1b4332" }}>
            Volunteer Dashboard
          </h1>
          <button onClick={() => { logout(); navigate("/login"); }} className="btn-primary" style={{ width: "auto" }}>
            Logout
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
          {/* Availability Status */}
          <div className="auth-card" style={{ textAlign: "center" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1b4332", marginBottom: "12px" }}>Status</h3>
            <button className="btn-primary" style={{ marginTop: "12px" }}>Go Online</button>
            <p style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: "8px" }}>Currently Offline</p>
          </div>

          {/* Available Tasks */}
          <div className="auth-card">
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1b4332", marginBottom: "12px" }}>Available Tasks</h3>
            <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>0 tasks nearby</p>
            <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>Go online to see tasks</p>
          </div>

          {/* Completed Tasks */}
          <div className="auth-card">
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1b4332", marginBottom: "12px" }}>Completed</h3>
            <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>0 tasks completed</p>
            <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>0 points earned</p>
          </div>

          {/* Rewards */}
          <div className="auth-card">
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1b4332", marginBottom: "12px" }}>Rewards</h3>
            <p style={{ fontSize: "0.9rem", color: "#6b7280" }}> 0 points</p>
            <p style={{ fontSize: "0.9rem", color: "#6b7280" }}> 0 badges</p>
          </div>

          {/* Skills */}
          <div className="auth-card">
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1b4332", marginBottom: "12px" }}>Your Skills</h3>
            <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>View your verified skills</p>
          </div>

          {/* Schedule */}
          <div className="auth-card">
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1b4332", marginBottom: "12px" }}>Schedule</h3>
            <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>View your availability</p>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: "40px", fontSize: "0.9rem", color: "#6b7280" }}>
           Volunteer Dashboard - Module 1 Skeleton
        </p>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default VolunteerDashboard;
