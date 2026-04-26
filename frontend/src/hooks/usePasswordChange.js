// ============================================================
// hooks/usePasswordChange.js - Custom Hook for Password Change
// ============================================================

import { useState, useCallback } from "react";
import * as userService from "../services/userService";
import { validatePassword, validatePasswordsMatch } from "../utils/validation";

/**
 * Custom hook for managing password change
 * @returns {object} Password change state and methods
 */
export const usePasswordChange = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState("weak");
  const [passwordErrors, setPasswordErrors] = useState([]);

  // Validate new password
  const validateNewPassword = useCallback((password) => {
    const validation = validatePassword(password);
    setPasswordErrors(validation.errors);
    setPasswordStrength(validation.strength);
    return validation.isValid;
  }, []);

  // Handle new password change
  const handleNewPasswordChange = useCallback(
    (password) => {
      setNewPassword(password);
      validateNewPassword(password);
    },
    [validateNewPassword]
  );

  // Change password
  const changePassword = useCallback(async () => {
    setError(null);
    setSuccess(null);

    // Validate inputs
    if (!currentPassword) {
      setError("Please enter your current password");
      return;
    }

    if (!newPassword) {
      setError("Please enter a new password");
      return;
    }

    if (!confirmPassword) {
      setError("Please confirm your new password");
      return;
    }

    // Validate password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      setError("Password does not meet requirements");
      return;
    }

    // Validate passwords match
    const matchValidation = validatePasswordsMatch(newPassword, confirmPassword);
    if (!matchValidation.isValid) {
      setError(matchValidation.error);
      return;
    }

    setLoading(true);

    try {
      const response = await userService.changePassword(currentPassword, newPassword);
      setSuccess("Password changed successfully");
      
      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordErrors([]);
      setPasswordStrength("weak");

      return response;
    } catch (err) {
      const errorMessage = err.message || "Failed to change password";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentPassword, newPassword, confirmPassword]);

  // Clear messages
  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
    setSuccess(null);
    setPasswordErrors([]);
    setPasswordStrength("weak");
  }, []);

  return {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword: handleNewPasswordChange,
    confirmPassword,
    setConfirmPassword,
    loading,
    error,
    success,
    passwordStrength,
    passwordErrors,
    changePassword,
    clearMessages,
    resetForm,
  };
};

export default usePasswordChange;
