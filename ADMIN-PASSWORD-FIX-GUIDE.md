# 🔧 ADMIN PASSWORD FIX - STEP BY STEP

## 📊 **Issue Identified**

The admin user exists in your MongoDB but has the wrong password hash. The existing hash doesn't match "123456".

**Current Admin User:**
- Email: `admin@refugeenetwork.com` ✅
- Role: `admin` ✅  
- Password Hash: `$2a$10$SwYYvCt1ZwV8QGN9X8We8umWc1xrEtK7L3QMy6EZJ6..yPV1pbku.` ❌
- Email Verified: `false` ❌

## 🔧 **Fix Instructions**

### **Step 1: Access MongoDB Atlas**
1. Go to https://cloud.mongodb.com/
2. Sign in to your account
3. Select your project
4. Go to **Collections**

### **Step 2: Navigate to User**
1. Database: **refugee-network**
2. Collection: **users**
3. Find document with email: `admin@refugeenetwork.com`
4. Click **Edit Document**

### **Step 3: Update Password Hash**
Replace the current password field with this new hash:
```
$2a$10$2FRSUSwfu7tnnjjipYXQAu5RIzetQ95atVicOUE3TzoXdBwTWsw86
```

### **Step 4: Update Email Verification**
Change `isEmailVerified` from `false` to `true`

### **Step 5: Save Changes**
Click **Update** to save the document

## 🧪 **Test Login**

After updating, test with:
- **Email**: `admin@refugeenetwork.com`
- **Password**: `123456`

## 🚀 **Next Steps**

1. **Update admin password in MongoDB Atlas**
2. **Deploy frontend to Netlify**
3. **Test admin login on live site**
4. **All functionality should work perfectly**

The backend is fully functional - just need this password fix!
