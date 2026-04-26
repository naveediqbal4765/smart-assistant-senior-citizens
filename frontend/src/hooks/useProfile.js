// ============================================================
// hooks/useProfile.js - Custom Hook for Profile Management
// ============================================================

import { useState, useEffect, useCallback } from "react";
import * as userService from "../services/userService";

/**
 * Custom hook for managing user profile
 * @returns {object} Profile state and methods
 */
export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch profile data
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getProfile();
      setProfile(response.data || response);
      return response.data || response;
    } catch (err) {
      // Extract error message from Error object
      let errorMessage = "Failed to fetch profile";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      console.error("Profile fetch error:", errorMessage, err);
      // Don't throw - just set error state
    } finally {
      setLoading(false);
    }
  }, []);

  // Update profile
  const updateProfile = useCallback(async (profileData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await userService.updateProfile(profileData);
      setProfile(response.data);
      setSuccess("Profile updated successfully");
      return response.data;
    } catch (err) {
      const errorMessage = err.message || "Failed to update profile";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Change password
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await userService.changePassword(currentPassword, newPassword);
      setSuccess("Password changed successfully");
      return response;
    } catch (err) {
      const errorMessage = err.message || "Failed to change password";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete account
  const deleteAccount = useCallback(async (password) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await userService.deleteAccount(password);
      setSuccess("Account deleted successfully");
      return response;
    } catch (err) {
      const errorMessage = err.message || "Failed to delete account";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear messages
  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    success,
    fetchProfile,
    updateProfile,
    changePassword,
    deleteAccount,
    clearMessages,
  };
};

export default useProfile;
