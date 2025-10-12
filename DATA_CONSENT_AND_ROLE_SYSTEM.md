## ✅ DATA CONSENT & ROLE-BASED ACCESS CONTROL SYSTEM

## 📋 **Overview**

Implemented a comprehensive data consent system and role-based access control that ensures:
1. **Mandatory data consent** during profile completion
2. **Role-based access** (Member, Volunteer, Intern, Vendor)
3. **Application system** for role upgrades
4. **Member-only access** to blog and forum features

---

## 🎯 **Key Features**

### **1. Data Consent System** ✅

#### **4 Mandatory Consents:**

1. **Data Collection**
   - User consents to RNC collecting personal information
   - Includes ID details, contact info, profile data

2. **Data Storage**
   - User consents to secure storage in database
   - For duration of membership and as required by law

3. **Internal Data Sharing**
   - User consents to sharing among authorized staff/volunteers
   - For program coordination and service delivery

4. **Partner & NGO Sharing** 
   - User consents to sharing with trusted partners
   - NGOs and service providers
   - To facilitate access to programs and opportunities

#### **Implementation:**
- ✅ Added as Step 4 in profile completion
- ✅ All 4 consents are **mandatory**
- ✅ Clear descriptions for each consent
- ✅ Stored in database with timestamp and version
- ✅ Can be reviewed/updated in account settings (future)

---

### **2. Role-Based System** ✅

#### **Role Hierarchy:**

```
Member (Base Level)
├── Everyone starts as Member after profile completion
├── Can apply for additional roles:
    ├── Volunteer
    ├── Intern
    └── Vendor
```

#### **Role Details:**

**Member:**
- Default role for all registered users
- Automatically assigned after profile completion
- Can access blog, forum, and basic features
- Can apply for other roles

**Volunteer:**
- Must apply through application form
- Requires approval from admin
- Gets volunteer-specific access
- Can have Member + Volunteer status simultaneously

**Intern:**
- Must apply through application form
- Requires approval from admin
- Gets intern-specific access
- Can have Member + Intern status simultaneously

**Vendor:**
- Must apply to sell in Caravan Treasures
- Requires business information
- Requires admin approval
- Can have Member + Vendor status simultaneously

---

### **3. Application System** ✅

#### **Application Flow:**

```
User Profile → Apply for Role → Pending Review → Admin Decision → Approved/Rejected
```

#### **Application Form Fields:**

**Common Fields (All Roles):**
- Motivation (why apply)
- Relevant experience
- Availability
- Skills & qualifications

**Vendor-Specific Fields:**
- Business name
- Business type (handmade, digital, bakery, etc.)
- Product/service description
- Business registration number (optional)

#### **Application Statuses:**
- `none` - Not applied
- `pending` - Under review
- `approved` - Accepted
- `rejected` - Not accepted

---

### **4. Access Control** ✅

#### **Member-Only Features:**
- ✅ Blog (read, comment, post)
- ✅ Forum (read, ask, answer)
- ✅ Community features
- ✅ Resource access

#### **Non-Members Cannot:**
- ❌ Access blog
- ❌ Access forum
- ❌ Comment or post
- ❌ Access member resources

#### **Enforcement:**
- `memberAuth` middleware checks profile completion
- Returns 403 error if profile not completed
- Redirects to `/complete-profile`

---

## 📁 **Files Created/Modified**

### **Frontend:**

#### **1. ProfileCompletion.js** (MODIFIED)
**Changes:**
- Added Step 4: Data Consent
- 4 checkbox consents with descriptions
- Validation for all consents
- Updated to 5 steps total
- Added Security and Share icons

#### **2. RoleApplication.js** (NEW)
**Location:** `client/src/pages/RoleApplication.js`

**Features:**
- Dynamic form based on role type (volunteer/intern/vendor)
- Status checking (pending/approved/rejected)
- Role-specific fields
- Application submission
- Success/error handling

---

### **Backend:**

#### **1. User.js Model** (MODIFIED)
**New Fields:**

```javascript
dataConsent: {
  dataCollection: Boolean,
  dataStorage: Boolean,
  dataSharing: Boolean,
  partnerSharing: Boolean,
  consentDate: Date,
  consentVersion: String
},
roles: {
  member: Boolean,
  volunteer: {
    status: String,
    appliedDate: Date,
    approvedDate: Date,
    rejectedDate: Date,
    rejectionReason: String
  },
  intern: { /* same structure */ },
  vendor: {
    /* same structure */
    businessName: String,
    businessType: String
  }
}
```

#### **2. memberAuth.js** (NEW)
**Location:** `middleware/memberAuth.js`

**Purpose:**
- Check if user is authenticated
- Check if profile is completed
- Block access if not a member
- Return helpful error messages

#### **3. roles.js Routes** (NEW)
**Location:** `routes/roles.js`

**Endpoints:**
- `POST /api/roles/apply/:roleType` - Submit application
- `GET /api/roles/status/:roleType` - Check application status
- `GET /api/roles/applications` - Get all applications (Admin)
- `PUT /api/roles/approve/:userId/:roleType` - Approve/reject (Admin)

#### **4. profiles.js** (MODIFIED)
**Changes:**
- Added data consent validation
- Save consent data to user model
- Validate all 4 consents are true

#### **5. server.js** (MODIFIED)
**Changes:**
- Added roles route: `/api/roles`

---

## 🔄 **User Flows**

### **Flow 1: New User Registration**

```
1. Register → 2. Complete Profile (5 steps) → 3. Become Member
   ├── Step 1: ID Verification
   ├── Step 2: Location
   ├── Step 3: Personal Details
   ├── Step 4: Data Consent ✅ (NEW)
   └── Step 5: Profile Photo
```

### **Flow 2: Apply for Volunteer Role**

```
1. Member Dashboard → 2. Click "Apply as Volunteer"
   → 3. Fill Application Form → 4. Submit
   → 5. Status: Pending → 6. Admin Reviews
   → 7. Approved/Rejected → 8. Notification
```

### **Flow 3: Apply for Vendor Role**

```
1. Member Dashboard → 2. Click "Become a Vendor"
   → 3. Fill Business Details → 4. Submit
   → 5. Status: Pending → 6. Admin Reviews
   → 7. If Approved: Can sell in Caravan Treasures
```

### **Flow 4: Access Blog (Member-Only)**

```
User clicks Blog
   ├── If NOT logged in → Redirect to Login
   ├── If logged in but profile NOT complete → Redirect to Complete Profile
   └── If Member (profile complete) → Access Granted ✅
```

---

## 🎨 **UI Components**

### **Data Consent Step:**
- 4 consent cards with checkboxes
- Clear descriptions for each
- Security icon
- Info alert about privacy
- Warning alert about mandatory consents
- Error messages for unchecked boxes

### **Role Application Page:**
- Role-specific icons and colors
- Dynamic form based on role type
- Status display (pending/approved/rejected)
- Progress indicators
- Success/error alerts
- Info box about review process

---

## 📊 **Database Schema Updates**

### **User Model:**

```javascript
{
  // Existing fields...
  name: String,
  email: String,
  
  // NEW: Data Consent
  dataConsent: {
    dataCollection: Boolean,
    dataStorage: Boolean,
    dataSharing: Boolean,
    partnerSharing: Boolean,
    consentDate: Date,
    consentVersion: String
  },
  
  // NEW: Roles System
  roles: {
    member: Boolean,
    volunteer: {
      status: 'none' | 'pending' | 'approved' | 'rejected',
      appliedDate: Date,
      approvedDate: Date,
      rejectedDate: Date,
      rejectionReason: String,
      motivation: String,
      experience: String,
      availability: String,
      skills: String
    },
    intern: { /* same */ },
    vendor: {
      /* same + */
      businessName: String,
      businessType: String,
      productDescription: String,
      businessRegistration: String
    }
  }
}
```

---

## 🔐 **Security & Privacy**

### **Data Consent:**
- ✅ All consents mandatory
- ✅ Timestamp recorded
- ✅ Version tracking
- ✅ Can be audited
- ✅ Clear descriptions
- ✅ User-friendly language

### **Access Control:**
- ✅ JWT authentication required
- ✅ Profile completion checked
- ✅ Role-based permissions
- ✅ Middleware protection
- ✅ Clear error messages

### **Application Security:**
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ Rate limiting
- ✅ Admin-only approval

---

## 📝 **API Endpoints**

### **Profile Completion:**
```
POST /api/profiles/complete
Body: {
  ...profileFields,
  dataCollection: true,
  dataStorage: true,
  dataSharing: true,
  partnerSharing: true
}
```

### **Role Applications:**
```
POST /api/roles/apply/:roleType
Body: {
  motivation: String,
  experience: String,
  availability: String,
  skills: String,
  // Vendor-specific:
  businessName: String,
  businessType: String,
  productDescription: String
}
```

```
GET /api/roles/status/:roleType
Response: {
  success: true,
  roleType: 'volunteer',
  status: 'pending',
  details: { ... }
}
```

### **Admin Endpoints:**
```
GET /api/roles/applications?roleType=volunteer&status=pending
Response: {
  success: true,
  count: 5,
  applications: [ ... ]
}
```

```
PUT /api/roles/approve/:userId/:roleType
Body: {
  action: 'approve' | 'reject',
  rejectionReason: String (if reject)
}
```

---

## 🧪 **Testing Checklist**

### **Data Consent:**
- [ ] Step 4 displays in profile completion
- [ ] All 4 consents show correctly
- [ ] Cannot proceed without all consents
- [ ] Consent data saves to database
- [ ] Timestamp and version recorded

### **Role Applications:**
- [ ] Can access application form
- [ ] Form shows correct fields for each role
- [ ] Vendor form shows business fields
- [ ] Application submits successfully
- [ ] Status shows as "pending"
- [ ] Cannot apply twice for same role

### **Access Control:**
- [ ] Non-members cannot access blog
- [ ] Non-members cannot access forum
- [ ] Members can access blog
- [ ] Members can access forum
- [ ] Error message shows for non-members

### **Admin Functions:**
- [ ] Admin can see all applications
- [ ] Admin can approve applications
- [ ] Admin can reject applications
- [ ] Status updates correctly
- [ ] User gets correct role access

---

## 🎯 **User Benefits**

### **For Users:**
- ✅ Clear understanding of data usage
- ✅ Transparent consent process
- ✅ Easy role application
- ✅ Track application status
- ✅ Multiple roles possible

### **For Organization:**
- ✅ Legal compliance
- ✅ Documented consent
- ✅ Organized role management
- ✅ Controlled access
- ✅ Audit trail

---

## 🚀 **Usage Examples**

### **Apply as Volunteer:**
```
Navigate to: /apply/volunteer
Fill form and submit
Check status in profile
```

### **Apply as Vendor:**
```
Navigate to: /apply/vendor
Fill business details
Submit application
Wait for approval
Once approved: Can sell in Caravan Treasures
```

### **Check Application Status:**
```javascript
// Frontend
const response = await axios.get(
  '/api/roles/status/volunteer',
  { headers: { 'x-auth-token': token } }
);
console.log(response.data.status); // 'pending', 'approved', 'rejected'
```

---

## 📞 **Common Scenarios**

### **Scenario 1: User wants to volunteer**
1. Complete profile (become member)
2. Go to /apply/volunteer
3. Fill application form
4. Submit
5. Wait for admin approval
6. Get email notification
7. Access volunteer features

### **Scenario 2: User wants to sell products**
1. Complete profile (become member)
2. Go to /apply/vendor
3. Fill business information
4. Submit
5. Admin reviews
6. If approved: Can list products in Caravan Treasures

### **Scenario 3: Non-member tries to access blog**
1. Click on blog
2. System checks: Not a member
3. Shows error: "Please complete your profile"
4. Redirects to /complete-profile
5. After completion: Can access blog

---

## 🎨 **UI/UX Features**

### **Data Consent Step:**
- Professional card layout
- Clear checkbox labels
- Descriptive text for each consent
- Icons for visual clarity
- Color-coded alerts
- Mandatory indicators

### **Role Application:**
- Role-specific branding
- Icon representation
- Color themes per role
- Progress indicators
- Status badges
- Clear instructions

---

## 📊 **Statistics & Tracking**

### **Trackable Metrics:**
- Total members
- Pending applications by role
- Approval rate
- Rejection rate
- Average approval time
- Active volunteers/interns/vendors
- Consent acceptance rate

---

**Status:** ✅ **COMPLETE AND READY FOR TESTING**

**Last Updated:** 2025-10-10

**Created by:** Cascade AI Assistant
