// ============================================================
// pages/VerifyOTPPage.js - OTP Verification Page
// ============================================================

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
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

const VerifyOTPPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.verifyOTP({ email, otp });
      const { accessToken, user } = response.data;
      login(accessToken, user);
      toast.success("Email verified! Welcome!");
      navigate("/dashboard/elder");
    } catch (error) {
      setError(error.response?.data?.message || "Invalid OTP");
      toast.error("OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await authAPI.resendOTP({ email, purpose: "email-verification" });
      toast.success("OTP sent to your email");
    } catch (error) {
      toast.error("Failed to resend OTP");
    }
  };

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
        <AppLogo size={Math.min(Math.max(32, window.innerWidth * 0.04), 48)} />
        <div style={{ minWidth: "0", flex: "1 1 auto" }}>
          <h1 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "clamp(16px, 3vw, 22px)", color: "#FFFFFF", margin: "0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            Smart Assistant
          </h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 400, fontSize: "clamp(10px, 1.5vw, 13px)", color: "#BAE4C7", margin: "0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            Care for Seniors, By Community
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px",
          paddingTop: "clamp(100px, 20vw, 150px)", backgroundColor: "#A9C6B2", minHeight: "100vh", width: "100%", boxSizing: "border-box" }}>
        <div className="auth-card w-full max-w-sm">
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1b4332", marginBottom: "8px", textAlign: "center" }}>
          Verify Your Email
        </h1>
        <p style={{ fontSize: "0.9rem", color: "#6b7280", textAlign: "center", marginBottom: "24px" }}>
          We sent a 6-digit code to {email}
        </p>

        {error && (
          <div style={{ backgroundColor: "#fde8ea", border: "1.5px solid #e63946", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", color: "#c1121f", fontSize: "0.9rem", fontWeight: 600 }}>
            [Warning] {error}
          </div>
        )}

        <form onSubmit={handleVerify}>
          <div style={{ marginBottom: "20px" }}>
            <label className="form-label">Enter OTP *</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                setError("");
              }}
              className="form-input"
              placeholder="000000"
              maxLength="6"
              style={{ fontSize: "1.5rem", letterSpacing: "8px", textAlign: "center", fontWeight: 700 }}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "0.9rem", color: "#6b7280", marginTop: "16px" }}>
          Didn't receive the code?{" "}
          <button type="button" onClick={handleResend} className="btn-ghost">
            Resend OTP
          </button>
        </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTPPage;
