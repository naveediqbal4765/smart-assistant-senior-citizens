# 🎯 MODULE 2 - USER PROFILE MANAGEMENT - IMPLEMENTATION PLAN

**Smart Assistant for Senior Citizens**  
**Date:** April 26, 2026  
**Status:** Ready to Implement

---

## 📋 REQUIREMENTS SUMMARY

### **Core Features**
1. ✅ Editable Profile Picture
2. ✅ Text Fields (Name, Phone, Address, Date of Birth)
3. ✅ Role-Specific Details Section
4. ✅ Update Password Section
5. ✅ Save Changes Button
6. ✅ Delete Account

---

## 🎯 IMPLEMENTATION CASES

### **CASE 01: UPDATING BASIC INFORMATION**

**Requirements:**
- User can modify Name, Phone, Address
- Click "Save Changes" to commit to database
- Phone number validation (no letters, correct digit count)
- Error message: "Please enter a valid phone number."
- Success message: "Profile Updated Successfully" (toast notification)

**Tasks:**
- [ ] Create form validation for phone number
- [ ] Create API call to update profile
- [ ] Create toast notification component
- [ ] Test phone validation with various inputs
- [ ] Test successful update flow

**Estimated Time:** 2-3 hours

---

### **CASE 02: ROLE-BASED PROFILE CUSTOMIZATION**

**Requirements:**

#### **Senior Users:**
- Medical Emergency Information section
- Blood Group field
- Allergies field
- Primary Caregiver Contact field

#### **Caregiver Users:**
- Linked Seniors list
- Add senior option
- Remove senior option

#### **Volunteer Users:**
- Availability Toggle
- Skills section (Grocery Shopping, Tech Support, etc.)
- Skills determine tasks in community module

**Tasks:**
- [ ] Create conditional rendering based on user role
- [ ] Create Senior medical info form
- [ ] Create Caregiver linked seniors list
- [ ] Create Volunteer availability toggle
- [ ] Create Volunteer skills selector
- [ ] Test role-based rendering
- [ ] Test data persistence for each role

**Estimated Time:** 3-4 hours

---

### **CASE 03: PASSWORD SENSITIVITY & SECURITY**

**Requirements:**
- User enters "Current Password" for verification
- If incorrect: "Verification failed: Incorrect current password."
- User enters "New Password" and "Confirm New Password"
- System logs user out of all other active sessions
- Password change is secure and verified

**Tasks:**
- [ ] Create password change form
- [ ] Create current password verification
- [ ] Create password strength validation
- [ ] Create API call to change password
- [ ] Implement session logout on all devices
- [ ] Test password verification flow
- [ ] Test incorrect password handling
- [ ] Test session logout functionality

**Estimated Time:** 3-4 hours

---

### **CASE 04: PROFILE PICTURE UPLOAD**

**Requirements:**
- Click profile image to open file explorer/gallery
- File size validation (max 5MB)
- Error: "File too large; please upload an image under 5MB."
- File format validation (.jpg, .png only)
- Error: "Please upload a valid image file (.jpg, .png)."
- Upload to Cloudinary

**Tasks:**
- [ ] Create file input component
- [ ] Create file size validation
- [ ] Create file format validation
- [ ] Create upload to Cloudinary
- [ ] Create progress indicator
- [ ] Create error handling
- [ ] Test with various file sizes
- [ ] Test with various file formats
- [ ] Test upload success/failure

**Estimated Time:** 2-3 hours

---

### **CASE 05: ACCOUNT DELETION**

**Requirements:**
- Click "Delete Account" opens confirmation modal
- Modal asks: "Are you sure? This action cannot be undone."
- User must type "DELETE" OR enter password
- All user data wiped from database
- Redirect to Welcome/Signup screen

**Tasks:**
- [ ] Create delete account button
- [ ] Create confirmation modal
- [ ] Create "DELETE" text verification
- [ ] Create password verification option
- [ ] Create API call to delete account
- [ ] Create redirect to signup
- [ ] Test confirmation flow
- [ ] Test data deletion
- [ ] Test redirect

**Estimated Time:** 2-3 hours

---

## 📁 FILES TO CREATE/UPDATE

### **New Files to Create**

```
frontend/src/
├── pages/
│   ├── elder/
│   │   └── ElderMyProfile.js (UPDATE - add API integration)
│   ├── caregiver/
│   │   └── CaregiverProfile.js (CREATE)
│   └── volunteer/
│       └── VolunteerProfile.js (CREATE)
├── components/
│   ├── ProfilePictureUpload.js (CREATE)
│   ├── BasicInfoForm.js (CREATE)
│   ├── PasswordChangeForm.js (CREATE)
│   ├── DeleteAccountModal.js (CREATE)
│   ├── RoleSpecificSection.js (CREATE)
│   ├── SeniorMedicalInfo.js (CREATE)
│   ├── CaregiverLinkedSeniors.js (CREATE)
│   ├── VolunteerAvailability.js (CREATE)
│   ├── VolunteerSkills.js (CREATE)
│   └── ToastNotification.js (CREATE)
├── services/
│   ├── userService.js (CREATE)
│   ├── profileService.js (CREATE)
│   └── uploadService.js (CREATE)
├── hooks/
│   ├── useProfile.js (CREATE)
│   ├── useFileUpload.js (CREATE)
│   └── usePasswordChange.js (CREATE)
└── utils/
    ├── validation.js (CREATE)
    └── formatters.js (CREATE)
```

---

## 🔧 IMPLEMENTATION PHASES

### **PHASE 1: SETUP & INFRASTRUCTURE (2-3 hours)**

**Tasks:**
- [ ] Create userService.js with API calls
- [ ] Create profileService.js with API calls
- [ ] Create uploadService.js for Cloudinary
- [ ] Create validation utilities
- [ ] Create custom hooks
- [ ] Set up error handling
- [ ] Set up loading states

**Files:**
- userService.js
- profileService.js
- uploadService.js
- validation.js
- useProfile.js
- useFileUpload.js

---

### **PHASE 2: BASIC PROFILE PAGE (3-4 hours)**

**Tasks:**
- [ ] Update ElderMyProfile.js with API integration
- [ ] Create BasicInfoForm component
- [ ] Add phone number validation
- [ ] Add save changes functionality
- [ ] Add toast notifications
- [ ] Test basic info update
- [ ] Test validation

**Files:**
- ElderMyProfile.js (UPDATE)
- BasicInfoForm.js (CREATE)
- ToastNotification.js (CREATE)

---

### **PHASE 3: PROFILE PICTURE UPLOAD (2-3 hours)**

**Tasks:**
- [ ] Create ProfilePictureUpload component
- [ ] Add file size validation
- [ ] Add file format validation
- [ ] Add upload to Cloudinary
- [ ] Add progress indicator
- [ ] Test upload functionality
- [ ] Test error handling

**Files:**
- ProfilePictureUpload.js (CREATE)
- uploadService.js (CREATE)

---

### **PHASE 4: PASSWORD CHANGE (3-4 hours)**

**Tasks:**
- [ ] Create PasswordChangeForm component
- [ ] Add current password verification
- [ ] Add password strength validation
- [ ] Add session logout on all devices
- [ ] Test password change flow
- [ ] Test verification
- [ ] Test session logout

**Files:**
- PasswordChangeForm.js (CREATE)
- usePasswordChange.js (CREATE)

---

### **PHASE 5: ROLE-BASED CUSTOMIZATION (3-4 hours)**

**Tasks:**
- [ ] Create RoleSpecificSection component
- [ ] Create SeniorMedicalInfo component
- [ ] Create CaregiverLinkedSeniors component
- [ ] Create VolunteerAvailability component
- [ ] Create VolunteerSkills component
- [ ] Test role-based rendering
- [ ] Test data persistence

**Files:**
- RoleSpecificSection.js (CREATE)
- SeniorMedicalInfo.js (CREATE)
- CaregiverLinkedSeniors.js (CREATE)
- VolunteerAvailability.js (CREATE)
- VolunteerSkills.js (CREATE)

---

### **PHASE 6: ACCOUNT DELETION (2-3 hours)**

**Tasks:**
- [ ] Create DeleteAccountModal component
- [ ] Add "DELETE" text verification
- [ ] Add password verification option
- [ ] Add API call to delete account
- [ ] Add redirect to signup
- [ ] Test confirmation flow
- [ ] Test data deletion

**Files:**
- DeleteAccountModal.js (CREATE)

---

### **PHASE 7: CAREGIVER & VOLUNTEER PROFILES (3-4 hours)**

**Tasks:**
- [ ] Create CaregiverProfile.js
- [ ] Create VolunteerProfile.js
- [ ] Add role-specific sections
- [ ] Test both profiles
- [ ] Test data persistence

**Files:**
- CaregiverProfile.js (CREATE)
- VolunteerProfile.js (CREATE)

---

### **PHASE 8: TESTING & REFINEMENT (2-3 hours)**

**Tasks:**
- [ ] Test all form validations
- [ ] Test all API integrations
- [ ] Test error handling
- [ ] Test loading states
- [ ] Test responsive design
- [ ] Test on mobile devices
- [ ] Fix bugs

---

### **PHASE 9: STYLING & UX (2-3 hours)**

**Tasks:**
- [ ] Apply consistent styling
- [ ] Use brand colors
- [ ] Add animations
- [ ] Improve form UX
- [ ] Add help text
- [ ] Test accessibility
- [ ] Optimize performance

---

## 📊 TASK BREAKDOWN

| Phase | Tasks | Time | Status |
|-------|-------|------|--------|
| 1. Setup | 7 | 2-3h | ⏳ |
| 2. Basic Profile | 7 | 3-4h | ⏳ |
| 3. Picture Upload | 7 | 2-3h | ⏳ |
| 4. Password Change | 7 | 3-4h | ⏳ |
| 5. Role-Based | 5 | 3-4h | ⏳ |
| 6. Account Delete | 7 | 2-3h | ⏳ |
| 7. Other Profiles | 7 | 3-4h | ⏳ |
| 8. Testing | 7 | 2-3h | ⏳ |
| 9. Styling | 7 | 2-3h | ⏳ |
| **TOTAL** | **69** | **24-32h** | **⏳** |

---

## 🚀 RECOMMENDED START ORDER

### **Week 1: Core Functionality**
1. Phase 1: Setup & Infrastructure (2-3h)
2. Phase 2: Basic Profile Page (3-4h)
3. Phase 3: Profile Picture Upload (2-3h)

### **Week 2: Security & Customization**
4. Phase 4: Password Change (3-4h)
5. Phase 5: Role-Based Customization (3-4h)
6. Phase 6: Account Deletion (2-3h)

### **Week 3: Completion**
7. Phase 7: Caregiver & Volunteer Profiles (3-4h)
8. Phase 8: Testing & Refinement (2-3h)
9. Phase 9: Styling & UX (2-3h)

---

## 🎯 API ENDPOINTS NEEDED

### **User Service**
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/password` - Change password
- `DELETE /api/users/account` - Delete account

### **Profile Service**
- `GET /api/profile/medical-info` - Get medical info (seniors)
- `PUT /api/profile/medical-info` - Update medical info
- `GET /api/profile/linked-seniors` - Get linked seniors (caregivers)
- `POST /api/profile/linked-seniors` - Add linked senior
- `DELETE /api/profile/linked-seniors/:id` - Remove linked senior
- `GET /api/profile/availability` - Get availability (volunteers)
- `PUT /api/profile/availability` - Update availability
- `GET /api/profile/skills` - Get skills (volunteers)
- `PUT /api/profile/skills` - Update skills

### **Upload Service**
- `POST /api/upload/profile-picture` - Upload profile picture

---

## ✅ VALIDATION RULES

### **Phone Number**
- Format: +92XXXXXXXXXX or 03XXXXXXXXXX
- Length: 11-12 digits
- No letters or special characters

### **Password**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

### **File Upload**
- Max size: 5MB
- Allowed formats: .jpg, .png
- Mime types: image/jpeg, image/png

---

## 🔐 SECURITY CONSIDERATIONS

1. **Password Change**
   - Verify current password before allowing change
   - Log out all other sessions
   - Use HTTPS for transmission

2. **Account Deletion**
   - Require confirmation (type "DELETE" or password)
   - Soft delete (mark as deleted, don't remove data)
   - Or hard delete with backup

3. **File Upload**
   - Validate file size and format
   - Scan for malware
   - Store in secure cloud storage (Cloudinary)

4. **Data Privacy**
   - Don't expose sensitive data in logs
   - Use secure tokens for authentication
   - Encrypt sensitive fields

---

## 📝 TESTING CHECKLIST

### **Form Validation**
- [ ] Phone number validation
- [ ] Password strength validation
- [ ] File size validation
- [ ] File format validation
- [ ] Required field validation

### **API Integration**
- [ ] Get profile data
- [ ] Update profile data
- [ ] Change password
- [ ] Delete account
- [ ] Upload profile picture

### **Error Handling**
- [ ] Invalid phone number
- [ ] Incorrect current password
- [ ] File too large
- [ ] Invalid file format
- [ ] Network errors
- [ ] Server errors

### **User Experience**
- [ ] Toast notifications appear
- [ ] Loading states show
- [ ] Error messages display
- [ ] Success messages display
- [ ] Redirect works correctly

### **Security**
- [ ] Password verified before change
- [ ] Session logout works
- [ ] Account deletion confirmed
- [ ] Data actually deleted
- [ ] Redirect to signup

---

## 🎯 SUCCESS CRITERIA

✅ All 5 cases implemented  
✅ All validations working  
✅ All API calls functional  
✅ All error handling in place  
✅ All tests passing  
✅ Responsive design working  
✅ Accessibility compliant  
✅ Performance optimized  

---

**Total Estimated Time:** 24-32 hours  
**Difficulty:** Medium ⭐⭐⭐  
**Status:** Ready to Start 🚀

**Ready to begin Phase 1?**
