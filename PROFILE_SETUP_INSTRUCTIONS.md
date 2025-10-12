# 🚀 PROFILE COMPLETION SYSTEM - SETUP INSTRUCTIONS

## 📦 **Installation Steps**

### **1. Install Required Dependencies**

#### **Backend:**
```bash
cd c:\Users\Lenovo\CascadeProjects\RNC\CascadeProjects\windsurf-project
npm install multer
```

**Multer** is required for handling file uploads (profile photos).

---

### **2. Create Upload Directory**

The system needs a directory to store uploaded profile photos:

```bash
# Create the uploads directory
mkdir uploads
mkdir uploads\profiles
```

Or manually create:
- `c:\Users\Lenovo\CascadeProjects\RNC\CascadeProjects\windsurf-project\uploads\profiles\`

---

### **3. Verify Files Are in Place**

#### **Frontend Files:**
- ✅ `client\src\pages\ProfileCompletion.js` (NEW)
- ✅ `client\src\pages\Register.js` (MODIFIED)
- ✅ `client\src\App.js` (MODIFIED)

#### **Backend Files:**
- ✅ `models\User.js` (MODIFIED)
- ✅ `routes\profiles.js` (MODIFIED)

---

### **4. Start the Application**

#### **Terminal 1 - Backend:**
```bash
cd c:\Users\Lenovo\CascadeProjects\RNC\CascadeProjects\windsurf-project
npm start
```

#### **Terminal 2 - Frontend:**
```bash
cd c:\Users\Lenovo\CascadeProjects\RNC\CascadeProjects\windsurf-project\client
npm start
```

---

## 🧪 **Testing the System**

### **Step-by-Step Test:**

1. **Register a New User:**
   - Go to: http://localhost:3000/register
   - Fill in registration form
   - Click "Register"
   - ✅ Should redirect to `/complete-profile`

2. **Complete Profile - Step 1 (ID Verification):**
   - Select ID Type: Passport or UNHCR
   - Enter ID Number
   - Click "Next"

3. **Complete Profile - Step 2 (Location):**
   - Select Location Type: Malaysia or Overseas
   - If Malaysia: Select State (e.g., Kuala Lumpur)
   - If Overseas: Select Country (e.g., Australia)
   - Enter City
   - Click "Next"

4. **Complete Profile - Step 3 (Personal Details):**
   - Enter Phone Number (e.g., +60 12-345-6789)
   - Select Date of Birth
   - Select Gender
   - Select Nationality
   - Click "Next"

5. **Complete Profile - Step 4 (Photo Upload):**
   - Click "Upload Photo"
   - Select a PNG/JPG/JPEG file (max 1MB)
   - See preview
   - Click "Complete Profile"
   - ✅ Should redirect to `/profile` with success message

---

## ✅ **Verification Checklist**

### **Frontend:**
- [ ] Registration page loads
- [ ] After registration, redirects to profile completion
- [ ] Profile completion page shows 4 steps
- [ ] Stepper shows current step
- [ ] Can navigate between steps
- [ ] Validation works on each step
- [ ] Photo upload shows preview
- [ ] File type validation works (only PNG/JPG/JPEG)
- [ ] File size validation works (max 1MB)
- [ ] Error messages display correctly
- [ ] Success redirect works

### **Backend:**
- [ ] Server starts without errors
- [ ] `uploads/profiles/` directory exists
- [ ] POST `/api/profiles/complete` endpoint works
- [ ] GET `/api/profiles/check-completion` endpoint works
- [ ] File upload saves to `uploads/profiles/`
- [ ] User model updated with new fields
- [ ] Profile marked as completed in database

---

## 🐛 **Troubleshooting**

### **Issue 1: "multer is not defined"**
**Solution:**
```bash
npm install multer
```

### **Issue 2: "Cannot find module './pages/ProfileCompletion'"**
**Solution:**
- Verify file exists at: `client\src\pages\ProfileCompletion.js`
- Restart React dev server

### **Issue 3: "ENOENT: no such file or directory, open 'uploads/profiles'"**
**Solution:**
```bash
mkdir uploads
mkdir uploads\profiles
```

### **Issue 4: Photo upload fails**
**Solution:**
- Check file size (must be ≤ 1MB)
- Check file type (must be PNG, JPG, or JPEG)
- Check `uploads/profiles/` directory exists and is writable

### **Issue 5: "Navigate is not defined"**
**Solution:**
- Already fixed in App.js
- Verify import: `import { ..., Navigate } from 'react-router-dom';`

---

## 📊 **Database Check**

### **Verify User Model:**

After completing a profile, check MongoDB:

```javascript
// In MongoDB Compass or Shell
db.users.findOne({ email: "test@example.com" })

// Should show:
{
  _id: ObjectId("..."),
  name: "Test User",
  email: "test@example.com",
  profileCompleted: true,  // ✅ Should be true
  idType: "passport",
  idNumber: "AB123456",
  locationType: "malaysia",
  state: "Kuala Lumpur",
  city: "KL",
  phoneNumber: "+60 12-345-6789",
  dateOfBirth: ISODate("1990-01-01"),
  gender: "male",
  nationality: "Malaysia",
  profileImage: "uploads/profiles/profile-1234567890-123456789.png"
}
```

---

## 🎯 **Quick Test Script**

### **Test Data:**
```
Step 1:
- ID Type: Passport
- ID Number: AB123456

Step 2:
- Location Type: Malaysia
- State: Kuala Lumpur
- City: Kuala Lumpur

Step 3:
- Phone: +60 12-345-6789
- DOB: 1990-01-01
- Gender: Male
- Nationality: Malaysia

Step 4:
- Photo: Any PNG/JPG file under 1MB
```

---

## 📝 **Next Steps**

After successful setup:

1. **Test with multiple users**
2. **Test with different ID types (Passport vs UNHCR)**
3. **Test with different locations (Malaysia vs Overseas)**
4. **Test file upload limits**
5. **Test validation errors**
6. **Test mobile responsiveness**

---

## 🎉 **Success Indicators**

You'll know it's working when:
- ✅ New users are redirected to profile completion
- ✅ All 4 steps work smoothly
- ✅ Photos upload successfully
- ✅ Profile marked as completed in database
- ✅ User can access full platform after completion

---

**Status:** ✅ Ready for testing!

**Need Help?** Check the detailed documentation in `PROFILE_COMPLETION_SYSTEM.md`
