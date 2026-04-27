import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { resetPassword, handleAPIError } from "../../services/apiClient";
import Logo from "../../assets/images/Logo.png";

const COLORS = {
  darkGreen: "#1C382A",
  mediumGreen: "#52b788",
  darkMediumGreen: "#2d6a4f",
  veryLightGreen: "#BAE4C7",
  white: "#FFFFFF",
  lightGray: "#f5f5f5",
  darkGray: "#666666",
  red: "#e63946",
  yellow: "#FFC107",
};

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [resetToken, setResetToken] = useState(location.state?.resetToken || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  // ============================================================
  // Check Password Strength
  // ============================================================
  const checkPasswordStrength = (password) => {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;

    return strength;
  };

  // ============================================================
  // Handle Password Change
  // ============================================================
  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);
    setPasswordStrength(checkPasswordStrength(password));
    setError("");
  };

  // ============================================================
  // Handle Submit
  // ============================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate inputs
    if (!email || !resetToken) {
      setError("Invalid reset request. Please start over.");
      navigate("/forgot-password");
      return;
    }

    if (!newPassword) {
      setError("New password is required");
      return;
    }

    if (!confirmPassword) {
      setError("Please confirm your password");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      // Call backend API
      const response = await resetPassword(email, resetToken, newPassword, confirmPassword);

      if (response.data.success) {
        toast.success("Password reset successfully!");
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      const apiError = handleAPIError(err);
      setError(apiError.message);
      toast.error(apiError.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // Get Password Strength Color
  // ============================================================
  const getStrengthColor = () => {
    if (passwordStrength === 0) return COLORS.darkGray;
    if (passwordStrength <= 2) return COLORS.red;
    if (passwordStrength <= 3) return COLORS.yellow;
    return COLORS.mediumGreen;
  };

  // ============================================================
  // Get Password Strength Text
  // ============================================================
  const getStrengthText = () => {
    if (passwordStrength === 0) return "No password";
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 3) return "Fair";
    return "Strong";
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
          backgroundColor: COLORS.darkGreen,
          padding: "clamp(12px, 2vw, 20px) clamp(16px, 4vw, 40px)",
          display: "flex",
          alignItems: "center",
          gap: "clamp(8px, 2vw, 16px)",
          zIndex: 10,
          flexWrap: "wrap",
          justifyContent: "flex-start",
        }}
      >
        <img src={Logo} alt="Logo" style={{ height: Math.min(Math.max(32, window.innerWidth * 0.04), 48), width: "auto" }} />
        <div style={{ minWidth: "0", flex: "1 1 auto" }}>
          <h1 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "clamp(16px, 3vw, 22px)", color: COLORS.white, margin: "0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            Smart Assistant
          </h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 400, fontSize: "clamp(10px, 1.5vw, 13px)", color: COLORS.veryLightGreen, margin: "0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            Care for Seniors, By Community
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          paddingTop: "clamp(100px, 20vw, 150px)",
          backgroundColor: "#A9C6B2",
          minHeight: "100vh",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            backgroundColor: COLORS.white,
            borderRadius: "12px",
            padding: "40px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            width: "100%",
            maxWidth: "400px",
          }}
        >
          {/* Title */}
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: COLORS.darkGreen, margin: "0 0 8px 0", textAlign: "center" }}>
            Set New Password
          </h1>
          <p style={{ fontSize: "14px", color: COLORS.darkGray, textAlign: "center", margin: "0 0 24px 0" }}>
            Create a strong password for your account
          </p>

          {/* Error Message */}
          {error && (
            <div
              style={{
                backgroundColor: "#fde8ea",
                border: `1.5px solid ${COLORS.red}`,
                borderRadius: "8px",
                padding: "10px 14px",
                marginBottom: "16px",
                color: "#c1121f",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* New Password Input */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: COLORS.darkGreen,
                  marginBottom: "8px",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                New Password *
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  style={{
                    width: "100%",
                    padding: "12px 40px 12px 12px",
                    border: `2px solid ${COLORS.veryLightGreen}`,
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "Montserrat, sans-serif",
                    boxSizing: "border-box",
                    color: COLORS.darkGreen,
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = COLORS.mediumGreen)}
                  onBlur={(e) => (e.target.style.borderColor = COLORS.veryLightGreen)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "18px",
                  }}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {newPassword && (
                <div style={{ marginTop: "8px" }}>
                  <div
                    style={{
                      height: "4px",
                      backgroundColor: COLORS.lightGray,
                      borderRadius: "2px",
                      overflow: "hidden",
                      marginBottom: "4px",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${(passwordStrength / 5) * 100}%`,
                        backgroundColor: getStrengthColor(),
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                  <p style={{ fontSize: "11px", color: getStrengthColor(), margin: "0", fontWeight: 600 }}>
                    Password strength: {getStrengthText()}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: COLORS.darkGreen,
                  marginBottom: "8px",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                Confirm Password *
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Confirm password"
                  style={{
                    width: "100%",
                    padding: "12px 40px 12px 12px",
                    border: `2px solid ${confirmPassword && newPassword === confirmPassword ? COLORS.mediumGreen : COLORS.veryLightGreen}`,
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "Montserrat, sans-serif",
                    boxSizing: "border-box",
                    color: COLORS.darkGreen,
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = COLORS.mediumGreen)}
                  onBlur={(e) => (e.target.style.borderColor = confirmPassword && newPassword === confirmPassword ? COLORS.mediumGreen : COLORS.veryLightGreen)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "18px",
                  }}
                >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>

              {/* Password Match Indicator */}
              {confirmPassword && (
                <p
                  style={{
                    fontSize: "11px",
                    color: newPassword === confirmPassword ? COLORS.mediumGreen : COLORS.red,
                    margin: "4px 0 0 0",
                    fontWeight: 600,
                  }}
                >
                  {newPassword === confirmPassword ? "✅ Passwords match" : "❌ Passwords do not match"}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: newPassword && confirmPassword && newPassword === confirmPassword ? COLORS.mediumGreen : COLORS.darkGray,
                color: COLORS.white,
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 600,
                fontFamily: "Montserrat, sans-serif",
                cursor: newPassword && confirmPassword && newPassword === confirmPassword && !isLoading ? "pointer" : "not-allowed",
                opacity: newPassword && confirmPassword && newPassword === confirmPassword && !isLoading ? 1 : 0.7,
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                if (newPassword && confirmPassword && newPassword === confirmPassword && !isLoading) {
                  e.target.style.backgroundColor = COLORS.darkMediumGreen;
                }
              }}
              onMouseLeave={(e) => {
                if (newPassword && confirmPassword && newPassword === confirmPassword && !isLoading) {
                  e.target.style.backgroundColor = COLORS.mediumGreen;
                }
              }}
            >
              {isLoading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>

          {/* Back to Login */}
          <p style={{ textAlign: "center", fontSize: "12px", color: COLORS.darkGray, marginTop: "16px" }}>
            Remember your password?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              style={{
                background: "none",
                border: "none",
                color: COLORS.mediumGreen,
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "12px",
                fontFamily: "Montserrat, sans-serif",
                textDecoration: "underline",
              }}
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
