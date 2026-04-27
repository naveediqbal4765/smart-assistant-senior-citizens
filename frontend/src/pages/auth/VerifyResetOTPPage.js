import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { verifyResetOTP, handleAPIError } from "../../services/apiClient";
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

const VerifyResetOTPPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  // ============================================================
  // Timer for OTP expiry
  // ============================================================
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // ============================================================
  // Format time remaining
  // ============================================================
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // ============================================================
  // Handle OTP Verification
  // ============================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate inputs
    if (!email) {
      setError("Email is required");
      return;
    }

    if (!otp) {
      setError("OTP is required");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    if (timeLeft <= 0) {
      setError("OTP has expired. Please request a new one.");
      return;
    }

    setIsLoading(true);
    try {
      // Call backend API
      const response = await verifyResetOTP(email, otp);

      if (response.data.success) {
        toast.success("OTP verified successfully!");
        
        // Redirect to reset password page with reset token
        navigate("/reset-password", {
          state: {
            email,
            resetToken: response.data.data.resetToken,
          },
        });
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
  // Handle OTP Input Change
  // ============================================================
  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
    setError("");
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
            Verify OTP
          </h1>
          <p style={{ fontSize: "14px", color: COLORS.darkGray, textAlign: "center", margin: "0 0 24px 0" }}>
            Enter the 6-digit code sent to your email
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

          {/* Timer */}
          <div
            style={{
              backgroundColor: timeLeft <= 60 ? "#fff3cd" : COLORS.lightGray,
              border: `1.5px solid ${timeLeft <= 60 ? COLORS.yellow : COLORS.veryLightGreen}`,
              borderRadius: "8px",
              padding: "10px 14px",
              marginBottom: "16px",
              textAlign: "center",
              fontSize: "13px",
              fontWeight: 600,
              color: timeLeft <= 60 ? "#856404" : COLORS.darkGray,
            }}
          >
            ⏱️ OTP expires in: <span style={{ fontSize: "16px", fontWeight: 700 }}>{formatTime(timeLeft)}</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* OTP Input */}
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
                Enter OTP *
              </label>
              <input
                type="text"
                value={otp}
                onChange={handleOtpChange}
                placeholder="000000"
                maxLength="6"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: `2px solid ${COLORS.veryLightGreen}`,
                  borderRadius: "8px",
                  fontSize: "24px",
                  fontFamily: "monospace",
                  boxSizing: "border-box",
                  color: COLORS.darkGreen,
                  textAlign: "center",
                  letterSpacing: "8px",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => (e.target.style.borderColor = COLORS.mediumGreen)}
                onBlur={(e) => (e.target.style.borderColor = COLORS.veryLightGreen)}
              />
              <p style={{ fontSize: "12px", color: COLORS.darkGray, margin: "8px 0 0 0", textAlign: "center" }}>
                {otp.length}/6 digits entered
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || otp.length !== 6 || timeLeft <= 0}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: otp.length === 6 && timeLeft > 0 ? COLORS.mediumGreen : COLORS.darkGray,
                color: COLORS.white,
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 600,
                fontFamily: "Montserrat, sans-serif",
                cursor: otp.length === 6 && timeLeft > 0 && !isLoading ? "pointer" : "not-allowed",
                opacity: otp.length === 6 && timeLeft > 0 && !isLoading ? 1 : 0.7,
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                if (otp.length === 6 && timeLeft > 0 && !isLoading) {
                  e.target.style.backgroundColor = COLORS.darkMediumGreen;
                }
              }}
              onMouseLeave={(e) => {
                if (otp.length === 6 && timeLeft > 0 && !isLoading) {
                  e.target.style.backgroundColor = COLORS.mediumGreen;
                }
              }}
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          {/* Back Button */}
          <p style={{ textAlign: "center", fontSize: "12px", color: COLORS.darkGray, marginTop: "16px" }}>
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
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
              Back to Forgot Password
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyResetOTPPage;
