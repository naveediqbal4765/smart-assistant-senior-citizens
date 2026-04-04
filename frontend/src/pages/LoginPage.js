// ============================================================
// pages/LoginPage.js - Login Page
// Exact match to UserInterface1.png:
//   Left: Logo + title + description text (sideways layout)
//   Middle: Vertical divider line
//   Right: Rounded card with login form, OAuth buttons
// ============================================================

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";

// ---- SVG Logo: Green cross with red heart (from UI) ----
const AppLogo = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Cross shape */}
    <rect x="30" y="10" width="40" height="80" rx="8" fill="#52b788" />
    <rect x="10" y="30" width="80" height="40" rx="8" fill="#52b788" />
    {/* Inner lighter cross */}
    <rect x="34" y="14" width="32" height="72" rx="6" fill="#74c69d" />
    <rect x="14" y="34" width="72" height="32" rx="6" fill="#74c69d" />
    {/* White circle center */}
    <circle cx="50" cy="50" r="18" fill="white" />
    {/* Red heart */}
    <path
      d="M50 58 C50 58 38 50 38 43 C38 39 41 36 44.5 36 C46.5 36 48.5 37.2 50 39 C51.5 37.2 53.5 36 55.5 36 C59 36 62 39 62 43 C62 50 50 58 50 58Z"
      fill="#e63946"
    />
  </svg>
);

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
// LoginPage Component
// ============================================================
const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // ---- Form State ----
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [shakeForm, setShakeForm] = useState(false);

  // ---- Handle input changes ----
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ---- Client-side validation ----
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

  // ---- Handle Login Submit ----
  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate inputs
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

      // Store token and user in context
      login(accessToken, user, formData.rememberMe);

      toast.success(`Welcome back, ${user.fullName.split(" ")[0]}! 👋`);

      // Redirect to role-specific dashboard
      const dashboardRoutes = {
        elder: "/dashboard/elder",
        caregiver: "/dashboard/caregiver",
        volunteer: "/dashboard/volunteer",
      };
      navigate(dashboardRoutes[user.role] || "/dashboard/elder");
    } catch (error) {
      const message = error.response?.data?.message || "Login failed. Please try again.";

      // Show error inside the form (as per requirements)
      if (message.toLowerCase().includes("wrong") || message.toLowerCase().includes("password") || message.toLowerCase().includes("email")) {
        setErrors({ general: message });
      } else if (error.response?.data?.requiresVerification) {
        // Redirect to OTP verification
        toast.error("Please verify your email first.");
        navigate("/verify-otp", { state: { email: formData.email } });
        return;
      } else {
        setErrors({ general: message });
      }

      // Shake the form on error
      setShakeForm(true);
      setTimeout(() => setShakeForm(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  // ---- Handle OAuth Login ----
  const handleOAuth = (provider) => {
    // TODO: Integrate actual OAuth SDK (Google, Facebook, Apple)
    // For now, show a toast indicating the feature
    toast(`${provider} login coming soon! Use email/password for now.`, { icon: "ℹ️" });
  };

  // ============================================================
  // RENDER - SIDEWAYS LAYOUT (Left Content | Divider | Right Form)
  // ============================================================
  return (
    <div className="page-bg flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-0 md:gap-0 animate-fade-in">

        {/* ============================================================
            LEFT SIDE — Logo + Title + Description (SIDEWAYS)
            ============================================================ */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left px-4 md:px-8">
          {/* Large Logo */}
          <div className="mb-6">
            <AppLogo size={120} />
          </div>

          {/* App Title */}
          <h1
            style={{ fontWeight: 800, fontSize: "2.4rem", color: "#1b4332", lineHeight: 1.2, marginBottom: "1rem" }}
          >
            Smart Assistant for<br />Senior Citizens
          </h1>

          {/* Description (Lorem Ipsum placeholder as in UI) */}
          <p style={{ fontSize: "1rem", color: "#4a4a4a", lineHeight: 1.7, maxWidth: "380px" }}>
            <span style={{ color: "#2d6a4f", fontWeight: 700 }}>Lorem Ipsum</span> is simply dummy text of
            the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy
          </p>
        </div>

        {/* ---- VERTICAL DIVIDER (visible on desktop) ---- */}
        <div
          className="hidden md:block"
          style={{ width: "1px", height: "340px", backgroundColor: "#a8d5b5", flexShrink: 0 }}
        />

        {/* ============================================================
            RIGHT SIDE — Login Card (FORM)
            ============================================================ */}
        <div className="flex-1 flex justify-center w-full px-4 md:px-8">
          <div
            className={`auth-card w-full max-w-sm ${shakeForm ? "animate-shake" : ""}`}
            style={{ minWidth: "300px" }}
          >
            {/* Card Logo (small, centered) */}
            <div className="flex justify-center mb-6">
              <AppLogo size={56} />
            </div>

            {/* ---- General Error Message (shown inside form) ---- */}
            {errors.general && (
              <div
                className="animate-fade-in"
                style={{
                  backgroundColor: "#fde8ea",
                  border: "1.5px solid #e63946",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  marginBottom: "16px",
                  color: "#c1121f",
                  fontSize: "0.9rem",
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

            {/* ---- Login Form ---- */}
            <form onSubmit={handleLogin} noValidate>

              {/* Username / Email Field */}
              <div style={{ marginBottom: "16px" }}>
                <label className="form-label" htmlFor="email">
                  Username / Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? "error" : ""}`}
                  placeholder=""
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="error-msg">⚠️ {errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div style={{ marginBottom: "20px" }}>
                <label className="form-label" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? "error" : ""}`}
                  placeholder=""
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="error-msg">⚠️ {errors.password}</p>
                )}
              </div>

              {/* ---- Login + Sign Up Buttons (side by side as in UI1) ---- */}
              <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isLoading}
                  style={{ flex: 1 }}
                >
                  {isLoading ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                      <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="30 70" />
                      </svg>
                      Logging in...
                    </span>
                  ) : "Login"}
                </button>

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => navigate("/signup")}
                  disabled={isLoading}
                  style={{ flex: 1 }}
                >
                  Sign Up
                </button>
              </div>

              {/* ---- Remember Me + Reset Password (same row as UI1) ---- */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                }}
              >
                {/* Remember Me Checkbox */}
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    color: "#2d6a4f",
                    userSelect: "none",
                  }}
                >
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="custom-checkbox"
                    style={{ width: "18px", height: "18px" }}
                  />
                  Remember me
                </label>

                {/* Reset Password Link */}
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#2d6a4f",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    textDecoration: "underline",
                    padding: 0,
                  }}
                >
                  Reset password?
                </button>
              </div>

              {/* ---- OR Divider ---- */}
              <div className="or-divider">OR</div>

              {/* ---- OAuth Buttons (Google, Facebook, Apple) ---- */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "16px",
                  marginTop: "4px",
                }}
              >
                {/* Google */}
                <button
                  type="button"
                  className="btn-oauth"
                  onClick={() => handleOAuth("Google")}
                  title="Continue with Google"
                  aria-label="Continue with Google"
                >
                  <GoogleIcon />
                </button>

                {/* Facebook */}
                <button
                  type="button"
                  className="btn-oauth"
                  onClick={() => handleOAuth("Facebook")}
                  title="Continue with Facebook"
                  aria-label="Continue with Facebook"
                >
                  <FacebookIcon />
                </button>

                {/* Apple */}
                <button
                  type="button"
                  className="btn-oauth"
                  onClick={() => handleOAuth("Apple")}
                  title="Continue with Apple"
                  aria-label="Continue with Apple"
                >
                  <AppleIcon />
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
