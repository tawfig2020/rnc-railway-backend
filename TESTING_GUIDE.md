# 🧪 COMPREHENSIVE TESTING GUIDE

## 📋 **Overview**

Complete end-to-end testing guide for the RNC platform covering all features: registration, profile completion, data consent, role applications, partner system, and job matching.

---

## 🎯 **Testing Objectives**

1. ✅ Verify complete user registration flow
2. ✅ Test profile completion with data consent
3. ✅ Validate role application system
4. ✅ Test partner application and approval
5. ✅ Verify job matching and nomination
6. ✅ Ensure all tracking is working
7. ✅ Validate access control
8. ✅ Test admin functionalities

---

## 🚀 **Pre-Testing Setup**

### **1. Environment Setup**

```bash
# Start MongoDB
mongod

# Start Backend Server
cd c:\Users\Lenovo\CascadeProjects\RNC\CascadeProjects\windsurf-project
npm start

# Start Frontend (new terminal)
cd client
npm start
```

### **2. Create Test Accounts**

**Admin Account:**
```javascript
// Use MongoDB Compass or shell
db.users.insertOne({
  name: "Admin Test",
  email: "admin@rnc.test",
  password: "$2a$10$...", // Use bcrypt to hash "Admin123!"
  role: "admin",
  profileCompleted: true,
  createdAt: new Date()
})
```

**Test Data:**
- Admin Email: `admin@rnc.test`
- Admin Password: `Admin123!`

---

## 📝 **Test Cases**

### **TEST 1: User Registration Flow** ✅

#### **Objective:** Test complete registration process

**Steps:**
1. Navigate to: `http://localhost:3000/register`
2. Fill registration form:
   - First Name: `Test`
   - Last Name: `User`
   - Email: `testuser1@example.com`
   - Location: `Kuala Lumpur`
   - Password: `Test123!`
   - Confirm Password: `Test123!`
   - Check "I agree to Terms"
3. Click "Register"

**Expected Results:**
- ✅ Success message appears
- ✅ Redirects to `/complete-profile`
- ✅ User record created in database
- ✅ Email field is unique (try registering again - should fail)

**Database Verification:**
```javascript
db.users.findOne({ email: "testuser1@example.com" })
// Should show:
// - profileCompleted: false
// - roles.member: true
// - dataConsent: empty
```

---

### **TEST 2: Profile Completion (5 Steps)** ✅

#### **Objective:** Test mandatory profile completion with data consent

**Prerequisites:** Completed TEST 1

**Step 1: ID Verification**
1. Select ID Type: `Passport`
2. Enter ID Number: `AB1234567`
3. Click "Next"

**Expected:** ✅ Proceeds to Step 2

**Step 2: Location**
1. Select Location Type: `Malaysia`
2. Select State: `Kuala Lumpur`
3. Enter City: `Kuala Lumpur`
4. Click "Next"

**Expected:** ✅ Proceeds to Step 3

**Step 3: Personal Details**
1. Phone: `+60 12-345-6789`
2. Date of Birth: `1990-01-01`
3. Gender: `Male`
4. Nationality: `Syria`
5. Click "Next"

**Expected:** ✅ Proceeds to Step 4

**Step 4: Data Consent** (NEW!)
1. Check all 4 consents:
   - ☑ Data Collection
   - ☑ Data Storage
   - ☑ Data Sharing
   - ☑ Partner Sharing
2. Click "Next"

**Expected:** ✅ Proceeds to Step 5

**Step 5: Profile Photo**
1. Click "Upload Photo"
2. Select PNG/JPG file (< 1MB)
3. Verify preview shows
4. Click "Complete Profile"

**Expected Results:**
- ✅ Success message
- ✅ Redirects to `/profile`
- ✅ Profile marked as completed

**Database Verification:**
```javascript
db.users.findOne({ email: "testuser1@example.com" })
// Should show:
// - profileCompleted: true
// - idType: "passport"
// - idNumber: "AB1234567"
// - dataConsent.dataCollection: true
// - dataConsent.dataStorage: true
// - dataConsent.dataSharing: true
// - dataConsent.partnerSharing: true
// - dataConsent.consentDate: [timestamp]
// - dataConsent.consentVersion: "1.0"
// - profileImage: "uploads/profiles/..."
```

---

### **TEST 3: Member-Only Access Control** ✅

#### **Objective:** Verify non-members cannot access protected features

**Test 3A: Blog Access (Non-Member)**
1. Create new user (don't complete profile)
2. Try to access blog
3. **Expected:** ❌ Blocked with message "Please complete your profile"

**Test 3B: Blog Access (Member)**
1. Login with completed profile user
2. Access blog
3. **Expected:** ✅ Access granted

**Test 3C: Forum Access**
- Same as blog test
- **Expected:** Only members can access

---

### **TEST 4: Volunteer Application** ✅

#### **Objective:** Test role application system

**Prerequisites:** Completed profile (member status)

**Steps:**
1. Navigate to: `/apply/volunteer`
2. Fill application form:
   - Motivation: `I want to help refugee communities...` (min text)
   - Experience: `3 years volunteering at local NGO...`
   - Availability: `Weekends, 10 hours/week`
   - Skills: `Community outreach, event planning, multilingual`
3. Click "Submit Application"

**Expected Results:**
- ✅ Success message
- ✅ Status shows "Pending"
- ✅ Cannot apply again (duplicate prevention)

**Database Verification:**
```javascript
db.users.findOne({ email: "testuser1@example.com" })
// Should show:
// - roles.volunteer.status: "pending"
// - roles.volunteer.appliedDate: [timestamp]
// - roles.volunteer.motivation: "..."
```

---

### **TEST 5: Admin Approval Process** ✅

#### **Objective:** Test admin role approval workflow

**Prerequisites:** TEST 4 completed

**Steps:**
1. Login as admin: `admin@rnc.test`
2. Navigate to Admin Dashboard
3. Go to "Role Applications" section
4. Find pending volunteer application
5. Click "Approve"

**Expected Results:**
- ✅ Status changes to "Approved"
- ✅ User gets volunteer access
- ✅ Approval date recorded

**Database Verification:**
```javascript
db.users.findOne({ email: "testuser1@example.com" })
// Should show:
// - roles.volunteer.status: "approved"
// - roles.volunteer.approvedDate: [timestamp]
```

**Test Rejection:**
1. Create another volunteer application
2. Click "Reject" with reason
3. **Expected:** Status = "rejected", reason recorded

---

### **TEST 6: Partner Application** ✅

#### **Objective:** Test partner application system

**Steps:**
1. Navigate to: `/partner-application`
2. **Step 1 - Organization Info:**
   - Organization Name: `Tech Solutions Malaysia`
   - Partner Type: `Employer`
   - Country: `Malaysia`
   - City: `Kuala Lumpur`
3. **Step 2 - Contact:**
   - Name: `John Smith`
   - Position: `HR Manager`
   - Email: `john@techsolutions.com`
   - Phone: `+60 12-999-8888`
4. **Step 3 - Partnership:**
   - Type: `Employment`
   - Description: `We are a leading tech company looking to hire talented refugees...` (100+ chars)
   - Areas: Select multiple
5. **Step 4 - Services:**
   - Click "Add Service"
   - Type: `Job Placement`
   - Capacity: `5 positions`
   - Description: `Software developer positions`
6. Click "Submit Application"

**Expected Results:**
- ✅ Success message
- ✅ Status: "Under Review"
- ✅ Partner record created

**Database Verification:**
```javascript
db.partners.findOne({ organizationName: "Tech Solutions Malaysia" })
// Should show:
// - applicationStatus: "pending"
// - partnerType: "employer"
// - offeredServices: [...]
```

---

### **TEST 7: Partner Approval & Opportunity Posting** ✅

#### **Objective:** Test admin partner approval and job posting

**Prerequisites:** TEST 6 completed

**Steps:**
1. Login as admin
2. Go to "Partner Management"
3. Find "Tech Solutions Malaysia"
4. Click "Approve"
5. Click "View Details"
6. Go to "Opportunities" tab
7. Add new opportunity:
   - Title: `Junior Software Developer`
   - Type: `Full-time`
   - Description: `Looking for talented developers...`
   - Requirements: `Bachelor's degree\n2 years experience`
   - Skills: `JavaScript, React, Node.js`
   - Location: `Kuala Lumpur`
   - Salary: `RM 4000-6000`
   - Positions: `2`
   - Deadline: `2025-12-31`
8. Click "Post Opportunity"

**Expected Results:**
- ✅ Opportunity created
- ✅ Status: "active"
- ✅ Appears in partner's opportunities list

**Database Verification:**
```javascript
db.partners.findOne({ organizationName: "Tech Solutions Malaysia" })
// Should show:
// - applicationStatus: "approved"
// - opportunities: [{ title: "Junior Software Developer", ... }]
```

---

### **TEST 8: Candidate Matching** ✅

#### **Objective:** Test smart candidate matching system

**Prerequisites:** 
- TEST 7 completed
- Multiple members with completed profiles
- Some members have matching skills

**Setup Test Data:**
```javascript
// Create test member with matching skills
db.users.insertOne({
  name: "Ahmed Ali",
  email: "ahmed@example.com",
  profileCompleted: true,
  skills: ["JavaScript", "React", "Node.js"],
  city: "Kuala Lumpur",
  // ... other required fields
})
```

**Steps:**
1. Login as admin
2. Go to Partner Management
3. Find "Tech Solutions Malaysia"
4. View "Opportunities" tab
5. Find "Junior Software Developer"
6. Click "Find Candidates"

**Expected Results:**
- ✅ System searches member database
- ✅ Filters by skills: JavaScript, React, Node.js
- ✅ Shows matching candidates
- ✅ Excludes already nominated members
- ✅ Shows candidate details

**Verify Matching:**
- ✅ Ahmed Ali appears in results (has matching skills)
- ✅ Members without skills don't appear
- ✅ Non-members don't appear

---

### **TEST 9: Member Nomination** ✅

#### **Objective:** Test nomination workflow

**Prerequisites:** TEST 8 completed

**Steps:**
1. From candidate list, find "Ahmed Ali"
2. Click "Nominate"
3. Confirm nomination

**Expected Results:**
- ✅ Success message
- ✅ Nomination created
- ✅ Ahmed removed from candidate list
- ✅ Cannot nominate same member again

**Database Verification:**
```javascript
db.partners.findOne({ organizationName: "Tech Solutions Malaysia" })
// Should show:
// - nominations: [{
//     memberId: [Ahmed's ID],
//     opportunityId: [opportunity ID],
//     nominatedBy: [admin ID],
//     status: "nominated",
//     nominatedDate: [timestamp]
//   }]
// - totalNominations: 1
```

---

### **TEST 10: Nomination Status Updates** ✅

#### **Objective:** Test nomination lifecycle

**Prerequisites:** TEST 9 completed

**Steps:**
1. Go to Partner Details → Nominations tab
2. Find Ahmed's nomination
3. Update status to "interview"
4. Update status to "hired"

**Expected Results:**
- ✅ Status updates successfully
- ✅ Successful placements counter increments
- ✅ Timestamps recorded

**Database Verification:**
```javascript
db.partners.findOne({ organizationName: "Tech Solutions Malaysia" })
// Should show:
// - nominations[0].status: "hired"
// - successfulPlacements: 1
```

---

### **TEST 11: Data Tracking & Traceability** ✅

#### **Objective:** Verify all activities are tracked

**Test Scenarios:**

**A. Course Enrollment Tracking**
```javascript
// Verify member ID is recorded
db.course_enrollments.findOne({ userId: [member ID] })
// Should link to member
```

**B. Blog Post Tracking**
```javascript
// Verify author is member
db.blog_posts.findOne({ authorId: [member ID] })
// Should link to member
```

**C. Forum Activity Tracking**
```javascript
// Verify all forum posts link to members
db.forum_posts.find({ authorId: { $exists: true } })
// All should have valid member IDs
```

**D. Volunteer Activity Tracking**
```javascript
// Verify volunteer hours tracked
db.volunteer_activities.find({ volunteerId: [member ID] })
// Should show activities with hours
```

---

### **TEST 12: Access Control Matrix** ✅

#### **Objective:** Verify role-based permissions

| Feature | Non-Member | Member | Volunteer | Admin |
|---------|-----------|--------|-----------|-------|
| Register | ✅ | ✅ | ✅ | ✅ |
| Complete Profile | ✅ | ✅ | ✅ | ✅ |
| Blog Access | ❌ | ✅ | ✅ | ✅ |
| Forum Access | ❌ | ✅ | ✅ | ✅ |
| Apply Volunteer | ❌ | ✅ | ✅ | ✅ |
| Volunteer Activities | ❌ | ❌ | ✅ | ✅ |
| Partner Application | ✅ | ✅ | ✅ | ✅ |
| Approve Partners | ❌ | ❌ | ❌ | ✅ |
| Post Opportunities | ❌ | ❌ | ❌ | ✅ |
| Nominate Members | ❌ | ❌ | ❌ | ✅ |
| View Analytics | ❌ | ❌ | ❌ | ✅ |

**Test Each Cell:**
- ✅ = Should work
- ❌ = Should be blocked

---

## 🔍 **Integration Testing**

### **Complete User Journey Test**

**Scenario:** New refugee registers and gets hired

```
1. User Registration
   ↓
2. Profile Completion (5 steps + data consent)
   ↓
3. Member Status Granted
   ↓
4. Access Blog/Forum
   ↓
5. Enroll in Course
   ↓
6. Apply as Volunteer
   ↓
7. Volunteer Approved
   ↓
8. Partner Posts Job
   ↓
9. Admin Finds Member in Matching
   ↓
10. Admin Nominates Member
    ↓
11. Interview Process
    ↓
12. Member Hired ✅
```

**Expected:** All steps complete successfully with full tracking

---

## 📊 **Performance Testing**

### **Load Testing Scenarios**

**Test 1: Concurrent Registrations**
```javascript
// Simulate 100 concurrent registrations
for (let i = 0; i < 100; i++) {
  registerUser(`testuser${i}@example.com`);
}
```

**Expected:**
- ✅ All registrations succeed
- ✅ No duplicate emails
- ✅ Response time < 2 seconds

**Test 2: Candidate Matching Performance**
```javascript
// Test with 1000 members
// Search for candidates with specific skills
// Measure response time
```

**Expected:**
- ✅ Results return in < 3 seconds
- ✅ Accurate matching
- ✅ No timeouts

---

## 🐛 **Error Handling Tests**

### **Test Invalid Inputs**

**1. Registration Errors:**
- ❌ Duplicate email → Error message
- ❌ Weak password → Validation error
- ❌ Missing fields → Field-specific errors

**2. Profile Completion Errors:**
- ❌ Skip consent → Cannot proceed
- ❌ Large photo (>1MB) → File size error
- ❌ Wrong file type → File type error

**3. Application Errors:**
- ❌ Apply twice → Duplicate prevention
- ❌ Incomplete form → Validation errors
- ❌ Non-member applies → Access denied

---

## ✅ **Testing Checklist**

### **Functional Testing**
- [ ] User registration works
- [ ] Profile completion (all 5 steps)
- [ ] Data consent recorded
- [ ] Member-only access enforced
- [ ] Role applications work
- [ ] Admin approvals work
- [ ] Partner applications work
- [ ] Job posting works
- [ ] Candidate matching works
- [ ] Nominations work
- [ ] Status updates work

### **Data Integrity**
- [ ] All user data saved correctly
- [ ] Consents timestamped
- [ ] Roles tracked properly
- [ ] Nominations linked correctly
- [ ] Statistics calculated accurately

### **Security**
- [ ] Passwords hashed
- [ ] JWT tokens work
- [ ] Admin-only routes protected
- [ ] File uploads validated
- [ ] SQL injection prevented
- [ ] XSS protection active

### **Performance**
- [ ] Page load < 2 seconds
- [ ] API response < 1 second
- [ ] Matching algorithm < 3 seconds
- [ ] No memory leaks
- [ ] Database queries optimized

### **User Experience**
- [ ] Clear error messages
- [ ] Success confirmations
- [ ] Loading indicators
- [ ] Responsive design
- [ ] Mobile friendly

---

## 📝 **Test Report Template**

```markdown
# Test Report - [Date]

## Summary
- Total Tests: X
- Passed: X
- Failed: X
- Skipped: X

## Test Results

### ✅ Passed Tests
1. User Registration - PASS
2. Profile Completion - PASS
3. Data Consent - PASS
...

### ❌ Failed Tests
1. [Test Name] - FAIL
   - Error: [Description]
   - Steps to Reproduce: [...]
   - Expected: [...]
   - Actual: [...]

## Issues Found
1. [Issue Description]
   - Severity: High/Medium/Low
   - Status: Open/Fixed
   - Assigned to: [Name]

## Recommendations
1. [Recommendation]
2. [Recommendation]

## Next Steps
1. Fix failed tests
2. Retest
3. Deploy to staging
```

---

## 🎯 **Success Criteria**

**System is ready for production when:**
- ✅ All functional tests pass
- ✅ No critical bugs
- ✅ Performance meets requirements
- ✅ Security tests pass
- ✅ Data integrity verified
- ✅ Admin training completed
- ✅ Documentation complete

---

**Status:** Ready for Testing! 🚀

**Next:** Run through all test cases and document results.
