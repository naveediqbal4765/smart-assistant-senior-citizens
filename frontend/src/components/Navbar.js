import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/images/Logo.png";

// ---- COLOR SCHEME ----
const COLORS = {
  darkGreen: "#1C382A",
  mediumGreen: "#52b788",
  darkMediumGreen: "#2d6a4f",
  darkestGreen: "#1b4332",
  lightGreen: "#74c69d",
  paleGreen: "#A9C6B2",
  veryLightGreen: "#BAE4C7",
  white: "#FFFFFF",
  lightGray: "#f5f5f5",
  mediumGray: "#f0f0f0",
  darkGray: "#666666",
  lightDarkGray: "#999999",
  red: "#e63946",
  yellow: "#FFC107",
};

const Navbar = ({ screenReaderEnabled, onScreenReaderToggle }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Listen for modal events from header
  React.useEffect(() => {
    const handleContactModal = () => setShowContactModal(true);
    const handleAboutModal = () => setShowAboutModal(true);

    window.addEventListener('openContactModal', handleContactModal);
    window.addEventListener('openAboutModal', handleAboutModal);

    return () => {
      window.removeEventListener('openContactModal', handleContactModal);
      window.removeEventListener('openAboutModal', handleAboutModal);
    };
  }, []);

  return (
    <>
      {/* ============================================================
          PROFILE DROPDOWN ONLY
          ============================================================ */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          style={{
            padding: "8px 12px",
            backgroundColor: COLORS.veryLightGreen,
            color: COLORS.darkGreen,
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "12px",
            fontFamily: "Montserrat, sans-serif",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.mediumGreen, e.target.style.color = COLORS.white)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.veryLightGreen, e.target.style.color = COLORS.darkGreen)}
        >
          👤 {user?.fullName.split(" ")[0]}
        </button>

        {/* Profile Dropdown Menu */}
        {showProfileMenu && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              backgroundColor: COLORS.white,
              border: `2px solid ${COLORS.mediumGreen}`,
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              zIndex: 1000,
              minWidth: "200px",
              marginTop: "8px",
            }}
          >
            {/* Profile Info */}
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${COLORS.veryLightGreen}` }}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: COLORS.darkGreen }}>
                {user?.fullName}
              </div>
              <div style={{ fontSize: "11px", color: COLORS.darkGray, marginTop: "4px" }}>
                {user?.email}
              </div>
              <div style={{ fontSize: "11px", color: COLORS.darkGray }}>
                Role: {user?.role === "elder" ? "Senior" : user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </div>
            </div>

            {/* Profile Options */}
            <button
              onClick={() => {
                setShowProfileMenu(false);
                window.location.href = "/elder-settings";
              }}
              style={{
                width: "100%",
                padding: "12px 16px",
                backgroundColor: "transparent",
                border: "none",
                textAlign: "left",
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
                fontSize: "13px",
                color: COLORS.darkGreen,
                transition: "all 0.3s ease",
                borderBottom: `1px solid ${COLORS.veryLightGreen}`,
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.veryLightGreen)}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
            >
              ⚙️ Settings
            </button>

            <button
              onClick={() => {
                setShowProfileMenu(false);
                window.location.href = "/elder-my-profile";
              }}
              style={{
                width: "100%",
                padding: "12px 16px",
                backgroundColor: "transparent",
                border: "none",
                textAlign: "left",
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
                fontSize: "13px",
                color: COLORS.darkGreen,
                transition: "all 0.3s ease",
                borderBottom: `1px solid ${COLORS.veryLightGreen}`,
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.veryLightGreen)}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
            >
              👤 My Profile
            </button>

            {/* Logout */}
            <button
              onClick={() => {
                setShowProfileMenu(false);
                handleLogout();
              }}
              style={{
                width: "100%",
                padding: "12px 16px",
                backgroundColor: "transparent",
                border: "none",
                textAlign: "left",
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
                fontSize: "13px",
                color: COLORS.red,
                transition: "all 0.3s ease",
                fontWeight: 600,
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#ffe0e0")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>

      {/* ============================================================
          CONTACT MODAL
          ============================================================ */}
      {showContactModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
          onClick={() => setShowContactModal(false)}
        >
          <div
            style={{
              backgroundColor: COLORS.white,
              borderRadius: "12px",
              padding: "30px",
              maxWidth: "500px",
              width: "90%",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              fontFamily: "Montserrat, sans-serif",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "24px", fontWeight: 700, color: COLORS.darkGreen, margin: "0" }}>
                📞 Contact Us
              </h2>
              <button
                onClick={() => setShowContactModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: COLORS.darkGray,
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Email */}
              <div>
                <h3 style={{ fontSize: "14px", fontWeight: 600, color: COLORS.darkGreen, margin: "0 0 8px 0" }}>
                  📧 Email
                </h3>
                <a
                  href="mailto:smartassistantforseniorcitizen@gmail.com"
                  style={{
                    fontSize: "14px",
                    color: COLORS.mediumGreen,
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  smartassistantforseniorcitizen@gmail.com
                </a>
              </div>

              {/* Phone */}
              <div>
                <h3 style={{ fontSize: "14px", fontWeight: 600, color: COLORS.darkGreen, margin: "0 0 8px 0" }}>
                  📱 Phone
                </h3>
                <a
                  href="tel:+923399934981"
                  style={{
                    fontSize: "14px",
                    color: COLORS.mediumGreen,
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  +92 (339) 993-4981
                </a>
              </div>

              {/* Support Hours */}
              <div>
                <h3 style={{ fontSize: "14px", fontWeight: 600, color: COLORS.darkGreen, margin: "0 0 8px 0" }}>
                  🕐 Support Hours
                </h3>
                <p style={{ fontSize: "14px", color: COLORS.darkGray, margin: "0" }}>
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Saturday: 10:00 AM - 4:00 PM<br />
                  Sunday: Closed
                </p>
              </div>

              {/* Address */}
              <div>
                <h3 style={{ fontSize: "14px", fontWeight: 600, color: COLORS.darkGreen, margin: "0 0 8px 0" }}>
                  📍 Address
                </h3>
                <p style={{ fontSize: "14px", color: COLORS.darkGray, margin: "0" }}>
                  SZABIST University<br />
                  Islamabad, Pakistan
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowContactModal(false)}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: COLORS.mediumGreen,
                color: COLORS.white,
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "14px",
                fontFamily: "Montserrat, sans-serif",
                marginTop: "20px",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.darkMediumGreen)}
              onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.mediumGreen)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ============================================================
          ABOUT US MODAL
          ============================================================ */}
      {showAboutModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
          onClick={() => setShowAboutModal(false)}
        >
          <div
            style={{
              backgroundColor: COLORS.white,
              borderRadius: "12px",
              padding: "30px",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              fontFamily: "Montserrat, sans-serif",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "24px", fontWeight: 700, color: COLORS.darkGreen, margin: "0" }}>
                ℹ️ About Us
              </h2>
              <button
                onClick={() => setShowAboutModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: COLORS.darkGray,
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", lineHeight: "1.6" }}>
              {/* Project Overview */}
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: COLORS.mediumGreen, margin: "0 0 8px 0" }}>
                  🎯 Project Overview
                </h3>
                <p style={{ fontSize: "14px", color: COLORS.darkGray, margin: "0" }}>
                  Smart Assistant for Senior Citizens is a comprehensive digital platform designed to empower elderly individuals by connecting them with caregivers and volunteers. Our mission is to enhance the quality of life for seniors through technology, ensuring they receive timely support, health monitoring, and community assistance.
                </p>
              </div>

              {/* Key Features */}
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: COLORS.mediumGreen, margin: "0 0 8px 0" }}>
                  ✨ Key Features
                </h3>
                <ul style={{ fontSize: "14px", color: COLORS.darkGray, margin: "0", paddingLeft: "20px" }}>
                  <li>Emergency SOS alerts with location sharing</li>
                  <li>Real-time health monitoring and vitals tracking</li>
                  <li>Medication reminders and medical history management</li>
                  <li>Caregiver coordination and assignment system</li>
                  <li>Volunteer matching for community support</li>
                  <li>Accessibility features including screen reader support</li>
                </ul>
              </div>

              {/* Our Team */}
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: COLORS.mediumGreen, margin: "0 0 8px 0" }}>
                  👥 Our Team
                </h3>
                <p style={{ fontSize: "14px", color: COLORS.darkGray, margin: "0" }}>
                  Developed by Team SZABIST (Students: 2212470, 2212498 & 2212474) at SZABIST University Islamabad. Our team is passionate about leveraging technology to improve the lives of senior citizens and create a more connected, caring community.
                </p>
              </div>

              {/* Vision */}
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: COLORS.mediumGreen, margin: "0 0 8px 0" }}>
                  🌟 Our Vision
                </h3>
                <p style={{ fontSize: "14px", color: COLORS.darkGray, margin: "0" }}>
                  To create a world where every senior citizen has access to reliable support, health monitoring, and community assistance through innovative technology. We believe that age should not be a barrier to living independently and safely.
                </p>
              </div>

              {/* Technology */}
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: COLORS.mediumGreen, margin: "0 0 8px 0" }}>
                  💻 Technology Stack
                </h3>
                <p style={{ fontSize: "14px", color: COLORS.darkGray, margin: "0" }}>
                  Built with React.js for the frontend, Node.js/Express for the backend, and MongoDB for data storage. Our platform is designed to be responsive, accessible, and secure.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowAboutModal(false)}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: COLORS.mediumGreen,
                color: COLORS.white,
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "14px",
                fontFamily: "Montserrat, sans-serif",
                marginTop: "20px",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.darkMediumGreen)}
              onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.mediumGreen)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;