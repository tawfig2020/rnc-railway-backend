# 🔧 RENDER MONGODB CONNECTION FIX

## 🚨 CRITICAL ISSUE IDENTIFIED
Your backend is running in **MOCK MODE** instead of connecting to MongoDB, causing login failures.

## 📋 IMMEDIATE SOLUTION STEPS

### Step 1: Fix MongoDB Atlas IP Whitelist
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Navigate to **Network Access** → **IP Access List**
3. Click **+ ADD IP ADDRESS**
4. Select **ALLOW ACCESS FROM ANYWHERE** (0.0.0.0/0)
5. Add comment: "Render Deployment - All IPs"
6. Click **Confirm**

### Step 2: Update Render Environment Variables
1. Go to your [Render Dashboard](https://dashboard.render.com/)
2. Select your backend service: `rncplatform`
3. Go to **Environment** tab
4. Verify/Add these variables:

```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
JWT_SECRET=your-jwt-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
CORS_ORIGIN=https://rncmalaysia.org,https://your-netlify-site.netlify.app
```

### Step 3: Manual Deploy
1. In Render dashboard, go to **Manual Deploy** tab
2. Click **Deploy latest commit**
3. Wait for deployment to complete
4. Check logs for "MongoDB Connected" message

## 🧪 TEST CREDENTIALS (Mock Mode - Current)
- **Admin:** admin@refugeenetwork.com / 123456
- **User:** test@example.com / 123456

## 🧪 REAL DATABASE CREDENTIALS (After Fix)
You'll need to create these in your MongoDB database or use seeded data.

## 🔍 VERIFICATION COMMANDS
```bash
# Test health (should work)
curl https://rncplatform.onrender.com/health

# Test API root (should show real mode message)
curl https://rncplatform.onrender.com/api

# Test login (should work with real credentials)
curl -X POST https://rncplatform.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@refugeenetwork.com","password":"123456"}'
```

## 🎯 SUCCESS INDICATORS
- ✅ MongoDB connection log in Render
- ✅ API root returns "Welcome to Refugee Network Centre API" (not Mock Mode)
- ✅ Login works with real credentials
- ✅ Frontend can register/login successfully
