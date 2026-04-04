import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.login({ email, password, rememberMe });
      const { accessToken, user } = response.data;
      login(accessToken, user, rememberMe);
      toast.success("Login successful!");
      navigate(`/dashboard/${user.role}`);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Login failed";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif" }}>
      {/* Top Border Rectangle */}
      <div
        style={{
          width: "100%",
          height: "45px",
          backgroundColor: "#1C382A",
        }}
      />

      {/* Main Page Background */}
      <div
        style={{
          minHeight: "calc(100vh - 90px)",
          backgroundColor: "#E2FFEB",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
        }}
      >
        {/* Page Title and Subtitle */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: 700,
              color: "#1C382A",
              margin: "0 0 10px 0",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Smart Assistant
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              color: "#1C382A",
              margin: "0 0 20px 0",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            For Senior Citizens
          </p>

          {/* Divider Line */}
          <div
            style={{
              width: "300px",
              height: "2px",
              backgroundColor: "#1C382A4D",
              margin: "20px auto",
            }}
          />

          <p
            style={{
              fontSize: "1rem",
              color: "#1C382A",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Welcome Back! Please login to your account
          </p>
        </div>

        {/* Login Form Card */}
        <div
          style={{
            backgroundColor: "#BAE4C7",
            borderRadius: "16px",
            padding: "40px",
            width: "100%",
            maxWidth: "450px",
            boxShadow: "9px 10px 20px 2px #00000040",
          }}
        >
          {/* Error Message */}
          {error && (
            <div
              style={{
                backgroundColor: "#FFE5E5",
                border: "2px solid #FF6B6B",
                borderRadius: "8px",
                padding: "12px 16px",
                marginBottom: "20px",
                color: "#C92A2A",
                fontSize: "0.95rem",
                fontWeight: 600,
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* Email Field */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "#1C382A",
                  marginBottom: "8px",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="your@email.com"
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  fontSize: "1rem",
                  backgroundColor: "#FFFFFF",
                  color: "#1C382A",
                  borderRadius: "8px",
                  boxSizing: "border-box",
                  fontFamily: "Montserrat, sans-serif",
                  outline: "none",
                  border: "none",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => {
                  e.target.style.boxShadow = "0 0 0 3px #1C382A40";
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "#1C382A",
                  marginBottom: "8px",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  fontSize: "1rem",
                  backgroundColor: "#FFFFFF",
                  color: "#1C382A",
                  borderRadius: "8px",
                  boxSizing: "border-box",
                  fontFamily: "Montserrat, sans-serif",
                  outline: "none",
                  border: "none",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => {
                  e.target.style.boxShadow = "0 0 0 3px #1C382A40";
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Remember Me Checkbox */}
            <div style={{ marginBottom: "24px", display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                  accentColor: "#1C382A",
                  border: "none",
                }}
              />
              <label
                htmlFor="rememberMe"
                style={{
                  marginLeft: "10px",
                  fontSize: "1rem",
                  color: "#1C382A",
                  cursor: "pointer",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 500,
                }}
              >
                Remember Me
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "14px 20px",
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "#FFFFFF",
                backgroundColor: "#1C382A",
                borderRadius: "8px",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                opacity: isLoading ? 0.7 : 1,
                fontFamily: "Montserrat, sans-serif",
                border: "none",
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = "#0F1F1A";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 8px 16px #00000030";
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#1C382A";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              {isLoading ? "Logging in..." : "LOGIN"}
            </button>
          </form>

          {/* Forgot Password & Sign Up Links */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "20px",
              fontSize: "0.95rem",
            }}
          >
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              style={{
                background: "none",
                border: "none",
                color: "#1C382A",
                cursor: "pointer",
                textDecoration: "underline",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 500,
                fontSize: "0.95rem",
              }}
            >
              Forgot Password?
            </button>
            <button
              type="button"
              onClick={() => navigate("/signup")}
              style={{
                background: "none",
                border: "none",
                color: "#1C382A",
                cursor: "pointer",
                textDecoration: "underline",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 500,
                fontSize: "0.95rem",
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "24px 0",
              gap: "12px",
            }}
          >
            <div
              style={{
                flex: 1,
                height: "1px",
                backgroundColor: "#1C382A4D",
              }}
            />
            <span
              style={{
                color: "#1C382A",
                fontSize: "0.9rem",
                fontWeight: 500,
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              OR
            </span>
            <div
              style={{
                flex: 1,
                height: "1px",
                backgroundColor: "#1C382A4D",
              }}
            />
          </div>

          {/* OAuth Buttons */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "12px",
            }}
          >
            {/* Google Button */}
            <button
              type="button"
              style={{
                padding: "12px",
                backgroundColor: "transparent",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
                fontSize: "1.5rem",
                border: "none",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#1C382A15";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
              title="Login with Google"
            >
              🔵
            </button>

            {/* Facebook Button */}
            <button
              type="button"
              style={{
                padding: "12px",
                backgroundColor: "transparent",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
                fontSize: "1.5rem",
                border: "none",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#1C382A15";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
              title="Login with Facebook"
            >
              📘
            </button>

            {/* Apple Button */}
            <button
              type="button"
              style={{
                padding: "12px",
                backgroundColor: "transparent",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
                fontSize: "1.5rem",
                border: "none",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#1C382A15";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
              title="Login with Apple"
            >
              🍎
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Border Rectangle */}
      <div
        style={{
          width: "100%",
          height: "45px",
          backgroundColor: "#1C382A",
        }}
      />
    </div>
  );
};

export default LoginPage;
