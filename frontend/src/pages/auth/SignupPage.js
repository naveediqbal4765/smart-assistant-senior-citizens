// ============================================================
// pages/SignupPage.js - Comprehensive Signup Page
// Includes general fields + role-specific fields
// Elder, Caregiver, Volunteer with full validation
// ============================================================

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../services/api";
import Header from "../../components/Header";
import toast from "react-hot-toast";
import Logo from "../../assets/images/Logo.png";

// ---- SVG Logo: Green cross with red heart ----


// Medical conditions dropdown options
const MEDICAL_CONDITIONS = [
  "Diabetes",
  "Hypertension",
  "Heart Disease",
  "Arthritis",
  "Asthma",
  "COPD",
  "Parkinson's",
  "Alzheimer's",
  "Osteoporosis",
  "Thyroid",
  "Kidney Disease",
  "Liver Disease",
  "Cancer",
  "Stroke History",
  "Other",
];

// ============================================================
// SignupPage Component - Full Signup with Role-Specific Fields
// ============================================================
const SignupPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [shakeForm, setShakeForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gpsModalOpen, setGpsModalOpen] = useState(false);
  const [gpsModalType, setGpsModalType] = useState(null); // "elder" or "volunteer"

  // General form data
  const [formData, setFormData] = useState({
    // General fields
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    profilePicture: null,
    dateOfBirth: "",
    address: "",
    nationalId: "",
    role: "",

    // Elder-specific
    livesAlone: null,
    emergencyContacts: [],
    medicalConditions: [],
    medicalConditionsOther: "",
    hasMedicalIssues: null,
    locationPermission: null,

    // Caregiver-specific
    relationshipToElder: "",
    relationshipToElderOther: "",
    linkedElderEmail: "",
    pairingCode: "",
    notificationsEnabled: false,
    isAvailable: true,

    // Volunteer-specific
    affiliation: "",
    affiliationOther: "",
    ngoId: "",
    serviceRadius: 5,
    skills: [],
    availabilityDays: [],
    availabilityTimeSlots: [],
    volunteerLocationPermission: null,
  });

  const [errors, setErrors] = useState({});

  // Image URLs from public folder
  const images = [
    require("../../assets/images/signup-1.jpeg"),
    require("../../assets/images/signup-2.jpeg"),
    require("../../assets/images/signup-3.jpeg"),
    require("../../assets/images/signup-4.jpeg"),
    require("../../assets/images/signup-5.jpeg"),
  ];

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setFormData((prev) => ({ ...prev, role }));
    setCurrentStep(2);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAddEmergencyContact = () => {
    setFormData((prev) => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, { name: "", phone: "", relationship: "" }],
    }));
  };

  const handleRemoveEmergencyContact = (index) => {
    setFormData((prev) => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index),
    }));
  };

  const handleEmergencyContactChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.emergencyContacts];
      updated[index][field] = value;
      return { ...prev, emergencyContacts: updated };
    });
  };

  const handleMedicalConditionToggle = (condition) => {
    setFormData((prev) => ({
      ...prev,
      medicalConditions: prev.medicalConditions.includes(condition)
        ? prev.medicalConditions.filter((c) => c !== condition)
        : [...prev.medicalConditions, condition],
    }));
  };

  const handleSkillToggle = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleDayToggle = (day) => {
    setFormData((prev) => ({
      ...prev,
      availabilityDays: prev.availabilityDays.includes(day)
        ? prev.availabilityDays.filter((d) => d !== day)
        : [...prev.availabilityDays, day],
    }));
  };

  const handleTimeSlotToggle = (slot) => {
    setFormData((prev) => ({
      ...prev,
      availabilityTimeSlots: prev.availabilityTimeSlots.includes(slot)
        ? prev.availabilityTimeSlots.filter((s) => s !== slot)
        : [...prev.availabilityTimeSlots, slot],
    }));
  };

  const handleGpsPermission = (allowed, type) => {
    if (type === "elder") {
      setFormData((prev) => ({ ...prev, locationPermission: allowed }));
    } else if (type === "volunteer") {
      setFormData((prev) => ({ ...prev, volunteerLocationPermission: allowed }));
    }
    setGpsModalOpen(false);
  };

  const validateGeneral = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Min 8 characters";
    else if (!/[0-9]/.test(formData.password)) newErrors.password = "Must contain a number";
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) newErrors.password = "Must contain a symbol";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.nationalId.trim()) newErrors.nationalId = "National ID is required";
    else if (!/^\d{13}$/.test(formData.nationalId)) newErrors.nationalId = "Must be exactly 13 digits";
    return newErrors;
  };

  const validateElderSpecific = () => {
    const newErrors = {};
    if (formData.livesAlone === null) newErrors.livesAlone = "Please select";
    if (!formData.livesAlone && formData.emergencyContacts.length === 0) {
      newErrors.emergencyContacts = "Add at least 1 emergency contact";
    }
    if (formData.emergencyContacts.length > 3) {
      newErrors.emergencyContacts = "Maximum 3 contacts allowed";
    }
    formData.emergencyContacts.forEach((contact, idx) => {
      if (!contact.name.trim()) newErrors[`contact_${idx}_name`] = "Name required";
      if (!contact.phone.trim()) newErrors[`contact_${idx}_phone`] = "Phone required";
      if (!contact.relationship.trim()) newErrors[`contact_${idx}_relationship`] = "Relationship required";
    });
    if (formData.hasMedicalIssues === null) newErrors.hasMedicalIssues = "Please select";
    if (formData.locationPermission === null) newErrors.locationPermission = "Please select";
    return newErrors;
  };

  const validateCaregiverSpecific = () => {
    const newErrors = {};
    if (!formData.relationshipToElder) newErrors.relationshipToElder = "Required";
    if (!formData.linkedElderEmail.trim()) newErrors.linkedElderEmail = "Required";
    if (!formData.pairingCode.trim()) newErrors.pairingCode = "Required";
    if (!formData.notificationsEnabled) newErrors.notificationsEnabled = "Must enable notifications";
    return newErrors;
  };

  const validateVolunteerSpecific = () => {
    const newErrors = {};
    if (!formData.affiliation) newErrors.affiliation = "Required";
    if (formData.availabilityDays.length === 0) newErrors.availabilityDays = "Select at least 1 day";
    if (formData.availabilityTimeSlots.length === 0) newErrors.availabilityTimeSlots = "Select at least 1 time slot";
    if (formData.skills.length === 0) newErrors.skills = "Select at least 1 skill";
    if (formData.volunteerLocationPermission === null) newErrors.volunteerLocationPermission = "Please select";
    return newErrors;
  };

  const handleNextStep = () => {
    if (currentStep === 2) {
      const validationErrors = validateGeneral();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setShakeForm(true);
        setTimeout(() => setShakeForm(false), 500);
        return;
      }
      setCurrentStep(3);
      setErrors({});
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    let validationErrors = {};
    if (currentStep === 3) {
      if (selectedRole === "elder") validationErrors = validateElderSpecific();
      else if (selectedRole === "caregiver") validationErrors = validateCaregiverSpecific();
      else if (selectedRole === "volunteer") validationErrors = validateVolunteerSpecific();
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setShakeForm(true);
      setTimeout(() => setShakeForm(false), 500);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const signupData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: formData.role,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        nationalId: formData.nationalId,
      };

      if (selectedRole === "elder") {
        signupData.livesAlone = formData.livesAlone;
        signupData.emergencyContacts = formData.emergencyContacts;
        signupData.medicalConditions = formData.medicalConditions;
        signupData.hasMedicalIssues = formData.hasMedicalIssues;
        signupData.locationPermission = formData.locationPermission;
      } else if (selectedRole === "caregiver") {
        signupData.relationshipToElder = formData.relationshipToElder;
        signupData.linkedElderEmail = formData.linkedElderEmail;
        signupData.pairingCode = formData.pairingCode;
        signupData.notificationsEnabled = formData.notificationsEnabled;
      } else if (selectedRole === "volunteer") {
        signupData.affiliation = formData.affiliation;
        signupData.ngoId = formData.ngoId;
        signupData.serviceRadius = formData.serviceRadius;
        signupData.skills = formData.skills;
        signupData.availability = {
          days: formData.availabilityDays,
          timeSlots: formData.availabilityTimeSlots,
        };
        signupData.locationPermission = formData.volunteerLocationPermission;
      }

      const response = await authAPI.signup(signupData);
      toast.success("Account created! Please verify your email.");
      navigate("/verify-otp", { state: { email: formData.email } });
    } catch (error) {
      const message = error.response?.data?.message || "Signup failed. Please try again.";
      setErrors({ general: message });
      setShakeForm(true);
      setTimeout(() => setShakeForm(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  // GPS Permission Modal
  const GPSModal = ({ type }) => (
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
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          padding: "40px",
          maxWidth: "400px",
          textAlign: "center",
          boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
        }}
      >
        <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "20px", color: "#1C382A", marginBottom: "16px" }}>
           Location Permission
        </h3>
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "14px", color: "#1C382A", marginBottom: "24px", lineHeight: "1.6" }}>
          {type === "elder"
            ? "We need your location to enable SOS and Fall Detection features. This helps us send help quickly in emergencies."
            : "We need your location to match you with seniors who need help nearby. This improves our volunteer matching algorithm."}
        </p>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => handleGpsPermission(false, type)}
            style={{
              flex: 1,
              padding: "12px",
              backgroundColor: "#e63946",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 700,
              fontFamily: "Montserrat, sans-serif",
              fontSize: "14px",
            }}
          >
            Disallow
          </button>
          <button
            onClick={() => handleGpsPermission(true, type)}
            style={{
              flex: 1,
              padding: "12px",
              backgroundColor: "#1C382A",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 700,
              fontFamily: "Montserrat, sans-serif",
              fontSize: "14px",
            }}
          >
            Allow
          </button>
        </div>
      </div>
    </div>
  );

  // ============================================================
  // RENDER - STEP 1: ROLE SELECTION
  // ============================================================
  if (currentStep === 1) {
    return (
      <div style={{ fontFamily: "Montserrat, sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
          paddingTop: "clamp(100px, 20vw, 150px)",
            gap: "40px",
            backgroundColor: "#A9C6B2",
            minHeight: "100vh",
            width: "100%",
            boxSizing: "border-box",
            flexWrap: "wrap",
            position: "relative",
          }}
        >
          {/* Header Overlay - Positioned absolutely */}
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
          {/* LEFT SIDE - Live Image Carousel */}
          <div
            style={{
              flex: "0 1 45%",
              minWidth: "280px",
              maxWidth: "500px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "350px",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "9px 10px 20px 2px #00000040",
                position: "relative",
              }}
            >
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Senior citizens ${index + 1}`}
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: index === currentImageIndex ? 1 : 0,
                    transition: "opacity 0.8s ease-in-out",
                  }}
                />
              ))}
            </div>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
              {images.map((_, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: index === currentImageIndex ? "#1C382A" : "#1C382A80",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </div>
          </div>

          <div
            style={{
              display: window.innerWidth >= 900 ? "block" : "none",
              width: "1px",
              minHeight: "350px",
              backgroundColor: "#1C382A4D",
              flexShrink: 0,
            }}
          />

          {/* RIGHT SIDE - Role Selection */}
          <div
            style={{
              flex: "0 1 45%",
              minWidth: "280px",
              maxWidth: "500px",
              width: "100%",
              padding: "20px",
            }}
          >
            <div
              style={{
                backgroundColor: "#BAE4C7",
                borderRadius: "48px",
                padding: "40px",
                boxShadow: "9px 10px 20px 2px #00000040",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                <img src={Logo} alt="Logo" style={{ height: 70, width: \'auto\' }} />
              </div>
              <h2
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                  fontSize: "28px",
                  color: "#1C382A",
                  margin: "0 0 10px 0",
                  textAlign: "center",
                }}
              >
                Create Account
              </h2>
              {/* Quick Access Links for Testing */}
              <div style={{ width: "100%", marginBottom: "20px", textAlign: "center" }}>
                <p style={{ fontSize: "12px", color: "#666", margin: "0 0 10px 0", fontFamily: "Montserrat, sans-serif" }}>
                   Quick access to dashboards (testing):
                </p>
                <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => navigate("/elder-dashboard")}
                    style={{
                      padding: "8px 12px",
                      backgroundColor: "#52b788",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                     Elder
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/caregiver-dashboard")}
                    style={{
                      padding: "8px 12px",
                      backgroundColor: "#2d6a4f",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    Hospital Caregiver
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/volunteer-dashboard")}
                    style={{
                      padding: "8px 12px",
                      backgroundColor: "#1b4332",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                     Volunteer
                  </button>
                </div>
              </div>

              <p
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "14px",
                  color: "#1C382A",
                  margin: "0 0 30px 0",
                  textAlign: "center",
                }}
              >
                Select your role to get started
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <button
                  onClick={() => handleRoleSelect("elder")}
                  style={{
                    padding: "20px",
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#FFFFFF",
                    backgroundColor: "#1C382A",
                    borderRadius: "12px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    fontFamily: "Montserrat, sans-serif",
                    border: "none",
                    minHeight: "60px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#0F1F1A";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#1C382A";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                   Senior Citizen
                </button>

                <button
                  onClick={() => handleRoleSelect("caregiver")}
                  style={{
                    padding: "20px",
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#FFFFFF",
                    backgroundColor: "#1C382A",
                    borderRadius: "12px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    fontFamily: "Montserrat, sans-serif",
                    border: "none",
                    minHeight: "60px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#0F1F1A";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#1C382A";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  Medical Caregiver
                </button>

                <button
                  onClick={() => handleRoleSelect("volunteer")}
                  style={{
                    padding: "20px",
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#FFFFFF",
                    backgroundColor: "#1C382A",
                    borderRadius: "12px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    fontFamily: "Montserrat, sans-serif",
                    border: "none",
                    minHeight: "60px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#0F1F1A";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#1C382A";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                   Volunteer
                </button>
              </div>

              <p
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "14px",
                  color: "#1C382A",
                  margin: "30px 0 0 0",
                  textAlign: "center",
                }}
              >
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#1C382A",
                    fontSize: "14px",
                    fontWeight: 700,
                    cursor: "pointer",
                    textDecoration: "underline",
                    padding: "0",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  Login here
                </button>
              </p>
            </div>
          </div>
        </div>
        <div style={{ width: "100%", height: "48px", backgroundColor: "#1C382A" }} />
      </div>
    );
  }

  // ============================================================
  // RENDER - STEP 2: GENERAL FIELDS
  // ============================================================
  if (currentStep === 2) {
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
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
          paddingTop: "clamp(100px, 20vw, 150px)",
            gap: "40px",
            backgroundColor: "#A9C6B2",
            minHeight: "calc(100vh - 96px)",
            width: "100%",
            boxSizing: "border-box",
            flexWrap: "wrap",
          }}
        >
          {/* LEFT SIDE - Live Image Carousel */}
          <div
            style={{
              flex: "0 1 45%",
              minWidth: "280px",
              maxWidth: "500px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "350px",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "9px 10px 20px 2px #00000040",
                position: "relative",
              }}
            >
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Senior citizens ${index + 1}`}
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: index === currentImageIndex ? 1 : 0,
                    transition: "opacity 0.8s ease-in-out",
                  }}
                />
              ))}
            </div>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
              {images.map((_, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: index === currentImageIndex ? "#1C382A" : "#1C382A80",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </div>
          </div>

          <div
            style={{
              display: window.innerWidth >= 900 ? "block" : "none",
              width: "1px",
              minHeight: "500px",
              backgroundColor: "#1C382A4D",
              flexShrink: 0,
            }}
          />

          {/* RIGHT SIDE - General Form */}
          <div
            style={{
              flex: "0 1 45%",
              minWidth: "280px",
              maxWidth: "500px",
              width: "100%",
              padding: "20px",
              maxHeight: "calc(100vh - 136px)",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                backgroundColor: "#BAE4C7",
                borderRadius: "48px",
                padding: "40px",
                boxShadow: "9px 10px 20px 2px #00000040",
                width: "100%",
                boxSizing: "border-box",
                animation: shakeForm ? "shake 0.5s ease-in-out" : "none",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
                <img src={Logo} alt="Logo" style={{ height: 60, width: \'auto\' }} />
              </div>
              <h2
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                  fontSize: "24px",
                  color: "#1C382A",
                  margin: "0 0 5px 0",
                  textAlign: "center",
                }}
              >
                General Information
              </h2>
              <p
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "12px",
                  color: "#1C382A",
                  margin: "0 0 20px 0",
                  textAlign: "center",
                  backgroundColor: "#1C382A15",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  display: "inline-block",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                Step 1 of 2: {selectedRole?.toUpperCase()}
              </p>

              {errors.general && (
                <div
                  style={{
                    backgroundColor: "#fde8ea",
                    border: "1.5px solid #e63946",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    marginBottom: "16px",
                    color: "#c1121f",
                    fontSize: "14px",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span>Warning</span>
                  <span>{errors.general}</span>
                </div>
              )}

              <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }} noValidate>
                {/* Profile Picture */}
                <label style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "14px", color: "#1C382A", marginBottom: "6px" }}>
                  Profile Picture (optional, max 50KB)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData((prev) => ({ ...prev, profilePicture: e.target.files?.[0] || null }))}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    fontSize: "13px",
                    backgroundColor: "#FFFFFF",
                    color: "#1C382A",
                    borderRadius: "8px",
                    boxSizing: "border-box",
                    fontFamily: "Montserrat, sans-serif",
                    outline: "none",
                    border: "none",
                    transition: "all 0.3s ease",
                    marginBottom: "12px",
                    minHeight: "40px",
                  }}
                  disabled={isLoading}
                />

                {/* Full Name */}
                <label style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "14px", color: "#1C382A", marginBottom: "6px" }}>
                  Full Name *
                </label>
                <input
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    fontSize: "13px",
                    backgroundColor: errors.fullName ? "#ffe8e8" : "#FFFFFF",
                    color: "#1C382A",
                    borderRadius: "8px",
                    boxSizing: "border-box",
                    fontFamily: "Montserrat, sans-serif",
                    outline: "none",
                    border: errors.fullName ? "2px solid #e63946" : "none",
                    transition: "all 0.3s ease",
                    marginBottom: "12px",
                    minHeight: "40px",
                  }}
                  disabled={isLoading}
                  onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px #1C382A40")}
                  onBlur={(e) => (e.target.style.boxShadow = "none")}
                />
                {errors.fullName && <p style={{ color: "#e63946", fontSize: "12px", fontWeight: 600, marginTop: "-10px", marginBottom: "6px" }}>Warning {errors.fullName}</p>}

                {/* Email */}
                <label style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "14px", color: "#1C382A", marginBottom: "6px" }}>
                  Email *
                </label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    fontSize: "13px",
                    backgroundColor: errors.email ? "#ffe8e8" : "#FFFFFF",
                    color: "#1C382A",
                    borderRadius: "8px",
                    boxSizing: "border-box",
                    fontFamily: "Montserrat, sans-serif",
                    outline: "none",
                    border: errors.email ? "2px solid #e63946" : "none",
                    transition: "all 0.3s ease",
                    marginBottom: "12px",
                    minHeight: "40px",
                  }}
                  disabled={isLoading}
                  onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px #1C382A40")}
                  onBlur={(e) => (e.target.style.boxShadow = "none")}
                />
                {errors.email && <p style={{ color: "#e63946", fontSize: "12px", fontWeight: 600, marginTop: "-10px", marginBottom: "6px" }}>Warning {errors.email}</p>}

                {/* Phone */}
                <label style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "14px", color: "#1C382A", marginBottom: "6px" }}>
                  Phone *
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    fontSize: "13px",
                    backgroundColor: errors.phone ? "#ffe8e8" : "#FFFFFF",
                    color: "#1C382A",
                    borderRadius: "8px",
                    boxSizing: "border-box",
                    fontFamily: "Montserrat, sans-serif",
                    outline: "none",
                    border: errors.phone ? "2px solid #e63946" : "none",
                    transition: "all 0.3s ease",
                    marginBottom: "12px",
                    minHeight: "40px",
                  }}
                  disabled={isLoading}
                  onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px #1C382A40")}
                  onBlur={(e) => (e.target.style.boxShadow = "none")}
                />
                {errors.phone && <p style={{ color: "#e63946", fontSize: "12px", fontWeight: 600, marginTop: "-10px", marginBottom: "6px" }}>Warning {errors.phone}</p>}

                {/* Date of Birth */}
                <label style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "14px", color: "#1C382A", marginBottom: "6px" }}>
                  Date of Birth *
                </label>
                <input
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    fontSize: "13px",
                    backgroundColor: errors.dateOfBirth ? "#ffe8e8" : "#FFFFFF",
                    color: "#1C382A",
                    borderRadius: "8px",
                    boxSizing: "border-box",
                    fontFamily: "Montserrat, sans-serif",
                    outline: "none",
                    border: errors.dateOfBirth ? "2px solid #e63946" : "none",
                    transition: "all 0.3s ease",
                    marginBottom: "12px",
                    minHeight: "40px",
                  }}
                  disabled={isLoading}
                  onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px #1C382A40")}
                  onBlur={(e) => (e.target.style.boxShadow = "none")}
                />
                {errors.dateOfBirth && <p style={{ color: "#e63946", fontSize: "12px", fontWeight: 600, marginTop: "-10px", marginBottom: "6px" }}>Warning {errors.dateOfBirth}</p>}

                {/* Address */}
                <label style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "14px", color: "#1C382A", marginBottom: "6px" }}>
                  Address (Google Maps Autocomplete) *
                </label>
                <input
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    fontSize: "13px",
                    backgroundColor: errors.address ? "#ffe8e8" : "#FFFFFF",
                    color: "#1C382A",
                    borderRadius: "8px",
                    boxSizing: "border-box",
                    fontFamily: "Montserrat, sans-serif",
                    outline: "none",
                    border: errors.address ? "2px solid #e63946" : "none",
                    transition: "all 0.3s ease",
                    marginBottom: "12px",
                    minHeight: "40px",
                  }}
                  disabled={isLoading}
                  onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px #1C382A40")}
                  onBlur={(e) => (e.target.style.boxShadow = "none")}
                />
                {errors.address && <p style={{ color: "#e63946", fontSize: "12px", fontWeight: 600, marginTop: "-10px", marginBottom: "6px" }}>Warning {errors.address}</p>}

                {/* National ID */}
                <label style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "14px", color: "#1C382A", marginBottom: "6px" }}>
                  National ID (13 digits) *
                </label>
                <input
                  name="nationalId"
                  type="text"
                  value={formData.nationalId}
                  onChange={handleChange}
                  placeholder="Enter 13-digit national ID"
                  maxLength="13"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    fontSize: "13px",
                    backgroundColor: errors.nationalId ? "#ffe8e8" : "#FFFFFF",
                    color: "#1C382A",
                    borderRadius: "8px",
                    boxSizing: "border-box",
                    fontFamily: "Montserrat, sans-serif",
                    outline: "none",
                    border: errors.nationalId ? "2px solid #e63946" : "none",
                    transition: "all 0.3s ease",
                    marginBottom: "12px",
                    minHeight: "40px",
                  }}
                  disabled={isLoading}
                  onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px #1C382A40")}
                  onBlur={(e) => (e.target.style.boxShadow = "none")}
                />
                {errors.nationalId && <p style={{ color: "#e63946", fontSize: "12px", fontWeight: 600, marginTop: "-10px", marginBottom: "6px" }}>Warning {errors.nationalId}</p>}

                {/* Password */}
                <label style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "14px", color: "#1C382A", marginBottom: "6px" }}>
                  Password (min 8 chars, 1 number, 1 symbol) *
                </label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    fontSize: "13px",
                    backgroundColor: errors.password ? "#ffe8e8" : "#FFFFFF",
                    color: "#1C382A",
                    borderRadius: "8px",
                    boxSizing: "border-box",
                    fontFamily: "Montserrat, sans-serif",
                    outline: "none",
                    border: errors.password ? "2px solid #e63946" : "none",
                    transition: "all 0.3s ease",
                    marginBottom: "12px",
                    minHeight: "40px",
                  }}
                  disabled={isLoading}
                  onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px #1C382A40")}
                  onBlur={(e) => (e.target.style.boxShadow = "none")}
                />
                {errors.password && <p style={{ color: "#e63946", fontSize: "12px", fontWeight: 600, marginTop: "-10px", marginBottom: "6px" }}>Warning {errors.password}</p>}

                {/* Confirm Password */}
                <label style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "14px", color: "#1C382A", marginBottom: "6px" }}>
                  Confirm Password *
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    fontSize: "13px",
                    backgroundColor: errors.confirmPassword ? "#ffe8e8" : "#FFFFFF",
                    color: "#1C382A",
                    borderRadius: "8px",
                    boxSizing: "border-box",
                    fontFamily: "Montserrat, sans-serif",
                    outline: "none",
                    border: errors.confirmPassword ? "2px solid #e63946" : "none",
                    transition: "all 0.3s ease",
                    marginBottom: "12px",
                    minHeight: "40px",
                  }}
                  disabled={isLoading}
                  onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px #1C382A40")}
                  onBlur={(e) => (e.target.style.boxShadow = "none")}
                />
                {errors.confirmPassword && <p style={{ color: "#e63946", fontSize: "12px", fontWeight: 600, marginTop: "-10px", marginBottom: "6px" }}>Warning {errors.confirmPassword}</p>}

                {/* Next Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: "100%",
                    padding: "12px 20px",
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#FFFFFF",
                    backgroundColor: "#1C382A",
                    borderRadius: "8px",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease",
                    opacity: isLoading ? 0.7 : 1,
                    fontFamily: "Montserrat, sans-serif",
                    border: "none",
                    minHeight: "44px",
                    marginTop: "10px",
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.target.style.backgroundColor = "#0F1F1A";
                      e.target.style.transform = "translateY(-2px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#1C382A";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  Next
                </button>

                {/* Back Button */}
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  style={{
                    width: "100%",
                    padding: "12px 20px",
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#1C382A",
                    backgroundColor: "transparent",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    fontFamily: "Montserrat, sans-serif",
                    border: "none",
                    minHeight: "44px",
                    marginTop: "8px",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#1C382A15")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                >
                  Back
                </button>
              </form>
            </div>
          </div>
        </div>
        <div style={{ width: "100%", height: "48px", backgroundColor: "#1C382A" }} />
        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
          }
        `}</style>
      </div>
    );
  }

  // ============================================================
  // RENDER - STEP 3: ROLE-SPECIFIC FIELDS
  // ============================================================
  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {gpsModalOpen && <GPSModal type={gpsModalType} />}
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
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          paddingTop: "clamp(100px, 20vw, 150px)",
          gap: "40px",
          backgroundColor: "#A9C6B2",
          minHeight: "calc(100vh - 96px)",
          width: "100%",
          boxSizing: "border-box",
          flexWrap: "wrap",
        }}
      >
        {/* LEFT SIDE - Live Image Carousel */}
        <div
          style={{
            flex: "0 1 45%",
            minWidth: "280px",
            maxWidth: "500px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "350px",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "9px 10px 20px 2px #00000040",
              position: "relative",
            }}
          >
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Senior citizens ${index + 1}`}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: index === currentImageIndex ? 1 : 0,
                  transition: "opacity 0.8s ease-in-out",
                }}
              />
            ))}
          </div>
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            {images.map((_, index) => (
              <div
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: index === currentImageIndex ? "#1C382A" : "#1C382A80",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>

        <div
          style={{
            display: window.innerWidth >= 900 ? "block" : "none",
            width: "1px",
            minHeight: "500px",
            backgroundColor: "#1C382A4D",
            flexShrink: 0,
          }}
        />

        {/* RIGHT SIDE - Role-Specific Form */}
        <div
          style={{
            flex: "0 1 45%",
            minWidth: "280px",
            maxWidth: "500px",
            width: "100%",
            padding: "20px",
            maxHeight: "calc(100vh - 136px)",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              backgroundColor: "#BAE4C7",
              borderRadius: "48px",
              padding: "40px",
              boxShadow: "9px 10px 20px 2px #00000040",
              width: "100%",
              boxSizing: "border-box",
              animation: shakeForm ? "shake 0.5s ease-in-out" : "none",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
              <img src={Logo} alt="Logo" style={{ height: 60, width: \'auto\' }} />
            </div>
            <h2
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: "24px",
                color: "#1C382A",
                margin: "0 0 5px 0",
                textAlign: "center",
              }}
            >
              {selectedRole === "elder" && "Senior Information"}
              {selectedRole === "caregiver" && "Caregiver Details"}
              {selectedRole === "volunteer" && "Volunteer Profile"}
            </h2>
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "12px",
                color: "#1C382A",
                margin: "0 0 20px 0",
                textAlign: "center",
                backgroundColor: "#1C382A15",
                padding: "8px 16px",
                borderRadius: "20px",
                display: "inline-block",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              Step 2 of 2: {selectedRole?.toUpperCase()}
            </p>

            {errors.general && (
              <div
                style={{
                  backgroundColor: "#fde8ea",
                  border: "1.5px solid #e63946",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  marginBottom: "16px",
                  color: "#c1121f",
                  fontSize: "14px",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>Warning</span>
                <span>{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSignup} noValidate>
              {/* ============================================================
                  ELDER-SPECIFIC FIELDS
                  ============================================================ */}
              {selectedRole === "elder" && (
                <>
                  {/* Lives Alone */}
                  <label style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "14px", color: "#1C382A", marginBottom: "12px" }}>
                    Do you live alone? *
                  </label>
                  <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="livesAlone"
                        value="true"
                        checked={formData.livesAlone === true}
                        onChange={() => setFormData((prev) => ({ ...prev, livesAlone: true }))}
                        style={{ cursor: "pointer" }}
                      />
                      <span style={{ fontSize: "14px", color: "#1C382A" }}>Yes</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="livesAlone"
                        value="false"
                        checked={formData.livesAlone === false}
                        onChange={() => setFormData((prev) => ({ ...prev, livesAlone: false }))}
                        style={{ cursor: "pointer" }}
                      />
                      <span style={{ fontSize: "14px", color: "#1C382A" }}>No</span>
                    </label>
                  </div>
                  {errors.livesAlone && <p style={{ color: "#e63946", fontSize: "12px", fontWeight: 600, marginBottom: "12px" }}>Warning {errors.livesAlone}</p>}

                  {/* Emergency Contacts (if not lives alone) */}
                  {formData.livesAlone === false && (
                    <>
                      <label style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "14px", color: "#1C382A", marginBottom: "12px" }}>
                        Emergency Contacts (1-3 persons) *
                      </label>
                      {formData.emergencyContacts.map((contact, idx) => (
                        <div key={idx} style={{ marginBottom: "16px", padding: "12px", backgroundColor: "#FFFFFF", borderRadius: "8px" }}>
                          <input
                            type="text"
                            placeholder="Name"
                            value={contact.name}
                            onChange={(e) => handleEmergencyContactChange(idx, "name", e.target.value)}
                            style={{
                              width: "100%",
                              padding: "8px",
                              marginBottom: "8px",
                              borderRadius: "6px",
                              border: errors[`contact_${idx}_name`] ? "2px solid #e63946" : "1px solid #ddd",
                              fontSize: "12px",
                              boxSizing: "border-box",
                            }}
                          />
                          <input
                            type="tel"
                            placeholder="Phone"
                            value={contact.phone}
                            onChange={(e) => handleEmergencyContactChange(idx, "phone", e.target.value)}
                            style={{
                              width: "100%",
                              padding: "8px",
                              marginBottom: "8px",
                              borderRadius: "6px",
                              border: errors[`contact_${idx}_phone`] ? "2px solid #e63946" : "1px solid #ddd",
                              fontSize: "12px",
                              boxSizing: "border-box",
                            }}
                          />
                          <input
                            type="text"
                            placeholder="Relationship (e.g., Son, Daughter)"
                            value={contact.relationship}
                            onChange={(e) => handleEmergencyContactChange(idx, "relationship", e.target.value)}
                            style={{
                              width: "100%",
                              padding: "8px",
                              marginBottom: "8px",
                              borderRadius: "6px",
                              border: errors[`contact_${idx}_relationship`] ? "2px solid #e63946" : "1px solid #ddd",
                              fontSize: "12px",
                              boxSizing: "border-box",
                            }}
                          />
                          {formData.emergencyContacts.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveEmergencyContact(idx)}
                              style={{
                                width: "100%",
                                padding: "6px",
                                backgroundColor: "#e63946",
                                color: "#FFFFFF",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "12px",
                                fontWeight: 600,
                              }}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                      {formData.emergencyContacts.length < 3 && (
                        <button
                          type="button"
                          onClick={handleAddEmergencyContact}
                          style={{
                            width: "100%",
                            padding: "10px",
                            backgroundColor: "#1C382A",
                            color: "#FFFFFF",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: 600,
                            marginBottom: "16px",
                          }}
                        >
                          + Add Contact
                        </button>
                      )}
                      {errors.emergencyContacts && <p style={{ color: "#e63946", fontSize: "12px", fontWeight: 600, marginBottom: "12px" }}>Warning {errors.emergencyContacts}</p>}
                    </>
                  )}

                  {/* Medical Issues */}
                  <label style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "14px", color: "#1C382A", marginBottom: "12px" }}>
                    Do you have any medical issues? *
                  </label>
                  <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="hasMedicalIssues"
                        value="true"
                        checked={formData.hasMedicalIssues === true}
                        onChange={() => setFormData((prev) => ({ ...prev, hasMedicalIssues: true }))}
                        style={{ cursor: "pointer" }}
                      />
                      <span style={{ fontSize: "14px", color: "#1C382A" }}>Yes</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="hasMedicalIssues"
                        value="false"
                        checked={formData.hasMedicalIssues === false}
                        onChange={() => setFormData((prev) => ({ ...prev, hasMedicalIssues: false }))}
                        style={{ cursor: "pointer" }}
                      />
                      <span style={{ fontSize: "14px", color: "#1C382A" }}>No</span>
                    </label>
                  </div>
                  {errors.hasMedicalIssues && <p style={{ color: "#e63946", fontSize: "12px", fontWeight: 600, marginBottom: "12px" }}>Warning {errors.hasMedicalIssues}</p>}

                  {/* Medical Conditions Dropdown (if yes) */}
                  {formData.hasMedicalIssues === true && (
                    <>
                      <label style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "14px", color: "#1C382A", marginBottom: "12px" }}>
                        Medical Conditions (Searchable Dropdown)
                      </label>
                      <div style={{ marginBottom: "16px", maxHeight: "200px", overflowY: "auto", border: "1px solid #ddd", borderRadius: "8px", padding: "8px", backgroundColor: "#FFFFFF" }}>
                        {MEDICAL_CONDITIONS.map((condition) => (
                          <label key={condition} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", marginBottom: "8px", padding: "6px" }}>
                            <input
                              type="checkbox"
                              checked={formData.medicalConditions.includes(condition)}
                              onChange={() => handleMedicalConditionToggle(condition)}
                              style={{ cursor: "pointer", width: "16px", height: "16px" }}
                            />
                            <span style={{ fontSize: "13px", color: "#1C382A" }}>{condition}</span>
                          </label>
                        ))}
                      </div>

                      {/* Custom Medical Condition (if Other selected) */}
                      {formData.medicalConditions.includes("Other") && (
                        <>
                          <label style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "14px", color: "#1C382A", marginBottom: "6px" }}>
                            Please specify your medical condition *
                          </label>
                          <div style={{
                            width: "100%",
                            padding: "10px 12px",
                            marginBottom: "16px",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                            fontSize: "13px",
                            fontFamily: "Montserrat, sans-serif",
                            backgroundColor: "#FFFFFF",
                            color: "#1C382A",
                            minHeight: "40px",
                            boxSizing: "border-box",
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "8px",
                            alignItems: "center",
                          }}>
                            {/* Display tags for each custom condition */}
                            {formData.medicalConditionsOther.split(",").map((condition, idx) => {
                              const trimmed = condition.trim();
                              return trimmed ? (
                                <div key={idx} style={{
                                  backgroundColor: "#52b788",
                                  color: "#FFFFFF",
                                  padding: "6px 12px",
                                  borderRadius: "20px",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  whiteSpace: "nowrap",
                                }}>
                                  {trimmed}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const conditions = formData.medicalConditionsOther.split(",").filter((_, i) => i !== idx);
                                      setFormData((prev) => ({ ...prev, medicalConditionsOther: conditions.join(",") }));
                                    }}
                                    style={{
                                      background: "none",
                                      border: "none",
                                      color: "#FFFFFF",
                                      cursor: "pointer",
                                      fontSize: "16px",
                                      padding: "0",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    ×
                                  </button>
                                </div>
                              ) : null;
                            })}
                            <input
                              name="medicalConditionsOther"
                              type="text"
                              value={formData.medicalConditionsOther}
                              onChange={handleChange}
                              placeholder="Type condition and press comma (,) to add"
                              style={{
                                border: "none",
                                outline: "none",
                                fontSize: "13px",
                                fontFamily: "Montserrat, sans-serif",
                                backgroundColor: "transparent",
                                color: "#1C382A",
                                flex: 1,
                                minWidth: "150px",
                              }}
                            />
                          </div>
                          <p style={{ fontSize: "12px", color: "#666", marginTop: "-12px", marginBottom: "16px" }}>
                            Idea Tip: Separate multiple conditions with commas (e.g., "Diabetes, Arthritis")
                          </p>
                        </>
                      )}
                    </>
                  )}

                  {/* Location Permission */}
                  <label style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "14px", color: "#1C382A", marginBottom: "12px" }}>
                    Location Permission for SOS & Fall Detection *
                  </label>
                  <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
                    <button
                      type="button"
                      onClick={() => {
                        setGpsModalOpen(true);
                        setGpsModalType("elder");
                      }}
                      style={{
                        flex: 1,
                        padding: "12px",
                        backgroundColor: formData.locationPermission === true ? "#52b788" : "#FFFFFF",
                        color: formData.locationPermission === true ? "#FFFFFF" : "#1C382A",
                        border: "2px solid #1C382A",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: 700,
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: "14px",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (formData.locationPermission !== true) {
                          e.target.style.backgroundColor = "#1C382A15";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (formData.locationPermission !== true) {
                          e.target.style.backgroundColor = "#FFFFFF";
                        }
                      }}
                    >
                      Check Allow
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setGpsModalOpen(true);
                        setGpsModalType("elder");
                      }}
                      style={{
                        flex: 1,
                        padding: "12px",
                        backgroundColor: formData.locationPermission === false ? "#e63946" : "#FFFFFF",
                        color: formData.locationPermission === false ? "#FFFFFF" : "#1C382A",
                        border: "2px solid #1C382A",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: 700,
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: "14px",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (formData.locationPermission !== false) {
                          e.target.style.backgroundColor = "#1C382A15";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (formData.locationPermission !== false) {
                          e.target.style.backgroundColor = "#FFFFFF";
                        }
                      }}
                    >
                       Disallow
                    </button>
                  </div>
                  {errors.locationPermission && <p style={{ color: "#e63946", fontSize: "12px", fontWeight: 600, marginBottom: "12px" }}>Warning {errors.locationPermission}</p>}
                </>
              )}

              {/* ============================================================
                  CAREGIVER-SPECIFIC FIELDS
                  ============================================================ */}
              {selectedRole === "caregiver" && (
                <>
                  {/* Relationship to Elder */}
                  <label style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "14px", color: "#1C382A", marginBottom: "6px" }}>
                    Relationship to Elder *
                  </label>
                  <select
                    name="relationshipToElder"
                    value={formData.relationshipToElder}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      marginBottom: "16px",
                      borderRadius: "8px",
                      border: errors.relationshipToElder ? "2px solid #e63946" : "1px solid #ddd",
                      fontSize: "13px",
                      fontFamily: "Montserrat, sans-serif",
                      backgroundColor: "#FFFFFF",
                      color: "#1C382A",
                      cursor: "pointer",
                      minHeight: "40px",
                    }}
                  >
                    <option value="">Select relationship</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Professional Nurse">Professional Nurse</option>
                    <option value="Paid Caregiver">Paid Caregiver</option>
                    <option value="Neighbor">Neighbor</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.relationshipToElder && <p style={{ color: "#e63946", fontSize: "12px", fontWeight: 600, marginBottom: "12px" }}>Warning {errors.relationshipToElder}</p>}

                  {/* Custom Relationship (if Other selected) */}
                  {formData.relationshipToElder === "Other" && (
                    <>
                      <label style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "14px", color: "#1C382A", marginBottom: "6px" }}>
                        Please specify your relationship *
                      </label>
                      <input
                        name="relationshipToElderOther"
                        type="text"
                        value={formData.relationshipToElderOther}
                        onChange={handleChange}
                        placeholder="Enter your relationship"
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          marginBottom: "16px",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                          fontSize: "13px",
                          fontFamily: "Montserrat, sans-serif",
                          backgroundColor: "#FFFFFF",
                          color: "#1C382A",
                          minHeight: "40px",
                          boxSizing: "border-box",
                        }}
                      />
                    </>
                  )}

                  {/* Senior's Email */}
                  <label style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "14px", color: "#1C382A", marginBottom: "6px" }}>
                    Senior's Email *
                  </label>
                  <input
                    name="linkedElderEmail"
                    type="email"
                    value={formData.linkedElderEmail}
                    onChange={handleChange}
                    placeholder="Enter senior's email"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      marginBottom: "16px",
                      borderRadius: "8px",
                      border: errors.linkedElderEmail ? "2px solid #e63946" : "1px solid #ddd",
                      fontSize: "13px",
                      fontFamily: "Montserrat, sans-serif",
                      backgroundColor: "#FFFFFF",
                      color: "#1C382A",
                      minHeight: "40px",
                      boxSizing: "border-box",
                    }}
                  />
                  {errors.linkedElderEmail && <p style={{ color: "#e63946", fontSize: "12px", fontWeight: 600, marginBottom: "12px" }}>Warning {errors.linkedElderEmail}</p>}

                  {/* Pairing Code */}
                  <label style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "14px", color: "#1C382A", marginBottom: "6px" }}>
                    6-Digit Pairing Code *
                  </label>
                  <input
                    name="pairingCode"
                    type="text"
                    value={formData.pairingCode}
                    onChange={handleChange}
                    placeholder="Enter 6-digit code"
                    maxLength="6"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      marginBottom: "16px",
                      borderRadius: "8px",
                      border: errors.pairingCode ? "2px solid #e63946" : "1px solid #ddd",
                      fontSize: "13px",
                      fontFamily: "Montserrat, sans-serif",
                      backgroundColor: "#FFFFFF",
                      color: "#1C382A",
                      minHeight: "40px",
                      boxSizing: "border-box",
                    }}
                  />
                  {errors.pairingCode && <p style={{ color: "#e63946", fontSize: "12px", fontWeight: 600, marginBottom: "12px" }}>Warning {errors.pairingCode}</p>}

                  {/* Notifications */}
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", marginBottom: "20px" }}>
                    <input
                      type="checkbox"
                      name="notificationsEnabled"
                      checked={formData.notificationsEnabled}
                      onChange={handleChange}
                      style={{ cursor: "pointer", width: "18px", height: "18px" }}
                    />
                    <span style={{ fontSize: "14px", color: "#1C382A", fontWeight: 600 }}>Enable push notifications for SOS alerts *</span>
                  </label>
                  {errors.notificationsEnabled && <p style={{ color: "#e63946", fontSize: "12px", fontWeight: 600, marginBottom: "12px" }}>Warning {errors.notificationsEnabled}</p>}

                  {/* Available Status */}
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", marginBottom: "20px" }}>
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={formData.isAvailable}
                      onChange={handleChange}
                      style={{ cursor: "pointer", width: "18px", height: "18px" }}
                    />
                    <span style={{ fontSize: "14px", color: "#1C382A", fontWeight: 600 }}>I am currently available to monitor</span>
                  </label>
                </>
              )}

              {/* ============================================================
                  VOLUNTEER-SPECIFIC FIELDS
                  ============================================================ */}
              {selectedRole === "volunteer" && (
                <>
                  {/* Affiliation */}
                  <label style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "14px", color: "#1C382A", marginBottom: "6px" }}>
                    NGO Affiliation *
                  </label>
                  <select
                    name="affiliation"
                    value={formData.affiliation}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      marginBottom: "16px",
                      borderRadius: "8px",
                      border: errors.affiliation ? "2px solid #e63946" : "1px solid #ddd",
                      fontSize: "13px",
                      fontFamily: "Montserrat, sans-serif",
                      backgroundColor: "#FFFFFF",
                      color: "#1C382A",
                      cursor: "pointer",
                      minHeight: "40px",
                    }}
                  >
                    <option value="">Select NGO</option>
                    <option value="Edhi">Edhi Foundation</option>
                    <option value="Al-Khidmat">Al-Khidmat Foundation</option>
                    <option value="Shaukat Khanum">Shaukat Khanum Memorial</option>
                    <option value="Independent">Independent Volunteer</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.affiliation && <p style={{ color: "#e63946", fontSize: "12px", fontWeight: 600, marginBottom: "12px" }}>Warning {errors.affiliation}</p>}

                  {/* Custom Affiliation (if Other selected) */}
                  {formData.affiliation === "Other" && (
                    <>
                      <label style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "14px", color: "#1C382A", marginBottom: "6px" }}>
                        Please specify your NGO *
                      </label>
                      <input
                        name="affiliationOther"
                        type="text"
                        value={formData.affiliationOther}
                        onChange={handleChange}
                        placeholder="Enter your NGO name"
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          marginBottom: "16px",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                          fontSize: "13px",
                          fontFamily: "Montserrat, sans-serif",
                          backgroundColor: "#FFFFFF",
                          color: "#1C382A",
                          minHeight: "40px",
                          boxSizing: "border-box",
                        }}
                      />
                    </>
                  )}

                  {/* NGO ID */}
                  <label style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "14px", color: "#1C382A", marginBottom: "6px" }}>
                    NGO ID (optional)
                  </label>
                  <input
                    name="ngoId"
                    type="text"
                    value={formData.ngoId}
                    onChange={handleChange}
                    placeholder="Enter NGO ID if applicable"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      marginBottom: "16px",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                      fontSize: "13px",
                      fontFamily: "Montserrat, sans-serif",
                      backgroundColor: "#FFFFFF",
                      color: "#1C382A",
                      minHeight: "40px",
                      boxSizing: "border-box",
                    }}
                  />

                  {/* Service Radius */}
                  <label style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "14px", color: "#1C382A", marginBottom: "6px" }}>
                    Service Radius: {formData.serviceRadius} km
                  </label>
                  <input
                    type="range"
                    name="serviceRadius"
                    min="1"
                    max="10"
                    value={formData.serviceRadius}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      marginBottom: "16px",
                      cursor: "pointer",
                    }}
                  />

                  {/* Skills */}
                  <label style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "14px", color: "#1C382A", marginBottom: "12px" }}>
                    Skills (select at least 1) *
                  </label>
                  <div style={{ marginBottom: "16px" }}>
                    {["Medical", "Errands", "Physical Help"].map((skill) => (
                      <label key={skill} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", marginBottom: "8px" }}>
                        <input
                          type="checkbox"
                          checked={formData.skills.includes(skill)}
                          onChange={() => handleSkillToggle(skill)}
                          style={{ cursor: "pointer", width: "18px", height: "18px" }}
                        />
                        <span style={{ fontSize: "14px", color: "#1C382A" }}>{skill}</span>
                      </label>
                    ))}
                  </div>
                  {errors.skills && <p style={{ color: "#e63946", fontSize: "12px", fontWeight: 600, marginBottom: "12px" }}>Warning {errors.skills}</p>}

                  {/* Availability Days */}
                  <label style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "14px", color: "#1C382A", marginBottom: "12px" }}>
                    Available Days (select at least 1) *
                  </label>
                  <div style={{ marginBottom: "16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                      <label key={day} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={formData.availabilityDays.includes(day)}
                          onChange={() => handleDayToggle(day)}
                          style={{ cursor: "pointer", width: "16px", height: "16px" }}
                        />
                        <span style={{ fontSize: "12px", color: "#1C382A" }}>{day.slice(0, 3)}</span>
                      </label>
                    ))}
                  </div>
                  {errors.availabilityDays && <p style={{ color: "#e63946", fontSize: "12px", fontWeight: 600, marginBottom: "12px" }}>Warning {errors.availabilityDays}</p>}

                  {/* Availability Time Slots */}
                  <label style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "14px", color: "#1C382A", marginBottom: "12px" }}>
                    Preferred Time Slots (select at least 1) *
                  </label>
                  <div style={{ marginBottom: "16px" }}>
                    {["Morning", "Afternoon", "Evening", "Night"].map((slot) => (
                      <label key={slot} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", marginBottom: "8px" }}>
                        <input
                          type="checkbox"
                          checked={formData.availabilityTimeSlots.includes(slot)}
                          onChange={() => handleTimeSlotToggle(slot)}
                          style={{ cursor: "pointer", width: "18px", height: "18px" }}
                        />
                        <span style={{ fontSize: "14px", color: "#1C382A" }}>{slot}</span>
                      </label>
                    ))}
                  </div>
                  {errors.availabilityTimeSlots && <p style={{ color: "#e63946", fontSize: "12px", fontWeight: 600, marginBottom: "12px" }}>Warning {errors.availabilityTimeSlots}</p>}

                  {/* Location Permission */}
                  <label style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "14px", color: "#1C382A", marginBottom: "12px" }}>
                    Location Permission for Volunteer Matching *
                  </label>
                  <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
                    <button
                      type="button"
                      onClick={() => {
                        setGpsModalOpen(true);
                        setGpsModalType("volunteer");
                      }}
                      style={{
                        flex: 1,
                        padding: "12px",
                        backgroundColor: formData.volunteerLocationPermission === true ? "#52b788" : "#FFFFFF",
                        color: formData.volunteerLocationPermission === true ? "#FFFFFF" : "#1C382A",
                        border: "2px solid #1C382A",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: 700,
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: "14px",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (formData.volunteerLocationPermission !== true) {
                          e.target.style.backgroundColor = "#1C382A15";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (formData.volunteerLocationPermission !== true) {
                          e.target.style.backgroundColor = "#FFFFFF";
                        }
                      }}
                    >
                      Check Allow
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setGpsModalOpen(true);
                        setGpsModalType("volunteer");
                      }}
                      style={{
                        flex: 1,
                        padding: "12px",
                        backgroundColor: formData.volunteerLocationPermission === false ? "#e63946" : "#FFFFFF",
                        color: formData.volunteerLocationPermission === false ? "#FFFFFF" : "#1C382A",
                        border: "2px solid #1C382A",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: 700,
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: "14px",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (formData.volunteerLocationPermission !== false) {
                          e.target.style.backgroundColor = "#1C382A15";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (formData.volunteerLocationPermission !== false) {
                          e.target.style.backgroundColor = "#FFFFFF";
                        }
                      }}
                    >
                       Disallow
                    </button>
                  </div>
                  {errors.volunteerLocationPermission && <p style={{ color: "#e63946", fontSize: "12px", fontWeight: 600, marginBottom: "12px" }}>Warning {errors.volunteerLocationPermission}</p>}
                </>
              )}

              {/* Signup Button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "12px 20px",
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  backgroundColor: "#1C382A",
                  borderRadius: "8px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  opacity: isLoading ? 0.7 : 1,
                  fontFamily: "Montserrat, sans-serif",
                  border: "none",
                  minHeight: "44px",
                  marginTop: "10px",
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.target.style.backgroundColor = "#0F1F1A";
                    e.target.style.transform = "translateY(-2px)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#1C382A";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                {isLoading ? "Creating..." : "Create Account"}
              </button>

              {/* Back Button */}
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                style={{
                  width: "100%",
                  padding: "12px 20px",
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#1C382A",
                  backgroundColor: "transparent",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  fontFamily: "Montserrat, sans-serif",
                  border: "none",
                  minHeight: "44px",
                  marginTop: "8px",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#1C382A15")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
              >
                Back
              </button>

              {/* Login Link */}
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "12px", color: "#1C382A", margin: "16px 0 0 0", textAlign: "center" }}>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#1C382A",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    textDecoration: "underline",
                    padding: "0",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  Login here
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
      <div style={{ width: "100%", height: "48px", backgroundColor: "#1C382A" }} />
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  );
};

export default SignupPage;