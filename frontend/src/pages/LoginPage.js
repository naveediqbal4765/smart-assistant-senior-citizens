// ============================================================
// pages/LoginPage.js - Login Page
// MacBook Pro 16 Layout (1728x1117)
// Exact specifications from design file
// ============================================================

import React, { useState } from "react";
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

// ---- Google Icon ----
const GoogleIcon = () => (
  <svg width="55" height="55" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

// ---- Facebook Icon ----
const FacebookIcon = () => (
  <svg width="53" height="55" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#1877F2"/>
    <path d="M16.5 8H14.5C13.95 8 13.5 8.45 13.5 9V11H16.5L16 14H13.5V22H10.5V14H8.5V11H10.5V9C10.5 7.07 12.07 5.5 14 5.5H16.5V8Z" fill="white"/>
  </svg>
);

// ---- Apple Icon ----
const AppleIcon = () => (
  <svg width="55" height="55" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" fill="#000000"/>
  </svg>
);

// ============================================================
// LoginPage Component
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
      const response = await authAPI.login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      const { accessToken, user } = response.data;
      login(accessToken, user, formData.rememberMe);
      toast.success(`Welcome back, ${user.fullName.split(" ")[0]}! 👋`);

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
    toast(`${provider} login coming soon! Use email/password for now.`, { icon: "ℹ️" });
  };

  // ============================================================
  // RENDER - MacBook Pro 16 Layout
  // ============================================================
  return (
    <div style={{ fontFamily: "Montserrat, sans-serif" }}>
      {/* Top Border Rectangle - 1728x48 */}
      <div
        style={{
          width: "100%",
          height: "48px",
          backgroundColor: "#1C382A",
        }}
      />

      {/* Main Page Container - 1728x1117 */}
      <div
        style={{
          width: "100%",
          minHeight: "calc(100vh - 96px)",
          backgroundColor: "#A9C6B2",
          display: "flex",
          position: "relative",
          padding: "0",
        }}
      >
        {/* LEFT SIDE - Logo and Content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingTop: "224px",
          }}
        >
          {/* App Logo - 292x292, top: 224px, left: 274px */}
          <div
            style={{
              width: "292px",
              height: "292px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "33px",
            }}
          >
            <AppLogo size={292} />
          </div>

          {/* Title - Smart Assistant for Senior Citizens */}
          {/* 548x130, top: 549px, left: 145px */}
          <h1
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: "53px",
              lineHeight: "100%",
              letterSpacing: "0%",
              textAlign: "center",
              color: "#1C382A",
              margin: "0 0 32px 0",
              width: "548px",
              height: "130px",
            }}
          >
            Smart Assistant for<br />Senior Citizens
          </h1>

          {/* Description Text */}
          {/* 548x130 */}
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "32px",
              lineHeight: "100%",
              letterSpacing: "0%",
              textAlign: "center",
              color: "#1C382A",
              margin: "0",
              width: "548px",
            }}
          >
            <span style={{ fontWeight: 700 }}>Lorem Ipsum</span>
            <span style={{ fontWeight: 400 }}> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy</span>
          </p>
        </div>

        {/* RIGHT SIDE - Login Form Container */}
        {/* 542x810, top: 130px, left: 1023px, border-radius: 48px */}
        <div
          style={{
            position: "absolute",
            right: "103px",
            top: "130px",
            width: "542px",
            height: "810px",
            backgroundColor: "#BAE4C7",
            borderRadius: "48px",
            boxShadow: "9px 10px 20px 2px #00000040",
            padding: "0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Form Logo - 118x118, top: 196px, left: 1245px (centered in form) */}
          <div
            style={{
              width: "118px",
              height: "118px",
              marginTop: "66px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AppLogo size={118} />
          </div>

          {/* Error Message */}
          {errors.general && (
            <div
              style={{
                backgroundColor: "#fde8ea",
                border: "1.5px solid #e63946",
                borderRadius: "8px",
                padding: "10px 14px",
                marginTop: "20px",
                marginBottom: "16px",
                color: "#c1121f",
                fontSize: "0.9rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "Montserrat, sans-serif",
                width: "405px",
              }}
            >
              <span>⚠️</span>
              <span>{errors.general}</span>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleLogin}
            noValidate
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            {/* Username / Email Label - 192x20, top: 385px, left: 1091px */}
            <label
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 500,
                fontSize: "20px",
                lineHeight: "100%",
                letterSpacing: "0%",
                color: "#1C382A",
                alignSelf: "flex-start",
                marginLeft: "68px",
                marginBottom: "10px",
              }}
            >
              Username / Email
            </label>

            {/* Email Input - 405x54, top: 415px, left: 1091px */}
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: "405px",
                height: "54px",
                padding: "12px 14px",
                fontSize: "16px",
                backgroundColor: "#FFFFFF",
                color: "#1C382A",
                borderRadius: "6px",
                boxSizing: "border-box",
                fontFamily: "Montserrat, sans-serif",
                outline: "none",
                border: "none",
                transition: "all 0.3s ease",
                marginBottom: "16px",
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
              <p style={{ color: "#e63946", fontSize: "0.85rem", fontWeight: 600, marginTop: "-12px", marginBottom: "8px", fontFamily: "Montserrat, sans-serif", alignSelf: "flex-start", marginLeft: "68px" }}>
                ⚠️ {errors.email}
              </p>
            )}

            {/* Password Label */}
            <label
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 500,
                fontSize: "20px",
                lineHeight: "100%",
                letterSpacing: "0%",
                color: "#1C382A",
                alignSelf: "flex-start",
                marginLeft: "68px",
                marginBottom: "10px",
              }}
            >
              Password
            </label>

            {/* Password Input - 405x54 */}
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              style={{
                width: "405px",
                height: "54px",
                padding: "12px 14px",
                fontSize: "16px",
                backgroundColor: "#FFFFFF",
                color: "#1C382A",
                borderRadius: "6px",
                boxSizing: "border-box",
                fontFamily: "Montserrat, sans-serif",
                outline: "none",
                border: "none",
                transition: "all 0.3s ease",
                marginBottom: "16px",
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
              <p style={{ color: "#e63946", fontSize: "0.85rem", fontWeight: 600, marginTop: "-12px", marginBottom: "8px", fontFamily: "Montserrat, sans-serif", alignSelf: "flex-start", marginLeft: "68px" }}>
                ⚠️ {errors.password}
              </p>
            )}

            {/* Login and Sign Up Buttons - top: 635px */}
            <div
              style={{
                display: "flex",
                gap: "30px",
                marginBottom: "20px",
                marginTop: "20px",
              }}
            >
              {/* Login Button - 107x41, top: 635px, left: 1176px */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: "107px",
                  height: "41px",
                  padding: "0",
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  backgroundColor: "#1C382A",
                  borderRadius: "6px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  opacity: isLoading ? 0.7 : 1,
                  fontFamily: "Montserrat, sans-serif",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
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

              {/* Sign Up Button - 99x29, top: 641px, left: 1313px, transparent */}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                disabled={isLoading}
                style={{
                  width: "99px",
                  height: "29px",
                  padding: "0",
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#1C382A",
                  backgroundColor: "transparent",
                  borderRadius: "6px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  fontFamily: "Montserrat, sans-serif",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
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

            {/* Remember Me and Reset Password - top: 728px */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "405px",
                marginBottom: "20px",
              }}
            >
              {/* Remember Me Checkbox - 21x19, top: 728px, left: 1092px */}
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  fontSize: "15px",
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
                    width: "21px",
                    height: "19px",
                    cursor: "pointer",
                    accentColor: "#1C382A",
                    border: "none",
                    borderRadius: "3px",
                  }}
                />
                Remember me
              </label>

              {/* Reset Password - top: 730px */}
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#1C382A",
                  fontSize: "15px",
                  fontWeight: 500,
                  cursor: "pointer",
                  textDecoration: "underline",
                  padding: "0",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                Reset Password?
              </button>
            </div>

            {/* OR Divider - top: 791px */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "405px",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              {/* Left Line - 129x1, top: 791px, left: 1143px */}
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  backgroundColor: "#1C382A",
                }}
              />
              {/* OR Text */}
              <span
                style={{
                  color: "#1C382A",
                  fontSize: "14px",
                  fontWeight: 400,
                  fontFamily: "Montserrat, sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                OR
              </span>
              {/* Right Line - 129x1, top: 791px, left: 1316px */}
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  backgroundColor: "#1C382A",
                }}
              />
            </div>

            {/* OAuth Buttons - top: 837px */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "30px",
                marginTop: "4px",
              }}
            >
              {/* Google - 55x55, top: 837px, left: 1176px */}
              <button
                type="button"
                onClick={() => handleOAuth("Google")}
                title="Continue with Google"
                aria-label="Continue with Google"
                style={{
                  padding: "0",
                  backgroundColor: "transparent",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                  border: "none",
                  width: "55px",
                  height: "55px",
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

              {/* Facebook - 53x55, top: 837px, left: 1270px */}
              <button
                type="button"
                onClick={() => handleOAuth("Facebook")}
                title="Continue with Facebook"
                aria-label="Continue with Facebook"
                style={{
                  padding: "0",
                  backgroundColor: "transparent",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                  border: "none",
                  width: "53px",
                  height: "55px",
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

              {/* Apple - 55x55, top: 837px, left: 1362px */}
              <button
                type="button"
                onClick={() => handleOAuth("Apple")}
                title="Continue with Apple"
                aria-label="Continue with Apple"
                style={{
                  padding: "0",
                  backgroundColor: "transparent",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                  border: "none",
                  width: "55px",
                  height: "55px",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#1C382A15";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                <AppleIcon />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Bottom Border Rectangle - 1728x48 */}
      <div
        style={{
          width: "100%",
          height: "48px",
          backgroundColor: "#1C382A",
        }}
      />
    </div>
  );
};

export default LoginPage;
