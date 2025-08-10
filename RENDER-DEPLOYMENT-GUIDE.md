# 🚀 Complete Render Deployment Guide for RNC Malaysia Backend

## 📋 **Pre-Deployment Checklist**
- ✅ Backend code ready and tested locally
- ✅ `render.yaml` configuration file created
- ✅ Production environment variables configured
- ✅ CORS updated for production domains
- ✅ Git repository initialized

## 🎯 **Step-by-Step Deployment Process**

### **Step 1: Prepare Git Repository**

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Prepare RNC Malaysia backend for Render deployment"

# Create main branch
git branch -M main
```

### **Step 2: Push to GitHub/GitLab**

1. **Create a new repository** on GitHub or GitLab
   - Repository name: `rnc-malaysia-backend` (or similar)
   - Set as Public or Private (your choice)

2. **Connect and push your code:**
```bash
# Add remote origin (replace with your repository URL)
git remote add origin https://github.com/yourusername/rnc-malaysia-backend.git

# Push to GitHub/GitLab
git push -u origin main
```

### **Step 3: Deploy on Render**

1. **Go to Render Dashboard:**
   - Visit: https://render.com
   - Sign up or log in with your GitHub/GitLab account

2. **Create New Web Service:**
   - Click "New +" button
   - Select "Web Service"
   - Choose "Build and deploy from a Git repository"

3. **Connect Repository:**
   - Select GitHub or GitLab
   - Choose your `rnc-malaysia-backend` repository
   - Click "Connect"

4. **Configure Service:**
   - **Name:** `rnc-malaysia-api`
   - **Region:** Singapore (closest to Malaysia)
   - **Branch:** `main`
   - **Runtime:** Node
   - **Build Command:** `npm install --production`
   - **Start Command:** `npm start`

5. **Render will auto-detect your `render.yaml` file** and use those settings

### **Step 4: Configure Environment Variables**

In the Render dashboard, add these environment variables:

#### **Required Variables:**
```bash
MONGODB_URI=mongodb+srv://username:password@rncmalaysia.dfz2nfi.mongodb.net/refugee-network
```
*Replace with your actual MongoDB Atlas connection string*

#### **Auto-Generated Variables (Render will create these):**
- `JWT_SECRET` - ✅ Auto-generated
- `JWT_REFRESH_SECRET` - ✅ Auto-generated

#### **Pre-Configured Variables (from render.yaml):**
- `NODE_ENV=production` - ✅ Set
- `PORT=10000` - ✅ Set
- `CORS_ORIGIN=http://rncmalaysia.org,https://rncmalaysia.org` - ✅ Set
- `JWT_EXPIRE=1h` - ✅ Set
- `JWT_REFRESH_EXPIRE=7d` - ✅ Set
- `RATE_LIMIT_WINDOW_MS=900000` - ✅ Set
- `RATE_LIMIT_MAX_REQUESTS=100` - ✅ Set

### **Step 5: Deploy and Monitor**

1. **Start Deployment:**
   - Click "Create Web Service"
   - Render will start building and deploying your app
   - Monitor the build logs for any errors

2. **Deployment URL:**
   - Your app will be available at: `https://rnc-malaysia-api.onrender.com`
   - Or similar URL based on availability

### **Step 6: Verify Deployment**

#### **Test Backend Health:**
```bash
curl https://rnc-malaysia-api.onrender.com/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-11T00:30:00.000Z",
  "database": "Connected" // or "Mock Mode"
}
```

#### **Test Authentication:**
```bash
curl -X POST https://rnc-malaysia-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@refugeenetwork.com","password":"123456"}'
```

**Expected Response:**
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "admin@refugeenetwork.com",
    "role": "admin"
  }
}
```

### **Step 7: Update Frontend Configuration**

Update your frontend `.env.production` file:

```bash
# In client/.env.production
REACT_APP_API_URL=https://rnc-malaysia-api.onrender.com/api
```

**Then rebuild and redeploy your frontend:**
```bash
cd client
npm run build
# Upload the build folder to your web hosting
```

## 🔧 **Production Configuration Details**

### **Render.yaml Configuration:**
```yaml
services:
  - type: web
    name: rnc-malaysia-api
    env: node
    plan: free
    region: singapore
    buildCommand: npm install --production
    startCommand: npm start
    healthCheckPath: /health
```

### **CORS Configuration:**
Your backend now supports these origins:
- `http://localhost:3000` (development)
- `http://rncmalaysia.org` (production)
- `https://rncmalaysia.org` (production SSL)
- `https://www.rncmalaysia.org` (www subdomain)

### **Security Features:**
- ✅ JWT token authentication
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ CORS protection
- ✅ Environment variable security
- ✅ Production-ready error handling

## 🎯 **Expected Results**

### **Deployment Timeline:**
- **Build Time:** 2-5 minutes
- **First Deploy:** 5-10 minutes
- **Subsequent Deploys:** 2-3 minutes

### **Performance:**
- **Cold Start:** ~30 seconds (free tier)
- **Response Time:** <500ms
- **Uptime:** 99.9% (Render SLA)

### **URLs After Deployment:**
- **Backend API:** `https://rnc-malaysia-api.onrender.com/api`
- **Health Check:** `https://rnc-malaysia-api.onrender.com/health`
- **Admin Login:** `https://rnc-malaysia-api.onrender.com/api/auth/login`

## 🔐 **Test Credentials**
- **Admin:** admin@refugeenetwork.com / 123456
- **User:** test@example.com / 123456

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **Build Fails:**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Check build logs for specific errors

2. **MongoDB Connection Issues:**
   - Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
   - Check MONGODB_URI format and credentials
   - Monitor database connection in logs

3. **CORS Errors:**
   - Verify frontend domain is in CORS_ORIGIN
   - Check browser network tab for actual request origin
   - Ensure HTTPS/HTTP protocol matches

4. **Authentication Fails:**
   - Check JWT_SECRET is set
   - Verify user credentials exist in database
   - Check rate limiting isn't blocking requests

### **Monitoring:**
- **Render Dashboard:** Monitor deployment status and logs
- **Health Endpoint:** Regular health checks
- **Error Logs:** Check Render logs for runtime errors

## 🎉 **Success Indicators**

✅ **Deployment Successful When:**
1. Build completes without errors
2. Health endpoint returns 200 OK
3. Login endpoint accepts credentials
4. Frontend can connect to backend
5. No CORS errors in browser console

## 📞 **Support Resources**

- **Render Documentation:** https://render.com/docs
- **MongoDB Atlas:** https://docs.atlas.mongodb.com/
- **Node.js on Render:** https://render.com/docs/node-version

---

## 🚀 **Ready to Deploy!**

Run the deployment script to get started:
```bash
node deploy-to-render.js
```

This will guide you through the entire process step by step!
