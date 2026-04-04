// ============================================================
// pages/VerifyOTPPage.js - OTP Verification Page
// Used for: Email verification after signup, Password reset OTP
// ============================================================

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const VerifyOTPPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Get email and purpose from navigation state
  const email = location.state?.email || "";
  const purpose = location.state?.purpose || "email-verification";

  // ---- OTP Input State (6 individual digit boxes) ----
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60); // 60 second cooldown for resend
  const [canResend, setCanResend] = useState(false);

  // Refs for auto-focus between OTP boxes
  const inputRefs = useRef([]);

  // ---- Countdown timer for resend ----
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  // ---- Handle OTP digit input ----
  const handleOTPChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take last character
    setOtp(newOtp);

    // Auto-focus next box when digit entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // ---- Handle backspace to go to previous box ----
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // ---- Handle paste (paste full OTP at once) ----
  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
    }
  };

  // ---- Submit OTP ----
  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP.");
      return;
    }

    setIsLoading(true);
    try {
      if (purpose === "password-reset") {
        // Verify OTP for password reset
        await authAPI.verifyResetOTP({ email, otp: otpString });
        toast.success("OTP verified! Set your new password.");
        navigate("/reset-password", { state: { email } });
      } else {
        // Verify OTP for email verification (after signup)
        const response = await authAPI.verifyOTP({ email, otp: otpString });
        const { accessToken, user } = response.data;
        login(accessToken, user, false);
        toast.success("Email verified! Welcome to Smart Assistant!");
        navigate(`/dashboard/${user.role}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ---- Resend OTP ----
  const handleResend = async () => {
    if (!canResend) return;
    try {
      await authAPI.resendOTP({ email, purpose });
      toast.success("New OTP sent to your email!");
      setResendTimer(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]); // Clear OTP boxes
      inputRefs.current[0]?.focus();
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-auth flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="card shadow-senior-lg text-center">
          {/* Icon */}
          <div className="text-6xl mb-4">📧</div>
          <h2 className="text-2xl font-bold text-primary mb-2">Check Your Email</h2>
          <p className="text-neutral-600 text-senior-base mb-2">
            We sent a 6-digit OTP to:
          </p>
          <p className="text-accent font-bold text-senior-lg mb-6">{email}</p>

          {/* OTP Input Boxes */}
          <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOTPChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-14 h-16 text-center text-2xl font-bold border-2 border-neutral-300 rounded-senior focus:border-accent focus:ring-0 outline-none transition-colors"
                autoFocus={index === 0}
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            className="btn-primary mb-4"
            disabled={isLoading || otp.join("").length !== 6}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>

          {/* Resend OTP */}
          <p className="text-neutral-500 text-senior-base">
            Didn't receive it?{" "}
            {canResend ? (
              <button onClick={handleResend} className="text-accent font-bold hover:underline">
                Resend OTP
              </button>
            ) : (
              <span className="text-neutral-400">Resend in {resendTimer}s</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTPPage;
