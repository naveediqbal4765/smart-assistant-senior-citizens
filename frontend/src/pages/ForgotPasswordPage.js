// ============================================================
// pages/ForgotPasswordPage.js - Forgot Password Page
// User enters email → OTP sent → redirected to VerifyOTPPage
// ============================================================

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      await authAPI.forgotPassword({ email });
      toast.success("If this email exists, an OTP has been sent.");
      // Redirect to OTP verification for password reset
      navigate("/verify-otp", { state: { email, purpose: "password-reset" } });
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-auth flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="card shadow-senior-lg">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🔐</div>
            <h2 className="text-2xl font-bold text-primary">Reset Password</h2>
            <p className="text-neutral-600 text-senior-base mt-2">
              Enter your email and we'll send you a one-time password (OTP) to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="Enter your registered email"
                className={`input-field ${error ? "input-error" : ""}`}
                autoFocus
              />
              {error && <p className="error-text">{error}</p>}
            </div>

            <button type="submit" className="btn-primary mb-4" disabled={isLoading}>
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>

          <Link to="/login" className="flex items-center justify-center gap-2 text-neutral-500 hover:text-primary font-semibold transition-colors">
            <FaArrowLeft /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
