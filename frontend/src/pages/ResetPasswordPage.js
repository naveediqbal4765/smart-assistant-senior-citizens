import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState("otp"); // otp or password
  const [email] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    setIsLoading(true);
    try {
      await authAPI.verifyResetOTP({ email, otp });
      setStep("password");
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true);
    try {
      await authAPI.resetPassword({ email, password });
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-bg flex items-center justify-center min-h-screen p-4">
      <div className="auth-card w-full max-w-sm">
        {step === "otp" ? (
          <>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1b4332", marginBottom: "8px", textAlign: "center" }}>
              Verify OTP
            </h1>
            <p style={{ fontSize: "0.9rem", color: "#6b7280", textAlign: "center", marginBottom: "24px" }}>
              Enter the 6-digit code sent to {email}
            </p>

            {error && <div style={{ backgroundColor: "#fde8ea", border: "1.5px solid #e63946", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", color: "#c1121f", fontSize: "0.9rem", fontWeight: 600 }}>⚠️ {error}</div>}

            <form onSubmit={handleVerifyOTP}>
              <div style={{ marginBottom: "20px" }}>
                <label className="form-label">OTP *</label>
                <input type="text" value={otp} onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }} className="form-input" placeholder="000000" maxLength="6" style={{ fontSize: "1.5rem", letterSpacing: "8px", textAlign: "center", fontWeight: 700 }} />
              </div>
              <button type="submit" className="btn-primary" disabled={isLoading}>{isLoading ? "Verifying..." : "Verify OTP"}</button>
            </form>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1b4332", marginBottom: "8px", textAlign: "center" }}>
              Set New Password
            </h1>
            <p style={{ fontSize: "0.9rem", color: "#6b7280", textAlign: "center", marginBottom: "24px" }}>
              Create a strong password for your account
            </p>

            {error && <div style={{ backgroundColor: "#fde8ea", border: "1.5px solid #e63946", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", color: "#c1121f", fontSize: "0.9rem", fontWeight: 600 }}>⚠️ {error}</div>}

            <form onSubmit={handleResetPassword}>
              <div style={{ marginBottom: "14px" }}>
                <label className="form-label">New Password *</label>
                <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} className="form-input" placeholder="" />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label className="form-label">Confirm Password *</label>
                <input type="password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }} className="form-input" placeholder="" />
              </div>
              <button type="submit" className="btn-primary" disabled={isLoading}>{isLoading ? "Resetting..." : "Reset Password"}</button>
            </form>
          </>
        )}

        <p style={{ textAlign: "center", fontSize: "0.9rem", color: "#6b7280", marginTop: "16px" }}>
          <button type="button" onClick={() => navigate("/login")} className="btn-ghost">
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
