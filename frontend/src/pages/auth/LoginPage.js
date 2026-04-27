// ============================================================
// pages/LoginPage.js - Login Page
// Fully responsive horizontal layout with proper proportions
// Left (logo + title + description) | Divider | Right (form)
// ============================================================

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../services/api";
import PasswordResetModal from "../../components/PasswordResetModal";
import GoogleLoginButton from "../../components/GoogleLoginButton";
import FacebookLoginButton from "../../components/FacebookLoginButton";
import toast from "react-hot-toast";
import Logo from "../../assets/images/Logo.png";
import Background from "../../assets/images/Background.png";

// ---- Google Icon ----
const GoogleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

// ---- Facebook Icon ----
const FacebookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#1877F2"/>
    <path d="M16.5 8H14.5C13.95 8 13.5 8.45 13.5 9V11H16.5L16 14H13.5V22H10.5V14H8.5V11H10.5V9C10.5 7.07 12.07 5.5 14 5.5H16.5V8Z" fill="white"/>
  </svg>
);

// ---- Apple Icon ----
const AppleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" fill="#000000"/>
  </svg>
);

// ============================================================
// LoginPage Component - Fully Responsive with Proper Proportions
// ============================================================
const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [shakeForm, setShakeForm] = useState(false);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);

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

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    return newErrors;
  };

  const handleLogin = async (e) => {
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
      // Use the Remember Me endpoint if checkbox is checked
      const endpoint = formData.rememberMe ? "/auth/login-with-remember-me" : "/auth/login";
      
      const response = await authAPI.post(endpoint, {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      const { token, rememberMeToken, user } = response.data.data;
      
      // Pass Remember Me token to login function
      login(token, user, rememberMeToken, formData.rememberMe);
      toast.success(`Welcome back, ${user.fullName.split(" ")[0]}! `);

      const dashboardRoutes = {
        elder: "/dashboard/elder",
        caregiver: "/dashboard/caregiver",
        volunteer: "/dashboard/volunteer",
      };
      navigate(dashboardRoutes[user.role] || "/dashboard/elder");
    } catch (error) {
      const message = error.response?.data?.message || "Login failed. Please try again.";

      if (message.toLowerCase().includes("wrong") || message.toLowerCase().includes("password") || message.toLowerCase().includes("email")) {
        setErrors({ general: message });
      } else if (error.response?.data?.requiresVerification) {
        toast.error("Please verify your email first.");
        navigate("/verify-otp", { state: { email: formData.email } });
        return;
      } else {
        setErrors({ general: message });
      }

      setShakeForm(true);
      setTimeout(() => setShakeForm(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = (provider) => {
    toast(`${provider} login coming soon! Use email/password for now.`, { icon: "Info" });
  };

  // ============================================================
  // RENDER - FULLY RESPONSIVE WITH PROPER PROPORTIONS
  // ============================================================
  return (
    <div 
      style={{ 
        fontFamily: "Montserrat, sans-serif", 
        minHeight: "100vh", 
        display: "flex", 
        flexDirection: "column",
        backgroundImage: `url(${Background})`,
        backgroundColor: 'rgba(26, 26, 26, 0.4)',
        backgroundBlendMode: 'overlay',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* MAIN CONTENT - Responsive Horizontal Layout */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          paddingTop: "clamp(100px, 20vw, 150px)",
          gap: "40px",
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
          <img 
            src={Logo} 
            alt="Logo" 
            style={{ width: 'auto', height: 'clamp(32px, 4vw, 48px)', objectFit: 'contain' }} 
          />
          <div style={{ minWidth: "0", flex: "1 1 auto" }}>
            <h1 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "clamp(16px, 3vw, 22px)", color: "#FFFFFF", margin: "0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Smart Assistant
            </h1>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 400, fontSize: "clamp(10px, 1.5vw, 13px)", color: "#BAE4C7", margin: "0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Care for Seniors, By Community
            </p>
          </div>
        </div>

        {/* LEFT SIDE - Logo + Title + Description */}
        <div
          style={{
            flex: "0 1 45%",
            minWidth: "280px",
            maxWidth: "500px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "20px",
          }}
        >
          {/* Logo */}
          <div style={{ marginBottom: "30px", flexShrink: 0 }}>
            <img src={Logo} alt="Smart Assistant Logo" style={{ width: '120px', height: 'auto' }} />
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(28px, 4vw, 48px)",
              lineHeight: "1.2",
              color: "#FFFFFF",
              margin: "0 0 20px 0",
            }}
          >
            Smart Assistant for<br />Senior Citizens
          </h1>

          {/* Description */}
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "clamp(14px, 2vw, 18px)",
              lineHeight: "1.6",
              color: "#FFFFFF",
              margin: "0",
              maxWidth: "100%",
              opacity: 0.9
            }}
          >
            Smart Assistant is a gateway to independence, empowering seniors with secure health monitoring, instant connectivity, and dignified daily living.
          </p>
        </div>

        {/* VERTICAL DIVIDER - Hidden on mobile */}
        <div
          style={{
            display: window.innerWidth >= 900 ? "block" : "none",
            width: "1px",
            minHeight: "350px",
            backgroundColor: "#FFFFFF4D",
            flexShrink: 0,
          }}
        />

        {/* RIGHT SIDE - Login Form */}
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
              backgroundColor: "rgba(186, 228, 199, 0.9)",
              backdropFilter: "blur(10px)",
              borderRadius: "48px",
              padding: "40px",
              boxShadow: "9px 10px 20px 2px #00000040",
              animation: shakeForm ? "shake 0.5s ease-in-out" : "none",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            {/* Form Logo */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <img src={Logo} alt="Form Logo" style={{ width: '70px', height: 'auto' }} />
            </div>

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
                <span>Warning</span>
                <span>{errors.general}</span>
              </div>
            )}

            {/* Quick Access Links for Testing - Dashboards */}
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

            {/* Quick Access Links for Testing - User Profiles */}
            <div style={{ width: "100%", marginBottom: "20px", textAlign: "center", padding: "15px", backgroundColor: "#E2FFEB", borderRadius: "8px", border: "2px solid #52b788" }}>
              <p style={{ fontSize: "13px", color: "#1C382A", margin: "0 0 12px 0", fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
                 🧪 TEST USER PROFILES (No Login Required):
              </p>
              <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => {
                    const mockUser = {
                      userId: "test-elder",
                      email: "elder@test.com",
                      fullName: "Test Elder",
                      role: "elder",
                      profilePicture: null,
                    };
                    localStorage.setItem("user", JSON.stringify(mockUser));
                    sessionStorage.setItem("user", JSON.stringify(mockUser));
                    localStorage.setItem("accessToken", "test-token");
                    sessionStorage.setItem("accessToken", "test-token");
                    navigate("/profile");
                  }}
                  style={{
                    padding: "10px 16px",
                    backgroundColor: "#52b788",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "Montserrat, sans-serif",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#2d6a4f")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#52b788")}
                >
                   👴 Elder Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const mockUser = {
                      userId: "test-caregiver",
                      email: "caregiver@test.com",
                      fullName: "Test Caregiver",
                      role: "caregiver",
                      profilePicture: null,
                    };
                    localStorage.setItem("user", JSON.stringify(mockUser));
                    sessionStorage.setItem("user", JSON.stringify(mockUser));
                    localStorage.setItem("accessToken", "test-token");
                    sessionStorage.setItem("accessToken", "test-token");
                    navigate("/profile");
                  }}
                  style={{
                    padding: "10px 16px",
                    backgroundColor: "#2d6a4f",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "Montserrat, sans-serif",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#1b4332")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#2d6a4f")}
                >
                  💚 Caregiver Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const mockUser = {
                      userId: "test-volunteer",
                      email: "volunteer@test.com",
                      fullName: "Test Volunteer",
                      role: "volunteer",
                      profilePicture: null,
                    };
                    localStorage.setItem("user", JSON.stringify(mockUser));
                    sessionStorage.setItem("user", JSON.stringify(mockUser));
                    localStorage.setItem("accessToken", "test-token");
                    sessionStorage.setItem("accessToken", "test-token");
                    navigate("/profile");
                  }}
                  style={{
                    padding: "10px 16px",
                    backgroundColor: "#1b4332",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "Montserrat, sans-serif",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#0f2818")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#1b4332")}
                >
                   🤝 Volunteer Profile
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} noValidate>
              {/* Email Label */}
              <label
                style={{
                  display: "block",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 600,
                  fontSize: "16px",
                  color: "#1C382A",
                  marginBottom: "8px",
                }}
              >
                Username / Email
              </label>

              {/* Email Input */}
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  fontSize: "14px",
                  backgroundColor: "#FFFFFF",
                  color: "#1C382A",
                  borderRadius: "8px",
                  boxSizing: "border-box",
                  fontFamily: "Montserrat, sans-serif",
                  outline: "none",
                  border: "none",
                  transition: "all 0.3s ease",
                  marginBottom: "16px",
                  minHeight: "44px",
                }}
                placeholder=""
                disabled={isLoading}
                onFocus={(e) => {
                  e.target.style.boxShadow = "0 0 0 3px #1C382A40";
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = "none";
                }}
              />
              {errors.email && (
                <p style={{ color: "#e63946", fontSize: "13px", fontWeight: 600, marginTop: "-12px", marginBottom: "8px" }}>
                  Warning {errors.email}
                </p>
              )}

              {/* Password Label */}
              <label
                style={{
                  display: "block",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 600,
                  fontSize: "16px",
                  color: "#1C382A",
                  marginBottom: "8px",
                }}
              >
                Password
              </label>

              {/* Password Input */}
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  fontSize: "14px",
                  backgroundColor: "#FFFFFF",
                  color: "#1C382A",
                  borderRadius: "8px",
                  boxSizing: "border-box",
                  fontFamily: "Montserrat, sans-serif",
                  outline: "none",
                  border: "none",
                  transition: "all 0.3s ease",
                  marginBottom: "16px",
                  minHeight: "44px",
                }}
                placeholder=""
                disabled={isLoading}
                onFocus={(e) => {
                  e.target.style.boxShadow = "0 0 0 3px #1C382A40";
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = "none";
                }}
              />
              {errors.password && (
                <p style={{ color: "#e63946", fontSize: "13px", fontWeight: 600, marginTop: "-12px", marginBottom: "8px" }}>
                  Warning {errors.password}
                </p>
              )}

              {/* Login and Sign Up Buttons */}
              <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    flex: 1,
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
                  {isLoading ? "..." : "Login"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    padding: "12px 20px",
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#1C382A",
                    backgroundColor: "transparent",
                    borderRadius: "8px",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease",
                    fontFamily: "Montserrat, sans-serif",
                    border: "none",
                    minHeight: "44px",
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.target.style.backgroundColor = "#1C382A15";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                  }}
                >
                  Sign Up
                </button>
              </div>

              {/* Remember Me and Reset Password */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#1C382A",
                    userSelect: "none",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    style={{
                      width: "18px",
                      height: "18px",
                      cursor: "pointer",
                      accentColor: "#1C382A",
                      border: "none",
                      borderRadius: "3px",
                      minWidth: "18px",
                      flexShrink: 0,
                    }}
                  />
                  Remember me
                </label>

                <button
                  type="button"
                  onClick={() => setShowPasswordResetModal(true)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#1C382A",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    textDecoration: "underline",
                    padding: "0",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  Reset Password?
                </button>
              </div>

              {/* OR Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ flex: 1, height: "1px", backgroundColor: "#1C382A" }} />
                <span style={{ color: "#1C382A", fontSize: "12px", fontWeight: 400, fontFamily: "Montserrat, sans-serif" }}>OR</span>
                <div style={{ flex: 1, height: "1px", backgroundColor: "#1C382A" }} />
              </div>

              {/* Google Login Button */}
              <div style={{ marginBottom: "16px" }}>
                <GoogleLoginButton 
                  rememberMe={formData.rememberMe}
                  onSuccess={(user) => {
                    toast.success(`Welcome back, ${user.fullName}!`);
                    const dashboardRoutes = {
                      elder: "/dashboard/elder",
                      caregiver: "/dashboard/caregiver",
                      volunteer: "/dashboard/volunteer",
                    };
                    navigate(dashboardRoutes[user.role] || "/dashboard/elder");
                  }}
                  onError={(error) => {
                    toast.error(error.message || "Google login failed");
                  }}
                />
              </div>

              {/* Facebook Login Button */}
              <div style={{ marginBottom: "16px" }}>
                <FacebookLoginButton 
                  rememberMe={formData.rememberMe}
                  onSuccess={(user) => {
                    toast.success(`Welcome back, ${user.fullName}!`);
                    const dashboardRoutes = {
                      elder: "/dashboard/elder",
                      caregiver: "/dashboard/caregiver",
                      volunteer: "/dashboard/volunteer",
                    };
                    navigate(dashboardRoutes[user.role] || "/dashboard/elder");
                  }}
                  onError={(error) => {
                    toast.error(error.message || "Facebook login failed");
                  }}
                />
              </div>

              {/* OAuth Icon Buttons */}
              <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "4px" }}>
                <button
                  type="button"
                  onClick={() => handleOAuth("Google")}
                  title="Continue with Google"
                  style={{
                    padding: "12px",
                    backgroundColor: "transparent",
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s ease",
                    border: "none",
                    minWidth: "44px",
                    minHeight: "44px",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#1C382A15";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                  }}
                >
                  <GoogleIcon />
                </button>

                <button
                  type="button"
                  onClick={() => handleOAuth("Facebook")}
                  title="Continue with Facebook"
                  style={{
                    padding: "12px",
                    backgroundColor: "transparent",
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s ease",
                    border: "none",
                    minWidth: "44px",
                    minHeight: "44px",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#1C382A15";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                  }}
                >
                  <FacebookIcon />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Shake Animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
      `}</style>

      {/* Password Reset Modal */}
      <PasswordResetModal 
        isOpen={showPasswordResetModal} 
        onClose={() => setShowPasswordResetModal(false)}
        onSuccess={() => {
          toast.success("Password reset successfully! Please log in with your new password.");
          setShowPasswordResetModal(false);
        }}
      />
    </div>
  );
};

export default LoginPage;