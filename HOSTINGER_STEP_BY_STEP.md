# 🚀 HOSTINGER DEPLOYMENT - COMPLETE STEP-BY-STEP GUIDE

**Date:** October 6, 2025, 1:55 AM  
**Task:** Deploy frontend to Hostinger (rncmalaysia.net)

---

## ✅ BACKEND STATUS

**Backend changes pushed successfully!**
- ✓ Committed: server.js
- ✓ Pushed to: https://github.com/tawfig2020/rnc-railway-backend
- ✓ Render will auto-deploy in 2-3 minutes

**Check backend deployment:**
- Go to: https://dashboard.render.com/
- Check if deployment is in progress
- Wait for "Live" status

---

## 📁 WHAT YOU NEED

**Build Folder Location:**
```
C:\Users\Lenovo\CascadeProjects\RNC\CascadeProjects\windsurf-project\client\build
```

**I already opened this folder in Windows Explorer for you!**

---

## 🎯 STEP-BY-STEP DEPLOYMENT TO HOSTINGER

### **STEP 1: Login to Hostinger**

1. Open your web browser
2. Go to: **https://hpanel.hostinger.com/**
3. Enter your Hostinger credentials
4. Click **"Login"**

---

### **STEP 2: Access File Manager**

1. After login, you'll see your dashboard
2. Find your website: **rncmalaysia.net**
3. Click on **rncmalaysia.net**
4. Look for **"File Manager"** button (usually on the right side)
5. Click **"File Manager"**

**Alternative path:**
- Click **"Files"** in left menu
- Then click **"File Manager"**

---

### **STEP 3: Navigate to public_html**

1. In File Manager, you'll see a list of folders
2. Look for **"public_html"** folder
3. **Double-click** on `public_html` to open it
4. This is where your website files go

---

### **STEP 4: Backup Old Files (Optional but Recommended)**

**Option A: Create Backup Folder**
1. In File Manager, click **"New Folder"**
2. Name it: `backup_old_site`
3. Select ALL current files in `public_html`
4. Click **"Move"** or drag them to `backup_old_site`

**Option B: Delete Old Files**
1. Select ALL files in `public_html`
2. Click **"Delete"** button (trash icon)
3. Confirm deletion

**I recommend Option A (backup) for safety!**

---

### **STEP 5: Upload New Build Files**

**Method 1: Drag and Drop (Easiest)**

1. In File Manager, make sure you're in `public_html` folder
2. Look for **"Upload"** button (usually top right)
3. Click **"Upload"** button
4. A file upload dialog will appear

5. **Go to the build folder I opened:**
   - Switch to Windows Explorer
   - You should see the `build` folder open
   - Press `Ctrl + A` to select ALL files and folders inside build
   
6. **Drag ALL selected files** from Explorer to the Hostinger upload area
   - OR click "Select Files" and browse to the build folder
   - Select ALL files and folders inside build
   
7. **Important:** Upload the CONTENTS of build folder, not the build folder itself!

**Files you should see uploading:**
- index.html
- manifest.json
- robots.txt
- asset-manifest.json
- favicon.ico
- logo192.png
- logo512.png
- static/ (folder with css, js, media inside)

8. Wait for upload to complete (3-5 minutes depending on internet speed)

---

### **STEP 6: Verify Files Uploaded**

After upload completes, check that `public_html` contains:

```
public_html/
├── index.html          ← Main file (MUST be here)
├── manifest.json
├── robots.txt
├── asset-manifest.json
├── favicon.ico
├── logo192.png
├── logo512.png
└── static/             ← Folder (MUST be here)
    ├── css/
    ├── js/
    └── media/
```

**If you see a `build` folder inside `public_html`, that's WRONG!**
- Move all files OUT of the build folder
- Delete the empty build folder

---

### **STEP 7: Create .htaccess File**

**This is CRITICAL for React Router to work!**

1. In File Manager (still in `public_html`), click **"New File"**
2. Name it exactly: `.htaccess` (don't forget the dot!)
3. Click **"Create"**

4. **Right-click** on `.htaccess` file
5. Click **"Edit"**

6. **Copy this content** (from htaccess-for-hostinger.txt):

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

7. **Paste** the content into the .htaccess file
8. Click **"Save"** or **"Save Changes"**
9. Close the editor

---

### **STEP 8: Set File Permissions (If Needed)**

1. **Right-click** on `public_html` folder
2. Select **"Permissions"** or **"Change Permissions"**
3. Set to: **755**
4. Check **"Apply to subdirectories"**
5. Click **"OK"**

---

### **STEP 9: Clear Cache**

**Clear Hostinger Cache (if available):**
1. Go back to Hostinger dashboard
2. Look for **"Cache"** or **"Website"** settings
3. Click **"Clear Cache"** if available

**Clear Your Browser Cache:**
1. Press `Ctrl + Shift + Delete`
2. Select **"Cached images and files"**
3. Click **"Clear data"**

---

### **STEP 10: Test Your Website**

1. **Open a new browser tab**
2. Go to: **https://rncmalaysia.net**
3. **Homepage should load!**

**If you see errors:**
- Wait 2-3 minutes (DNS propagation)
- Clear browser cache again
- Try incognito/private mode

---

## 🧪 COMPLETE TESTING CHECKLIST

### **Test 1: Homepage**
- [ ] Go to: https://rncmalaysia.net
- [ ] Homepage loads without errors
- [ ] No 404 errors

### **Test 2: Login**
- [ ] Go to: https://rncmalaysia.net/login
- [ ] Login page loads
- [ ] Enter credentials:
  - Email: `admin@refugeenetwork.com`
  - Password: `admin123456`
- [ ] Click "Sign In"
- [ ] Should redirect to admin panel

### **Test 3: Admin Panel**
- [ ] Admin dashboard loads
- [ ] No errors in browser console (Press F12)

### **Test 4: Events Section**
- [ ] Go to Admin → Events
- [ ] Click "Add New Event"
- [ ] Fill in:
  - Title: "Test Event Persistence"
  - Category: Workshop
  - Date: Tomorrow's date
  - Time: 10:00 - 12:00
  - Location: Online
  - Capacity: 50
  - Description: "Testing database persistence"
- [ ] Click "Save"
- [ ] See "Event added successfully"
- [ ] **LOGOUT**
- [ ] **LOGIN AGAIN**
- [ ] Go to Events
- [ ] **"Test Event Persistence" should still be there!** ✅

### **Test 5: Users Section**
- [ ] Go to Admin → Users
- [ ] Click "Add New User"
- [ ] Fill in:
  - Name: "Test User"
  - Email: "test@example.com"
  - Role: User
  - Password: "test123"
- [ ] Click "Save"
- [ ] **LOGOUT**
- [ ] **LOGIN AGAIN**
- [ ] Go to Users
- [ ] **"Test User" should still be there!** ✅

### **Test 6: Courses Section**
- [ ] Go to Admin → Courses
- [ ] Click "Add New Course"
- [ ] Fill in course details
- [ ] Click "Save"
- [ ] **LOGOUT**
- [ ] **LOGIN AGAIN**
- [ ] Go to Courses
- [ ] **Course should still be there!** ✅

### **Test 7: Browser Console**
- [ ] Press F12 (open Developer Tools)
- [ ] Go to "Console" tab
- [ ] Should see NO red errors
- [ ] API calls should go to: `rnc-railway-backend.onrender.com`

---

## ⚠️ TROUBLESHOOTING

### **Problem: 404 Error on Page Refresh**
**Solution:** Check .htaccess file
- Make sure it's named exactly `.htaccess`
- Verify content is correct
- Check it's in `public_html` folder

### **Problem: Homepage Shows Directory Listing**
**Solution:** Check index.html location
- index.html must be directly in `public_html`
- NOT in a subfolder

### **Problem: "Network Error" When Testing**
**Solution:** Check backend
- Go to: https://rnc-railway-backend.onrender.com/health
- Should show: "Database: Connected"
- If not, wait for Render deployment to complete

### **Problem: Old Site Still Showing**
**Solution:** Clear all caches
- Clear browser cache (Ctrl + Shift + Delete)
- Try incognito mode
- Wait 5 minutes for CDN cache to clear

### **Problem: CSS Not Loading**
**Solution:** Check static folder
- Verify `static` folder uploaded correctly
- Check file permissions (755)
- Clear browser cache

### **Problem: Can't Upload Files**
**Solution:** 
- Check file size limits in Hostinger
- Try uploading in smaller batches
- Use FTP if File Manager fails

---

## 📞 QUICK REFERENCE

### **Hostinger Login:**
```
URL: https://hpanel.hostinger.com/
```

### **Website URL:**
```
https://rncmalaysia.net
```

### **Admin Login:**
```
Email: admin@refugeenetwork.com
Password: admin123456
```

### **Backend Health Check:**
```
https://rnc-railway-backend.onrender.com/health
```

### **Build Folder:**
```
C:\Users\Lenovo\CascadeProjects\RNC\CascadeProjects\windsurf-project\client\build
```

---

## ✅ DEPLOYMENT CHECKLIST

**Before You Start:**
- [x] Backend pushed to GitHub
- [x] Build folder ready
- [x] .htaccess content ready
- [ ] Hostinger account ready
- [ ] Browser open

**During Deployment:**
- [ ] Login to Hostinger
- [ ] Open File Manager
- [ ] Navigate to public_html
- [ ] Backup/delete old files
- [ ] Upload ALL build files
- [ ] Create .htaccess file
- [ ] Set permissions (755)
- [ ] Clear caches

**After Deployment:**
- [ ] Test homepage
- [ ] Test login
- [ ] Test admin panel
- [ ] Test Events (add, logout, login, verify)
- [ ] Test Users (add, logout, login, verify)
- [ ] Test Courses (add, logout, login, verify)
- [ ] Check browser console (no errors)
- [ ] Celebrate! 🎉

---

## 🎊 SUCCESS INDICATORS

When everything is working, you should see:

✅ Homepage loads at https://rncmalaysia.net  
✅ Login works with admin credentials  
✅ Admin panel accessible  
✅ Events persist after logout/login  
✅ Users persist after logout/login  
✅ Courses persist after logout/login  
✅ No errors in browser console  
✅ API calls go to rnc-railway-backend.onrender.com  
✅ All CRUD operations working  
✅ Data saves to MongoDB database  

---

## ⏱️ ESTIMATED TIME

- Login to Hostinger: 1 minute
- Navigate to File Manager: 1 minute
- Backup old files: 2 minutes
- Upload new files: 3-5 minutes
- Create .htaccess: 2 minutes
- Test website: 5 minutes
- **Total: 15-20 minutes**

---

## 🆘 NEED HELP?

**If you get stuck:**

1. **Check this guide** - Read the troubleshooting section
2. **Check browser console** - Press F12, look for errors
3. **Check backend** - Visit health endpoint
4. **Clear all caches** - Browser, Hostinger, CDN
5. **Wait a few minutes** - Sometimes takes time to propagate

---

**Ready to deploy? Let's do this!** 🚀

**Start with STEP 1: Login to Hostinger**

Good luck! You got this! 💪
