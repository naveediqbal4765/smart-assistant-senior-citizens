import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authAPI } from "../../services/api";
import toast from "react-hot-toast";
import Logo from "../../assets/images/Logo.png";
import * as MageIcons from "mage-icons-react";

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

const RoleSelectionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Get user data from Google OAuth
  const { userId, email, fullName, profilePicture, accessToken } =
    location.state || {};

  // Redirect if no user data
  React.useEffect(() => {
    if (!userId || !email) {
      navigate("/login");
    }
  }, [userId, email, navigate]);

  const handleRoleSelection = async (role) => {
    try {
      setIsLoading(true);

      // Redirect to signup page with pre-filled data
      navigate("/signup", {
        state: {
          role,
          email,
          fullName,
          profilePicture,
          accessToken,
          userId,
          isOAuthSignup: true,
        },
      });
    } catch (error) {
      console.error("Role selection error:", error);
      toast.error(error.response?.data?.message || "Failed to set role");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: COLORS.white,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: "40px" }}>
        <img
          src={Logo}
          alt="Smart Assistant"
          style={{ height: "60px", objectFit: "contain" }}
        />
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: "32px",
          fontWeight: 700,
          color: COLORS.darkGreen,
          marginBottom: "10px",
          textAlign: "center",
        }}
      >
        Welcome, {fullName?.split(" ")[0]}!
      </h1>

      <p
        style={{
          fontSize: "16px",
          color: COLORS.darkGray,
          marginBottom: "40px",
          textAlign: "center",
          maxWidth: "500px",
        }}
      >
        Please select your role to continue with the signup process
      </p>

      {/* Role Selection Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "30px",
          maxWidth: "900px",
          width: "100%",
          marginBottom: "40px",
        }}
      >
        {/* Elder Card */}
        <button
          onClick={() => handleRoleSelection("elder")}
          disabled={isLoading}
          style={{
            padding: "40px 30px",
            backgroundColor: COLORS.veryLightGreen,
            border: `3px solid ${COLORS.mediumGreen}`,
            borderRadius: "16px",
            cursor: isLoading ? "not-allowed" : "pointer",
            transition: "all 0.3s ease",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            opacity: isLoading ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = COLORS.mediumGreen;
              e.currentTarget.style.color = COLORS.white;
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow =
                "0 8px 24px rgba(82, 183, 136, 0.3)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = COLORS.veryLightGreen;
            e.currentTarget.style.color = "inherit";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div style={{ fontSize: "48px" }}>
            {MageIcons.UserIcon ? (
              <MageIcons.UserIcon size={48} color={COLORS.darkGreen} />
            ) : (
              "👴"
            )}
          </div>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: COLORS.darkGreen,
              margin: "0",
            }}
          >
            Senior Citizen
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: COLORS.darkGray,
              margin: "0",
              textAlign: "center",
            }}
          >
            I need assistance and support
          </p>
        </button>

        {/* Volunteer Card */}
        <button
          onClick={() => handleRoleSelection("volunteer")}
          disabled={isLoading}
          style={{
            padding: "40px 30px",
            backgroundColor: COLORS.veryLightGreen,
            border: `3px solid ${COLORS.mediumGreen}`,
            borderRadius: "16px",
            cursor: isLoading ? "not-allowed" : "pointer",
            transition: "all 0.3s ease",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            opacity: isLoading ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = COLORS.mediumGreen;
              e.currentTarget.style.color = COLORS.white;
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow =
                "0 8px 24px rgba(82, 183, 136, 0.3)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = COLORS.veryLightGreen;
            e.currentTarget.style.color = "inherit";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div style={{ fontSize: "48px" }}>
            {MageIcons.UsersIcon ? (
              <MageIcons.UsersIcon size={48} color={COLORS.darkGreen} />
            ) : (
              "🤝"
            )}
          </div>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: COLORS.darkGreen,
              margin: "0",
            }}
          >
            Volunteer
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: COLORS.darkGray,
              margin: "0",
              textAlign: "center",
            }}
          >
            I want to help seniors in my community
          </p>
        </button>

        {/* Caregiver Card */}
        <button
          onClick={() => handleRoleSelection("caregiver")}
          disabled={isLoading}
          style={{
            padding: "40px 30px",
            backgroundColor: COLORS.veryLightGreen,
            border: `3px solid ${COLORS.mediumGreen}`,
            borderRadius: "16px",
            cursor: isLoading ? "not-allowed" : "pointer",
            transition: "all 0.3s ease",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            opacity: isLoading ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = COLORS.mediumGreen;
              e.currentTarget.style.color = COLORS.white;
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow =
                "0 8px 24px rgba(82, 183, 136, 0.3)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = COLORS.veryLightGreen;
            e.currentTarget.style.color = "inherit";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div style={{ fontSize: "48px" }}>
            {MageIcons.HeartIcon ? (
              <MageIcons.HeartIcon size={48} color={COLORS.red} />
            ) : (
              "💚"
            )}
          </div>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: COLORS.darkGreen,
              margin: "0",
            }}
          >
            Caregiver
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: COLORS.darkGray,
              margin: "0",
              textAlign: "center",
            }}
          >
            I care for a senior citizen
          </p>
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div
          style={{
            fontSize: "16px",
            color: COLORS.mediumGreen,
            fontWeight: 600,
          }}
        >
          Loading...
        </div>
      )}

      {/* Back to Login */}
      <button
        onClick={() => navigate("/login")}
        disabled={isLoading}
        style={{
          padding: "12px 24px",
          backgroundColor: "transparent",
          color: COLORS.mediumGreen,
          border: `2px solid ${COLORS.mediumGreen}`,
          borderRadius: "8px",
          cursor: isLoading ? "not-allowed" : "pointer",
          fontWeight: 600,
          fontSize: "14px",
          fontFamily: "Montserrat, sans-serif",
          transition: "all 0.3s ease",
          opacity: isLoading ? 0.6 : 1,
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.target.style.backgroundColor = COLORS.mediumGreen;
            e.target.style.color = COLORS.white;
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "transparent";
          e.target.style.color = COLORS.mediumGreen;
        }}
      >
        Back to Login
      </button>
    </div>
  );
};

export default RoleSelectionPage;