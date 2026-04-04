// ============================================================
// pages/LoginPage.js - Login Page
// Matches the design from UserInterface1.png
// Handles: Email/Password login, OAuth, Remember Me, Reset Password
// ============================================================

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaApple } from "react-icons/fa";

// ============================================================
// LoginPage Component
// ============================================================
const LoginPage = () => {
  const navigate = useNavigate();
  const { login, getDashboardRoute } = useAuth();

  // ---- Form State ----
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const [isLoading, setIsLoading] = useState(false);       // Loading state during API call
  const [errors, setErrors] = useState({});                // Field-level error messages

  // ---- Handle input changes ----
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ---- Client-side validation ----
  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Enter a valid email";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // True if no errors
  };

  // ---- Handle Login Form Submit ----
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return; // Stop if validation fails

    setIsLoading(true);
    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      const { accessToken, user } = response.data;

      // Store auth state
      login(accessToken, user, formData.rememberMe);

      toast.success(`Welcome back, ${user.fullName}!`);

      // Redirect to role-specific dashboard
      navigate(getDashboardRoute(user.role));
    } catch (error) {
      const message = error.response?.data?.message || "Login failed. Please try again.";

      // Show error in the form fields (as per requirements)
      if (message.includes("email or password")) {
        setErrors({
          email: "Entered wrong email or password",
          password: "Entered wrong email or password",
        });
      } else if (error.response?.data?.requiresVerification) {
        // Redirect to OTP verification if email not verified
        toast.error("Please verify your email first.");
        navigate("/verify-otp", { state: { email: formData.email } });
      } else {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ---- Handle OAuth Login (Google, Facebook, Apple) ----
  const handleOAuthLogin = async (provider) => {
    // TODO: Integrate actual OAuth SDK (Google OAuth, Facebook SDK, Apple Sign-In)
    // For now, show a placeholder message
    toast(`${provider} login coming soon! Please use email/password for now.`, {
      icon: "ℹ️",
    });
    // Example flow:
    // 1. Open OAuth popup/redirect
    // 2. Get provider token and user info
    // 3. Call authAPI.oauthLogin({ provider, providerId, email, fullName })
    // 4. If user exists → login; if not → redirect to signup with prefilled data
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="min-h-screen bg-auth flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">

        {/* ---- Logo & Title ---- */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-accent rounded-full mb-4 shadow-senior-lg">
            {/* Placeholder logo - replace with actual logo */}
            <span className="text-white text-4xl">🏥</span>
          </div>
          <h1 className="text-white text-3xl font-bold">Smart Assistant</h1>
          <p className="text-neutral-300 text-senior-base mt-1">For Senior Citizens</p>
        </div>

        {/* ---- Login Card ---- */}
        <div className="card shadow-senior-lg">
          <h2 className="text-primary text-2xl font-bold text-center mb-6">Welcome Back</h2>

          <form onSubmit={handleLogin} noValidate>

            {/* ---- Email Field ---- */}
            <div className="mb-5">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`input-field ${errors.email ? "input-error" : ""}`}
                autoComplete="email"
                disabled={isLoading}
              />
              {/* Show error message inside/below field as per requirements */}
              {errors.email && (
                <p className="error-text">{errors.email}</p>
              )}
            </div>

            {/* ---- Password Field ---- */}
            <div className="mb-5">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`input-field pr-14 ${errors.password ? "input-error" : ""}`}
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                {/* Toggle password visibility button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-primary transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash size={22} /> : <FaEye size={22} />}
                </button>
              </div>
              {errors.password && (
                <p className="error-text">{errors.password}</p>
              )}
            </div>

            {/* ---- Remember Me + Forgot Password Row ---- */}
            <div className="flex items-center justify-between mb-6">
              {/* Remember Me Checkbox */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-5 h-5 rounded accent-accent cursor-pointer"
                />
                <span className="text-neutral-600 text-senior-base font-medium">Remember Me</span>
              </label>

              {/* Reset Password Link */}
              <Link
                to="/forgot-password"
                className="text-accent font-semibold text-senior-base hover:underline"
              >
                Reset Password
              </Link>
            </div>

            {/* ---- Login Button ---- */}
            <button
              type="submit"
              className="btn-primary mb-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>

            {/* ---- Signup Button ---- */}
            <Link to="/signup">
              <button type="button" className="btn-secondary mb-6">
                Create New Account
              </button>
            </Link>

            {/* ---- Divider ---- */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-neutral-200" />
              <span className="text-neutral-400 text-sm font-medium">OR CONTINUE WITH</span>
              <div className="flex-1 h-px bg-neutral-200" />
            </div>

            {/* ---- OAuth Buttons (Google, Facebook, Apple) ---- */}
            <div className="grid grid-cols-3 gap-3">
              {/* Google */}
              <button
                type="button"
                onClick={() => handleOAuthLogin("Google")}
                className="flex items-center justify-center gap-2 border-2 border-neutral-200 rounded-senior py-3 px-4 hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-200 font-semibold text-neutral-700"
                aria-label="Login with Google"
              >
                <FaGoogle size={22} className="text-red-500" />
                <span className="hidden sm:inline text-sm">Google</span>
              </button>

              {/* Facebook */}
              <button
                type="button"
                onClick={() => handleOAuthLogin("Facebook")}
                className="flex items-center justify-center gap-2 border-2 border-neutral-200 rounded-senior py-3 px-4 hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-200 font-semibold text-neutral-700"
                aria-label="Login with Facebook"
              >
                <FaFacebook size={22} className="text-blue-600" />
                <span className="hidden sm:inline text-sm">Facebook</span>
              </button>

              {/* Apple */}
              <button
                type="button"
                onClick={() => handleOAuthLogin("Apple")}
                className="flex items-center justify-center gap-2 border-2 border-neutral-200 rounded-senior py-3 px-4 hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-200 font-semibold text-neutral-700"
                aria-label="Login with Apple ID"
              >
                <FaApple size={22} className="text-neutral-900" />
                <span className="hidden sm:inline text-sm">Apple</span>
              </button>
            </div>
          </form>
        </div>

        {/* ---- Footer ---- */}
        <p className="text-center text-neutral-400 text-sm mt-6">
          Smart Assistant for Senior Citizens © 2026 | SZABIST University
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
