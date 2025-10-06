# 🚀 Hostinger Frontend Deployment - Step by Step Guide

## ✅ Current Situation (Clear Now!)

- **New Backend:** `https://rnc-railway-backend.onrender.com` ✅ Working perfectly!
- **Old Backend:** `https://rncplatform.onrender.com` (connected to Netlify)
- **Target:** Deploy frontend to **Hostinger** using the NEW working backend

---

## 📁 What You Need to Upload to Hostinger

### **Upload This Folder:**
```
client/build/
```

This folder contains:
- `index.html` (main file)
- `static/` folder (CSS, JS, images)
- `manifest.json`
- `robots.txt`
- All other assets

**Location:** `C:\Users\Lenovo\CascadeProjects\RNC\CascadeProjects\windsurf-project\client\build`

---

## 🎯 Step-by-Step: Deploy to Hostinger

### **Step 1: Access Hostinger File Manager**

1. **Login to Hostinger:**
   - Go to: https://hpanel.hostinger.com/
   - Login with your credentials

2. **Go to File Manager:**
   - Click on your website (rncmalaysia.net)
   - Click **"File Manager"** button
   - Or go to: **Files** → **File Manager**

---

### **Step 2: Navigate to Public Directory**

1. **Find the public_html folder:**
   - In File Manager, look for `public_html` folder
   - This is where your website files go
   - Click to open it

2. **Clean up old files (if any):**
   - Select all old files in `public_html`
   - Click **Delete** (or move to backup folder)
   - Confirm deletion

---

### **Step 3: Upload Build Files**

#### **Method 1: Upload via File Manager (Recommended)**

1. **Click Upload button:**
   - In File Manager, click **"Upload"** button (top right)

2. **Select files:**
   - Navigate to: `C:\Users\Lenovo\CascadeProjects\RNC\CascadeProjects\windsurf-project\client\build`
   - Select **ALL files and folders** inside build:
     - `index.html`
     - `static` folder
     - `manifest.json`
     - `robots.txt`
     - `asset-manifest.json`
     - All other files

3. **Upload:**
   - Click **"Upload"** or drag files
   - Wait for upload to complete (may take 2-5 minutes)

4. **Verify:**
   - Check that all files are in `public_html`
   - Should see `index.html` at root level
   - Should see `static` folder

---

#### **Method 2: Upload via FTP (Alternative)**

1. **Get FTP credentials:**
   - In Hostinger panel, go to **Files** → **FTP Accounts**
   - Note: Hostname, Username, Password

2. **Use FTP Client (FileZilla):**
   - Download FileZilla: https://filezilla-project.org/
   - Connect using FTP credentials
   - Navigate to `public_html` folder
   - Upload all files from `client/build` folder

---

### **Step 4: Configure .htaccess for React Router**

1. **Create .htaccess file:**
   - In File Manager, click **"New File"**
   - Name it: `.htaccess`
   - Location: Inside `public_html` folder

2. **Add this content:**
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

3. **Save the file**

---

### **Step 5: Verify Deployment**

1. **Visit your website:**
   - Go to: https://rncmalaysia.net
   - Should load the homepage

2. **Test login:**
   - Go to: https://rncmalaysia.net/login
   - Email: `admin@refugeenetwork.com`
   - Password: `admin123456`
   - Should work! ✅

3. **Check browser console:**
   - Press F12
   - Go to Console tab
   - Should see no errors
   - Should see API calls to: `rnc-railway-backend.onrender.com`

---

## 📂 Exact File Structure in Hostinger

After upload, your `public_html` should look like:

```
public_html/
├── index.html                    ← Main file
├── manifest.json
├── robots.txt
├── asset-manifest.json
├── favicon.ico
├── logo192.png
├── logo512.png
├── .htaccess                     ← Create this!
└── static/                       ← Folder
    ├── css/
    │   └── main.be2c0035.css
    ├── js/
    │   ├── main.dcbe8518.js
    │   └── 206.276884ca.chunk.js
    └── media/
        └── (images, fonts, etc.)
```

---

## 🔧 Important: Backend URL is Already Configured

The build you're uploading already points to:
```
https://rnc-railway-backend.onrender.com/api
```

**No need to change anything!** It's already configured correctly.

---

## ⚠️ Common Hostinger Issues & Solutions

### Issue 1: "404 Not Found" on page refresh
**Solution:** Make sure `.htaccess` file is created with the rewrite rules above.

### Issue 2: Files not uploading
**Solution:** 
- Check file size limits
- Try uploading in smaller batches
- Use FTP if File Manager fails

### Issue 3: "Permission denied"
**Solution:**
- Check folder permissions (should be 755)
- Right-click folder → Permissions → Set to 755

### Issue 4: Old files still showing
**Solution:**
- Clear browser cache (Ctrl + Shift + Delete)
- Clear Hostinger cache (if enabled)
- Wait 5 minutes for DNS propagation

---

## 🧪 Testing Checklist

After deployment, test these:

- [ ] Homepage loads: https://rncmalaysia.net
- [ ] Login page loads: https://rncmalaysia.net/login
- [ ] Admin login works with credentials
- [ ] Admin panel accessible: https://rncmalaysia.net/admin
- [ ] No CORS errors in console
- [ ] API calls go to: rnc-railway-backend.onrender.com
- [ ] All pages load (no 404 on refresh)

---

## 📝 Quick Reference

### **What to Upload:**
```
Location: C:\Users\Lenovo\CascadeProjects\RNC\CascadeProjects\windsurf-project\client\build
Upload to: public_html folder in Hostinger
```

### **Files to Upload:**
- ✅ index.html
- ✅ static/ folder (entire folder)
- ✅ manifest.json
- ✅ robots.txt
- ✅ All other files in build folder

### **File to Create:**
- ✅ .htaccess (with React Router rules)

### **Admin Credentials:**
```
Email: admin@refugeenetwork.com
Password: admin123456
```

### **Backend URL (Already Configured):**
```
https://rnc-railway-backend.onrender.com/api
```

---

## 🎯 Summary

1. **Login to Hostinger** → File Manager
2. **Go to public_html** folder
3. **Delete old files** (if any)
4. **Upload all files** from `client/build` folder
5. **Create .htaccess** file with rewrite rules
6. **Visit** https://rncmalaysia.net
7. **Test login** with admin credentials
8. **Done!** ✅

---

## ⏱️ Estimated Time

- Login to Hostinger: 1 minute
- Upload files: 3-5 minutes
- Create .htaccess: 1 minute
- Test: 1 minute
- **Total: 6-8 minutes**

---

## 🆘 If You Need Help

### Can't find File Manager?
- Look for **"Files"** section in Hostinger panel
- Or **"Website"** → **"File Manager"**

### Upload failing?
- Try FTP method instead
- Or upload in smaller batches

### Site not loading?
- Wait 5 minutes for cache to clear
- Clear browser cache
- Check .htaccess is created

---

**Next Action:** Login to Hostinger and start uploading! 🚀

**Build Location:** `client/build` folder (I opened it for you in Explorer)

**Upload Destination:** `public_html` folder in Hostinger File Manager
