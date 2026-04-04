// ============================================================
// pages/SignupPage.js - Signup Page
// Horizontal layout with live image carousel on left side
// Same color scheme as LoginPage with drop shadow
// ============================================================

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";

// ---- SVG Logo: Green cross with red heart ----
const AppLogo = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="30" y="10" width="40" height="80" rx="8" fill="#52b788" />
    <rect x="10" y="30" width="80" height="40" rx="8" fill="#52b788" />
    <rect x="34" y="14" width="32" height="72" rx="6" fill="#74c69d" />
    <rect x="14" y="34" width="72" height="32" rx="6" fill="#74c69d" />
    <circle cx="50" cy="50" r="18" fill="white" />
    <path
      d="M50 58 C50 58 38 50 38 43 C38 39 41 36 44.5 36 C46.5 36 48.5 37.2 50 39 C51.5 37.2 53.5 36 55.5 36 C59 36 62 39 62 43 C62 50 50 58 50 58Z"
      fill="#e63946"
    />
  </svg>
);

// ============================================================
// SignupPage Component - Horizontal Layout with Live Carousel
// ============================================================
const SignupPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [shakeForm, setShakeForm] = useState(false);

  // Image URLs from public folder
  const images = [
    require("../assets/images/signup-1.jpeg"),
    require("../assets/images/signup-2.jpeg"),
    require("../assets/images/signup-3.jpeg"),
    require("../assets/images/signup-4.jpeg"),
    require("../assets/images/signup-5.jpeg"),
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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    return newErrors;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setShakeForm(true);
      setTimeout(() => setShakeForm(false), 500);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await authAPI.signup({
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: formData.role,
      });

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

  // ============================================================
  // RENDER - STEP 1: ROLE SELECTION
  // ============================================================
  if (currentStep === 1) {
    return (
      <div style={{ fontFamily: "Montserrat, sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* TOP BORDER */}
        <div style={{ width: "100%", height: "48px", backgroundColor: "#1C382A" }} />

        {/* MAIN CONTENT */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
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
            {/* Image Container with Live Carousel */}
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

            {/* Image Indicators */}
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

          {/* VERTICAL DIVIDER */}
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
              {/* Logo */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                <AppLogo size={70} />
              </div>

              {/* Title */}
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

              {/* Subtitle */}
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

              {/* Role Selection Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Elder Button */}
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
                  👴 Senior Citizen
                </button>

                {/* Caregiver Button */}
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
                  👨‍⚕️ Caregiver
                </button>

                {/* Volunteer Button */}
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
                  🤝 Volunteer
                </button>
              </div>

              {/* Login Link */}
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

        {/* BOTTOM BORDER */}
        <div style={{ width: "100%", height: "48px", backgroundColor: "#1C382A" }} />
      </div>
    );
  }

  // ============================================================
  // RENDER - STEP 2: SIGNUP FORM
  // ============================================================
  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* TOP BORDER */}
      <div style={{ width: "100%", height: "48px", backgroundColor: "#1C382A" }} />

      {/* MAIN CONTENT */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
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
          {/* Image Container with Live Carousel */}
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

          {/* Image Indicators */}
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

        {/* VERTICAL DIVIDER */}
        <div
          style={{
            display: window.innerWidth >= 900 ? "block" : "none",
            width: "1px",
            minHeight: "500px",
            backgroundColor: "#1C382A4D",
            flexShrink: 0,
          }}
        />

        {/* RIGHT SIDE - Signup Form */}
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
            {/* Logo */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
              <AppLogo size={60} />
            </div>

            {/* Title */}
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
              Create Account
            </h2>

            {/* Role Badge */}
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
              Role: <strong>{selectedRole?.toUpperCase()}</strong>
            </p>

            {/* Error Message */}
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
                <span>⚠️</span>
                <span>{errors.general}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSignup} noValidate>
              {/* Full Name */}
              <label style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "14px", color: "#1C382A", marginBottom: "6px" }}>
                Full Name
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
                onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px #1C382A40")}
                onBlur={(e) => (e.target.style.boxShadow = "none")}
              />
              {errors.fullName && <p style={{ color: "#e63946", fontSize: "12px", fontWeight: 600, marginTop: "-10px", marginBottom: "6px" }}>⚠️ {errors.fullName}</p>}

              {/* Email */}
              <label style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "14px", color: "#1C382A", marginBottom: "6px" }}>
                Email
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
                onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px #1C382A40")}
                onBlur={(e) => (e.target.style.boxShadow = "none")}
              />
              {errors.email && <p style={{ color: "#e63946", fontSize: "12px", fontWeight: 600, marginTop: "-10px", marginBottom: "6px" }}>⚠️ {errors.email}</p>}

              {/* Phone */}
              <label style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "14px", color: "#1C382A", marginBottom: "6px" }}>
                Phone
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
                onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px #1C382A40")}
                onBlur={(e) => (e.target.style.boxShadow = "none")}
              />
              {errors.phone && <p style={{ color: "#e63946", fontSize: "12px", fontWeight: 600, marginTop: "-10px", marginBottom: "6px" }}>⚠️ {errors.phone}</p>}

              {/* Password */}
              <label style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "14px", color: "#1C382A", marginBottom: "6px" }}>
                Password
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
                onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px #1C382A40")}
                onBlur={(e) => (e.target.style.boxShadow = "none")}
              />
              {errors.password && <p style={{ color: "#e63946", fontSize: "12px", fontWeight: 600, marginTop: "-10px", marginBottom: "6px" }}>⚠️ {errors.password}</p>}

              {/* Confirm Password */}
              <label style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "14px", color: "#1C382A", marginBottom: "6px" }}>
                Confirm Password
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
                onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px #1C382A40")}
                onBlur={(e) => (e.target.style.boxShadow = "none")}
              />
              {errors.confirmPassword && <p style={{ color: "#e63946", fontSize: "12px", fontWeight: 600, marginTop: "-10px", marginBottom: "6px" }}>⚠️ {errors.confirmPassword}</p>}

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

      {/* BOTTOM BORDER */}
      <div style={{ width: "100%", height: "48px", backgroundColor: "#1C382A" }} />

      {/* Shake Animation */}
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
