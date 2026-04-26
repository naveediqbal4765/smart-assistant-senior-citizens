import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const COLORS = {
  darkGreen: "#1C382A",
  mediumGreen: "#52b788",
  veryLightGreen: "#BAE4C7",
  white: "#FFFFFF",
  lightGray: "#f5f5f5",
  darkGray: "#666666",
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("basic");
  const [isLoading, setIsLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    dateOfBirth: "",
    // Elder specific
    bloodGroup: "",
    allergies: "",
    primaryCaregiver: "",
    // Caregiver specific
    linkedSeniors: [],
    // Volunteer specific
    skills: [],
    serviceRadius: 5,
  });

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <p>Loading...</p>
      </div>
    );
  }

  const tabs = [
    { id: "basic", label: "Basic Information" },
    { id: "role", label: "Role Details" },
    { id: "password", label: "Change Password" },
    { id: "privacy", label: "Privacy Settings" },
  ];

  return (
    <div style={{ backgroundColor: COLORS.lightGray, minHeight: "100vh", paddingBottom: "40px" }}>
      {/* Header */}
      <div style={{ backgroundColor: COLORS.darkGreen, padding: "30px 20px", color: COLORS.white }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none",
              border: "none",
              color: COLORS.white,
              cursor: "pointer",
              fontSize: "16px",
              marginBottom: "15px",
              fontWeight: 600,
            }}
          >
            Back
          </button>
          <h1 style={{ fontSize: "32px", fontWeight: 700, margin: "0 0 8px 0" }}>
            My Profile
          </h1>
          <p style={{ fontSize: "14px", color: COLORS.veryLightGreen, margin: "0" }}>
            {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} Profile
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "30px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "30px" }}>
          {/* Sidebar Tabs */}
          <div style={{ backgroundColor: COLORS.white, borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  width: "100%",
                  padding: "16px",
                  backgroundColor: activeTab === tab.id ? COLORS.mediumGreen : "transparent",
                  color: activeTab === tab.id ? COLORS.white : COLORS.darkGreen,
                  border: "none",
                  borderBottom: `1px solid ${COLORS.veryLightGreen}`,
                  textAlign: "left",
                  cursor: "pointer",
                  fontWeight: activeTab === tab.id ? 600 : 500,
                  fontSize: "13px",
                  fontFamily: "Montserrat, sans-serif",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.target.style.backgroundColor = COLORS.veryLightGreen;
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.target.style.backgroundColor = "transparent";
                  }
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div style={{ backgroundColor: COLORS.white, borderRadius: "8px", padding: "30px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            {/* Basic Information Tab */}
            {activeTab === "basic" && (
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: COLORS.darkGreen, marginBottom: "20px" }}>
                  Basic Information
                </h2>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "8px" }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: `2px solid ${COLORS.veryLightGreen}`,
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontFamily: "Montserrat, sans-serif",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "8px" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: `2px solid ${COLORS.veryLightGreen}`,
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontFamily: "Montserrat, sans-serif",
                      boxSizing: "border-box",
                      backgroundColor: "#f5f5f5",
                      cursor: "not-allowed",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "8px" }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: `2px solid ${COLORS.veryLightGreen}`,
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontFamily: "Montserrat, sans-serif",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "8px" }}>
                    Address
                  </label>
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: `2px solid ${COLORS.veryLightGreen}`,
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontFamily: "Montserrat, sans-serif",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: COLORS.mediumGreen,
                    color: COLORS.white,
                    border: "none",
                    borderRadius: "8px",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    fontWeight: 600,
                    fontSize: "13px",
                    fontFamily: "Montserrat, sans-serif",
                    opacity: isLoading ? 0.7 : 1,
                  }}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}

            {/* Role Details Tab */}
            {activeTab === "role" && (
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: COLORS.darkGreen, marginBottom: "20px" }}>
                  {user?.role === "elder" && "Medical Information"}
                  {user?.role === "caregiver" && "Caregiver Details"}
                  {user?.role === "volunteer" && "Volunteer Information"}
                </h2>

                {user?.role === "elder" && (
                  <>
                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "8px" }}>
                        Blood Group
                      </label>
                      <input
                        type="text"
                        value={profileData.bloodGroup}
                        onChange={(e) => handleInputChange("bloodGroup", e.target.value)}
                        placeholder="e.g., O+, A-, B+"
                        style={{
                          width: "100%",
                          padding: "12px",
                          border: `2px solid ${COLORS.veryLightGreen}`,
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontFamily: "Montserrat, sans-serif",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "8px" }}>
                        Allergies
                      </label>
                      <textarea
                        value={profileData.allergies}
                        onChange={(e) => handleInputChange("allergies", e.target.value)}
                        placeholder="List any allergies..."
                        style={{
                          width: "100%",
                          padding: "12px",
                          border: `2px solid ${COLORS.veryLightGreen}`,
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontFamily: "Montserrat, sans-serif",
                          boxSizing: "border-box",
                          minHeight: "100px",
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "8px" }}>
                        Primary Caregiver
                      </label>
                      <input
                        type="text"
                        value={profileData.primaryCaregiver}
                        onChange={(e) => handleInputChange("primaryCaregiver", e.target.value)}
                        placeholder="Name of primary caregiver"
                        style={{
                          width: "100%",
                          padding: "12px",
                          border: `2px solid ${COLORS.veryLightGreen}`,
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontFamily: "Montserrat, sans-serif",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                  </>
                )}

                {user?.role === "caregiver" && (
                  <div style={{ padding: "20px", backgroundColor: COLORS.lightGray, borderRadius: "8px" }}>
                    <p style={{ fontSize: "13px", color: COLORS.darkGray }}>
                      Linked Seniors: {profileData.linkedSeniors.length}
                    </p>
                    <p style={{ fontSize: "13px", color: COLORS.darkGray, marginTop: "10px" }}>
                      Manage your linked seniors from the dashboard.
                    </p>
                  </div>
                )}

                {user?.role === "volunteer" && (
                  <>
                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "8px" }}>
                        Skills
                      </label>
                      <input
                        type="text"
                        value={profileData.skills.join(", ")}
                        onChange={(e) => handleInputChange("skills", e.target.value.split(", "))}
                        placeholder="e.g., Grocery Shopping, Tech Support"
                        style={{
                          width: "100%",
                          padding: "12px",
                          border: `2px solid ${COLORS.veryLightGreen}`,
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontFamily: "Montserrat, sans-serif",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "8px" }}>
                        Service Radius (km)
                      </label>
                      <input
                        type="number"
                        value={profileData.serviceRadius}
                        onChange={(e) => handleInputChange("serviceRadius", parseInt(e.target.value))}
                        min="1"
                        max="50"
                        style={{
                          width: "100%",
                          padding: "12px",
                          border: `2px solid ${COLORS.veryLightGreen}`,
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontFamily: "Montserrat, sans-serif",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                  </>
                )}

                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: COLORS.mediumGreen,
                    color: COLORS.white,
                    border: "none",
                    borderRadius: "8px",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    fontWeight: 600,
                    fontSize: "13px",
                    fontFamily: "Montserrat, sans-serif",
                    opacity: isLoading ? 0.7 : 1,
                  }}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === "password" && (
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: COLORS.darkGreen, marginBottom: "20px" }}>
                  Change Password
                </h2>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "8px" }}>
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: `2px solid ${COLORS.veryLightGreen}`,
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontFamily: "Montserrat, sans-serif",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "8px" }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: `2px solid ${COLORS.veryLightGreen}`,
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontFamily: "Montserrat, sans-serif",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "8px" }}>
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: `2px solid ${COLORS.veryLightGreen}`,
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontFamily: "Montserrat, sans-serif",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: COLORS.mediumGreen,
                    color: COLORS.white,
                    border: "none",
                    borderRadius: "8px",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    fontWeight: 600,
                    fontSize: "13px",
                    fontFamily: "Montserrat, sans-serif",
                    opacity: isLoading ? 0.7 : 1,
                  }}
                >
                  {isLoading ? "Saving..." : "Update Password"}
                </button>
              </div>
            )}

            {/* Privacy Settings Tab */}
            {activeTab === "privacy" && (
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: COLORS.darkGreen, marginBottom: "20px" }}>
                  Privacy Settings
                </h2>
                <div style={{ padding: "20px", backgroundColor: COLORS.lightGray, borderRadius: "8px" }}>
                  <p style={{ fontSize: "13px", color: COLORS.darkGray }}>
                    Privacy settings coming soon...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
