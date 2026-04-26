import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Footer from "../../components/Footer";
import Logo from "../../assets/images/Logo.png";

const COLORS = {
  darkGreen: "#1C382A",
  mediumGreen: "#52b788",
  darkMediumGreen: "#2d6a4f",
  veryLightGreen: "#BAE4C7",
  white: "#FFFFFF",
  darkGray: "#666666",
  dashboardBg: "#E2FFEB",
  cardBg: "#BAE4C7",
};

const ElderMyProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: COLORS.dashboardBg }}>
      {/* Header */}
      <div style={{ position: "sticky", top: 0, backgroundColor: COLORS.darkGreen, padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button onClick={() => navigate("/elder-dashboard")} style={{ background: "none", border: "none", color: COLORS.white, cursor: "pointer", fontSize: "16px", fontWeight: 600 }}>
            Back
          </button>
          <img src={Logo} alt="Logo" style={{ height: '32px', width: 'auto' }} />
          <h1 style={{ color: COLORS.white, margin: "0", fontSize: "24px", fontWeight: 700 }}>My Profile</h1>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px", maxWidth: "900px", margin: "0 auto", width: "100%" }}>
        {/* Profile Header */}
        <div style={{ backgroundColor: COLORS.cardBg, borderRadius: "12px", padding: "30px", marginBottom: "30px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <div style={{ width: "120px", height: "120px", borderRadius: "50%", backgroundColor: "#f0f0f0", margin: "0 auto 15px auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "80px" }}>
            Profile Picture
          </div>
          <h2 style={{ color: COLORS.darkGreen, margin: "0 0 10px 0", fontSize: "24px", fontWeight: 700 }}>
            {user?.fullName || "User"}
          </h2>
          <p style={{ color: COLORS.darkGray, margin: "0", fontSize: "13px" }}>
            Email: <strong>{user?.email || "N/A"}</strong>
          </p>
        </div>

        {/* Placeholder Sections */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
          {/* Section 1 */}
          <div style={{ backgroundColor: COLORS.cardBg, borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <h3 style={{ color: COLORS.darkGreen, margin: "0 0 15px 0", fontSize: "16px", fontWeight: 700 }}>Section 1</h3>
            <p style={{ color: COLORS.darkGray, margin: "0", fontSize: "14px" }}>Coming soon...</p>
          </div>

          {/* Section 2 */}
          <div style={{ backgroundColor: COLORS.cardBg, borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <h3 style={{ color: COLORS.darkGreen, margin: "0 0 15px 0", fontSize: "16px", fontWeight: 700 }}>Section 2</h3>
            <p style={{ color: COLORS.darkGray, margin: "0", fontSize: "14px" }}>Coming soon...</p>
          </div>
        </div>

        {/* Quick Links */}
        <div style={{ marginTop: "30px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "15px" }}>
          <button
            onClick={() => navigate("/elder-dashboard")}
            style={{
              padding: "15px",
              backgroundColor: COLORS.mediumGreen,
              color: COLORS.white,
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "13px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.darkMediumGreen)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.mediumGreen)}
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ElderMyProfile;
