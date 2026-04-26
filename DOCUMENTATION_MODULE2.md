# 📚 MODULE 2 - USER PROFILE MANAGEMENT - COMPLETE DOCUMENTATION

**Smart Assistant for Senior Citizens**  
**Date:** April 26, 2026  
**Version:** 1.0  
**Status:** Phase 1 Complete ✅

---

## 📖 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Phase 1: Setup & Infrastructure](#phase-1-setup--infrastructure)
3. [How to Pull the Code](#how-to-pull-the-code)
4. [How to Verify the Work](#how-to-verify-the-work)
5. [File Structure](#file-structure)
6. [API Documentation](#api-documentation)
7. [Validation Rules](#validation-rules)
8. [Usage Examples](#usage-examples)
9. [Next Phases](#next-phases)

---

## 📋 OVERVIEW

### **Module 2 Goals**
Build a comprehensive user profile management system with:
- ✅ Editable profile information
- ✅ Profile picture upload
- ✅ Password change with security
- ✅ Role-based customization (Senior, Caregiver, Volunteer)
- ✅ Account deletion
- ✅ Emergency contacts management
- ✅ Medical information (seniors)
- ✅ Linked seniors (caregivers)
- ✅ Availability & skills (volunteers)

### **Module 2 Cases**
1. **CASE 01:** Updating Basic Information
2. **CASE 02:** Role-Based Profile Customization
3. **CASE 03:** Password Sensitivity & Security
4. **CASE 04:** Profile Picture Upload
5. **CASE 05:** Account Deletion

---

## 🏗️ PHASE 1: SETUP & INFRASTRUCTURE

### **Status:** ✅ COMPLETE

**Time Spent:** 2-3 hours  
**Tasks Completed:** 7/7  
**Files Created:** 8  
**Lines of Code:** 1,230+

### **What Was Created**

#### **1. Utilities (2 files)**

##### **validation.js** (250+ lines)
Location: `frontend/src/utils/validation.js`

**Functions:**
```javascript
// Phone number validation (Pakistani format)
validatePhoneNumber(phone) → { isValid, error }

// Password strength validation
validatePassword(password) → { isValid, errors[], strength }

// Email validation
validateEmail(email) → { isValid, error }

// File size validation (max 5MB)
validateFileSize(fileSizeInBytes, maxSizeInMB) → { isValid, error }

// File format validation (.jpg, .png)
validateFileFormat(fileName, allowedFormats) → { isValid, error }

// Combined file validation
validateFile(file, maxSizeInMB, allowedFormats) → { isValid, error }

// Required field validation
validateRequired(value, fieldName) → { isValid, error }

// Date of birth validation
validateDateOfBirth(dateOfBirth, minAge) → { isValid, error }

// Password match validation
validatePasswordsMatch(password, confirmPassword) → { isValid, error }
```

**Usage Example:**
```javascript
import { validatePhoneNumber, validatePassword } from '../utils/validation';

// Validate phone
const phoneValidation = validatePhoneNumber('+923001234567');
if (!phoneValidation.isValid) {
  console.log(phoneValidation.error); // "Please enter a valid phone number..."
}

// Validate password
const passwordValidation = validatePassword('Test@123456');
if (passwordValidation.isValid) {
  console.log(passwordValidation.strength); // "strong"
}
```

##### **formatters.js** (200+ lines)
Location: `frontend/src/utils/formatters.js`

**Functions:**
```javascript
// Format phone number for display
formatPhoneNumber(phone) → string

// Format date (short, long, iso)
formatDate(date, format) → string

// Format file size (Bytes, KB, MB, GB)
formatFileSize(bytes) → string

// Format currency
formatCurrency(amount, currency) → string

// Capitalize first letter
capitalize(str) → string

// Format name (capitalize each word)
formatName(name) → string

// Truncate text with ellipsis
truncateText(text, length) → string

// Format time ago (e.g., "2 hours ago")
formatTimeAgo(date) → string

// Get initials from name
getInitials(name) → string
```

**Usage Example:**
```javascript
import { formatPhoneNumber, formatDate } from '../utils/formatters';

const phone = formatPhoneNumber('+923001234567');
// Output: "+92 300 123 4567"

const date = formatDate('2026-04-26', 'long');
// Output: "April 26, 2026"
```

---

#### **2. Services (3 files)**

##### **userService.js** (150+ lines)
Location: `frontend/src/services/userService.js`

**API Endpoints:**
```javascript
// Get user profile
getProfile() → Promise<{ success, data }>

// Update user profile
updateProfile(profileData) → Promise<{ success, data }>

// Change password
changePassword(currentPassword, newPassword) → Promise<{ success, message }>

// Delete account
deleteAccount(password) → Promise<{ success, message }>

// Upload profile picture
uploadProfilePicture(file, onProgress) → Promise<{ success, data }>

// Get user by ID (public)
getUserById(userId) → Promise<{ success, data }>
```

**Features:**
- ✅ Automatic token injection in headers
- ✅ Automatic 401 redirect on auth failure
- ✅ Error handling
- ✅ Request/response interceptors

**Usage Example:**
```javascript
import * as userService from '../services/userService';

// Get profile
const profile = await userService.getProfile();
console.log(profile.data.fullName);

// Update profile
const updated = await userService.updateProfile({
  fullName: 'John Doe',
  phone: '+923001234567'
});

// Change password
await userService.changePassword('oldPassword', 'newPassword');

// Delete account
await userService.deleteAccount('password');
```

##### **profileService.js** (200+ lines)
Location: `frontend/src/services/profileService.js`

**API Endpoints:**

**Senior Endpoints:**
```javascript
getMedicalInfo() → Promise<{ success, data }>
updateMedicalInfo(medicalData) → Promise<{ success, data }>
```

**Caregiver Endpoints:**
```javascript
getLinkedSeniors() → Promise<{ success, data }>
addLinkedSenior(seniorId) → Promise<{ success, data }>
removeLinkedSenior(seniorId) → Promise<{ success, data }>
```

**Volunteer Endpoints:**
```javascript
getAvailability() → Promise<{ success, data }>
updateAvailability(availabilityData) → Promise<{ success, data }>
getSkills() → Promise<{ success, data }>
updateSkills(skills) → Promise<{ success, data }>
```

**Emergency Contacts Endpoints:**
```javascript
getEmergencyContacts() → Promise<{ success, data }>
addEmergencyContact(contactData) → Promise<{ success, data }>
updateEmergencyContact(contactId, contactData) → Promise<{ success, data }>
deleteEmergencyContact(contactId) → Promise<{ success, data }>
```

**Usage Example:**
```javascript
import * as profileService from '../services/profileService';

// Senior: Get medical info
const medicalInfo = await profileService.getMedicalInfo();

// Caregiver: Get linked seniors
const seniors = await profileService.getLinkedSeniors();

// Volunteer: Get skills
const skills = await profileService.getSkills();

// Emergency contacts
const contacts = await profileService.getEmergencyContacts();
```

##### **uploadService.js** (100+ lines)
Location: `frontend/src/services/uploadService.js`

**Functions:**
```javascript
// Generic file upload
uploadFile(file, uploadType, onProgress) → Promise<{ success, data }>

// Upload profile picture
uploadProfilePicture(file, onProgress) → Promise<{ success, data }>

// Upload document
uploadDocument(file, onProgress) → Promise<{ success, data }>

// Delete file
deleteFile(publicId) → Promise<{ success, message }>
```

**Features:**
- ✅ Progress tracking
- ✅ File validation
- ✅ Cloudinary integration
- ✅ Error handling

**Usage Example:**
```javascript
import * as uploadService from '../services/uploadService';

// Upload profile picture with progress
const result = await uploadService.uploadProfilePicture(file, (progress) => {
  console.log(`Upload progress: ${progress}%`);
});

console.log(result.data.url); // Cloudinary URL
```

---

#### **3. Custom Hooks (3 files)**

##### **useProfile.js** (100+ lines)
Location: `frontend/src/hooks/useProfile.js`

**Hook State:**
```javascript
{
  profile,           // User profile data
  loading,           // Loading state
  error,             // Error message
  success,           // Success message
  fetchProfile,      // Function to fetch profile
  updateProfile,     // Function to update profile
  changePassword,    // Function to change password
  deleteAccount,     // Function to delete account
  clearMessages      // Function to clear messages
}
```

**Usage Example:**
```javascript
import { useProfile } from '../hooks/useProfile';

function ProfilePage() {
  const { profile, loading, error, updateProfile } = useProfile();

  const handleSave = async (data) => {
    try {
      await updateProfile(data);
      // Success message shown automatically
    } catch (err) {
      // Error message shown automatically
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{profile?.fullName}</h1>
      <button onClick={() => handleSave({ fullName: 'New Name' })}>
        Save
      </button>
    </div>
  );
}
```

##### **useFileUpload.js** (150+ lines)
Location: `frontend/src/hooks/useFileUpload.js`

**Hook State:**
```javascript
{
  file,                    // Selected file
  preview,                 // Image preview (data URL)
  uploading,               // Upload in progress
  progress,                // Upload progress (0-100)
  error,                   // Error message
  success,                 // Success message
  handleFileSelect,        // Function to select file
  uploadFile,              // Function to upload file
  uploadProfilePicture,    // Function to upload profile picture
  clearFile,               // Function to clear file
  clearMessages            // Function to clear messages
}
```

**Usage Example:**
```javascript
import { useFileUpload } from '../hooks/useFileUpload';

function ProfilePictureUpload() {
  const {
    file,
    preview,
    uploading,
    progress,
    error,
    handleFileSelect,
    uploadProfilePicture
  } = useFileUpload(5, ['jpg', 'jpeg', 'png']);

  const handleUpload = async () => {
    try {
      const result = await uploadProfilePicture();
      console.log('Uploaded to:', result.url);
    } catch (err) {
      console.log('Upload failed:', error);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => handleFileSelect(e.target.files[0])}
      />
      {preview && <img src={preview} alt="Preview" />}
      {uploading && <div>Uploading: {progress}%</div>}
      {error && <div>Error: {error}</div>}
      <button onClick={handleUpload} disabled={!file || uploading}>
        Upload
      </button>
    </div>
  );
}
```

##### **usePasswordChange.js** (150+ lines)
Location: `frontend/src/hooks/usePasswordChange.js`

**Hook State:**
```javascript
{
  currentPassword,      // Current password input
  setCurrentPassword,   // Set current password
  newPassword,          // New password input
  setNewPassword,       // Set new password (with validation)
  confirmPassword,      // Confirm password input
  setConfirmPassword,   // Set confirm password
  loading,              // Loading state
  error,                // Error message
  success,              // Success message
  passwordStrength,     // Password strength (weak, medium, strong)
  passwordErrors,       // Array of password validation errors
  changePassword,       // Function to change password
  clearMessages,        // Function to clear messages
  resetForm             // Function to reset form
}
```

**Usage Example:**
```javascript
import { usePasswordChange } from '../hooks/usePasswordChange';

function ChangePasswordForm() {
  const {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    passwordStrength,
    passwordErrors,
    loading,
    error,
    success,
    changePassword,
    resetForm
  } = usePasswordChange();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await changePassword();
      resetForm();
    } catch (err) {
      // Error shown automatically
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        placeholder="Current Password"
      />
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="New Password"
      />
      <div>Strength: {passwordStrength}</div>
      {passwordErrors.map((err) => <div key={err}>{err}</div>)}
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm Password"
      />
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Changing...' : 'Change Password'}
      </button>
    </form>
  );
}
```

---

## 🔄 HOW TO PULL THE CODE

### **Step 1: Open Terminal/PowerShell**

On Windows:
```powershell
# Open PowerShell or Command Prompt
# Navigate to your project directory
cd D:\smart-assistant-for-senior-citizens-2026-04-04\smart-assistant-senior-citizens
```

On Mac/Linux:
```bash
cd ~/smart-assistant-for-senior-citizens
```

### **Step 2: Pull Latest Code**

```powershell
# Fetch latest changes from GitHub
git fetch origin

# Pull the latest code
git pull origin main
```

### **Step 3: Verify Pull Was Successful**

```powershell
# Check git status
git status

# Should show: "Your branch is up to date with 'origin/main'."
```

### **Step 4: Check New Files**

```powershell
# List new files in utils
dir frontend\src\utils\

# List new files in services
dir frontend\src\services\

# List new files in hooks
dir frontend\src\hooks\
```

### **Step 5: Install Dependencies (if needed)**

```powershell
cd frontend
npm install
```

### **Step 6: Start Development Server**

```powershell
npm start
```

The app should open at `http://localhost:3000`

---

## ✅ HOW TO VERIFY THE WORK

### **Method 1: Check Files Exist**

#### **1.1 Verify Utility Files**

```powershell
# Check validation.js exists
Test-Path frontend\src\utils\validation.js

# Check formatters.js exists
Test-Path frontend\src\utils\formatters.js
```

**Expected Output:** `True`

#### **1.2 Verify Service Files**

```powershell
# Check userService.js exists
Test-Path frontend\src\services\userService.js

# Check profileService.js exists
Test-Path frontend\src\services\profileService.js

# Check uploadService.js exists
Test-Path frontend\src\services\uploadService.js
```

**Expected Output:** `True` for all

#### **1.3 Verify Hook Files**

```powershell
# Check useProfile.js exists
Test-Path frontend\src\hooks\useProfile.js

# Check useFileUpload.js exists
Test-Path frontend\src\hooks\useFileUpload.js

# Check usePasswordChange.js exists
Test-Path frontend\src\hooks\usePasswordChange.js
```

**Expected Output:** `True` for all

---

### **Method 2: Check File Contents**

#### **2.1 Verify validation.js Functions**

Open `frontend/src/utils/validation.js` and verify these functions exist:

```javascript
✅ validatePhoneNumber
✅ validatePassword
✅ validateEmail
✅ validateFileSize
✅ validateFileFormat
✅ validateFile
✅ validateRequired
✅ validateDateOfBirth
✅ validatePasswordsMatch
```

#### **2.2 Verify formatters.js Functions**

Open `frontend/src/utils/formatters.js` and verify these functions exist:

```javascript
✅ formatPhoneNumber
✅ formatDate
✅ formatFileSize
✅ formatCurrency
✅ capitalize
✅ formatName
✅ truncateText
✅ formatTimeAgo
✅ getInitials
```

#### **2.3 Verify userService.js Functions**

Open `frontend/src/services/userService.js` and verify these functions exist:

```javascript
✅ getProfile
✅ updateProfile
✅ changePassword
✅ deleteAccount
✅ uploadProfilePicture
✅ getUserById
```

#### **2.4 Verify profileService.js Functions**

Open `frontend/src/services/profileService.js` and verify these functions exist:

```javascript
// Senior
✅ getMedicalInfo
✅ updateMedicalInfo

// Caregiver
✅ getLinkedSeniors
✅ addLinkedSenior
✅ removeLinkedSenior

// Volunteer
✅ getAvailability
✅ updateAvailability
✅ getSkills
✅ updateSkills

// Emergency Contacts
✅ getEmergencyContacts
✅ addEmergencyContact
✅ updateEmergencyContact
✅ deleteEmergencyContact
```

#### **2.5 Verify uploadService.js Functions**

Open `frontend/src/services/uploadService.js` and verify these functions exist:

```javascript
✅ uploadFile
✅ uploadProfilePicture
✅ uploadDocument
✅ deleteFile
```

#### **2.6 Verify useProfile.js Hook**

Open `frontend/src/hooks/useProfile.js` and verify:

```javascript
✅ Hook function: useProfile()
✅ Returns: profile, loading, error, success
✅ Methods: fetchProfile, updateProfile, changePassword, deleteAccount, clearMessages
```

#### **2.7 Verify useFileUpload.js Hook**

Open `frontend/src/hooks/useFileUpload.js` and verify:

```javascript
✅ Hook function: useFileUpload()
✅ Returns: file, preview, uploading, progress, error, success
✅ Methods: handleFileSelect, uploadFile, uploadProfilePicture, clearFile, clearMessages
```

#### **2.8 Verify usePasswordChange.js Hook**

Open `frontend/src/hooks/usePasswordChange.js` and verify:

```javascript
✅ Hook function: usePasswordChange()
✅ Returns: currentPassword, newPassword, confirmPassword, loading, error, success, passwordStrength, passwordErrors
✅ Methods: changePassword, clearMessages, resetForm
```

---

### **Method 3: Test Validation Functions**

Create a test file `frontend/src/test-validation.js`:

```javascript
import { validatePhoneNumber, validatePassword, validateFileSize } from './utils/validation';

// Test phone validation
console.log('=== Phone Validation ===');
console.log(validatePhoneNumber('+923001234567')); // Should be valid
console.log(validatePhoneNumber('123')); // Should be invalid

// Test password validation
console.log('\n=== Password Validation ===');
console.log(validatePassword('Test@123456')); // Should be strong
console.log(validatePassword('weak')); // Should be weak

// Test file size validation
console.log('\n=== File Size Validation ===');
console.log(validateFileSize(1024 * 1024 * 3, 5)); // 3MB, max 5MB - valid
console.log(validateFileSize(1024 * 1024 * 6, 5)); // 6MB, max 5MB - invalid
```

Run in browser console:
```javascript
// Open browser DevTools (F12)
// Go to Console tab
// Paste the test code above
// Should see validation results
```

---

### **Method 4: Check Git Commit History**

```powershell
# View recent commits
git log --oneline -10

# Should see:
# ✅ "feat: Phase 1 - Setup & Infrastructure..."
# ✅ "docs: Add Phase 1 completion report"
```

---

### **Method 5: Verify Line Count**

```powershell
# Count lines in validation.js
(Get-Content frontend\src\utils\validation.js | Measure-Object -Line).Lines

# Count lines in formatters.js
(Get-Content frontend\src\utils\formatters.js | Measure-Object -Line).Lines

# Count lines in userService.js
(Get-Content frontend\src\services\userService.js | Measure-Object -Line).Lines

# Count lines in profileService.js
(Get-Content frontend\src\services\profileService.js | Measure-Object -Line).Lines

# Count lines in uploadService.js
(Get-Content frontend\src\services\uploadService.js | Measure-Object -Line).Lines

# Count lines in useProfile.js
(Get-Content frontend\src\hooks\useProfile.js | Measure-Object -Line).Lines

# Count lines in useFileUpload.js
(Get-Content frontend\src\hooks\useFileUpload.js | Measure-Object -Line).Lines

# Count lines in usePasswordChange.js
(Get-Content frontend\src\hooks\usePasswordChange.js | Measure-Object -Line).Lines
```

**Expected Results:**
- validation.js: 250+ lines
- formatters.js: 200+ lines
- userService.js: 150+ lines
- profileService.js: 200+ lines
- uploadService.js: 100+ lines
- useProfile.js: 100+ lines
- useFileUpload.js: 150+ lines
- usePasswordChange.js: 150+ lines

---

### **Method 6: Check GitHub Repository**

1. Go to: https://github.com/naveediqbal4765/smart-assistant-senior-citizens
2. Navigate to `frontend/src/`
3. Verify folders exist:
   - ✅ `utils/` - Contains validation.js, formatters.js
   - ✅ `services/` - Contains userService.js, profileService.js, uploadService.js
   - ✅ `hooks/` - Contains useProfile.js, useFileUpload.js, usePasswordChange.js

---

## 📁 FILE STRUCTURE

```
frontend/src/
├── utils/
│   ├── validation.js (250+ lines)
│   │   ├── validatePhoneNumber()
│   │   ├── validatePassword()
│   │   ├── validateEmail()
│   │   ├── validateFileSize()
│   │   ├── validateFileFormat()
│   │   ├── validateFile()
│   │   ├── validateRequired()
│   │   ├── validateDateOfBirth()
│   │   └── validatePasswordsMatch()
│   │
│   └── formatters.js (200+ lines)
│       ├── formatPhoneNumber()
│       ├── formatDate()
│       ├── formatFileSize()
│       ├── formatCurrency()
│       ├── capitalize()
│       ├── formatName()
│       ├── truncateText()
│       ├── formatTimeAgo()
│       └── getInitials()
│
├── services/
│   ├── userService.js (150+ lines)
│   │   ├── getProfile()
│   │   ├── updateProfile()
│   │   ├── changePassword()
│   │   ├── deleteAccount()
│   │   ├── uploadProfilePicture()
│   │   └── getUserById()
│   │
│   ├── profileService.js (200+ lines)
│   │   ├── getMedicalInfo()
│   │   ├── updateMedicalInfo()
│   │   ├── getLinkedSeniors()
│   │   ├── addLinkedSenior()
│   │   ├── removeLinkedSenior()
│   │   ├── getAvailability()
│   │   ├── updateAvailability()
│   │   ├── getSkills()
│   │   ├── updateSkills()
│   │   ├── getEmergencyContacts()
│   │   ├── addEmergencyContact()
│   │   ├── updateEmergencyContact()
│   │   └── deleteEmergencyContact()
│   │
│   └── uploadService.js (100+ lines)
│       ├── uploadFile()
│       ├── uploadProfilePicture()
│       ├── uploadDocument()
│       └── deleteFile()
│
└── hooks/
    ├── useProfile.js (100+ lines)
    │   ├── profile
    │   ├── loading
    │   ├── error
    │   ├── success
    │   ├── fetchProfile()
    │   ├── updateProfile()
    │   ├── changePassword()
    │   ├── deleteAccount()
    │   └── clearMessages()
    │
    ├── useFileUpload.js (150+ lines)
    │   ├── file
    │   ├── preview
    │   ├── uploading
    │   ├── progress
    │   ├── error
    │   ├── success
    │   ├── handleFileSelect()
    │   ├── uploadFile()
    │   ├── uploadProfilePicture()
    │   ├── clearFile()
    │   └── clearMessages()
    │
    └── usePasswordChange.js (150+ lines)
        ├── currentPassword
        ├── newPassword
        ├── confirmPassword
        ├── loading
        ├── error
        ├── success
        ├── passwordStrength
        ├── passwordErrors
        ├── changePassword()
        ├── clearMessages()
        └── resetForm()
```

---

## 🔌 API DOCUMENTATION

### **Base URL**
```
http://localhost:5000/api
```

### **User Endpoints**

#### **GET /users/profile**
Get current user profile
```javascript
// Request
GET /api/users/profile
Authorization: Bearer {token}

// Response
{
  "success": true,
  "data": {
    "_id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+923001234567",
    "role": "elder",
    "profilePicture": "url",
    "address": "123 Main St",
    "dateOfBirth": "1990-01-15",
    "createdAt": "2026-04-26T12:26:15.118Z"
  }
}
```

#### **PUT /users/profile**
Update user profile
```javascript
// Request
PUT /api/users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "fullName": "Jane Doe",
  "phone": "+923001234567",
  "address": "456 Oak Ave"
}

// Response
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ... }
}
```

#### **PUT /users/password**
Change password
```javascript
// Request
PUT /api/users/password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "oldPassword",
  "newPassword": "newPassword"
}

// Response
{
  "success": true,
  "message": "Password changed successfully"
}
```

#### **DELETE /users/account**
Delete account
```javascript
// Request
DELETE /api/users/account
Authorization: Bearer {token}
Content-Type: application/json

{
  "password": "userPassword"
}

// Response
{
  "success": true,
  "message": "Account deleted successfully"
}
```

### **Profile Endpoints**

#### **GET /profile/medical-info** (Seniors)
Get medical information
```javascript
// Response
{
  "success": true,
  "data": {
    "bloodGroup": "O+",
    "allergies": ["Penicillin"],
    "primaryCaregiver": "contact_id"
  }
}
```

#### **GET /profile/linked-seniors** (Caregivers)
Get linked seniors
```javascript
// Response
{
  "success": true,
  "data": [
    {
      "_id": "senior_id",
      "fullName": "Senior Name",
      "email": "senior@example.com"
    }
  ]
}
```

#### **GET /profile/availability** (Volunteers)
Get availability
```javascript
// Response
{
  "success": true,
  "data": {
    "monday": true,
    "tuesday": true,
    "wednesday": false,
    ...
  }
}
```

#### **GET /profile/skills** (Volunteers)
Get skills
```javascript
// Response
{
  "success": true,
  "data": {
    "skills": ["Grocery Shopping", "Tech Support"]
  }
}
```

#### **GET /profile/emergency-contacts**
Get emergency contacts
```javascript
// Response
{
  "success": true,
  "data": [
    {
      "_id": "contact_id",
      "name": "Contact Name",
      "relation": "Son",
      "phone": "+923001234567"
    }
  ]
}
```

---

## ✔️ VALIDATION RULES

### **Phone Number**
- Format: `+92XXXXXXXXXX` or `03XXXXXXXXXX`
- Length: 11-12 digits
- No letters or special characters
- Error: "Please enter a valid phone number (e.g., +923001234567 or 03001234567)."

### **Password**
- Minimum 8 characters
- At least 1 uppercase letter (A-Z)
- At least 1 lowercase letter (a-z)
- At least 1 number (0-9)
- At least 1 special character (!@#$%^&*)
- Strength levels: weak, medium, strong

### **Email**
- Valid email format (user@domain.com)
- Error: "Please enter a valid email address."

### **File Size**
- Maximum 5MB
- Error: "File too large; please upload an image under 5MB."

### **File Format**
- Allowed: .jpg, .jpeg, .png
- Error: "Please upload a valid image file (.jpg, .png)."

### **Date of Birth**
- Minimum age: 18 years
- Maximum age: 150 years
- Error: "You must be at least 18 years old."

---

## 💡 USAGE EXAMPLES

### **Example 1: Update Profile with Validation**

```javascript
import { useProfile } from '../hooks/useProfile';
import { validatePhoneNumber } from '../utils/validation';

function UpdateProfileForm() {
  const { profile, loading, error, success, updateProfile } = useProfile();
  const [formData, setFormData] = useState({
    fullName: profile?.fullName || '',
    phone: profile?.phone || '',
    address: profile?.address || ''
  });
  const [phoneError, setPhoneError] = useState('');

  const handlePhoneChange = (e) => {
    const phone = e.target.value;
    setFormData({ ...formData, phone });

    // Validate phone
    const validation = validatePhoneNumber(phone);
    setPhoneError(validation.error || '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate phone before submit
    const validation = validatePhoneNumber(formData.phone);
    if (!validation.isValid) {
      setPhoneError(validation.error);
      return;
    }

    try {
      await updateProfile(formData);
      // Success message shown automatically
    } catch (err) {
      // Error message shown automatically
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.fullName}
        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        placeholder="Full Name"
      />
      <input
        type="tel"
        value={formData.phone}
        onChange={handlePhoneChange}
        placeholder="Phone Number"
      />
      {phoneError && <span className="error">{phoneError}</span>}
      <input
        type="text"
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        placeholder="Address"
      />
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}
```

### **Example 2: Upload Profile Picture with Progress**

```javascript
import { useFileUpload } from '../hooks/useFileUpload';

function ProfilePictureUpload() {
  const {
    file,
    preview,
    uploading,
    progress,
    error,
    success,
    handleFileSelect,
    uploadProfilePicture,
    clearFile
  } = useFileUpload(5, ['jpg', 'jpeg', 'png']);

  const handleUpload = async () => {
    try {
      const result = await uploadProfilePicture();
      console.log('Uploaded to:', result.url);
      clearFile();
    } catch (err) {
      console.log('Upload failed');
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => handleFileSelect(e.target.files[0])}
        accept="image/*"
      />
      {preview && (
        <div>
          <img src={preview} alt="Preview" style={{ maxWidth: '200px' }} />
        </div>
      )}
      {uploading && (
        <div>
          <div>Uploading: {progress}%</div>
          <progress value={progress} max="100" />
        </div>
      )}
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? 'Uploading...' : 'Upload Picture'}
      </button>
    </div>
  );
}
```

### **Example 3: Change Password with Strength Indicator**

```javascript
import { usePasswordChange } from '../hooks/usePasswordChange';

function ChangePasswordForm() {
  const {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    passwordStrength,
    passwordErrors,
    loading,
    error,
    success,
    changePassword,
    resetForm
  } = usePasswordChange();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await changePassword();
      resetForm();
    } catch (err) {
      // Error shown automatically
    }
  };

  const strengthColor = {
    weak: 'red',
    medium: 'orange',
    strong: 'green'
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        placeholder="Current Password"
        required
      />
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="New Password"
        required
      />
      <div style={{ color: strengthColor[passwordStrength] }}>
        Strength: {passwordStrength}
      </div>
      {passwordErrors.length > 0 && (
        <ul className="errors">
          {passwordErrors.map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      )}
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm Password"
        required
      />
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Changing...' : 'Change Password'}
      </button>
    </form>
  );
}
```

---

## 🚀 NEXT PHASES

### **Phase 2: Basic Profile Page (3-4 hours)**
- Create BasicInfoForm component
- Create ToastNotification component
- Update ElderMyProfile.js with API integration
- Implement CASE 01: Updating Basic Information

### **Phase 3: Profile Picture Upload (2-3 hours)**
- Create ProfilePictureUpload component
- Implement CASE 04: Profile Picture Upload

### **Phase 4: Password Change (3-4 hours)**
- Create PasswordChangeForm component
- Implement CASE 03: Password Sensitivity & Security

### **Phase 5: Role-Based Customization (3-4 hours)**
- Create RoleSpecificSection component
- Create SeniorMedicalInfo component
- Create CaregiverLinkedSeniors component
- Create VolunteerAvailability component
- Create VolunteerSkills component
- Implement CASE 02: Role-Based Profile Customization

### **Phase 6: Account Deletion (2-3 hours)**
- Create DeleteAccountModal component
- Implement CASE 05: Account Deletion

---

## 📞 SUPPORT

For issues or questions:
1. Check the documentation above
2. Review the code comments in the files
3. Check the GitHub repository
4. Review the usage examples

---

**Documentation Version:** 1.0  
**Last Updated:** April 26, 2026  
**Status:** Phase 1 Complete ✅  
**Next Phase:** Phase 2 - Basic Profile Page

---

**Ready to start Phase 2?** 🚀
