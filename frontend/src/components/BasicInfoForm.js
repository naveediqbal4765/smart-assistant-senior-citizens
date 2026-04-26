// ============================================================
// components/BasicInfoForm.js - Basic Information Form Component
// ============================================================

import React, { useState, useEffect } from "react";
import { validatePhoneNumber } from "../utils/validation";
import { formatPhoneNumber } from "../utils/formatters";
import "../styles/BasicInfoForm.css";

/**
 * Basic Information Form Component
 * Allows users to update their basic profile information
 * 
 * @param {object} initialData - Initial form data
 * @param {function} onSubmit - Callback when form is submitted
 * @param {boolean} loading - Loading state
 * @param {string} error - Error message
 * @param {string} success - Success message
 */
const BasicInfoForm = ({ initialData = {}, onSubmit, loading = false, error = null, success = null }) => {
  const [formData, setFormData] = useState({
    fullName: initialData.fullName || "",
    phone: initialData.phone || "",
    address: initialData.address || "",
    dateOfBirth: initialData.dateOfBirth ? initialData.dateOfBirth.split("T")[0] : "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validate phone number on change
  const validatePhone = (phone) => {
    if (!phone) {
      return null;
    }
    const validation = validatePhoneNumber(phone);
    return validation.error || null;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate on change if field was touched
    if (touched[name]) {
      if (name === "phone") {
        const phoneError = validatePhone(value);
        setErrors((prev) => ({
          ...prev,
          phone: phoneError,
        }));
      }
    }
  };

  // Handle field blur
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validate on blur
    if (name === "phone") {
      const phoneError = validatePhone(formData.phone);
      setErrors((prev) => ({
        ...prev,
        phone: phoneError,
      }));
    }
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (formData.phone) {
      const phoneError = validatePhone(formData.phone);
      if (phoneError) {
        newErrors.phone = phoneError;
      }
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }

    setErrors(newErrors);

    // If no errors, submit
    if (Object.keys(newErrors).length === 0) {
      onSubmit({
        fullName: formData.fullName.trim(),
        phone: formData.phone,
        address: formData.address.trim(),
        dateOfBirth: formData.dateOfBirth,
      });
    }
  };

  return (
    <form className="basic-info-form" onSubmit={handleSubmit}>
      <h2 className="form-title">Basic Information</h2>

      {/* Error Message */}
      {error && <div className="form-error-message">{error}</div>}

      {/* Success Message */}
      {success && <div className="form-success-message">{success}</div>}

      {/* Full Name Field */}
      <div className="form-group">
        <label htmlFor="fullName" className="form-label">
          Full Name <span className="required">*</span>
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter your full name"
          className={`form-input ${errors.fullName && touched.fullName ? "input-error" : ""}`}
          disabled={loading}
        />
        {errors.fullName && touched.fullName && (
          <span className="form-error">{errors.fullName}</span>
        )}
      </div>

      {/* Phone Number Field */}
      <div className="form-group">
        <label htmlFor="phone" className="form-label">
          Phone Number <span className="required">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="e.g., +923001234567 or 03001234567"
          className={`form-input ${errors.phone && touched.phone ? "input-error" : ""}`}
          disabled={loading}
        />
        {errors.phone && touched.phone && (
          <span className="form-error">{errors.phone}</span>
        )}
        {formData.phone && !errors.phone && touched.phone && (
          <span className="form-hint">
            Formatted: {formatPhoneNumber(formData.phone)}
          </span>
        )}
      </div>

      {/* Address Field */}
      <div className="form-group">
        <label htmlFor="address" className="form-label">
          Address <span className="required">*</span>
        </label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter your address"
          className={`form-textarea ${errors.address && touched.address ? "input-error" : ""}`}
          rows="3"
          disabled={loading}
        />
        {errors.address && touched.address && (
          <span className="form-error">{errors.address}</span>
        )}
      </div>

      {/* Date of Birth Field */}
      <div className="form-group">
        <label htmlFor="dateOfBirth" className="form-label">
          Date of Birth <span className="required">*</span>
        </label>
        <input
          type="date"
          id="dateOfBirth"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`form-input ${errors.dateOfBirth && touched.dateOfBirth ? "input-error" : ""}`}
          disabled={loading}
        />
        {errors.dateOfBirth && touched.dateOfBirth && (
          <span className="form-error">{errors.dateOfBirth}</span>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="btn-primary"
        disabled={loading}
        style={{ width: "100%", marginTop: "20px" }}
      >
        {loading ? "Saving Changes..." : "Save Changes"}
      </button>
    </form>
  );
};

export default BasicInfoForm;
