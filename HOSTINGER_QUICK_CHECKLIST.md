# ✅ Hostinger Deployment - Quick Checklist

## 🎯 What You're Doing

Deploying frontend to **Hostinger (rncmalaysia.net)** using the **NEW working backend** (`rnc-railway-backend.onrender.com`)

---

## 📦 What to Upload

### **Folder to Upload:**
```
client/build/
```

**Location on your PC:**
```
C:\Users\Lenovo\CascadeProjects\RNC\CascadeProjects\windsurf-project\client\build
```

**I just opened this folder for you in Explorer!** ✅

---

## 🚀 Step-by-Step Checklist

### **Step 1: Login to Hostinger**
- [ ] Go to: https://hpanel.hostinger.com/
- [ ] Login with your credentials
- [ ] Click on **rncmalaysia.net** website

### **Step 2: Open File Manager**
- [ ] Click **"File Manager"** button
- [ ] Or go to: **Files** → **File Manager**

### **Step 3: Navigate to public_html**
- [ ] Find `public_html` folder
- [ ] Click to open it
- [ ] This is where your website files go

### **Step 4: Clean Old Files (if any)**
- [ ] Select all old files in `public_html`
- [ ] Click **Delete** button
- [ ] Confirm deletion
- [ ] (Or move to backup folder first)

### **Step 5: Upload New Files**
- [ ] Click **"Upload"** button in File Manager
- [ ] Navigate to the `build` folder I opened
- [ ] Select **ALL files and folders** inside:
  - [ ] index.html
  - [ ] static/ folder
  - [ ] manifest.json
  - [ ] robots.txt
  - [ ] All other files
- [ ] Click **Upload** or drag & drop
- [ ] Wait for upload to complete (3-5 minutes)

### **Step 6: Create .htaccess File**
- [ ] In File Manager, click **"New File"**
- [ ] Name it: `.htaccess` (don't forget the dot!)
- [ ] Location: Inside `public_html` folder
- [ ] Click **Edit** on the new file
- [ ] Copy content from `htaccess-for-hostinger.txt` (I created this file)
- [ ] Paste into .htaccess
- [ ] Click **Save**

### **Step 7: Test Your Website**
- [ ] Visit: https://rncmalaysia.net
- [ ] Homepage should load
- [ ] Go to: https://rncmalaysia.net/login
- [ ] Login with:
  - Email: `admin@refugeenetwork.com`
  - Password: `admin123456`
- [ ] Should work! ✅

### **Step 8: Verify Everything**
- [ ] Press F12 (open browser console)
- [ ] Check for errors (should be none)
- [ ] Check API calls go to: `rnc-railway-backend.onrender.com`
- [ ] Test admin panel: https://rncmalaysia.net/admin
- [ ] All features should work

---

## 📁 Files I Prepared for You

### **1. Build Folder** ✅
- **Location:** `client/build/` (opened in Explorer)
- **What:** All your website files
- **Action:** Upload ALL files to Hostinger

### **2. .htaccess Content** ✅
- **File:** `htaccess-for-hostinger.txt` (created in project root)
- **What:** React Router configuration
- **Action:** Copy content to .htaccess in Hostinger

### **3. Deployment Guide** ✅
- **File:** `HOSTINGER_DEPLOYMENT_STEPS.md`
- **What:** Detailed step-by-step guide
- **Action:** Reference if you need more details

---

## 🔑 Important Information

### **Backend URL (Already Configured):**
```
https://rnc-railway-backend.onrender.com/api
```
✅ No need to change anything - it's already in the build!

### **Admin Credentials:**
```
Email: admin@refugeenetwork.com
Password: admin123456
```

### **Your Website:**
```
https://rncmalaysia.net
```

---

## 📂 Expected File Structure in Hostinger

After upload, `public_html` should contain:

```
public_html/
├── index.html          ← Main file
├── .htaccess           ← Create this manually
├── manifest.json
├── robots.txt
├── asset-manifest.json
├── favicon.ico
└── static/             ← Entire folder
    ├── css/
    ├── js/
    └── media/
```

---

## ⚠️ Important Notes

### **About .htaccess:**
- Must be named exactly: `.htaccess` (with the dot)
- Must be in `public_html` folder
- Content is in `htaccess-for-hostinger.txt`
- This fixes page refresh 404 errors

### **About Upload:**
- Upload ALL files from `build` folder
- Don't upload the `build` folder itself
- Upload the CONTENTS of build folder
- Keep folder structure intact (especially `static/` folder)

### **About Backend:**
- Backend is already working
- No changes needed on Render
- Frontend already points to correct backend
- Just upload and it works!

---

## 🎯 Quick Summary

1. ✅ **Build folder** ready (opened in Explorer)
2. ✅ **.htaccess content** ready (in htaccess-for-hostinger.txt)
3. ✅ **Backend** already working (no action needed)
4. 🚀 **Your action:** Upload to Hostinger
5. ⏱️ **Time needed:** 6-8 minutes
6. 🎉 **Result:** Website working!

---

## 🆘 Quick Help

### **Can't find File Manager?**
Look for "Files" or "Website" section in Hostinger panel

### **Upload failing?**
- Try uploading in smaller batches
- Or use FTP (get credentials from Hostinger)

### **.htaccess not working?**
- Make sure name is exactly: `.htaccess`
- Check it's in `public_html` folder
- Verify content is correct

### **Site not loading?**
- Wait 5 minutes for cache
- Clear browser cache (Ctrl + Shift + Delete)
- Check all files uploaded correctly

---

## ✅ Final Checklist

Before you start:
- [x] Build folder ready (opened)
- [x] .htaccess content ready (in txt file)
- [x] Backend working (verified)
- [x] Admin credentials known
- [ ] **YOU: Login to Hostinger**
- [ ] **YOU: Upload files**
- [ ] **YOU: Create .htaccess**
- [ ] **YOU: Test website**

---

**Ready to start?** 

1. Open: https://hpanel.hostinger.com/
2. Upload files from the `build` folder I opened
3. Create .htaccess using content from `htaccess-for-hostinger.txt`
4. Test: https://rncmalaysia.net

**You got this!** 🚀
