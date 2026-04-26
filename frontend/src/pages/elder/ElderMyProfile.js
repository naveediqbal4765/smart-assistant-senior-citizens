import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../hooks/useProfile";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import BasicInfoForm from "../../components/BasicInfoForm";
import ProfilePictureUpload from "../../components/ProfilePictureUpload";
import ToastNotification from "../../components/ToastNotification";
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
  red: "#e63946",
};

const ElderMyProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { profile, loading, error, success, updateProfile, clearMessages } = useProfile();
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState("info");

  // Show toast when success or error changes
  useEffect(() => {
    if (success) {
      setToastMessage(success);
      setToastType("success");
    } else if (error) {
      setToastMessage(error);
      setToastType("error");
    }
  }, [success, error]);

  const handleScreenReaderToggle = () => {
    setScreenReaderEnabled(!screenReaderEnabled);
    if (!screenReaderEnabled) {
      const utterance = new SpeechSynthesisUtterance("Screen reader enabled");
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleBasicInfoSubmit = async (formData) => {
    try {
      await updateProfile(formData);
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  const handleToastClose = () => {
    setToastMessage(null);
    clearMessages();
  };

  if (loading && !profile) {
    return (
      <div style={{ fontFamily: "Montserrat, sans-serif", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>⏳</div>
          <p style={{ fontSize: "16px", color: COLORS.darkGreen, fontWeight: 600 }}>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: COLORS.dashboardBg }}>
      {/* Toast Notification */}
      {toastMessage && (
        <ToastNotification
          message={toastMessage}
          type={toastType}
          duration={3000}
          onClose={handleToastClose}
        />
      )}

      {/* Header */}
      <div style={{ position: "sticky", top: 0, backgroundColor: COLORS.darkGreen, padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button onClick={() => navigate("/elder-dashboard")} style={{ background: "none", border: "none", color: COLORS.white, cursor: "pointer", fontSize: "16px", fontWeight: 600 }}>
            Back
          </button>
          <img src={Logo} alt="Logo" style={{ height: '32px', width: 'auto' }} />
          <h1 style={{ color: COLORS.white, margin: "0", fontSize: "24px", fontWeight: 700 }}>My Profile</h1>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div style={{ position: "fixed", bottom: "20px", left: "20px", zIndex: 90 }}>
            <button
              onClick={handleScreenReaderToggle}
              style={{
                backgroundColor: screenReaderEnabled ? "#52b788" : "#1C382A",
                color: "#FFFFFF",
                padding: "10px 20px",
                borderRadius: "30px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "12px",
                fontWeight: 600,
                transition: "all 0.3s ease"
              }}
            >
              <span style={{ width: "10px", height: "10px", backgroundColor: screenReaderEnabled ? "#fff" : "#ff4d4d", borderRadius: "50%", display: "inline-block" }}></span>
              {screenReaderEnabled ? "Screen Reader On" : "Screen Reader Off"}
            </button>
          </div>
          <Navbar screenReaderEnabled={screenReaderEnabled} onScreenReaderToggle={handleScreenReaderToggle} />
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px", maxWidth: "900px", margin: "0 auto", width: "100%" }}>
        {/* Profile Header */}
        <div style={{ backgroundColor: COLORS.cardBg, borderRadius: "12px", padding: "30px", marginBottom: "30px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <div style={{ width: "120px", height: "120px", borderRadius: "50%", backgroundColor: "transparent", margin: "0 auto 15px auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "80px", overflow: "hidden" }}>
            {profile?.profilePicture ? (
              <img src={profile.profilePicture} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              "👴"
            )}
          </div>
          <h2 style={{ color: COLORS.darkGreen, margin: "0 0 10px 0", fontSize: "24px", fontWeight: 700 }}>
            {profile?.fullName || user?.fullName || "User"}
          </h2>
          <p style={{ color: COLORS.darkGray, margin: "0 0 15px 0", fontSize: "14px" }}>
            Role: <strong>{user?.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : "Elder"}</strong>
          </p>
          <p style={{ color: COLORS.darkGray, margin: "0", fontSize: "13px" }}>
            Email: <strong>{profile?.email || user?.email || "N/A"}</strong>
          </p>
        </div>

        {/* Basic Information Form */}
        <BasicInfoForm
          initialData={{
            fullName: profile?.fullName || "",
            phone: profile?.phone || "",
            address: profile?.address || "",
            dateOfBirth: profile?.dateOfBirth || "",
          }}
          onSubmit={handleBasicInfoSubmit}
          loading={loading}
          error={error}
          success={success}
        />

        {/* Profile Picture Upload */}
        <div style={{ marginTop: "30px" }}>
          <ProfilePictureUpload
            currentImage={profile?.profilePicture}
            onUploadSuccess={(result) => {
              console.log("Profile picture uploaded:", result);
              // Optionally refresh profile data
            }}
            onUploadError={(error) => {
              console.error("Upload error:", error);
            }}
          />
        </div>

        {/* Additional Information */}
        {profile && (
          <div style={{ marginTop: "30px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {/* Contact Information */}
            <div style={{ backgroundColor: COLORS.cardBg, borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <h3 style={{ color: COLORS.darkGreen, margin: "0 0 15px 0", fontSize: "16px", fontWeight: 700 }}>Contact Information</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <p style={{ color: COLORS.darkGray, margin: "0 0 4px 0", fontSize: "12px" }}>Phone</p>
                  <p style={{ color: COLORS.darkGreen, margin: "0", fontSize: "14px", fontWeight: 600 }}>{profile.phone || "Not provided"}</p>
                </div>
                <div>
                  <p style={{ color: COLORS.darkGray, margin: "0 0 4px 0", fontSize: "12px" }}>Address</p>
                  <p style={{ color: COLORS.darkGreen, margin: "0", fontSize: "14px", fontWeight: 600 }}>{profile.address || "Not provided"}</p>
                </div>
                <div>
                  <p style={{ color: COLORS.darkGray, margin: "0 0 4px 0", fontSize: "12px" }}>Date of Birth</p>
                  <p style={{ color: COLORS.darkGreen, margin: "0", fontSize: "14px", fontWeight: 600 }}>{profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : "Not provided"}</p>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div style={{ backgroundColor: COLORS.cardBg, borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <h3 style={{ color: COLORS.darkGreen, margin: "0 0 15px 0", fontSize: "16px", fontWeight: 700 }}>Account Information</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <p style={{ color: COLORS.darkGray, margin: "0 0 4px 0", fontSize: "12px" }}>Email</p>
                  <p style={{ color: COLORS.darkGreen, margin: "0", fontSize: "14px", fontWeight: 600 }}>{profile.email}</p>
                </div>
                <div>
                  <p style={{ color: COLORS.darkGray, margin: "0 0 4px 0", fontSize: "12px" }}>Role</p>
                  <p style={{ color: COLORS.darkGreen, margin: "0", fontSize: "14px", fontWeight: 600 }}>{profile.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : "N/A"}</p>
                </div>
                <div>
                  <p style={{ color: COLORS.darkGray, margin: "0 0 4px 0", fontSize: "12px" }}>Member Since</p>
                  <p style={{ color: COLORS.darkGreen, margin: "0", fontSize: "14px", fontWeight: 600 }}>{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div style={{ marginTop: "30px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "15px" }}>
          <button
            onClick={() => navigate("/elder-settings")}
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
            ⚙️ Settings
          </button>
          <button
            onClick={() => navigate("/elder-password-change")}
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
            🔐 Change Password
          </button>
          <button
            onClick={() => navigate("/elder-dashboard")}
            style={{
              padding: "15px",
              backgroundColor: COLORS.veryLightGreen,
              color: COLORS.darkGreen,
              border: `2px solid ${COLORS.mediumGreen}`,
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "13px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.mediumGreen, e.target.style.color = COLORS.white)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.veryLightGreen, e.target.style.color = COLORS.darkGreen)}
          >
            🏠 Back to Dashboard
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ElderMyProfile;
