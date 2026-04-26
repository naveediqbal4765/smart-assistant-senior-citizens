import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/Logo.png";

// ---- SVG Logo: Green cross with red heart ----


const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: "#1C382A",
          padding: "clamp(12px, 2vw, 20px) clamp(16px, 4vw, 40px)",
          display: "flex",
          alignItems: "center",
          gap: "clamp(8px, 2vw, 16px)",
          zIndex: 10,
          flexWrap: "wrap",
          justifyContent: "flex-start",
        }}
      >
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

      {/* Main Content */}
      <div className="page-bg flex items-center justify-center min-h-screen p-4" style={{ flex: 1 }}>
        <div className="auth-card w-full max-w-sm text-center">
        <h1 style={{ fontSize: "4rem", fontWeight: 800, color: "#e63946", marginBottom: "16px" }}>
          404
        </h1>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1b4332", marginBottom: "12px" }}>
          Page Not Found
        </h2>
        <p style={{ fontSize: "0.95rem", color: "#6b7280", marginBottom: "24px" }}>
          Sorry, the page you're looking for doesn't exist.
        </p>
        <button onClick={() => navigate("/")} className="btn-primary">
          Go Home
        </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
