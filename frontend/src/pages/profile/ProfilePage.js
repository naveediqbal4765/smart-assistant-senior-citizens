import React, { useState, useRef, useEffect } from "react";
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
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  const [profileData, setProfileData] = useState({
    // Basic Info
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    dateOfBirth: "",
    profilePicture: user?.profilePicture || null,
    
    // Elder specific
    livesAlone: null,
    hasMedicalIssues: null,
    medicalConditions: [],
    locationPermission: false,
    emergencyContacts: [],
    elderContactNumbers: ["", "", ""],
    
    // Caregiver specific
    relationshipToElder: "",
    linkedElderEmail: "",
    notificationsEnabled: false,
    caregiverLocationSharing: false,
    
    // Volunteer specific
    affiliation: "",
    skills: [],
    availabilityDays: [],
    serviceRadius: 5,
    volunteerLocationSharing: false,
    
    // Password
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    
    // Privacy
    privacySettings: {
      emailNotifications: true,
      smsNotifications: true,
    },
  });

  const medicalConditionsList = [
    "Diabetes",
    "Hypertension",
    "Heart Disease",
    "Asthma",
    "Arthritis",
    "Alzheimer's",
    "Parkinson's",
    "Cancer",
    "Kidney Disease",
    "Liver Disease",
  ];

  const skillsList = [
    "Grocery Shopping",
    "Tech Support",
    "Cooking",
    "Cleaning",
    "Transportation",
    "Companionship",
    "Medical Assistance",
    "Pet Care",
  ];

  const availabilityDaysList = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Load user profile data on mount
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        // TODO: Call API to fetch user profile data
        // const response = await profileAPI.getProfile();
        // setProfileData(response.data);
        
        // For now, set default values from user context
        setProfileData((prev) => ({
          ...prev,
          fullName: user?.fullName || "",
          email: user?.email || "",
          profilePicture: user?.profilePicture || null,
        }));
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    if (user) {
      loadProfileData();
    }
  }, [user]);

  // Google Maps Autocomplete for address
  const handleAddressChange = async (value) => {
    setProfileData((prev) => ({
      ...prev,
      address: value,
    }));
    setHasChanges(true);

    if (value.length > 2) {
      try {
        // Using Google Maps Geocoding API for suggestions
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
            value
          )}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&components=country:pk`
        );
        const data = await response.json();
        
        if (data.predictions) {
          setLocationSuggestions(
            data.predictions.map((prediction) => ({
              placeId: prediction.place_id,
              description: prediction.description,
              mainText: prediction.structured_formatting.main_text,
            }))
          );
          setShowLocationSuggestions(true);
        }
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
      }
    } else {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
    }
  };

  const handleSelectLocation = (location) => {
    setProfileData((prev) => ({
      ...prev,
      address: location.description,
    }));
    setShowLocationSuggestions(false);
    setLocationSuggestions([]);
    setHasChanges(true);
  };

  const handleInputChange = (field, value) => {
    // Validate phone number - exactly 11 digits
    if (field === "phone") {
      const phoneValue = value.replace(/\D/g, "");
      if (phoneValue.length > 11) return;
      setProfileData((prev) => ({
        ...prev,
        [field]: phoneValue,
      }));
    } else {
      setProfileData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
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

  const handleArrayChange = (field, value) => {
    setProfileData((prev) => {
      const currentArray = prev[field] || [];
      if (currentArray.includes(value)) {
        return {
          ...prev,
          [field]: currentArray.filter((item) => item !== value),
        };
      } else {
        return {
          ...prev,
          [field]: [...currentArray, value],
        };
      }
    });
    setHasChanges(true);
  };

  const handleContactNumberChange = (index, value) => {
    const phoneValue = value.replace(/\D/g, "");
    if (phoneValue.length > 11) return;
    
    setProfileData((prev) => {
      const newNumbers = [...(prev.elderContactNumbers || [])];
      newNumbers[index] = phoneValue;
      return {
        ...prev,
        elderContactNumbers: newNumbers,
      };
    });
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
    setPasswordVerified(true);
  };

  const handleDeleteAccount = async () => {
    if (!deleteConfirmPassword) {
      toast.error("Please enter your password to confirm deletion");
      return;
    }
    
    setIsLoading(true);
    try {
      // TODO: Call API to delete account
      // const response = await profileAPI.deleteAccount(deleteConfirmPassword);
      toast.success("Account deleted successfully");
      logout();
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Failed to delete account");
    } finally {
      setIsLoading(false);
    }
  };

  const validateElderContactNumbers = () => {
    const filledNumbers = profileData.elderContactNumbers.filter((num) => num.trim() !== "");
    if (filledNumbers.length < 3) {
      return { valid: false, message: "Please enter at least 3 contact numbers" };
    }
    
    // Validate each number is exactly 11 digits
    for (let number of filledNumbers) {
      if (number.length !== 11) {
        return { valid: false, message: "Each contact number must be exactly 11 digits" };
      }
    }
    
    return { valid: true, message: "" };
  };

  const handleSaveChanges = async () => {
    // Validate phone number
    if (profileData.phone && profileData.phone.length !== 11) {
      toast.error("Phone number must be exactly 11 digits");
      return;
    }

    // Validate Elder contact numbers if applicable
    if (user?.role === "elder" && profileData.livesAlone === false) {
      if (!validateElderContactNumbers()) {
        return;
      }
    }

    setIsLoading(true);
    try {
      // TODO: Call API to save profile changes
      // const response = await profileAPI.updateProfile(profileData);
      toast.success("Profile updated successfully!");
      setHasChanges(false);
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      logout();
      navigate("/login");
    } catch (error) {
      toast.error("Failed to logout");
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
    { id: "role", label: "Role Details" },
    { id: "privacy", label: "Privacy & Security" },
  ];

  const canSaveRoleDetails = () => {
    if (user?.role === "elder" && profileData.livesAlone === false) {
      return validateElderContactNumbers();
    }
    return true;
  };

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
            {user?.fullName}
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

                {/* Profile Picture */}
                <div style={{ marginBottom: "30px", textAlign: "center", paddingBottom: "30px", borderBottom: `2px solid ${COLORS.veryLightGreen}` }}>
                  <h3 style={{ fontSize: "14px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "15px" }}>
                    Profile Picture
                  </h3>
                  <div
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                      backgroundColor: COLORS.lightGray,
                      margin: "0 auto 15px",
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
                      <span style={{ fontSize: "40px" }}>👤</span>
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
                      padding: "10px 20px",
                      backgroundColor: COLORS.mediumGreen,
                      color: COLORS.white,
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "12px",
                      fontFamily: "Montserrat, sans-serif",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#2d6a4f")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.mediumGreen)}
                  >
                    Upload Picture
                  </button>
                </div>

                {/* Personal Info Fields */}
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
                    Phone (11 digits)
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter your 11-digit phone number"
                    maxLength="11"
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
                  {profileData.phone && profileData.phone.length !== 11 && (
                    <p style={{ fontSize: "11px", color: COLORS.red, marginTop: "5px" }}>Phone number must be exactly 11 digits</p>
                  )}
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

                <div style={{ marginBottom: "20px", position: "relative" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "8px" }}>
                    Address (with Google Maps suggestions)
                  </label>
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={(e) => handleAddressChange(e.target.value)}
                    placeholder="Start typing your address..."
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
                  
                  {/* Location Suggestions Dropdown */}
                  {showLocationSuggestions && locationSuggestions.length > 0 && (
                    <div style={{
                      position: "absolute",
                      top: "100%",
                      left: "0",
                      right: "0",
                      backgroundColor: COLORS.white,
                      border: `2px solid ${COLORS.mediumGreen}`,
                      borderTop: "none",
                      borderRadius: "0 0 8px 8px",
                      maxHeight: "200px",
                      overflowY: "auto",
                      zIndex: 1000,
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    }}>
                      {locationSuggestions.map((location, index) => (
                        <div
                          key={index}
                          onClick={() => handleSelectLocation(location)}
                          style={{
                            padding: "12px",
                            borderBottom: `1px solid ${COLORS.veryLightGreen}`,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            backgroundColor: "transparent",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = COLORS.lightGray)}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                          <p style={{ fontSize: "13px", fontWeight: 600, color: COLORS.darkGreen, margin: "0 0 4px 0" }}>
                            {location.mainText}
                          </p>
                          <p style={{ fontSize: "11px", color: COLORS.darkGray, margin: "0" }}>
                            {location.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Save Button for Personal Info */}
                {hasChanges && (
                  <button
                    onClick={handleSaveChanges}
                    disabled={isLoading || (profileData.phone && profileData.phone.length !== 11)}
                    style={{
                      padding: "12px 24px",
                      backgroundColor: COLORS.mediumGreen,
                      color: COLORS.white,
                      border: "none",
                      borderRadius: "8px",
                      cursor: isLoading || (profileData.phone && profileData.phone.length !== 11) ? "not-allowed" : "pointer",
                      fontWeight: 600,
                      fontSize: "13px",
                      fontFamily: "Montserrat, sans-serif",
                      opacity: isLoading || (profileData.phone && profileData.phone.length !== 11) ? 0.7 : 1,
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading && (!profileData.phone || profileData.phone.length === 11)) e.target.style.backgroundColor = "#2d6a4f";
                    }}
                    onMouseLeave={(e) => {
                      if (!isLoading && (!profileData.phone || profileData.phone.length === 11)) e.target.style.backgroundColor = COLORS.mediumGreen;
                    }}
                  >
                    {isLoading ? "Saving..." : "Save Personal Info"}
                  </button>
                )}
              </div>
            )}

            {/* Role Details Tab */}
            {activeTab === "role" && (
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: COLORS.darkGreen, marginBottom: "20px" }}>
                  {user?.role === "elder" && "Medical & Living Information"}
                  {user?.role === "caregiver" && "Caregiver Information"}
                  {user?.role === "volunteer" && "Volunteer Information"}
                </h2>

                {/* Elder Role Details */}
                {user?.role === "elder" && (
                  <>
                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "8px" }}>
                        Do you live alone?
                      </label>
                      <div style={{ display: "flex", gap: "15px" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                          <input
                            type="radio"
                            name="livesAlone"
                            checked={profileData.livesAlone === true}
                            onChange={() => handleInputChange("livesAlone", true)}
                          />
                          <span style={{ fontSize: "13px", color: COLORS.darkGreen }}>Yes</span>
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                          <input
                            type="radio"
                            name="livesAlone"
                            checked={profileData.livesAlone === false}
                            onChange={() => handleInputChange("livesAlone", false)}
                          />
                          <span style={{ fontSize: "13px", color: COLORS.darkGreen }}>No</span>
                        </label>
                      </div>
                    </div>

                    {profileData.livesAlone === false && (
                      <div style={{ marginBottom: "20px", padding: "15px", backgroundColor: COLORS.lightGray, borderRadius: "8px" }}>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "12px" }}>
                          Contact Numbers (Required: 3 numbers, 11 digits each)
                        </label>
                        {(profileData.elderContactNumbers || []).map((number, index) => (
                          <div key={index} style={{ marginBottom: "10px" }}>
                            <input
                              type="tel"
                              value={number}
                              onChange={(e) => handleContactNumberChange(index, e.target.value)}
                              placeholder={`Contact ${index + 1}: 11-digit phone number`}
                              maxLength="11"
                              style={{
                                width: "100%",
                                padding: "10px",
                                border: `2px solid ${number && number.length !== 11 ? COLORS.red : COLORS.veryLightGreen}`,
                                borderRadius: "6px",
                                fontSize: "12px",
                                fontFamily: "Montserrat, sans-serif",
                                boxSizing: "border-box",
                              }}
                            />
                            {number && number.length !== 11 && (
                              <p style={{ fontSize: "10px", color: COLORS.red, marginTop: "3px" }}>Must be exactly 11 digits</p>
                            )}
                          </div>
                        ))}
                        <p style={{ fontSize: "11px", color: COLORS.darkGray, marginTop: "10px", fontStyle: "italic" }}>
                          ⚠️ You must enter all 3 contact numbers to save changes
                        </p>
                      </div>
                    )}

                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "8px" }}>
                        Do you have any medical issues?
                      </label>
                      <div style={{ display: "flex", gap: "15px" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                          <input
                            type="radio"
                            name="hasMedicalIssues"
                            checked={profileData.hasMedicalIssues === true}
                            onChange={() => handleInputChange("hasMedicalIssues", true)}
                          />
                          <span style={{ fontSize: "13px", color: COLORS.darkGreen }}>Yes</span>
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                          <input
                            type="radio"
                            name="hasMedicalIssues"
                            checked={profileData.hasMedicalIssues === false}
                            onChange={() => handleInputChange("hasMedicalIssues", false)}
                          />
                          <span style={{ fontSize: "13px", color: COLORS.darkGreen }}>No</span>
                        </label>
                      </div>
                    </div>

                    {profileData.hasMedicalIssues && (
                      <div style={{ marginBottom: "20px", padding: "15px", backgroundColor: COLORS.lightGray, borderRadius: "8px" }}>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "12px" }}>
                          Select your medical conditions:
                        </label>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
                          {medicalConditionsList.map((condition) => (
                            <label key={condition} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                              <input
                                type="checkbox"
                                checked={profileData.medicalConditions.includes(condition)}
                                onChange={() => handleArrayChange("medicalConditions", condition)}
                              />
                              <span style={{ fontSize: "12px", color: COLORS.darkGreen }}>{condition}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={profileData.locationPermission}
                          onChange={(e) => handleInputChange("locationPermission", e.target.checked)}
                        />
                        <span style={{ fontSize: "13px", color: COLORS.darkGreen, fontWeight: 500 }}>
                          Allow location sharing for SOS calls
                        </span>
                      </label>
                    </div>
                  </>
                )}

                {/* Caregiver Role Details */}
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

                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "8px" }}>
                        Linked Elder Email
                      </label>
                      <input
                        type="email"
                        value={profileData.linkedElderEmail}
                        onChange={(e) => handleInputChange("linkedElderEmail", e.target.value)}
                        placeholder="Enter elder's email"
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
                      <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={profileData.notificationsEnabled}
                          onChange={(e) => handleInputChange("notificationsEnabled", e.target.checked)}
                        />
                        <span style={{ fontSize: "13px", color: COLORS.darkGreen, fontWeight: 500 }}>
                          Enable notifications
                        </span>
                      </label>
                    </div>
                  </>
                )}

                {/* Volunteer Role Details */}
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
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "12px" }}>
                        Skills
                      </label>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
                        {skillsList.map((skill) => (
                          <label key={skill} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                            <input
                              type="checkbox"
                              checked={profileData.skills.includes(skill)}
                              onChange={() => handleArrayChange("skills", skill)}
                            />
                            <span style={{ fontSize: "12px", color: COLORS.darkGreen }}>{skill}</span>
                          </label>
                        ))}
                      </div>
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

                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "12px" }}>
                        Available Days
                      </label>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
                        {availabilityDaysList.map((day) => (
                          <label key={day} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                            <input
                              type="checkbox"
                              checked={profileData.availabilityDays.includes(day)}
                              onChange={() => handleArrayChange("availabilityDays", day)}
                            />
                            <span style={{ fontSize: "12px", color: COLORS.darkGreen }}>{day}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={profileData.volunteerLocationSharing}
                          onChange={(e) => handleInputChange("volunteerLocationSharing", e.target.checked)}
                        />
                        <span style={{ fontSize: "13px", color: COLORS.darkGreen, fontWeight: 500 }}>
                          Allow location sharing
                        </span>
                      </label>
                    </div>
                  </>
                )}

                {/* Save Button for Role Details */}
                {hasChanges && (
                  <button
                    onClick={handleSaveChanges}
                    disabled={isLoading || (profileData.phone && profileData.phone.length !== 11) || !canSaveRoleDetails()}
                    style={{
                      padding: "12px 24px",
                      backgroundColor: COLORS.mediumGreen,
                      color: COLORS.white,
                      border: "none",
                      borderRadius: "8px",
                      cursor: isLoading || (profileData.phone && profileData.phone.length !== 11) || !canSaveRoleDetails() ? "not-allowed" : "pointer",
                      fontWeight: 600,
                      fontSize: "13px",
                      fontFamily: "Montserrat, sans-serif",
                      opacity: isLoading || (profileData.phone && profileData.phone.length !== 11) || !canSaveRoleDetails() ? 0.7 : 1,
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading && (!profileData.phone || profileData.phone.length === 11) && canSaveRoleDetails()) e.target.style.backgroundColor = "#2d6a4f";
                    }}
                    onMouseLeave={(e) => {
                      if (!isLoading && (!profileData.phone || profileData.phone.length === 11) && canSaveRoleDetails()) e.target.style.backgroundColor = COLORS.mediumGreen;
                    }}
                  >
                    {isLoading ? "Saving..." : "Save Role Details"}
                  </button>
                )}
              </div>
            )}

            {/* Privacy & Security Tab */}
            {activeTab === "privacy" && (
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: COLORS.darkGreen, marginBottom: "20px" }}>
                  Privacy & Security
                </h2>

                {/* Privacy Settings */}
                <div style={{ marginBottom: "30px", paddingBottom: "30px", borderBottom: `2px solid ${COLORS.veryLightGreen}` }}>
                  <h3 style={{ fontSize: "14px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "15px" }}>
                    Privacy Settings
                  </h3>

                  {user?.role !== "elder" && (
                    <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", marginBottom: "15px" }}>
                      <input
                        type="checkbox"
                        checked={user?.role === "caregiver" ? profileData.caregiverLocationSharing : profileData.volunteerLocationSharing}
                        onChange={(e) => {
                          if (user?.role === "caregiver") {
                            handleInputChange("caregiverLocationSharing", e.target.checked);
                          } else {
                            handleInputChange("volunteerLocationSharing", e.target.checked);
                          }
                        }}
                      />
                      <span style={{ fontSize: "13px", color: COLORS.darkGreen, fontWeight: 500 }}>
                        Allow location sharing
                      </span>
                    </label>
                  )}

                  <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", marginBottom: "15px" }}>
                    <input
                      type="checkbox"
                      checked={profileData.privacySettings.emailNotifications}
                      onChange={(e) => handleNestedChange("privacySettings", "emailNotifications", e.target.checked)}
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
                    />
                    <span style={{ fontSize: "13px", color: COLORS.darkGreen, fontWeight: 500 }}>
                      Receive SMS notifications
                    </span>
                  </label>
                </div>

                {/* Change Password */}
                <div style={{ marginBottom: "30px", paddingBottom: "30px", borderBottom: `2px solid ${COLORS.veryLightGreen}` }}>
                  <h3 style={{ fontSize: "14px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "15px" }}>
                    Change Password
                  </h3>

                  {!passwordVerified ? (
                    <>
                      <div style={{ marginBottom: "20px", padding: "15px", backgroundColor: COLORS.lightGray, borderRadius: "8px" }}>
                        <p style={{ fontSize: "13px", color: COLORS.darkGray, margin: "0" }}>
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
                          padding: "10px 20px",
                          backgroundColor: COLORS.mediumGreen,
                          color: COLORS.white,
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: 600,
                          fontSize: "12px",
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
                          Password verified. You can now change your password.
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
                          padding: "10px 20px",
                          backgroundColor: COLORS.darkGray,
                          color: COLORS.white,
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: 600,
                          fontSize: "12px",
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

                {/* Delete Account */}
                <div>
                  <h3 style={{ fontSize: "14px", fontWeight: 600, color: COLORS.red, marginBottom: "15px" }}>
                    Delete Account
                  </h3>

                  {!showDeleteConfirm ? (
                    <div style={{ padding: "15px", backgroundColor: "#ffe0e0", borderRadius: "8px", border: `2px solid ${COLORS.red}` }}>
                      <p style={{ fontSize: "13px", color: COLORS.red, margin: "0 0 15px 0" }}>
                        Warning: Deleting your account will permanently remove all your data from our system. This action cannot be undone.
                      </p>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        style={{
                          padding: "10px 20px",
                          backgroundColor: COLORS.red,
                          color: COLORS.white,
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: 600,
                          fontSize: "12px",
                          fontFamily: "Montserrat, sans-serif",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
                        onMouseLeave={(e) => (e.target.style.opacity = "1")}
                      >
                        Delete My Account
                      </button>
                    </div>
                  ) : (
                    <div style={{ padding: "15px", backgroundColor: "#ffe0e0", borderRadius: "8px", border: `2px solid ${COLORS.red}` }}>
                      <p style={{ fontSize: "13px", color: COLORS.red, marginBottom: "15px" }}>
                        Enter your password to confirm account deletion:
                      </p>
                      <input
                        type="password"
                        value={deleteConfirmPassword}
                        onChange={(e) => setDeleteConfirmPassword(e.target.value)}
                        placeholder="Enter your password"
                        style={{
                          width: "100%",
                          padding: "12px",
                          border: `2px solid ${COLORS.red}`,
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontFamily: "Montserrat, sans-serif",
                          boxSizing: "border-box",
                          marginBottom: "15px",
                        }}
                      />
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button
                          onClick={handleDeleteAccount}
                          disabled={isLoading}
                          style={{
                            padding: "10px 20px",
                            backgroundColor: COLORS.red,
                            color: COLORS.white,
                            border: "none",
                            borderRadius: "8px",
                            cursor: isLoading ? "not-allowed" : "pointer",
                            fontWeight: 600,
                            fontSize: "12px",
                            fontFamily: "Montserrat, sans-serif",
                            opacity: isLoading ? 0.7 : 1,
                          }}
                        >
                          {isLoading ? "Deleting..." : "Confirm Delete"}
                        </button>
                        <button
                          onClick={() => {
                            setShowDeleteConfirm(false);
                            setDeleteConfirmPassword("");
                          }}
                          style={{
                            padding: "10px 20px",
                            backgroundColor: COLORS.darkGray,
                            color: COLORS.white,
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: 600,
                            fontSize: "12px",
                            fontFamily: "Montserrat, sans-serif",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Logout Button - Bottom Center */}
        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <button
            onClick={handleLogout}
            style={{
              padding: "12px 32px",
              backgroundColor: COLORS.red,
              color: COLORS.white,
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "14px",
              fontFamily: "Montserrat, sans-serif",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.target.style.opacity = "1")}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
