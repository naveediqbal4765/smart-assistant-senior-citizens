// ============================================================
// frontend/src/components/FacebookLoginButton.js
// Facebook OAuth Login Button Component
// Handles Facebook token generation and login
// ============================================================

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

/**
 * Facebook Login Button Component
 * Integrates Facebook OAuth 2.0 for authentication
 *
 * @param {Function} onSuccess - Callback on successful login
 * @param {Function} onError - Callback on login error
 * @param {boolean} rememberMe - Whether to enable Remember Me
 */
const FacebookLoginButton = ({ onSuccess, onError, rememberMe = false }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [facebookSDKLoaded, setFacebookSDKLoaded] = useState(false);

  // Load Facebook SDK
  useEffect(() => {
    // Check if Facebook SDK is already loaded
    if (window.FB) {
      setFacebookSDKLoaded(true);
      return;
    }

    // Load Facebook SDK
    window.fbAsyncInit = function () {
      if (window.FB) {
        window.FB.init({
          appId: process.env.REACT_APP_FACEBOOK_APP_ID,
          xfbml: true,
          version: "v18.0",
        });

        setFacebookSDKLoaded(true);
      }
    };

    // Load the SDK script
    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  /**
   * Handle Facebook Login
   */
  const handleFacebookLogin = async () => {
    try {
      setIsLoading(true);

      if (!window.FB) {
        throw new Error("Facebook SDK not loaded");
      }

      // Request login
      window.FB.login(
        async (response) => {
          try {
            if (response.authResponse) {
              // User logged in successfully
              const accessToken = response.authResponse.accessToken;

              // Send token to backend
              const result = await fetch(
                `${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/auth/facebook`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    token: accessToken,
                    rememberMe,
                  }),
                }
              );

              const data = await result.json();

              if (!result.ok) {
                throw new Error(data.message || "Facebook login failed");
              }

              // Login user
              const { accessToken: jwtToken, refreshToken, rememberMeToken, user } = data.data;

              login(jwtToken, user, refreshToken, rememberMe);

              // Store tokens
              localStorage.setItem("accessToken", jwtToken);
              localStorage.setItem("refreshToken", refreshToken);
              if (rememberMeToken) {
                localStorage.setItem("rememberMeToken", rememberMeToken);
              }

              // Show success message
              toast.success(`Welcome back, ${user.fullName}!`);

              // Call success callback
              if (onSuccess) {
                onSuccess(user);
              }

              // Redirect to dashboard
              const dashboardPath = `/dashboard/${user.role}`;
              navigate(dashboardPath);
            } else {
              // User cancelled login
              toast.error("Facebook login cancelled");
            }
          } catch (error) {
            console.error("[Facebook Login] Error:", error);
            toast.error(error.message || "Facebook login failed");

            // Call error callback
            if (onError) {
              onError(error);
            }
          } finally {
            setIsLoading(false);
          }
        },
        { scope: "public_profile,email" }
      );
    } catch (error) {
      console.error("[Facebook Login] Error:", error);
      toast.error(error.message || "Failed to open Facebook login");
      setIsLoading(false);

      // Call error callback
      if (onError) {
        onError(error);
      }
    }
  };

  return (
    <button
      onClick={handleFacebookLogin}
      disabled={isLoading || !facebookSDKLoaded}
      style={{
        width: "100%",
        padding: "12px",
        backgroundColor: "#1877F2",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: isLoading || !facebookSDKLoaded ? "not-allowed" : "pointer",
        fontWeight: 600,
        fontSize: "14px",
        fontFamily: "Montserrat, sans-serif",
        opacity: isLoading || !facebookSDKLoaded ? 0.7 : 1,
        transition: "all 0.3s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        marginBottom: "16px",
      }}
      onMouseEnter={(e) => {
        if (!isLoading && facebookSDKLoaded) {
          e.target.style.backgroundColor = "#0a66c2";
        }
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = "#1877F2";
      }}
    >
      {/* Facebook Icon */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ display: "inline-block" }}
      >
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
      {isLoading ? "Signing in..." : "Sign in with Facebook"}
    </button>
  );
};

export default FacebookLoginButton;
