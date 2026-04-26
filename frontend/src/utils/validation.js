// ============================================================
// utils/validation.js - Form Validation Utilities
// ============================================================

/**
 * Validate phone number format
 * Accepts: +92XXXXXXXXXX or 03XXXXXXXXXX
 * @param {string} phone - Phone number to validate
 * @returns {object} { isValid: boolean, error: string }
 */
export const validatePhoneNumber = (phone) => {
  if (!phone) {
    return { isValid: false, error: "Phone number is required." };
  }

  // Remove spaces and dashes
  const cleanPhone = phone.replace(/[\s-]/g, "");

  // Check if it matches Pakistani phone format
  const phoneRegex = /^(\+92|0)[0-9]{10}$/;

  if (!phoneRegex.test(cleanPhone)) {
    return {
      isValid: false,
      error: "Please enter a valid phone number (e.g., +923001234567 or 03001234567).",
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate password strength
 * Requirements: 8+ chars, uppercase, lowercase, number, special char
 * @param {string} password - Password to validate
 * @returns {object} { isValid: boolean, errors: array, strength: string }
 */
export const validatePassword = (password) => {
  const errors = [];
  let strength = "weak";

  if (!password) {
    return { isValid: false, errors: ["Password is required."], strength };
  }

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long.");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter.");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter.");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number.");
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character (!@#$%^&*).");
  }

  if (errors.length === 0) {
    strength = "strong";
  } else if (errors.length <= 2) {
    strength = "medium";
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {object} { isValid: boolean, error: string }
 */
export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, error: "Email is required." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Please enter a valid email address." };
  }

  return { isValid: true, error: null };
};

/**
 * Validate file size
 * @param {number} fileSizeInBytes - File size in bytes
 * @param {number} maxSizeInMB - Maximum allowed size in MB (default: 5)
 * @returns {object} { isValid: boolean, error: string }
 */
export const validateFileSize = (fileSizeInBytes, maxSizeInMB = 5) => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  if (fileSizeInBytes > maxSizeInBytes) {
    return {
      isValid: false,
      error: `File too large; please upload an image under ${maxSizeInMB}MB.`,
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate file format
 * @param {string} fileName - File name
 * @param {array} allowedFormats - Allowed file extensions (default: jpg, png)
 * @returns {object} { isValid: boolean, error: string }
 */
export const validateFileFormat = (fileName, allowedFormats = ["jpg", "jpeg", "png"]) => {
  if (!fileName) {
    return { isValid: false, error: "File is required." };
  }

  const fileExtension = fileName.split(".").pop().toLowerCase();

  if (!allowedFormats.includes(fileExtension)) {
    return {
      isValid: false,
      error: `Please upload a valid image file (.${allowedFormats.join(", .")}).`,
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate file (size + format)
 * @param {File} file - File object
 * @param {number} maxSizeInMB - Maximum file size in MB
 * @param {array} allowedFormats - Allowed file extensions
 * @returns {object} { isValid: boolean, error: string }
 */
export const validateFile = (file, maxSizeInMB = 5, allowedFormats = ["jpg", "jpeg", "png"]) => {
  // Check file size
  const sizeValidation = validateFileSize(file.size, maxSizeInMB);
  if (!sizeValidation.isValid) {
    return sizeValidation;
  }

  // Check file format
  const formatValidation = validateFileFormat(file.name, allowedFormats);
  if (!formatValidation.isValid) {
    return formatValidation;
  }

  return { isValid: true, error: null };
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @param {string} fieldName - Field name for error message
 * @returns {object} { isValid: boolean, error: string }
 */
export const validateRequired = (value, fieldName = "This field") => {
  if (!value || (typeof value === "string" && value.trim() === "")) {
    return { isValid: false, error: `${fieldName} is required.` };
  }

  return { isValid: true, error: null };
};

/**
 * Validate date of birth
 * @param {string} dateOfBirth - Date in YYYY-MM-DD format
 * @param {number} minAge - Minimum age (default: 18)
 * @returns {object} { isValid: boolean, error: string }
 */
export const validateDateOfBirth = (dateOfBirth, minAge = 18) => {
  if (!dateOfBirth) {
    return { isValid: false, error: "Date of birth is required." };
  }

  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < minAge) {
    return { isValid: false, error: `You must be at least ${minAge} years old.` };
  }

  if (age > 150) {
    return { isValid: false, error: "Please enter a valid date of birth." };
  }

  return { isValid: true, error: null };
};

/**
 * Validate passwords match
 * @param {string} password - Password
 * @param {string} confirmPassword - Confirm password
 * @returns {object} { isValid: boolean, error: string }
 */
export const validatePasswordsMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return { isValid: false, error: "Passwords do not match." };
  }

  return { isValid: true, error: null };
};
