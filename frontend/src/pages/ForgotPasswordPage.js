import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
      return;
    }

    setIsLoading(true);
    try {
      await authAPI.forgotPassword({ email });
      toast.success("OTP sent to your email");
      navigate("/reset-password", { state: { email } });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-bg flex items-center justify-center min-h-screen p-4">
      <div className="auth-card w-full max-w-sm">
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1b4332", marginBottom: "8px", textAlign: "center" }}>
          Reset Password
        </h1>
        <p style={{ fontSize: "0.9rem", color: "#6b7280", textAlign: "center", marginBottom: "24px" }}>
          Enter your email to receive a password reset code
        </p>

        {error && <div style={{ backgroundColor: "#fde8ea", border: "1.5px solid #e63946", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", color: "#c1121f", fontSize: "0.9rem", fontWeight: 600 }}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label className="form-label">Email Address *</label>
            <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} className="form-input" placeholder="your@email.com" />
          </div>
          <button type="submit" className="btn-primary" disabled={isLoading}>{isLoading ? "Sending..." : "Send Reset Code"}</button>
        </form>

        <p style={{ textAlign: "center", fontSize: "0.9rem", color: "#6b7280", marginTop: "16px" }}>
          Remember your password?{" "}
          <button type="button" onClick={() => navigate("/login")} className="btn-ghost">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
