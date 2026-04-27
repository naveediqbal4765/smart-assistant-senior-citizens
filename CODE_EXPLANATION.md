# Code Structure & Implementation Guide

## 📚 Table of Contents

1. [Frontend Architecture](#frontend-architecture)
2. [Module 1: Authentication](#module-1-authentication)
3. [Module 2: User Profile](#module-2-user-profile)
4. [Module 3: Task Request System](#module-3-task-request-system)
5. [Component Structure](#component-structure)
6. [State Management](#state-management)
7. [API Integration](#api-integration)
8. [Styling & Design](#styling--design)

---

## Frontend Architecture

### **Project Structure**

```
frontend/src/
├── pages/
│   ├── auth/                    # Authentication pages
│   │   ├── LoginPage.js
│   │   ├── SignupPage.js
│   │   ├── RoleSelectionPage.js
│   │   ├── VerifyOTPPage.js
│   │   ├── ForgotPasswordPage.js
│   │   └── ResetPasswordPage.js
│   │
│   ├── elder/                   # Elder dashboard pages
│   │   ├── ElderDashboard.js
│   │   ├── ElderTaskRequest.js
│   │   ├── ElderLabReports.js
│   │   ├── ElderPrescriptions.js
│   │   ├── ElderHealthHistory.js
│   │   ├── ElderMessages.js
│   │   ├── ElderSleepTimer.js
│   │   ├── ElderMedicationReminder.js
│   │   └── ElderPhysicalRehabilitation.js
│   │
│   ├── caregiver/               # Caregiver dashboard pages
│   │   ├── CaregiverDashboard.js
│   │   ├── CaregiverTaskManagement.js
│   │   ├── CaregiverNotificationsPage.js
│   │   └── CaregiverTaskAnalyticsPage.js
│   │
│   ├── volunteer/               # Volunteer dashboard pages
│   │   ├── VolunteerDashboard.js
│   │   ├── VolunteerTaskList.js
│   │   ├── VolunteerNotificationsPage.js
│   │   ├── VolunteerTaskAnalyticsPage.js
│   │   └── VolunteerRatingsPage.js
│   │
│   ├── task/                    # Task management pages
│   │   ├── TaskDetailPage.js
│   │   ├── TaskHistoryPage.js
│   │   ├── TaskNotificationsPage.js
│   │   ├── TaskRatingPage.js
│   │   ├── VolunteerProfilePage.js
│   │   ├── TaskAnalyticsPage.js
│   │   ├── CaregiverNotificationsPage.js
│   │   ├── CaregiverTaskAnalyticsPage.js
│   │   ├── VolunteerNotificationsPage.js
│   │   ├── VolunteerTaskAnalyticsPage.js
│   │   ├── VolunteerRatingsPage.js
│   │   └── ElderTaskRequestNotificationsPage.js
│   │
│   ├── profile/                 # Profile management pages
│   │   ├── ProfilePage.js
│   │   ├── EditProfilePage.js
│   │   ├── PrivacySettingsPage.js
│   │   └── AccountSettingsPage.js
│   │
│   └── common/                  # Common pages
│       ├── HomePage.js
│       ├── NotFoundPage.js
│       └── UnauthorizedPage.js
│
├── components/                  # Reusable components
│   ├── Navbar.js
│   ├── Footer.js
│   ├── Sidebar.js
│   ├── GoogleLoginButton.js
│   ├── FacebookLoginButton.js
│   ├── TaskCard.js
│   ├── TaskForm.js
│   ├── TaskFilter.js
│   ├── TaskSearch.js
│   ├── TaskStatusBadge.js
│   ├── TaskPriorityBadge.js
│   ├── TaskAssignmentModal.js
│   └── ProtectedRoute.js
│
├── context/                     # State management
│   ├── AuthContext.js
│   ├── UserContext.js
│   └── TaskContext.js
│
├── assets/                      # Static files
│   ├── images/
│   ├── fonts/
│   └── icons/
│
├── App.js                       # Main app component with routing
├── index.js                     # Entry point
└── index.css                    # Global styles
```

---

## Module 1: Authentication

### **LoginPage.js**

**Purpose**: User login with email/password or social auth

**Key Features**:
- Email and password input validation
- Google OAuth integration
- Facebook OAuth integration
- Remember Me functionality
- Error handling and toast notifications
- Responsive design

**Code Structure**:
```javascript
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = async () => {
    // Validate inputs
    // Call API to authenticate
    // Store tokens in localStorage
    // Redirect to dashboard
  };
  
  return (
    // Login form with email, password, remember me
    // Google and Facebook OAuth buttons
    // Sign up link
  );
};
```

### **SignupPage.js**

**Purpose**: User registration with email/password

**Key Features**:
- Form validation (email, password strength)
- Password confirmation
- Terms and conditions acceptance
- Error handling
- Success message and redirect

**Code Structure**:
```javascript
const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });
  
  const handleSignup = async () => {
    // Validate form data
    // Call API to create user
    // Show success message
    // Redirect to role selection
  };
  
  return (
    // Signup form with all fields
    // Terms and conditions checkbox
    // Login link
  );
};
```

### **RoleSelectionPage.js**

**Purpose**: User selects their role (Elder, Caregiver, Volunteer)

**Key Features**:
- Three role options with descriptions
- Role selection with visual feedback
- Confirmation and redirect to profile setup

**Code Structure**:
```javascript
const RoleSelectionPage = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  
  const handleRoleSelection = (role) => {
    // Set selected role
    // Call API to update user role
    // Redirect to profile setup
  };
  
  return (
    // Three role cards (Elder, Caregiver, Volunteer)
    // Role descriptions
    // Continue button
  );
};
```

---

## Module 2: User Profile

### **ProfilePage.js**

**Purpose**: Display user profile information

**Key Features**:
- Display user information
- Profile picture
- Edit profile link
- Privacy settings link
- Account settings link

**Code Structure**:
```javascript
const ProfilePage = () => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Fetch user data from API
    // Set user state
  }, []);
  
  return (
    // User profile information
    // Profile picture
    // Edit and settings buttons
  );
};
```

### **EditProfilePage.js**

**Purpose**: Edit user profile information

**Key Features**:
- Edit all profile fields
- Upload profile picture
- Form validation
- Save changes to API

**Code Structure**:
```javascript
const EditProfilePage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    profilePicture: null
  });
  
  const handleSave = async () => {
    // Validate form data
    // Upload profile picture if changed
    // Call API to update profile
    // Show success message
  };
  
  return (
    // Edit form with all fields
    // Profile picture upload
    // Save and cancel buttons
  );
};
```

---

## Module 3: Task Request System

### **Elder Dashboard**

#### **ElderDashboard.js**

**Purpose**: Main dashboard for elders

**Key Features**:
- Emergency contacts speed dial
- Live vitals monitor (heart rate, oxygen, temperature)
- Medical vault (lab reports, prescriptions, health history)
- Mobility & help layer (task request, AI voice assistant, book ride, find volunteer)
- Wellness & support (messages, sleep timer, medication reminder, physical rehabilitation)
- Navigation menu

**Code Structure**:
```javascript
const ElderDashboard = () => {
  const [vitals, setVitals] = useState({
    heartRate: 72,
    oxygen: 98,
    temperature: 36.5
  });
  
  const [emergencyContacts, setEmergencyContacts] = useState([
    { id: 1, name: "Ahmed", relation: "Son", phone: "123456789" },
    // ... more contacts
  ]);
  
  return (
    // Header with navigation
    // Emergency contacts section
    // Live vitals monitor
    // Medical vault section
    // Mobility & help section
    // Wellness & support section
  );
};
```

#### **ElderTaskRequest.js**

**Purpose**: Create and manage task requests

**Key Features**:
- Task creation form
- Task details (title, description, category, priority, scheduled time)
- Browse available volunteers
- Task history
- Task status tracking

**Code Structure**:
```javascript
const ElderTaskRequest = () => {
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium",
    scheduledTime: ""
  });
  
  const handleCreateTask = async () => {
    // Validate form data
    // Call API to create task
    // Show success message
    // Redirect to task list
  };
  
  return (
    // Task creation form
    // Task list with status
    // Browse volunteers button
  );
};
```

### **Caregiver Dashboard**

#### **CaregiverDashboard.js**

**Purpose**: Main dashboard for caregivers

**Key Features**:
- Elder information display
- Task management card
- Notifications card
- Analytics card
- Quick actions

**Code Structure**:
```javascript
const CaregiverDashboard = () => {
  const [elderData, setElderData] = useState({
    name: "Fatima Ahmed",
    age: 75,
    healthStatus: "Stable",
    lastCheckup: "2025-04-25"
  });
  
  return (
    // Header with elder name
    // Elder health status
    // Task management section
    // Notifications section
    // Analytics section
  );
};
```

#### **CaregiverNotificationsPage.js**

**Purpose**: Display notifications for caregiver

**Key Features**:
- Volunteer accepted task notifications
- Volunteer applied notifications
- SOS emergency alerts with sound and vibration
- Task reminder notifications
- Mark as read and delete functionality

**Code Structure**:
```javascript
const CaregiverNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [sosActive, setSosActive] = useState(false);
  
  const playEmergencySound = () => {
    // Create audio context
    // Generate siren sound
    // Play sound
  };
  
  const triggerVibration = () => {
    // Use Vibration API
    // Trigger vibration pattern
  };
  
  return (
    // Notifications list
    // SOS alert banner
    // Mark as read and delete buttons
  );
};
```

#### **CaregiverTaskAnalyticsPage.js**

**Purpose**: Display task analytics for caregiver

**Key Features**:
- Task statistics (total, completed, pending, completion rate)
- Tasks by category with progress bars
- Tasks by priority breakdown
- Top volunteers ranking
- Monthly trends visualization

**Code Structure**:
```javascript
const CaregiverTaskAnalyticsPage = () => {
  const analyticsData = {
    totalTasks: 12,
    completedTasks: 8,
    pendingTasks: 3,
    completionRate: 67
  };
  
  return (
    // Statistics cards
    // Tasks by category chart
    // Tasks by priority chart
    // Top volunteers list
    // Monthly trends chart
  );
};
```

### **Volunteer Dashboard**

#### **VolunteerDashboard.js**

**Purpose**: Main dashboard for volunteers

**Key Features**:
- Available tasks count
- Accepted tasks count
- Quick action buttons (Browse Tasks, Notifications, My Ratings, Analytics)
- Profile information

**Code Structure**:
```javascript
const VolunteerDashboard = () => {
  const [stats, setStats] = useState({
    availableTasks: 15,
    acceptedTasks: 3,
    completedTasks: 12
  });
  
  return (
    // Header with volunteer name
    // Statistics cards
    // Quick action buttons
    // Recent tasks list
  );
};
```

#### **VolunteerTaskList.js**

**Purpose**: Browse and accept available tasks

**Key Features**:
- List of available tasks
- Task filtering and search
- Task details (title, description, category, priority, elder name, rating, distance)
- Accept button (changed from "Apply Now")
- Tabs for Available and Accepted tasks

**Code Structure**:
```javascript
const VolunteerTaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [appliedTasks, setAppliedTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("available");
  
  const handleAcceptTask = (taskId) => {
    // Add task to accepted list
    // Call API to accept task
    // Show success message
  };
  
  return (
    // Tabs (Available, Accepted)
    // Task list with cards
    // Accept button for each task
    // Search and filter options
  );
};
```

#### **VolunteerNotificationsPage.js**

**Purpose**: Display notifications for volunteer

**Key Features**:
- Task request notifications from elders
- Review and points feedback notifications
- Task reminder notifications
- SOS emergency alerts (if in radius range)
- Mark as read and delete functionality

**Code Structure**:
```javascript
const VolunteerNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [sosActive, setSosActive] = useState(false);
  
  const triggerSOS = () => {
    // Check if volunteer is in radius range
    // Play emergency sound
    // Trigger vibration
    // Show SOS alert
  };
  
  return (
    // Notifications list
    // SOS alert banner
    // Mark as read and delete buttons
  );
};
```

#### **VolunteerTaskAnalyticsPage.js**

**Purpose**: Display task analytics for volunteer

**Key Features**:
- Task statistics (total, completed, accepted, pending, completion rate)
- Total points earned
- Tasks by status breakdown
- Tasks by category with progress bars
- Recent completed tasks with ratings and points
- Monthly trends visualization

**Code Structure**:
```javascript
const VolunteerTaskAnalyticsPage = () => {
  const analyticsData = {
    totalTasks: 15,
    completedTasks: 12,
    acceptedTasks: 2,
    pendingTasks: 1,
    totalPoints: 480
  };
  
  return (
    // Statistics cards
    // Tasks by status chart
    // Tasks by category chart
    // Recent completed tasks list
    // Monthly trends chart
  );
};
```

#### **VolunteerRatingsPage.js**

**Purpose**: Display ratings and reviews from elders

**Key Features**:
- All ratings received from elders
- Rating distribution visualization
- Average rating and total points
- Individual reviews with elder names and task details
- Star ratings and feedback

**Code Structure**:
```javascript
const VolunteerRatingsPage = () => {
  const [ratings, setRatings] = useState([]);
  
  const calculateStats = () => {
    // Calculate average rating
    // Count ratings by star level
    // Calculate total points
  };
  
  return (
    // Statistics cards
    // Rating distribution chart
    // All ratings list
    // Individual review cards
  );
};
```

### **Elder Task Request Notifications**

#### **ElderTaskRequestNotificationsPage.js**

**Purpose**: Display notifications for elder about task requests

**Key Features**:
- Volunteer accepted task notifications
- Task completion notifications
- Volunteer rating display
- Task details in notification
- Mark as read and delete functionality

**Code Structure**:
```javascript
const ElderTaskRequestNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  
  const mockNotifications = [
    {
      type: "volunteer_accepted",
      message: "Ahmed Khan has accepted the task 'Buy Groceries' - Priority: Medium, Scheduled: Tomorrow at 10:00 AM, Distance: 2.5 km"
    },
    {
      type: "task_completed",
      message: "Hassan Ali has completed the task 'Medical Appointment' - Rating: 5 stars"
    }
  ];
  
  return (
    // Notifications list
    // Volunteer details
    // Mark as read and delete buttons
  );
};
```

---

## Component Structure

### **Reusable Components**

#### **TaskCard.js**

**Purpose**: Display task information in card format

**Props**:
- `task`: Task object with all details
- `onAccept`: Callback when accept button is clicked
- `onView`: Callback when view button is clicked

**Code Structure**:
```javascript
const TaskCard = ({ task, onAccept, onView }) => {
  return (
    // Task title and description
    // Category and priority badges
    // Elder/Volunteer name and rating
    // Scheduled time and distance
    // Action buttons
  );
};
```

#### **TaskForm.js**

**Purpose**: Form for creating/editing tasks

**Props**:
- `initialData`: Initial form data (for editing)
- `onSubmit`: Callback when form is submitted
- `isLoading`: Loading state

**Code Structure**:
```javascript
const TaskForm = ({ initialData, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState(initialData || {});
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate form data
    // Call onSubmit callback
  };
  
  return (
    // Form fields
    // Submit and cancel buttons
  );
};
```

#### **TaskFilter.js**

**Purpose**: Filter tasks by various criteria

**Props**:
- `onFilter`: Callback when filter is applied
- `filterOptions`: Available filter options

**Code Structure**:
```javascript
const TaskFilter = ({ onFilter, filterOptions }) => {
  const [filters, setFilters] = useState({
    category: "",
    priority: "",
    status: "",
    dateRange: ""
  });
  
  const handleFilterChange = (filterName, value) => {
    // Update filter state
    // Call onFilter callback
  };
  
  return (
    // Filter dropdowns and inputs
    // Apply and reset buttons
  );
};
```

#### **TaskStatusBadge.js**

**Purpose**: Display task status with color coding

**Props**:
- `status`: Task status (pending, accepted, completed, cancelled)

**Code Structure**:
```javascript
const TaskStatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case "pending": return COLORS.yellow;
      case "accepted": return COLORS.mediumGreen;
      case "completed": return COLORS.mediumGreen;
      case "cancelled": return COLORS.red;
      default: return COLORS.darkGray;
    }
  };
  
  return (
    // Badge with status text and color
  );
};
```

#### **TaskPriorityBadge.js**

**Purpose**: Display task priority with color coding

**Props**:
- `priority`: Task priority (low, medium, high)

**Code Structure**:
```javascript
const TaskPriorityBadge = ({ priority }) => {
  const getPriorityColor = (priority) => {
    switch(priority) {
      case "low": return COLORS.mediumGreen;
      case "medium": return COLORS.yellow;
      case "high": return COLORS.red;
      default: return COLORS.darkGray;
    }
  };
  
  return (
    // Badge with priority text and color
  );
};
```

---

## State Management

### **AuthContext.js**

**Purpose**: Manage authentication state globally

**State**:
- `user`: Current logged-in user
- `isAuthenticated`: Boolean indicating if user is logged in
- `role`: User's role (elder, caregiver, volunteer)
- `accessToken`: JWT access token
- `refreshToken`: JWT refresh token

**Methods**:
- `login(accessToken, user, refreshToken, rememberMe)`: Login user
- `logout()`: Logout user
- `updateUser(userData)`: Update user information
- `refreshAccessToken()`: Refresh access token

**Code Structure**:
```javascript
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  
  const login = (accessToken, user, refreshToken, rememberMe) => {
    // Store tokens
    // Set user state
    // Set authenticated state
  };
  
  const logout = () => {
    // Clear tokens
    // Clear user state
    // Set authenticated to false
  };
  
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### **UserContext.js**

**Purpose**: Manage user profile data globally

**State**:
- `profile`: User profile information
- `preferences`: User preferences
- `privacySettings`: Privacy settings

**Methods**:
- `updateProfile(profileData)`: Update user profile
- `updatePreferences(preferences)`: Update user preferences
- `updatePrivacySettings(settings)`: Update privacy settings

---

## API Integration

### **API Endpoints**

#### **Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/verify-otp` - Verify OTP

#### **User Profile**
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/profile/picture` - Upload profile picture
- `GET /api/users/privacy-settings` - Get privacy settings
- `PUT /api/users/privacy-settings` - Update privacy settings

#### **Tasks**
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/accept` - Accept task (volunteer)
- `POST /api/tasks/:id/complete` - Complete task
- `POST /api/tasks/:id/rate` - Rate task

#### **Notifications**
- `GET /api/notifications` - Get all notifications
- `POST /api/notifications/:id/read` - Mark notification as read
- `DELETE /api/notifications/:id` - Delete notification

#### **Ratings**
- `GET /api/ratings` - Get all ratings
- `POST /api/ratings` - Create new rating
- `GET /api/ratings/:id` - Get rating details

---

## Styling & Design

### **Color Constants**

```javascript
const COLORS = {
  darkGreen: "#1C382A",
  mediumGreen: "#52b788",
  darkMediumGreen: "#2d6a4f",
  veryLightGreen: "#BAE4C7",
  white: "#FFFFFF",
  lightGray: "#f5f5f5",
  darkGray: "#666666",
  red: "#e63946",
  yellow: "#FFC107",
};
```

### **Responsive Design**

All components use inline styles with responsive breakpoints:

```javascript
// Desktop
display: "grid"
gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))"

// Tablet
@media (max-width: 1024px) {
  gridTemplateColumns: "repeat(2, 1fr)"
}

// Mobile
@media (max-width: 768px) {
  gridTemplateColumns: "1fr"
}
```

### **Typography**

```javascript
// Headings
fontSize: "32px"
fontWeight: 700
fontFamily: "Montserrat, sans-serif"

// Body Text
fontSize: "14px"
fontWeight: 400
fontFamily: "Montserrat, sans-serif"

// Small Text
fontSize: "12px"
fontWeight: 400
fontFamily: "Montserrat, sans-serif"
```

---

## Best Practices

### **Component Organization**
- One component per file
- Descriptive file names
- Reusable components in `/components` folder
- Page-specific components in respective page folders

### **State Management**
- Use Context API for global state
- Use useState for local component state
- Use useEffect for side effects
- Avoid prop drilling with Context

### **Error Handling**
- Try-catch blocks for async operations
- Toast notifications for user feedback
- Error logging for debugging
- Graceful fallbacks for failed requests

### **Performance**
- Lazy load components with React.lazy()
- Memoize expensive computations with useMemo
- Optimize re-renders with useCallback
- Use React.memo for pure components

### **Security**
- Store tokens in localStorage (with caution)
- Validate user input on client and server
- Use HTTPS for all API calls
- Implement CORS protection
- Sanitize user-generated content

---

**Last Updated**: April 27, 2025
**Version**: 1.0.0
