// ============================================================
// pages/SignupPage.js - Signup Page with Role Selection
// Step 1: Choose role (Elder / Caregiver / Volunteer)
// Step 2: Fill role-specific form fields
// ============================================================

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";
import { FaUser, FaHeart, FaHandsHelping, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";

// Import role-specific form sections
import ElderSignupForm from "../components/auth/ElderSignupForm";
import CaregiverSignupForm from "../components/auth/CaregiverSignupForm";
import VolunteerSignupForm from "../components/auth/VolunteerSignupForm";

// ============================================================
// SignupPage Component
// ============================================================
const SignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Pre-filled data from OAuth (if user came from OAuth flow)
  const prefillData = location.state?.prefillData || {};

  // ---- Step State: 1 = role selection, 2 = form ----
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(null); // "elder" | "caregiver" | "volunteer"
  const [isLoading, setIsLoading] = useState(false);

  // ---- Common Form Data (all roles) ----
  const [commonData, setCommonData] = useState({
    fullName: prefillData.fullName || "",
    email: prefillData.email || "",
    phone: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    nationalId: "",
    address: { text: "", lat: null, lng: null },
    profilePicture: null,
  });

  // ---- Role-specific form data ----
  const [roleData, setRoleData] = useState({});

  // ---- Password visibility ----
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ---- Validation errors ----
  const [errors, setErrors] = useState({});

  // ---- Role selection cards ----
  const roles = [
    {
      id: "elder",
      label: "I am an Elder",
      description: "Get help, stay safe, and stay connected",
      icon: <FaUser size={40} />,
      color: "bg-blue-50 border-blue-300 hover:bg-blue-100",
      activeColor: "bg-blue-100 border-blue-500",
      iconColor: "text-blue-600",
    },
    {
      id: "caregiver",
      label: "I am a Caregiver",
      description: "Monitor and support your loved one",
      icon: <FaHeart size={40} />,
      color: "bg-pink-50 border-pink-300 hover:bg-pink-100",
      activeColor: "bg-pink-100 border-pink-500",
      iconColor: "text-pink-600",
    },
    {
      id: "volunteer",
      label: "I am a Volunteer",
      description: "Help seniors in your community",
      icon: <FaHandsHelping size={40} />,
      color: "bg-green-50 border-green-300 hover:bg-green-100",
      activeColor: "bg-green-100 border-green-500",
      iconColor: "text-green-600",
    },
  ];

  // ---- Handle common field changes ----
  const handleCommonChange = (e) => {
    const { name, value } = e.target;
    setCommonData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ---- Validate common fields ----
  const validateCommon = () => {
    const newErrors = {};
    if (!commonData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!commonData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(commonData.email)) newErrors.email = "Enter a valid email";
    if (!commonData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!commonData.password) newErrors.password = "Password is required";
    else if (commonData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    else if (!/[0-9]/.test(commonData.password)) newErrors.password = "Password must contain a number";
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(commonData.password)) newErrors.password = "Password must contain a special character";
    if (commonData.password !== commonData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (commonData.nationalId && !/^\d{13}$/.test(commonData.nationalId)) {
      newErrors.nationalId = "National ID must be exactly 13 digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---- Handle final signup submission ----
  const handleSignup = async () => {
    if (!validateCommon()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        ...commonData,
        role: selectedRole,
        ...roleData, // Merge role-specific data
        // Include OAuth provider info if applicable
        ...(prefillData.provider && {
          authProvider: prefillData.provider,
          providerId: prefillData.providerId,
        }),
      };

      const response = await authAPI.signup(payload);

      toast.success("Account created! Please check your email for the verification OTP.");

      // Redirect to OTP verification page
      navigate("/verify-otp", {
        state: {
          email: commonData.email,
          purpose: "email-verification",
        },
      });
    } catch (error) {
      const message = error.response?.data?.message || "Signup failed. Please try again.";
      toast.error(message);

      // Show field-level errors if returned from server
      if (error.response?.data?.errors) {
        const serverErrors = {};
        error.response.data.errors.forEach((err) => {
          serverErrors[err.field] = err.message;
        });
        setErrors(serverErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // RENDER - Step 1: Role Selection
  // ============================================================
  if (step === 1) {
    return (
      <div className="min-h-screen bg-auth flex items-center justify-center p-4">
        <div className="w-full max-w-2xl animate-fade-in">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent rounded-full mb-4">
              <span className="text-white text-4xl">🏥</span>
            </div>
            <h1 className="text-white text-3xl font-bold">Create Your Account</h1>
            <p className="text-neutral-300 text-senior-base mt-2">Who are you joining as?</p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => {
                  setSelectedRole(role.id);
                  setStep(2); // Move to form step
                }}
                className={`flex items-center gap-6 p-6 rounded-senior border-2 transition-all duration-200 text-left
                  ${selectedRole === role.id ? role.activeColor : role.color}`}
              >
                <div className={`${role.iconColor} flex-shrink-0`}>{role.icon}</div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-800">{role.label}</h3>
                  <p className="text-neutral-600 text-senior-base">{role.description}</p>
                </div>
                <div className="ml-auto text-neutral-400 text-2xl">→</div>
              </button>
            ))}
          </div>

          {/* Already have account */}
          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-white text-senior-base font-semibold hover:text-accent transition-colors"
            >
              <FaArrowLeft /> Already have an account? Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // RENDER - Step 2: Signup Form
  // ============================================================
  return (
    <div className="min-h-screen bg-auth py-8 px-4">
      <div className="w-full max-w-2xl mx-auto animate-slide-up">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-white text-3xl font-bold">
            {selectedRole === "elder" && "Elder Registration"}
            {selectedRole === "caregiver" && "Caregiver Registration"}
            {selectedRole === "volunteer" && "Volunteer Registration"}
          </h1>
          <p className="text-neutral-300 text-senior-base mt-1">Fill in your details below</p>
        </div>

        <div className="card shadow-senior-lg">

          {/* Back to role selection */}
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex items-center gap-2 text-neutral-500 hover:text-primary font-semibold mb-6 transition-colors"
          >
            <FaArrowLeft /> Change Role
          </button>

          {/* ---- Common Fields (All Roles) ---- */}
          <div className="space-y-5 mb-6">
            <h3 className="text-xl font-bold text-primary border-b-2 border-neutral-100 pb-3">
              Personal Information
            </h3>

            {/* Full Name */}
            <div>
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={commonData.fullName}
                onChange={handleCommonChange}
                placeholder="Enter your full name"
                className={`input-field ${errors.fullName ? "input-error" : ""}`}
              />
              {errors.fullName && <p className="error-text">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                value={commonData.email}
                onChange={handleCommonChange}
                placeholder="Enter your email"
                className={`input-field ${errors.email ? "input-error" : ""}`}
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={commonData.phone}
                onChange={handleCommonChange}
                placeholder="+92 300 1234567"
                className={`input-field ${errors.phone ? "input-error" : ""}`}
              />
              {errors.phone && <p className="error-text">{errors.phone}</p>}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={commonData.dateOfBirth}
                onChange={handleCommonChange}
                className="input-field"
              />
            </div>

            {/* National ID */}
            <div>
              <label className="form-label">National ID (CNIC) - 13 digits</label>
              <input
                type="text"
                name="nationalId"
                value={commonData.nationalId}
                onChange={handleCommonChange}
                placeholder="1234567890123"
                maxLength={13}
                className={`input-field ${errors.nationalId ? "input-error" : ""}`}
              />
              {errors.nationalId && <p className="error-text">{errors.nationalId}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="form-label">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={commonData.password}
                  onChange={handleCommonChange}
                  placeholder="Min 8 chars, 1 number, 1 symbol"
                  className={`input-field pr-14 ${errors.password ? "input-error" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500"
                >
                  {showPassword ? <FaEyeSlash size={22} /> : <FaEye size={22} />}
                </button>
              </div>
              {errors.password && <p className="error-text">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="form-label">Confirm Password *</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={commonData.confirmPassword}
                  onChange={handleCommonChange}
                  placeholder="Re-enter your password"
                  className={`input-field pr-14 ${errors.confirmPassword ? "input-error" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500"
                >
                  {showConfirmPassword ? <FaEyeSlash size={22} /> : <FaEye size={22} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* ---- Role-Specific Form Section ---- */}
          <div className="border-t-2 border-neutral-100 pt-6">
            {selectedRole === "elder" && (
              <ElderSignupForm roleData={roleData} setRoleData={setRoleData} errors={errors} />
            )}
            {selectedRole === "caregiver" && (
              <CaregiverSignupForm roleData={roleData} setRoleData={setRoleData} errors={errors} />
            )}
            {selectedRole === "volunteer" && (
              <VolunteerSignupForm roleData={roleData} setRoleData={setRoleData} errors={errors} />
            )}
          </div>

          {/* ---- Submit Button ---- */}
          <button
            type="button"
            onClick={handleSignup}
            className="btn-primary mt-6"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>

          {/* Already have account */}
          <p className="text-center text-neutral-500 text-senior-base mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-accent font-bold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
