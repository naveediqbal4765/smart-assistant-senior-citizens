import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import BasicInfo from "../../components/profile/BasicInfo";
import ProfilePicture from "../../components/profile/ProfilePicture";
import RoleSpecificDetails from "../../components/profile/RoleSpecificDetails";
import PasswordSection from "../../components/profile/PasswordSection";
import EmergencyContacts from "../../components/profile/EmergencyContacts";
import ActivityLogs from "../../components/profile/ActivityLogs";
import DocumentVault from "../../components/profile/DocumentVault";
import PrivacyControls from "../../components/profile/PrivacyControls";
import DeleteAccount from "../../components/profile/DeleteAccount";
import SaveButton from "../../components/profile/SaveButton";
import "./ProfilePage.css";

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

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("basic");
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    dateOfBirth: "",
    profilePicture: user?.profilePicture || null,
    // Role-specific fields
    bloodGroup: "",
    allergies: "",
    primaryCaregiver: "",
    linkedSeniors: [],
    skills: [],
    availabilityDays: [],
    availabilityTimeSlots: [],
    // Privacy
    privacySettings: {
      profileVisibility: "private",
      healthDataSharing: false,
      locationSharing: false,
    },
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle profile data changes
  const handleProfileChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  // Handle nested object changes (for role-specific data)
  const handleNestedChange = (parent, field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  // Save profile changes
  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      // TODO: Call API to save profile
      // const response = await profileService.updateProfile(profileData);
      toast.success("Profile updated successfully!");
      setHasChanges(false);
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div style={{ backgroundColor: COLORS.lightGray, minHeight: "100vh", paddingBottom: "40px" }}>
      {/* ============================================================
          HEADER
          ============================================================ */}
      <div style={{ backgroundColor: COLORS.darkGreen, padding: "30px 20px", color: COLORS.white }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none",
              border: "none",
              color: COLORS.white,
              cursor: "pointer",
              fontSize: "18px",
              marginBottom: "15px",
              fontWeight: 600,
            }}
          >
            ← Back
          </button>
          <h1 style={{ fontSize: "32px", fontWeight: 700, margin: "0 0 8px 0" }}>
            My Profile
          </h1>
          <p style={{ fontSize: "14px", color: COLORS.veryLightGreen, margin: "0" }}>
            Manage your account settings and personal information
          </p>
        </div>
      </div>

      {/* ============================================================
          MAIN CONTENT
          ============================================================ */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "30px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: "30px" }}>
          {/* ============================================================
              SIDEBAR - TAB NAVIGATION
              ============================================================ */}
          <div>
            <div
              style={{
                backgroundColor: COLORS.white,
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              {[
                { id: "basic", label: "Basic Information", icon: "👤" },
                { id: "picture", label: "Profile Picture", icon: "📷" },
                { id: "role", label: "Role Details", icon: "🎯" },
                { id: "password", label: "Password", icon: "🔐" },
                { id: "emergency", label: "Emergency Contacts", icon: "🚨" },
                { id: "activity", label: "Activity Logs", icon: "📊" },
                { id: "documents", label: "Document Vault", icon: "📁" },
                { id: "privacy", label: "Privacy Controls", icon: "🔒" },
                { id: "delete", label: "Delete Account", icon: "⚠️" },
              ].map((tab) => (
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
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
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
                  <span style={{ fontSize: "16px" }}>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* ============================================================
              MAIN CONTENT AREA
              ============================================================ */}
          <div>
            <div
              style={{
                backgroundColor: COLORS.white,
                borderRadius: "12px",
                padding: "30px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              {/* Basic Information Tab */}
              {activeTab === "basic" && (
                <BasicInfo
                  profileData={profileData}
                  onProfileChange={handleProfileChange}
                />
              )}

              {/* Profile Picture Tab */}
              {activeTab === "picture" && (
                <ProfilePicture
                  profileData={profileData}
                  onProfileChange={handleProfileChange}
                />
              )}

              {/* Role-Specific Details Tab */}
              {activeTab === "role" && (
                <RoleSpecificDetails
                  role={user?.role}
                  profileData={profileData}
                  onProfileChange={handleProfileChange}
                  onNestedChange={handleNestedChange}
                />
              )}

              {/* Password Tab */}
              {activeTab === "password" && (
                <PasswordSection
                  onPasswordChange={handleProfileChange}
                />
              )}

              {/* Emergency Contacts Tab */}
              {activeTab === "emergency" && (
                <EmergencyContacts
                  profileData={profileData}
                  onProfileChange={handleProfileChange}
                />
              )}

              {/* Activity Logs Tab */}
              {activeTab === "activity" && (
                <ActivityLogs />
              )}

              {/* Document Vault Tab */}
              {activeTab === "documents" && (
                <DocumentVault
                  profileData={profileData}
                  onProfileChange={handleProfileChange}
                />
              )}

              {/* Privacy Controls Tab */}
              {activeTab === "privacy" && (
                <PrivacyControls
                  profileData={profileData}
                  onNestedChange={handleNestedChange}
                />
              )}

              {/* Delete Account Tab */}
              {activeTab === "delete" && (
                <DeleteAccount />
              )}

              {/* Save Button - Show only when there are changes */}
              {hasChanges && activeTab !== "activity" && activeTab !== "delete" && (
                <SaveButton
                  isLoading={isLoading}
                  onSave={handleSaveChanges}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
