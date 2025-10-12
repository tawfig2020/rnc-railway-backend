# 🧪 QUICK TESTING GUIDE

**Date:** October 11, 2025  
**Purpose:** Test the implemented data persistence features

---

## 🚀 STEP 1: START THE SERVERS

### **Backend Server:**
```powershell
# Navigate to project root
cd c:\Users\Lenovo\CascadeProjects\RNC\CascadeProjects\windsurf-project

# Start backend
node server.js
```

**Expected Output:**
```
Allowed CORS origins: [...]
Server is running on port 5000
Connecting to MongoDB...
MongoDB Connected: [your-cluster].mongodb.net
✅ Database connection successful. Real API routes are active.
```

### **Frontend Server:**
```powershell
# Open new terminal
cd c:\Users\Lenovo\CascadeProjects\RNC\CascadeProjects\windsurf-project\client

# Start frontend
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view client in the browser.
  Local:            http://localhost:3000
```

---

## 🧪 STEP 2: TEST MARKETPLACE (Already Integrated)

### **Test 1: View Products**
1. Open browser: `http://localhost:3000/marketplace`
2. **Expected:** Products load from database
3. **Check:** Loading spinner appears first, then products display
4. **If empty:** That's okay! Backend is working, just no products yet

### **Test 2: View Vendors**
1. Click "Featured Vendors" tab
2. **Expected:** Vendors load from database
3. **Check:** Vendor cards display with business info
4. **If empty:** That's okay! Backend is working, just no vendors yet

### **Test 3: Error Handling**
1. Stop backend server (Ctrl+C)
2. Refresh marketplace page
3. **Expected:** Error message displays with "Retry" button
4. Restart backend server
5. Click "Retry" button
6. **Expected:** Data loads successfully

---

## 🧪 STEP 3: TEST COMMUNITY PROJECTS API (Backend Only)

### **Using Thunder Client / Postman:**

#### **Test 1: Get All Projects**
```
GET http://localhost:5000/api/community-projects
```

**Expected Response:**
```json
{
  "success": true,
  "count": 0,
  "total": 0,
  "page": 1,
  "pages": 0,
  "data": []
}
```

#### **Test 2: Create Project (Requires Auth)**
First, you need to login and get a token.

**Login:**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "your-email@example.com",
  "password": "your-password"
}
```

**Copy the token from response, then:**

```
POST http://localhost:5000/api/community-projects
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "title": "Test Community Project",
  "category": "Social Enterprise",
  "description": "This is a test project to verify the API is working correctly.",
  "location": "Kuala Lumpur, Malaysia",
  "fundingGoal": 5000,
  "tags": ["Test", "Technology"],
  "founder": {
    "name": "Test User",
    "role": "Project Founder"
  }
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "_id": "...",
    "title": "Test Community Project",
    "category": "Social Enterprise",
    ...
  }
}
```

#### **Test 3: Get Project by ID**
```
GET http://localhost:5000/api/community-projects/PROJECT_ID_HERE
```

#### **Test 4: Like Project**
```
POST http://localhost:5000/api/community-projects/PROJECT_ID_HERE/like
Authorization: Bearer YOUR_TOKEN_HERE
```

#### **Test 5: Add Comment**
```
POST http://localhost:5000/api/community-projects/PROJECT_ID_HERE/comment
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "text": "Great project! Looking forward to seeing it grow."
}
```

---

## 🧪 STEP 4: TEST DATA PERSISTENCE

### **Test Scenario: Create → Logout → Login → Verify**

1. **Create a project** (using API or frontend when integrated)
2. **Logout** from the application
3. **Close browser completely**
4. **Open browser again**
5. **Login**
6. **Navigate to Community Projects**
7. **Expected:** Your project is still there!

---

## ✅ SUCCESS CRITERIA

### **Marketplace:**
- [ ] Products load from database (or show empty state)
- [ ] Vendors load from database (or show empty state)
- [ ] Loading spinner shows while fetching
- [ ] Error message shows if backend is down
- [ ] Retry button works
- [ ] No console errors

### **Community Projects API:**
- [ ] GET /api/community-projects returns data
- [ ] POST /api/community-projects creates project (with auth)
- [ ] Project appears in GET request after creation
- [ ] Like/bookmark/comment endpoints work
- [ ] Authorization checks work (can't edit others' projects)

### **Data Persistence:**
- [ ] Data survives page refresh
- [ ] Data survives logout/login
- [ ] Data survives browser close/reopen
- [ ] Data is accessible from different devices (if logged in)

---

## 🐛 TROUBLESHOOTING

### **Problem: "Database not connected"**
**Solution:**
1. Check MongoDB Atlas is accessible
2. Verify MONGODB_URI in .env file
3. Check internet connection
4. Whitelist your IP in MongoDB Atlas

### **Problem: "CORS error"**
**Solution:**
1. Verify backend is running on port 5000
2. Verify frontend is running on port 3000
3. Check CORS configuration in server.js

### **Problem: "401 Unauthorized"**
**Solution:**
1. Make sure you're logged in
2. Check token is being sent in Authorization header
3. Verify token hasn't expired
4. Try logging in again

### **Problem: "Products/Vendors not loading"**
**Solution:**
1. Check browser console for errors
2. Check backend console for errors
3. Verify API endpoints are correct
4. Check network tab in browser DevTools

---

## 📊 WHAT TO CHECK IN BROWSER

### **Console (F12 → Console tab):**
- ✅ No red errors
- ✅ API calls show successful responses
- ⚠️ Warnings are okay

### **Network (F12 → Network tab):**
- ✅ `/api/products` returns 200 OK
- ✅ `/api/vendors` returns 200 OK
- ✅ `/api/community-projects` returns 200 OK
- ✅ Response data is JSON format

### **Application (F12 → Application tab → Local Storage):**
- ✅ `token` exists if logged in
- ✅ No corrupted data

---

## 🎯 QUICK VERIFICATION COMMANDS

### **Check if backend is running:**
```powershell
curl http://localhost:5000/health
```

**Expected:**
```json
{
  "status": "OK",
  "message": "RNC Backend is running",
  "timestamp": "...",
  "environment": "development"
}
```

### **Check if frontend is running:**
```powershell
curl http://localhost:3000
```

**Expected:** HTML response

---

## 📝 TESTING NOTES

**Record your test results:**

### **Marketplace Tests:**
- Products loading: ⬜ Pass / ⬜ Fail
- Vendors loading: ⬜ Pass / ⬜ Fail
- Loading states: ⬜ Pass / ⬜ Fail
- Error handling: ⬜ Pass / ⬜ Fail

### **Community Projects API Tests:**
- GET projects: ⬜ Pass / ⬜ Fail
- POST project: ⬜ Pass / ⬜ Fail
- Like project: ⬜ Pass / ⬜ Fail
- Comment on project: ⬜ Pass / ⬜ Fail

### **Data Persistence Tests:**
- Survives refresh: ⬜ Pass / ⬜ Fail
- Survives logout/login: ⬜ Pass / ⬜ Fail
- Survives browser restart: ⬜ Pass / ⬜ Fail

---

## 🚀 NEXT STEPS AFTER TESTING

**If tests pass:**
1. Complete Community Projects frontend integration
2. Add more test data
3. Deploy to production

**If tests fail:**
1. Note which tests failed
2. Check error messages
3. Review implementation
4. Fix issues
5. Re-test

---

**Ready to test!** 🧪

Start with the servers, then test Marketplace, then test Community Projects API.
