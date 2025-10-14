# 🚀 Migration API Endpoint - User Guide

## ✅ Solution: Run Migration via API (No Shell Access Needed!)

Since you can't access the Render shell without upgrading, I've created an API endpoint that you can call from your browser or Postman.

---

## 📋 Step-by-Step Guide

### **Method 1: Using Browser Console (Easiest)**

1. **Log in as Admin**
   - Go to: `https://rncmalaysia.net/admin`
   - Or: `http://localhost:3000/admin`
   - Log in with your admin credentials

2. **Open Browser Console**
   - Press `F12` (or right-click → Inspect)
   - Click "Console" tab

3. **Check How Many Users Need Fixing**
   
   Copy and paste this code:
   ```javascript
   fetch('https://rnc-railway-backend.onrender.com/api/migration/check-user-locations', {
     method: 'GET',
     headers: {
       'Content-Type': 'application/json',
       'x-auth-token': localStorage.getItem('token')
     }
   })
   .then(res => res.json())
   .then(data => {
     console.log('Users without location:', data);
     alert(`Found ${data.count} users without location`);
   })
   .catch(err => console.error('Error:', err));
   ```

4. **Run the Migration**
   
   Copy and paste this code:
   ```javascript
   fetch('https://rnc-railway-backend.onrender.com/api/migration/fix-user-locations', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'x-auth-token': localStorage.getItem('token')
     }
   })
   .then(res => res.json())
   .then(data => {
     console.log('Migration result:', data);
     if (data.success) {
       alert(`✅ Success! Updated ${data.updated} users`);
     } else {
       alert(`❌ Error: ${data.message}`);
     }
   })
   .catch(err => {
     console.error('Error:', err);
     alert('Error running migration');
   });
   ```

5. **Verify Success**
   - You should see: `✅ Success! Updated X users`
   - Check the console for details

---

### **Method 2: Using Postman**

1. **Open Postman** (or download from https://www.postman.com/downloads/)

2. **Get Your Auth Token**
   - Log in to admin panel
   - Open browser console (F12)
   - Type: `localStorage.getItem('token')`
   - Copy the token (without quotes)

3. **Check Users (Optional)**
   - Method: `GET`
   - URL: `https://rnc-railway-backend.onrender.com/api/migration/check-user-locations`
   - Headers:
     - Key: `x-auth-token`
     - Value: `YOUR_TOKEN_HERE`
     - Key: `Content-Type`
     - Value: `application/json`
   - Click "Send"

4. **Run Migration**
   - Method: `POST`
   - URL: `https://rnc-railway-backend.onrender.com/api/migration/fix-user-locations`
   - Headers:
     - Key: `x-auth-token`
     - Value: `YOUR_TOKEN_HERE`
     - Key: `Content-Type`
     - Value: `application/json`
   - Click "Send"

5. **Check Response**
   ```json
   {
     "success": true,
     "message": "Successfully updated 3 users!",
     "updated": 3,
     "users": [
       { "email": "admin@rnc.org", "name": "Admin" },
       { "email": "test@example.com", "name": "Test User" }
     ]
   }
   ```

---

### **Method 3: Using cURL (Command Line)**

1. **Get Your Token**
   - Log in to admin panel
   - Open console: `localStorage.getItem('token')`
   - Copy the token

2. **Check Users**
   ```bash
   curl -X GET "https://rnc-railway-backend.onrender.com/api/migration/check-user-locations" \
     -H "Content-Type: application/json" \
     -H "x-auth-token: YOUR_TOKEN_HERE"
   ```

3. **Run Migration**
   ```bash
   curl -X POST "https://rnc-railway-backend.onrender.com/api/migration/fix-user-locations" \
     -H "Content-Type: application/json" \
     -H "x-auth-token: YOUR_TOKEN_HERE"
   ```

---

### **Method 4: Run Script Locally (Recommended)**

This is the easiest if you have MongoDB access:

1. **Open Terminal**
   ```bash
   cd C:\Users\Lenovo\CascadeProjects\RNC\CascadeProjects\windsurf-project
   ```

2. **Run the Script**
   ```bash
   node scripts/fix-user-locations.js
   ```

3. **Done!**
   ```
   MongoDB Connected
   🔍 Finding users without location...
   Found 3 users without location
   ✅ Successfully updated 3 users!
   ```

---

## 🔒 Security

- ✅ **Admin Only**: Requires admin authentication
- ✅ **Token Required**: Must be logged in as admin
- ✅ **Safe Operation**: Only updates missing location fields
- ✅ **No Data Loss**: Doesn't delete or modify other fields

---

## 📊 API Endpoints

### **1. Check Users Without Location**

```
GET /api/migration/check-user-locations
```

**Headers:**
- `x-auth-token`: Your admin token
- `Content-Type`: application/json

**Response:**
```json
{
  "success": true,
  "count": 3,
  "users": [
    { "email": "admin@rnc.org", "name": "Admin" },
    { "email": "test@example.com", "name": "Test User" }
  ]
}
```

---

### **2. Fix User Locations**

```
POST /api/migration/fix-user-locations
```

**Headers:**
- `x-auth-token`: Your admin token
- `Content-Type`: application/json

**Response:**
```json
{
  "success": true,
  "message": "Successfully updated 3 users!",
  "updated": 3,
  "users": [
    { "email": "admin@rnc.org", "name": "Admin" },
    { "email": "test@example.com", "name": "Test User" }
  ]
}
```

---

## ✅ Verification

After running the migration:

1. **Try Creating a Community Project**
   - Go to Admin → Community Projects
   - Click "Add New Project"
   - Fill form and submit
   - **Should work!** ✅

2. **Try Creating a Course**
   - Go to Admin → Courses
   - Click "Add New Course"
   - Fill form and submit
   - **Should work!** ✅

---

## 🎯 Recommended Method

**I recommend Method 1 (Browser Console)** because:
- ✅ No additional tools needed
- ✅ Already logged in as admin
- ✅ Token is automatically available
- ✅ Quick and easy
- ✅ See results immediately

---

## 📝 Summary

**Problem:** Can't access Render shell without subscription upgrade

**Solution:** Created API endpoint to run migration

**How to Use:**
1. Log in as admin
2. Open browser console (F12)
3. Run the JavaScript code provided above
4. Done! ✅

**Alternative:** Run `node scripts/fix-user-locations.js` locally

---

**No shell access needed!** 🎉
