// ============================================================
// services/emailValidationService.js - Email Validation Service
// Provides strict email validation with detailed error messages
// ============================================================

/**
 * Validate email format with strict rules
 * @param {string} email - Email to validate
 * @returns {object} - { isValid: boolean, error: string|null }
 */
const validateEmailFormat = (email) => {
  // Check if email is provided
  if (!email || typeof email !== 'string') {
    return {
      isValid: false,
      error: 'Email is required'
    };
  }

  // Trim whitespace
  email = email.trim();

  // Check if email is empty after trimming
  if (email.length === 0) {
    return {
      isValid: false,
      error: 'Email cannot be empty'
    };
  }

  // Check for common typos and invalid patterns
  const invalidPatterns = [
    /@@/,                    // Double @
    /\.\./, // Double dot
    /^\./, // Starts with dot
    /\.$/, // Ends with dot
    /@\./, // @ followed by dot
    /\.@/, // Dot followed by @
    /^@/, // Starts with @
    /@$/, // Ends with @
    / /, // Contains space
    /[<>()[\]\\,;:\s]/,     // Contains special characters
  ];

  for (const pattern of invalidPatterns) {
    if (pattern.test(email)) {
      return {
        isValid: false,
        error: 'Invalid email or password'
      };
    }
  }

  // Check for multiple @ symbols
  const atCount = (email.match(/@/g) || []).length;
  if (atCount !== 1) {
    return {
      isValid: false,
      error: 'Invalid email or password'
    };
  }

  // Split email into local and domain parts
  const [localPart, domainPart] = email.split('@');

  // Validate local part (before @)
  if (!localPart || localPart.length === 0) {
    return {
      isValid: false,
      error: 'Invalid email or password'
    };
  }

  if (localPart.length > 64) {
    return {
      isValid: false,
      error: 'Invalid email or password'
    };
  }

  // Check for consecutive dots in local part
  if (localPart.includes('..')) {
    return {
      isValid: false,
      error: 'Invalid email or password'
    };
  }

  // Check if local part starts or ends with dot
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return {
      isValid: false,
      error: 'Invalid email or password'
    };
  }

  // Validate domain part (after @)
  if (!domainPart || domainPart.length === 0) {
    return {
      isValid: false,
      error: 'Invalid email or password'
    };
  }

  // Check if domain has at least one dot
  if (!domainPart.includes('.')) {
    return {
      isValid: false,
      error: 'Invalid email or password'
    };
  }

  // Split domain into parts
  const domainParts = domainPart.split('.');

  // Check each domain part
  for (const part of domainParts) {
    if (!part || part.length === 0) {
      return {
        isValid: false,
        error: 'Invalid email or password'
      };
    }

    // Check if part contains only valid characters
    if (!/^[a-zA-Z0-9-]+$/.test(part)) {
      return {
        isValid: false,
        error: 'Invalid email or password'
      };
    }

    // Check if part starts or ends with hyphen
    if (part.startsWith('-') || part.endsWith('-')) {
      return {
        isValid: false,
        error: 'Invalid email or password'
      };
    }
  }

  // Check TLD (last part of domain)
  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2) {
    return {
      isValid: false,
      error: 'Invalid email or password'
    };
  }

  // Check if TLD contains only letters
  if (!/^[a-zA-Z]+$/.test(tld)) {
    return {
      isValid: false,
      error: 'Invalid email or password'
    };
  }

  // All validations passed
  return {
    isValid: true,
    error: null
  };
};

/**
 * Validate password format
 * @param {string} password - Password to validate
 * @returns {object} - { isValid: boolean, error: string|null }
 */
const validatePasswordFormat = (password) => {
  // Check if password is provided
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      error: 'Password is required'
    };
  }

  // Check minimum length
  if (password.length < 8) {
    return {
      isValid: false,
      error: 'Password must be at least 8 characters'
    };
  }

  // Check maximum length
  if (password.length > 128) {
    return {
      isValid: false,
      error: 'Password is too long'
    };
  }

  return {
    isValid: true,
    error: null
  };
};

/**
 * Normalize email (lowercase and trim)
 * @param {string} email - Email to normalize
 * @returns {string} - Normalized email
 */
const normalizeEmail = (email) => {
  return email.trim().toLowerCase();
};

module.exports = {
  validateEmailFormat,
  validatePasswordFormat,
  normalizeEmail
};
