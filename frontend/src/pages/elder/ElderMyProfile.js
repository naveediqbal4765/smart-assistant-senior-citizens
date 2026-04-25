import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || "John Doe",
    email: user?.email || "john@example.com",
    phone: "+923001234567",
    dateOfBirth: "1950-05-15",
    address: "123 Main Street, Islamabad",
    nationalId: "12345-6789012-3",
    livesAlone: true,
    medicalConditions: ["Diabetes", "Hypertension"],
    emergencyContacts: [
      { name: "Sarah (Daughter)", phone: "+923001234567", relation: "Daughter" },
      { name: "John (Son)", phone: "+923009876543", relation: "Son" },
    ],
  });

  const [editData, setEditData] = useState(profileData);

  const handleScreenReaderToggle = () => {
    setScreenReaderEnabled(!screenReaderEnabled);
    if (!screenReaderEnabled) {
      const utterance = new SpeechSynthesisUtterance("Screen reader enabled");
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(profileData);
  };

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

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
      <div style={{ flex: 1, padding: "20px", maxWidth: "800px", margin: "0 auto", width: "100%" }}>
        {/* Profile Header */}
        <div style={{ backgroundColor: COLORS.cardBg, borderRadius: "12px", padding: "30px", marginBottom: "30px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <div style={{ width: "120px", height: "120px", borderRadius: "50%", backgroundColor: "transparent", margin: "0 auto 15px auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "80px", overflow: "hidden" }}>
            {user?.profileImage ? (
              <img src={user.profileImage} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              "👴"
            )}
          </div>
          <h2 style={{ color: COLORS.darkGreen, margin: "0 0 10px 0", fontSize: "24px", fontWeight: 700 }}>
            {profileData.fullName}
          </h2>
          <p style={{ color: COLORS.darkGray, margin: "0 0 15px 0", fontSize: "14px" }}>
            Role: <strong>{user?.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : "Elder"}</strong>
          </p>
          {!isEditing && (
            <button
              onClick={handleEdit}
              style={{
                padding: "10px 20px",
                backgroundColor: COLORS.mediumGreen,
                color: COLORS.white,
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "13px",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.darkMediumGreen)}
              onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.mediumGreen)}
            >
              ✏️ Edit Profile
            </button>
          )}
        </div>

        {/* Profile Information */}
        {!isEditing ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {/* Personal Information */}
            <div style={{ backgroundColor: COLORS.cardBg, borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <h3 style={{ color: COLORS.darkGreen, margin: "0 0 15px 0", fontSize: "16px", fontWeight: 700 }}>Personal Information</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <p style={{ color: COLORS.darkGray, margin: "0 0 4px 0", fontSize: "12px" }}>Full Name</p>
                  <p style={{ color: COLORS.darkGreen, margin: "0", fontSize: "14px", fontWeight: 600 }}>{profileData.fullName}</p>
                </div>
                <div>
                  <p style={{ color: COLORS.darkGray, margin: "0 0 4px 0", fontSize: "12px" }}>Email</p>
                  <p style={{ color: COLORS.darkGreen, margin: "0", fontSize: "14px", fontWeight: 600 }}>{profileData.email}</p>
                </div>
                <div>
                  <p style={{ color: COLORS.darkGray, margin: "0 0 4px 0", fontSize: "12px" }}>Phone</p>
                  <p style={{ color: COLORS.darkGreen, margin: "0", fontSize: "14px", fontWeight: 600 }}>{profileData.phone}</p>
                </div>
                <div>
                  <p style={{ color: COLORS.darkGray, margin: "0 0 4px 0", fontSize: "12px" }}>Date of Birth</p>
                  <p style={{ color: COLORS.darkGreen, margin: "0", fontSize: "14px", fontWeight: 600 }}>{profileData.dateOfBirth}</p>
                </div>
              </div>
            </div>

            {/* Contact & Medical */}
            <div style={{ backgroundColor: COLORS.cardBg, borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <h3 style={{ color: COLORS.darkGreen, margin: "0 0 15px 0", fontSize: "16px", fontWeight: 700 }}>Additional Information</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <p style={{ color: COLORS.darkGray, margin: "0 0 4px 0", fontSize: "12px" }}>Address</p>
                  <p style={{ color: COLORS.darkGreen, margin: "0", fontSize: "14px", fontWeight: 600 }}>{profileData.address}</p>
                </div>
                <div>
                  <p style={{ color: COLORS.darkGray, margin: "0 0 4px 0", fontSize: "12px" }}>National ID</p>
                  <p style={{ color: COLORS.darkGreen, margin: "0", fontSize: "14px", fontWeight: 600 }}>{profileData.nationalId}</p>
                </div>
                <div>
                  <p style={{ color: COLORS.darkGray, margin: "0 0 4px 0", fontSize: "12px" }}>Lives Alone</p>
                  <p style={{ color: COLORS.darkGreen, margin: "0", fontSize: "14px", fontWeight: 600 }}>
                    {profileData.livesAlone ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>

            {/* Medical Conditions */}
            <div style={{ backgroundColor: COLORS.cardBg, borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", gridColumn: "1 / -1" }}>
              <h3 style={{ color: COLORS.darkGreen, margin: "0 0 15px 0", fontSize: "16px", fontWeight: 700 }}>Medical Conditions</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {profileData.medicalConditions.map((condition, idx) => (
                  <span
                    key={idx}
                    style={{
                      backgroundColor: COLORS.mediumGreen,
                      color: COLORS.white,
                      padding: "8px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    {condition}
                  </span>
                ))}
              </div>
            </div>

            {/* Emergency Contacts */}
            <div style={{ backgroundColor: COLORS.cardBg, borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", gridColumn: "1 / -1" }}>
              <h3 style={{ color: COLORS.darkGreen, margin: "0 0 15px 0", fontSize: "16px", fontWeight: 700 }}>Emergency Contacts</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
                {profileData.emergencyContacts.map((contact, idx) => (
                  <div key={idx} style={{ backgroundColor: COLORS.white, padding: "12px", borderRadius: "8px" }}>
                    <p style={{ color: COLORS.darkGreen, margin: "0 0 4px 0", fontSize: "13px", fontWeight: 600 }}>
                      {contact.name}
                    </p>
                    <p style={{ color: COLORS.darkGray, margin: "0 0 4px 0", fontSize: "12px" }}>
                      {contact.relation}
                    </p>
                    <p style={{ color: COLORS.mediumGreen, margin: "0", fontSize: "12px", fontWeight: 600 }}>
                      {contact.phone}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <div style={{ backgroundColor: COLORS.cardBg, borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <h3 style={{ color: COLORS.darkGreen, margin: "0 0 20px 0", fontSize: "16px", fontWeight: 700 }}>Edit Profile</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", color: COLORS.darkGreen, fontWeight: 600, marginBottom: "6px", fontSize: "12px" }}>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={editData.fullName}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${COLORS.mediumGreen}`,
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontFamily: "Montserrat, sans-serif",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", color: COLORS.darkGreen, fontWeight: 600, marginBottom: "6px", fontSize: "12px" }}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${COLORS.mediumGreen}`,
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontFamily: "Montserrat, sans-serif",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", color: COLORS.darkGreen, fontWeight: 600, marginBottom: "6px", fontSize: "12px" }}>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={editData.phone}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${COLORS.mediumGreen}`,
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontFamily: "Montserrat, sans-serif",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", color: COLORS.darkGreen, fontWeight: 600, marginBottom: "6px", fontSize: "12px" }}>Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={editData.dateOfBirth}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${COLORS.mediumGreen}`,
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontFamily: "Montserrat, sans-serif",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", color: COLORS.darkGreen, fontWeight: 600, marginBottom: "6px", fontSize: "12px" }}>Address</label>
                <input
                  type="text"
                  name="address"
                  value={editData.address}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${COLORS.mediumGreen}`,
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontFamily: "Montserrat, sans-serif",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleSave}
                style={{
                  flex: 1,
                  padding: "12px",
                  backgroundColor: COLORS.mediumGreen,
                  color: COLORS.white,
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "13px",
                }}
              >
                ✅ Save Changes
              </button>
              <button
                onClick={handleCancel}
                style={{
                  flex: 1,
                  padding: "12px",
                  backgroundColor: COLORS.veryLightGreen,
                  color: COLORS.darkGreen,
                  border: `2px solid ${COLORS.mediumGreen}`,
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "13px",
                }}
              >
                ✕ Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ElderMyProfile;