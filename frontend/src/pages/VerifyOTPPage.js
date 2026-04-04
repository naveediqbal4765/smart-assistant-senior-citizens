// ============================================================
// pages/VerifyOTPPage.js - OTP Verification Page
// ============================================================

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

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
    <div className="page-bg flex items-center justify-center min-h-screen p-4">
      <div className="auth-card w-full max-w-sm">
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1b4332", marginBottom: "8px", textAlign: "center" }}>
          Verify Your Email
        </h1>
        <p style={{ fontSize: "0.9rem", color: "#6b7280", textAlign: "center", marginBottom: "24px" }}>
          We sent a 6-digit code to {email}
        </p>

        {error && (
          <div style={{ backgroundColor: "#fde8ea", border: "1.5px solid #e63946", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", color: "#c1121f", fontSize: "0.9rem", fontWeight: 600 }}>
            ⚠️ {error}
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
  );
};

export default VerifyOTPPage;
