// ============================================================
// frontend/src/components/GoogleLoginButton.js
// Google OAuth Login Button Component
// Handles Google token generation and login
// ============================================================

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

/**
 * Google Login Button Component
 * Integrates Google OAuth 2.0 for authentication
 *
 * @param {Function} onSuccess - Callback on successful login
 * @param {Function} onError - Callback on login error
 * @param {boolean} rememberMe - Whether to enable Remember Me
 */
const GoogleLoginButton = ({ onSuccess, onError, rememberMe = false }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false);

  // Load Google Script
  useEffect(() => {
    // Check if Google script is already loaded
    if (window.google) {
      setGoogleScriptLoaded(true);
      return;
    }

    // Load Google script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setGoogleScriptLoaded(true);
      initializeGoogleButton();
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Initialize Google Button
  useEffect(() => {
    if (googleScriptLoaded) {
      initializeGoogleButton();
    }
  }, [googleScriptLoaded]);

  /**
   * Initialize Google Sign-In Button
   */
  const initializeGoogleButton = () => {
    if (!window.google) {
      console.warn("[Google Login] Google script not loaded");
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
      });

      // Render button
      const buttonElement = document.getElementById("google-signin-button");
      if (buttonElement) {
        window.google.accounts.id.renderButton(buttonElement, {
          theme: "outline",
          size: "large",
          width: "100%",
          text: "signin_with",
        });
      }
    } catch (error) {
      console.error("[Google Login] Error initializing button:", error);
    }
  };

  /**
   * Handle Google Response
   * Called when user completes Google sign-in
   *
   * @param {Object} response - Google response object
   */
  const handleGoogleResponse = async (response) => {
    try {
      setIsLoading(true);

      if (!response.credential) {
        throw new Error("No credential received from Google");
      }

      // Get CSRF token from meta tag or localStorage
      let csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
      if (!csrfToken) {
        csrfToken = localStorage.getItem("csrfToken") || "";
      }

      // Send token to backend
      const result = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/auth/google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
          },
          credentials: "include",
          body: JSON.stringify({
            token: response.credential,
            rememberMe,
          }),
        }
      );

      const data = await result.json();

      if (!result.ok) {
        throw new Error(data.message || "Google login failed");
      }

      // Login user
      const { accessToken, refreshToken, rememberMeToken, user } = data.data;

      login(accessToken, user, refreshToken, rememberMe);

      // Store tokens
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      if (rememberMeToken) {
        localStorage.setItem("rememberMeToken", rememberMeToken);
      }

      // Call success callback
      if (onSuccess) {
        onSuccess(user);
      }

      // Check if new user without role - redirect to role selection
      if (data.data.isNewUser && !user.role) {
        navigate("/select-role", {
          state: {
            userId: user.userId,
            email: user.email,
            fullName: user.fullName,
            profilePicture: user.profilePicture,
            accessToken,
          },
        });
      } else {
        // Existing user - redirect to dashboard
        const dashboardPath = `/dashboard/${user.role}`;
        navigate(dashboardPath);
      }
    } catch (error) {
      console.error("[Google Login] Error:", error);
      toast.error(error.message || "Google login failed");

      // Call error callback
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle manual Google login
   * Used if button doesn't work
   */
  const handleManualGoogleLogin = async () => {
    try {
      setIsLoading(true);

      if (!window.google) {
        throw new Error("Google script not loaded");
      }

      // Trigger Google sign-in
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log("[Google Login] Prompt not displayed");
        }
      });
    } catch (error) {
      console.error("[Google Login] Manual login error:", error);
      toast.error("Failed to open Google login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Google Sign-In Button */}
      <div
        id="google-signin-button"
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "16px",
        }}
      />

      {/* Fallback Button */}
      {!googleScriptLoaded && (
        <button
          onClick={handleManualGoogleLogin}
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#4285F4",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: isLoading ? "not-allowed" : "pointer",
            fontWeight: 600,
            fontSize: "14px",
            fontFamily: "Montserrat, sans-serif",
            opacity: isLoading ? 0.7 : 1,
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.target.style.backgroundColor = "#357ae8";
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#4285F4";
          }}
        >
          {isLoading ? "Signing in..." : "Sign in with Google"}
        </button>
      )}
    </div>
  );
};

export default GoogleLoginButton;
