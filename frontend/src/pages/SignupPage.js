// ============================================================
// pages/SignupPage.js - Signup Page with Role Tabs
// Matches UserInterface2.png design
// ============================================================

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";
import ElderSignupForm from "../components/auth/ElderSignupForm";
import CaregiverSignupForm from "../components/auth/CaregiverSignupForm";
import VolunteerSignupForm from "../components/auth/VolunteerSignupForm";

const AppLogo = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="30" y="10" width="40" height="80" rx="8" fill="#52b788" />
    <rect x="10" y="30" width="80" height="40" rx="8" fill="#52b788" />
    <rect x="34" y="14" width="32" height="72" rx="6" fill="#74c69d" />
    <rect x="14" y="34" width="72" height="32" rx="6" fill="#74c69d" />
    <circle cx="50" cy="50" r="18" fill="white" />
    <path d="M50 58 C50 58 38 50 38 43 C38 39 41 36 44.5 36 C46.5 36 48.5 37.2 50 39 C51.5 37.2 53.5 36 55.5 36 C59 36 62 39 62 43 C62 50 50 58 50 58Z" fill="#e63946" />
  </svg>
);

const SignupPage = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("elder");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [profilePicture, setProfilePicture] = useState(null);

  // ---- Common form data ----
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    nationalId: "",
    address: "",
    // Elder
    livesAlone: null,
    emergencyContacts: [],
    medicalConditions: [],
    hasMedicalIssues: null,
    locationPermission: false,
    // Caregiver
    relationshipToElder: "",
    linkedElderEmail: "",
    pairingCode: "",
    notificationsEnabled: false,
    isAvailable: true,
    // Volunteer
    affiliation: "",
    ngoId: "",
    serviceRadius: 5,
    skills: [],
    availability: { days: [], timeSlots: [] },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024) {
        toast.error("Profile picture must be less than 50KB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => setProfilePicture(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const validateCommon = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Min 8 characters";
    else if (!/[0-9]/.test(formData.password)) newErrors.password = "Must contain a number";
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) newErrors.password = "Must contain a special character";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
    if (formData.nationalId && !/^\d{13}$/.test(formData.nationalId)) newErrors.nationalId = "Must be 13 digits";
    return newErrors;
  };

  const validateRole = () => {
    const newErrors = {};
    if (selectedRole === "elder") {
      if (formData.livesAlone === null) newErrors.livesAlone = "Please select";
      if (formData.livesAlone === false && formData.emergencyContacts.length === 0) newErrors.emergencyContacts = "Add at least 1 contact";
      if (formData.hasMedicalIssues === null) newErrors.hasMedicalIssues = "Please select";
    } else if (selectedRole === "caregiver") {
      if (!formData.relationshipToElder) newErrors.relationshipToElder = "Required";
      if (!formData.linkedElderEmail) newErrors.linkedElderEmail = "Required";
      if (!formData.pairingCode || formData.pairingCode.length !== 6) newErrors.pairingCode = "Must be 6 digits";
    } else if (selectedRole === "volunteer") {
      if (!formData.skills || formData.skills.length === 0) newErrors.skills = "Select at least 1 skill";
    }
    return newErrors;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const commonErrors = validateCommon();
    const roleErrors = validateRole();
    const allErrors = { ...commonErrors, ...roleErrors };

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      toast.error("Please fix the errors above");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.signup({
        ...formData,
        role: selectedRole,
      });

      toast.success("Account created! Check your email for OTP.");
      navigate("/verify-otp", { state: { email: formData.email } });
    } catch (error) {
      const message = error.response?.data?.message || "Signup failed";
      setErrors({ general: message });
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-bg min-h-screen">
      {/* ---- Navbar ---- */}
      <div className="app-navbar">
        <AppLogo size={40} />
        <h1 style={{ color: "white", fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>
          Smart Assistant for Senior Citizens
        </h1>
      </div>

      {/* ---- Role Tab Bar ---- */}
      <div style={{ backgroundColor: "#1b4332", display: "flex", borderBottom: "2px solid #2d6a4f" }}>
        {["elder", "caregiver", "volunteer"].map((role) => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            className={`role-tab ${selectedRole === role ? "active" : ""}`}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>

      {/* ---- Main Content ---- */}
      <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", alignItems: "start" }}>

          {/* ---- LEFT: Form Card ---- */}
          <div className="auth-card">
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1b4332", marginBottom: "20px", textAlign: "center" }}>
              Enter your data.
            </h2>

            {/* General Error */}
            {errors.general && (
              <div style={{ backgroundColor: "#fde8ea", border: "1.5px solid #e63946", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", color: "#c1121f", fontSize: "0.9rem", fontWeight: 600 }}>
                ⚠️ {errors.general}
              </div>
            )}

            <form onSubmit={handleSignup} noValidate>

              {/* Profile Picture Upload */}
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <div className="profile-upload-circle">
                  {profilePicture ? (
                    <img src={profilePicture} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: "2rem" }}>📷</span>
                  )}
                </div>
                <label style={{ display: "block", marginTop: "10px", fontSize: "0.85rem", fontWeight: 600, color: "#2d6a4f", cursor: "pointer" }}>
                  <input type="file" accept="image/*" onChange={handleProfilePictureChange} style={{ display: "none" }} />
                  Upload Profile Picture
                </label>
              </div>

              {/* Common Fields */}
              <div style={{ marginBottom: "14px" }}>
                <label className="form-label">Full Name *</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className={`form-input ${errors.fullName ? "error" : ""}`} />
                {errors.fullName && <p className="error-msg">⚠️ {errors.fullName}</p>}
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label className="form-label">Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className={`form-input ${errors.email ? "error" : ""}`} />
                {errors.email && <p className="error-msg">⚠️ {errors.email}</p>}
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label className="form-label">Phone *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={`form-input ${errors.phone ? "error" : ""}`} />
                {errors.phone && <p className="error-msg">⚠️ {errors.phone}</p>}
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label className="form-label">Date of Birth</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="form-input" />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label className="form-label">National ID (13 digits)</label>
                <input type="text" name="nationalId" value={formData.nationalId} onChange={handleChange} className={`form-input ${errors.nationalId ? "error" : ""}`} placeholder="1234567890123" />
                {errors.nationalId && <p className="error-msg">⚠️ {errors.nationalId}</p>}
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label className="form-label">Password *</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} className={`form-input ${errors.password ? "error" : ""}`} />
                {errors.password && <p className="error-msg">⚠️ {errors.password}</p>}
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label className="form-label">Confirm Password *</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={`form-input ${errors.confirmPassword ? "error" : ""}`} />
                {errors.confirmPassword && <p className="error-msg">⚠️ {errors.confirmPassword}</p>}
              </div>

              {/* Role-Specific Fields */}
              {selectedRole === "elder" && <ElderSignupForm data={formData} onChange={handleChange} errors={errors} />}
              {selectedRole === "caregiver" && <CaregiverSignupForm data={formData} onChange={handleChange} errors={errors} />}
              {selectedRole === "volunteer" && <VolunteerSignupForm data={formData} onChange={handleChange} errors={errors} />}

              {/* Sign Up Button */}
              <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginTop: "20px" }}>
                {isLoading ? "Creating account..." : "Sign up"}
              </button>

              {/* Already have account */}
              <p style={{ textAlign: "center", fontSize: "0.9rem", color: "#6b7280", marginTop: "14px" }}>
                Already have an account?{" "}
                <button type="button" onClick={() => navigate("/login")} className="btn-ghost">
                  Login
                </button>
              </p>

            </form>
          </div>

          {/* ---- RIGHT: Photo Collage (from UI2) ---- */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", alignItems: "start" }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "#c8e6c9",
                  borderRadius: "12px",
                  aspectRatio: "1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "3rem",
                  color: "#a8d5b5",
                  fontWeight: 700,
                }}
              >
                {i % 2 === 0 ? "👴" : "👵"}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default SignupPage;
