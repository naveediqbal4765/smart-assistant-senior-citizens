import React, { useState, useRef } from "react";
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
  red: "#e63946",
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState("");

  const [profileData, setProfileData] = useState({
    // Basic Info
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    dateOfBirth: "",
    profilePicture: user?.profilePicture || null,
    // Elder specific
    bloodGroup: "",
    allergies: "",
    primaryCaregiver: "",
    // Caregiver specific
    linkedSeniors: [],
    relationshipToElder: "",
    // Volunteer specific
    skills: [],
    serviceRadius: 5,
    affiliation: "",
    // Password
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    // Privacy
    privacySettings: {
      profileVisibility: "private",
      healthDataSharing: false,
      locationSharing: false,
      emailNotifications: true,
      smsNotifications: true,
    },
  });

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

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

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => ({
          ...prev,
          profilePicture: reader.result,
        }));
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerifyPassword = async () => {
    if (!currentPasswordInput) {
      toast.error("Please enter your current password");
      return;
    }
    // TODO: Call API to verify password
    // For now, just set verified
    setPasswordVerified(true);
    toast.success("Password verified");
  };

  const handleSaveChanges = async () => {
    // Validate password change if in password tab
    if (activeTab === "password") {
      if (!passwordVerified) {
        toast.error("Please verify your current password first");
        return;
      }
      if (!profileData.newPassword || !profileData.confirmPassword) {
        toast.error("Please enter new password and confirm it");
        return;
      }
      if (profileData.newPassword !== profileData.confirmPassword) {
        toast.error("New passwords do not match");
        return;
      }
      if (profileData.newPassword.length < 8) {
        toast.error("Password must be at least 8 characters");
        return;
      }
    }

    setIsLoading(true);
    try {
      // TODO: Call API to save profile changes
      // const response = await profileAPI.updateProfile(profileData);
      toast.success("Profile updated successfully!");
      setHasChanges(false);
      setPasswordVerified(false);
      setCurrentPasswordInput("");
      setProfileData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
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
    { id: "basic", label: "Personal Information" },
    { id: "picture", label: "Profile Picture" },
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
          <div style={{ backgroundColor: COLORS.white, borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", height: "fit-content" }}>
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
            {/* Personal Information Tab */}
            {activeTab === "basic" && (
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: COLORS.darkGreen, marginBottom: "20px" }}>
                  Personal Information
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
                  <p style={{ fontSize: "11px", color: COLORS.darkGray, marginTop: "5px" }}>Email cannot be changed</p>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "8px" }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter your phone number"
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
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
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
                  <textarea
                    value={profileData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Enter your address"
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: `2px solid ${COLORS.veryLightGreen}`,
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontFamily: "Montserrat, sans-serif",
                      boxSizing: "border-box",
                      minHeight: "80px",
                      resize: "vertical",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Profile Picture Tab */}
            {activeTab === "picture" && (
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: COLORS.darkGreen, marginBottom: "20px" }}>
                  Profile Picture
                </h2>

                <div style={{ marginBottom: "20px", textAlign: "center" }}>
                  <div
                    style={{
                      width: "150px",
                      height: "150px",
                      borderRadius: "50%",
                      backgroundColor: COLORS.lightGray,
                      margin: "0 auto 20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      border: `3px solid ${COLORS.mediumGreen}`,
                    }}
                  >
                    {profileData.profilePicture ? (
                      <img
                        src={profileData.profilePicture}
                        alt="Profile"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <span style={{ fontSize: "50px" }}>👤</span>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    style={{ display: "none" }}
                  />

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      padding: "12px 24px",
                      backgroundColor: COLORS.mediumGreen,
                      color: COLORS.white,
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "13px",
                      fontFamily: "Montserrat, sans-serif",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#2d6a4f")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.mediumGreen)}
                  >
                    Upload New Picture
                  </button>

                  <p style={{ fontSize: "12px", color: COLORS.darkGray, marginTop: "15px" }}>
                    Recommended: Square image, at least 400x400px
                  </p>
                </div>
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
                  <>
                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "8px" }}>
                        Relationship to Elder
                      </label>
                      <input
                        type="text"
                        value={profileData.relationshipToElder}
                        onChange={(e) => handleInputChange("relationshipToElder", e.target.value)}
                        placeholder="e.g., Son, Daughter, Nurse"
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

                    <div style={{ padding: "20px", backgroundColor: COLORS.lightGray, borderRadius: "8px" }}>
                      <p style={{ fontSize: "13px", color: COLORS.darkGray, margin: "0" }}>
                        Linked Seniors: {profileData.linkedSeniors.length}
                      </p>
                      <p style={{ fontSize: "13px", color: COLORS.darkGray, marginTop: "10px" }}>
                        Manage your linked seniors from the dashboard.
                      </p>
                    </div>
                  </>
                )}

                {user?.role === "volunteer" && (
                  <>
                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "8px" }}>
                        NGO Affiliation
                      </label>
                      <input
                        type="text"
                        value={profileData.affiliation}
                        onChange={(e) => handleInputChange("affiliation", e.target.value)}
                        placeholder="e.g., Edhi, Al-Khidmat"
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
              </div>
            )}

            {/* Change Password Tab */}
            {activeTab === "password" && (
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: COLORS.darkGreen, marginBottom: "20px" }}>
                  Change Password
                </h2>

                {!passwordVerified ? (
                  <>
                    <div style={{ marginBottom: "20px", padding: "15px", backgroundColor: COLORS.lightGray, borderRadius: "8px" }}>
                      <p style={{ fontSize: "13px", color: COLORS.darkGray, margin: "0 0 15px 0" }}>
                        For security, please verify your current password first.
                      </p>
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "8px" }}>
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={currentPasswordInput}
                        onChange={(e) => setCurrentPasswordInput(e.target.value)}
                        placeholder="Enter your current password"
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
                      onClick={handleVerifyPassword}
                      style={{
                        padding: "12px 24px",
                        backgroundColor: COLORS.mediumGreen,
                        color: COLORS.white,
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "13px",
                        fontFamily: "Montserrat, sans-serif",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = "#2d6a4f")}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.mediumGreen)}
                    >
                      Verify Password
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#d4edda", borderRadius: "8px", border: `2px solid #28a745` }}>
                      <p style={{ fontSize: "13px", color: "#155724", margin: "0" }}>
                        Password verified successfully. You can now change your password.
                      </p>
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "8px" }}>
                        New Password
                      </label>
                      <input
                        type="password"
                        value={profileData.newPassword}
                        onChange={(e) => handleInputChange("newPassword", e.target.value)}
                        placeholder="Enter new password (min 8 characters)"
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
                        value={profileData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
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
                      onClick={() => {
                        setPasswordVerified(false);
                        setCurrentPasswordInput("");
                      }}
                      style={{
                        padding: "12px 24px",
                        backgroundColor: COLORS.darkGray,
                        color: COLORS.white,
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "13px",
                        fontFamily: "Montserrat, sans-serif",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = "#555")}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.darkGray)}
                    >
                      Change Password
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Privacy Settings Tab */}
            {activeTab === "privacy" && (
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: COLORS.darkGreen, marginBottom: "20px" }}>
                  Privacy Settings
                </h2>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", marginBottom: "15px" }}>
                    <input
                      type="checkbox"
                      checked={profileData.privacySettings.profileVisibility === "public"}
                      onChange={(e) => handleNestedChange("privacySettings", "profileVisibility", e.target.checked ? "public" : "private")}
                      style={{
                        width: "18px",
                        height: "18px",
                        cursor: "pointer",
                      }}
                    />
                    <span style={{ fontSize: "13px", color: COLORS.darkGreen, fontWeight: 500 }}>
                      Make my profile visible to other users
                    </span>
                  </label>

                  <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", marginBottom: "15px" }}>
                    <input
                      type="checkbox"
                      checked={profileData.privacySettings.healthDataSharing}
                      onChange={(e) => handleNestedChange("privacySettings", "healthDataSharing", e.target.checked)}
                      style={{
                        width: "18px",
                        height: "18px",
                        cursor: "pointer",
                      }}
                    />
                    <span style={{ fontSize: "13px", color: COLORS.darkGreen, fontWeight: 500 }}>
                      Allow sharing of health data with caregivers
                    </span>
                  </label>

                  <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", marginBottom: "15px" }}>
                    <input
                      type="checkbox"
                      checked={profileData.privacySettings.locationSharing}
                      onChange={(e) => handleNestedChange("privacySettings", "locationSharing", e.target.checked)}
                      style={{
                        width: "18px",
                        height: "18px",
                        cursor: "pointer",
                      }}
                    />
                    <span style={{ fontSize: "13px", color: COLORS.darkGreen, fontWeight: 500 }}>
                      Allow location sharing
                    </span>
                  </label>

                  <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", marginBottom: "15px" }}>
                    <input
                      type="checkbox"
                      checked={profileData.privacySettings.emailNotifications}
                      onChange={(e) => handleNestedChange("privacySettings", "emailNotifications", e.target.checked)}
                      style={{
                        width: "18px",
                        height: "18px",
                        cursor: "pointer",
                      }}
                    />
                    <span style={{ fontSize: "13px", color: COLORS.darkGreen, fontWeight: 500 }}>
                      Receive email notifications
                    </span>
                  </label>

                  <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", marginBottom: "15px" }}>
                    <input
                      type="checkbox"
                      checked={profileData.privacySettings.smsNotifications}
                      onChange={(e) => handleNestedChange("privacySettings", "smsNotifications", e.target.checked)}
                      style={{
                        width: "18px",
                        height: "18px",
                        cursor: "pointer",
                      }}
                    />
                    <span style={{ fontSize: "13px", color: COLORS.darkGreen, fontWeight: 500 }}>
                      Receive SMS notifications
                    </span>
                  </label>
                </div>

                <div style={{ padding: "15px", backgroundColor: COLORS.lightGray, borderRadius: "8px" }}>
                  <p style={{ fontSize: "12px", color: COLORS.darkGray, margin: "0" }}>
                    Your privacy is important to us. These settings control how your information is shared and how you receive notifications.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Changes Button - Outside all sections */}
        {hasChanges && (
          <div style={{ marginTop: "30px", textAlign: "right" }}>
            <button
              onClick={handleSaveChanges}
              disabled={isLoading}
              style={{
                padding: "14px 32px",
                backgroundColor: COLORS.mediumGreen,
                color: COLORS.white,
                border: "none",
                borderRadius: "8px",
                cursor: isLoading ? "not-allowed" : "pointer",
                fontWeight: 600,
                fontSize: "14px",
                fontFamily: "Montserrat, sans-serif",
                opacity: isLoading ? 0.7 : 1,
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                if (!isLoading) e.target.style.backgroundColor = "#2d6a4f";
              }}
              onMouseLeave={(e) => {
                if (!isLoading) e.target.style.backgroundColor = COLORS.mediumGreen;
              }}
            >
              {isLoading ? "Saving..." : "Save All Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
