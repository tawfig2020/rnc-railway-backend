# REFUGEE NETWORK CENTRE (RNC) PLATFORM
## COMPREHENSIVE SYSTEM REPORT - PART 4: TECHNICAL IMPLEMENTATION & ECOSYSTEM

---

## SECTION 8: TECHNICAL ARCHITECTURE

### 8.1 System Architecture Overview

#### 8.1.1 Three-Tier Architecture

**Tier 1: Presentation Layer (Frontend)**
- **Technology:** React.js 18.x
- **UI Framework:** Material-UI (MUI) v5
- **Routing:** React Router DOM v6
- **State Management:** React Hooks (useState, useEffect, useContext)
- **HTTP Client:** Axios
- **Form Handling:** Controlled components with validation
- **File Upload:** HTML5 File API with validation

**Tier 2: Application Layer (Backend)**
- **Runtime:** Node.js v16+
- **Framework:** Express.js v4
- **Authentication:** JSON Web Tokens (JWT)
- **Password Hashing:** bcrypt
- **Validation:** express-validator
- **File Upload:** Multer middleware
- **CORS:** cors middleware
- **Security:** helmet, express-rate-limit

**Tier 3: Data Layer (Database)**
- **Database:** MongoDB v5+
- **ODM:** Mongoose v6
- **Schema Design:** Document-based with references
- **Indexing:** Optimized queries with indexes
- **Validation:** Schema-level validation
- **Relationships:** ObjectId references with populate

#### 8.1.2 API Architecture

**RESTful API Design:**
- Resource-based URLs
- HTTP methods (GET, POST, PUT, DELETE)
- JSON request/response format
- Status codes (200, 201, 400, 401, 403, 404, 500)
- Error handling with consistent format

**API Endpoints Structure:**
```
/api/auth/*          - Authentication
/api/users/*         - User management
/api/profiles/*      - Profile completion
/api/roles/*         - Role applications
/api/partners/*      - Partner management
/api/analytics/*     - Analytics & reporting
```

### 8.2 Database Schema Design

#### 8.2.1 User Model (Enhanced)

```javascript
const UserSchema = new mongoose.Schema({
  // Basic Authentication
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // Profile Completion Status
  profileCompleted: { type: Boolean, default: false },
  profileCompletedDate: { type: Date },
  
  // ID Verification (Step 1)
  idType: { 
    type: String, 
    enum: ['passport', 'unhcr_card'] 
  },
  idNumber: { type: String },
  
  // Location Information (Step 2)
  locationType: { 
    type: String, 
    enum: ['malaysia', 'overseas'] 
  },
  state: { type: String }, // For Malaysia
  country: { type: String }, // For overseas
  city: { type: String },
  
  // Personal Details (Step 3)
  phoneNumber: { type: String },
  dateOfBirth: { type: Date },
  gender: { 
    type: String, 
    enum: ['male', 'female', 'other', 'prefer_not_to_say'] 
  },
  nationality: { type: String },
  skills: [{ type: String }],
  experience: { type: String },
  
  // Data Consent (Step 4) - NEW
  dataConsent: {
    dataCollection: { type: Boolean, default: false, required: true },
    dataStorage: { type: Boolean, default: false, required: true },
    dataSharing: { type: Boolean, default: false, required: true },
    partnerSharing: { type: Boolean, default: false, required: true },
    consentDate: { type: Date },
    consentVersion: { type: String, default: '1.0' },
    ipAddress: { type: String },
    userAgent: { type: String }
  },
  
  // Profile Photo (Step 5)
  profileImage: { type: String },
  
  // Role System - NEW
  roles: {
    member: { type: Boolean, default: true },
    
    volunteer: {
      status: { 
        type: String, 
        enum: ['none', 'pending', 'approved', 'rejected'],
        default: 'none'
      },
      appliedDate: { type: Date },
      approvedDate: { type: Date },
      rejectedDate: { type: Date },
      rejectionReason: { type: String },
      motivation: { type: String },
      experience: { type: String },
      availability: { type: String },
      skills: { type: String }
    },
    
    intern: {
      status: { 
        type: String, 
        enum: ['none', 'pending', 'approved', 'rejected'],
        default: 'none'
      },
      appliedDate: { type: Date },
      approvedDate: { type: Date },
      rejectedDate: { type: Date },
      rejectionReason: { type: String },
      education: { type: String },
      learningObjectives: { type: String },
      duration: { type: String },
      motivation: { type: String }
    },
    
    vendor: {
      status: { 
        type: String, 
        enum: ['none', 'pending', 'approved', 'rejected'],
        default: 'none'
      },
      appliedDate: { type: Date },
      approvedDate: { type: Date },
      rejectedDate: { type: Date },
      rejectionReason: { type: String },
      businessName: { type: String },
      businessType: { type: String },
      description: { type: String },
      products: [{ type: String }]
    },
    
    admin: { type: Boolean, default: false }
  },
  
  // Activity Tracking
  lastActive: { type: Date },
  loginHistory: [{
    date: { type: Date },
    ipAddress: { type: String },
    userAgent: { type: String }
  }],
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

#### 8.2.2 Partner Model (NEW)

```javascript
const PartnerSchema = new mongoose.Schema({
  // Organization Information
  organizationName: { 
    type: String, 
    required: true, 
    unique: true 
  },
  partnerType: { 
    type: String, 
    required: true,
    enum: [
      'ngo',
      'employer',
      'educational',
      'government',
      'corporate',
      'other'
    ]
  },
  registrationNumber: { type: String },
  website: { type: String },
  
  // Location
  country: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String },
  
  // Contact Person
  contactPerson: {
    name: { type: String, required: true },
    position: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  
  // Partnership Details
  partnershipType: { 
    type: String, 
    required: true,
    enum: [
      'employment',
      'program_collaboration',
      'resource_sharing',
      'training',
      'funding',
      'other'
    ]
  },
  description: { 
    type: String, 
    required: true,
    minlength: 100
  },
  areasOfInterest: [{ type: String }],
  
  // Services Offered
  offeredServices: [{
    serviceType: { type: String },
    description: { type: String },
    capacity: { type: String }
  }],
  
  // Job Opportunities
  opportunities: [{
    title: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['full-time', 'part-time', 'contract', 'internship', 'remote']
    },
    description: { type: String },
    requirements: [{ type: String }],
    skills: [{ type: String }],
    location: { type: String },
    salary: { type: String },
    positions: { type: Number, default: 1 },
    deadline: { type: Date },
    status: { 
      type: String, 
      enum: ['active', 'filled', 'closed'],
      default: 'active'
    },
    postedDate: { type: Date, default: Date.now }
  }],
  
  // Nominations
  nominations: [{
    memberId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    opportunityId: { type: mongoose.Schema.Types.ObjectId },
    nominatedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    nominatedDate: { type: Date, default: Date.now },
    status: { 
      type: String, 
      enum: ['nominated', 'accepted', 'rejected', 'interview', 'hired'],
      default: 'nominated'
    },
    notes: { type: String },
    statusHistory: [{
      status: { type: String },
      date: { type: Date },
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      notes: { type: String }
    }]
  }],
  
  // Application Status
  applicationStatus: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  applicationDate: { type: Date, default: Date.now },
  approvedDate: { type: Date },
  rejectedDate: { type: Date },
  rejectionReason: { type: String },
  
  // Statistics
  totalNominations: { type: Number, default: 0 },
  successfulPlacements: { type: Number, default: 0 },
  
  // Admin Notes
  adminNotes: [{
    note: { type: String },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    addedDate: { type: Date, default: Date.now }
  }],
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

### 8.3 API Routes Implementation

#### 8.3.1 Profile Routes (`/api/profiles`)

**POST /api/profiles/complete**
- **Purpose:** Complete user profile (all 5 steps)
- **Authentication:** Required (JWT)
- **Request Body:**
  ```javascript
  {
    idType: "passport",
    idNumber: "AB1234567",
    locationType: "malaysia",
    state: "Kuala Lumpur",
    city: "Kuala Lumpur",
    phoneNumber: "+60 12-345-6789",
    dateOfBirth: "1990-01-01",
    gender: "male",
    nationality: "Syria",
    skills: ["JavaScript", "React"],
    experience: "3 years software development",
    dataCollection: true,
    dataStorage: true,
    dataSharing: true,
    partnerSharing: true,
    photo: File
  }
  ```
- **Response:**
  ```javascript
  {
    success: true,
    message: "Profile completed successfully",
    user: { /* updated user object */ }
  }
  ```

#### 8.3.2 Role Routes (`/api/roles`)

**POST /api/roles/apply**
- **Purpose:** Apply for volunteer/intern/vendor role
- **Authentication:** Required (JWT + memberAuth)
- **Request Body:**
  ```javascript
  {
    roleType: "volunteer",
    motivation: "I want to help...",
    experience: "Previous volunteer work...",
    availability: "Weekends, 10 hours/week",
    skills: "Communication, event planning"
  }
  ```
- **Response:**
  ```javascript
  {
    success: true,
    message: "Application submitted successfully",
    application: { /* application details */ }
  }
  ```

**GET /api/roles/applications**
- **Purpose:** Get all role applications (Admin only)
- **Authentication:** Required (JWT + adminAuth)
- **Query Parameters:** `?status=pending&roleType=volunteer`
- **Response:**
  ```javascript
  {
    success: true,
    applications: [ /* array of applications */ ]
  }
  ```

**PUT /api/roles/applications/:id/approve**
- **Purpose:** Approve or reject application
- **Authentication:** Required (JWT + adminAuth)
- **Request Body:**
  ```javascript
  {
    action: "approve", // or "reject"
    rejectionReason: "Optional reason if rejecting"
  }
  ```

#### 8.3.3 Partner Routes (`/api/partners`)

**POST /api/partners/apply**
- **Purpose:** Submit partner application
- **Authentication:** Public (no auth required)
- **Request Body:**
  ```javascript
  {
    organizationName: "Tech Solutions Malaysia",
    partnerType: "employer",
    contactPerson: {
      name: "John Smith",
      position: "HR Manager",
      email: "john@tech.com",
      phone: "+60 12-999-8888"
    },
    partnershipType: "employment",
    description: "We are looking to hire...",
    areasOfInterest: ["Job Placement"],
    offeredServices: [{
      serviceType: "Job Placement",
      description: "Software developer positions",
      capacity: "5 positions"
    }]
  }
  ```

**POST /api/partners/:id/opportunities**
- **Purpose:** Post job opportunity
- **Authentication:** Required (JWT + adminAuth)
- **Request Body:**
  ```javascript
  {
    title: "Junior Software Developer",
    type: "full-time",
    description: "Looking for talented developer...",
    requirements: ["Bachelor's degree", "2 years experience"],
    skills: ["JavaScript", "React", "Node.js"],
    location: "Kuala Lumpur",
    salary: "RM 4000-6000",
    positions: 2,
    deadline: "2025-12-31"
  }
  ```

**POST /api/partners/matching/candidates**
- **Purpose:** Find matching candidates for opportunity
- **Authentication:** Required (JWT + adminAuth)
- **Request Body:**
  ```javascript
  {
    opportunityId: "opp123",
    partnerId: "partner456",
    requiredSkills: ["JavaScript", "React"]
  }
  ```
- **Response:**
  ```javascript
  {
    success: true,
    count: 12,
    candidates: [ /* array of matching members */ ]
  }
  ```

**POST /api/partners/:partnerId/nominate**
- **Purpose:** Nominate member for opportunity
- **Authentication:** Required (JWT + adminAuth)
- **Request Body:**
  ```javascript
  {
    memberId: "member123",
    opportunityId: "opp456",
    notes: "Excellent candidate, strong skills"
  }
  ```

#### 8.3.4 Analytics Routes (`/api/analytics`)

**GET /api/analytics/members**
- **Purpose:** Get member statistics and trends
- **Authentication:** Required (JWT + adminAuth)
- **Query Parameters:** `?range=30days`
- **Response:**
  ```javascript
  {
    success: true,
    stats: {
      total: 1000,
      newThisMonth: 150,
      profileCompleted: 850,
      active: 600
    },
    roles: {
      volunteers: 120,
      interns: 45,
      vendors: 30,
      pendingApplications: 25
    },
    trend: [ /* daily registration data */ ],
    roleDistribution: [ /* pie chart data */ ]
  }
  ```

**GET /api/analytics/reports/summary**
- **Purpose:** Generate comprehensive summary report
- **Authentication:** Required (JWT + adminAuth)
- **Response:** Complete platform statistics

**GET /api/analytics/export**
- **Purpose:** Export data as CSV
- **Authentication:** Required (JWT + adminAuth)
- **Query Parameters:** `?type=members`
- **Response:** CSV file download

### 8.4 Middleware Implementation

#### 8.4.1 Authentication Middleware (`auth.js`)

```javascript
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');
  
  // Check if no token
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'No token, authorization denied' 
    });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user from payload
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ 
      success: false,
      message: 'Token is not valid' 
    });
  }
};
```

#### 8.4.2 Member Authentication Middleware (`memberAuth.js`) - NEW

```javascript
const User = require('../models/User');

module.exports = async function(req, res, next) {
  try {
    // Get user from database
    const user = await User.findById(req.user.id);
    
    // Check if profile is completed
    if (!user.profileCompleted) {
      return res.status(403).json({
        success: false,
        message: 'Please complete your profile to access this feature',
        redirectTo: '/complete-profile'
      });
    }
    
    // Profile completed, proceed
    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
```

#### 8.4.3 Admin Authentication Middleware (`adminAuth.js`)

```javascript
const User = require('../models/User');

module.exports = async function(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user.roles.admin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
    
    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
```

### 8.5 File Upload Handling

#### 8.5.1 Multer Configuration

```javascript
const multer = require('multer');
const path = require('path');

// Storage configuration
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/profiles/');
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only PNG, JPG, and JPEG files are allowed'));
  }
};

// Upload configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 }, // 1MB
  fileFilter: fileFilter
});
```

---

**END OF PART 4**

*Continue to Part 5: Complete Ecosystem & Summary*
