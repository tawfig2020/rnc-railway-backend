# 🚀 RNC Platform - Render.com Deployment Instructions

## 📋 **Repository:** https://github.com/tawfig2020/rncplatform

## 🎯 **Quick Deployment Steps**

### **Step 1: Push Updates to GitHub**

All the necessary files are ready. The deployment will use your existing `server.js` and `package.json`.

### **Step 2: Deploy to Render.com**

1. **Go to [render.com](https://render.com) and login**

2. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect GitHub account if not already connected
   - Select repository: `tawfig2020/rncplatform`
   - Click "Connect"

3. **Configure Deployment:**
   ```
   Name: rnc-malaysia-api
   Environment: Node
   Region: Oregon (US West) or Singapore (Asia)
   Branch: master (or main)
   Root Directory: (leave empty - uses root)
   Build Command: npm install
   Start Command: npm start
   ```

4. **Set Environment Variables:**
   ```
   NODE_ENV=production
   JWT_SECRET=rnc-super-secret-jwt-key-2025-CHANGE-THIS-IN-PRODUCTION
   JWT_REFRESH_SECRET=rnc-refresh-secret-2025-CHANGE-THIS-IN-PRODUCTION
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/refugee-network
   PORT=10000
   ```

5. **Advanced Settings (Optional):**
   ```
   Instance Type: Free
   Auto-Deploy: Yes (recommended)
   ```

6. **Deploy:**
   - Click "Create Web Service"
   - Wait 3-5 minutes for deployment
   - Your backend will be available at: `https://rnc-malaysia-api.onrender.com`

### **Step 3: Test Deployment**

After deployment, test these endpoints:

1. **Health Check:**
   ```
   https://rnc-malaysia-api.onrender.com/api/health
   ```

2. **Login Test:**
   ```bash
   curl -X POST https://rnc-malaysia-api.onrender.com/api/auth/login \
   -H "Content-Type: application/json" \
   -d '{"email":"admin@refugeenetwork.com","password":"123456"}'
   ```

### **Step 4: Update Frontend**

1. **Update Production Environment:**
   ```bash
   # Edit client/.env.production
   REACT_APP_API_URL=https://rnc-malaysia-api.onrender.com/api
   ```

2. **Rebuild Frontend:**
   ```bash
   cd client
   npm run build
   ```

3. **Redeploy to Netlify:**
   - Upload new `build` folder to Netlify
   - Or trigger rebuild if using Git deployment

## 🔧 **Backend Features Included**

Your current `server.js` includes:
- ✅ Complete authentication system
- ✅ Mock authentication fallback
- ✅ All API endpoints
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Error handling
- ✅ JWT token management

## 🔑 **Test Credentials**

After deployment, test with:
- **Admin:** `admin@refugeenetwork.com` / `123456`
- **Test User:** `test@example.com` / `123456`

## 📊 **Expected Results**

After successful deployment:
- ✅ Backend accessible at Render URL
- ✅ All API endpoints working
- ✅ Authentication system functional
- ✅ Frontend login works at `rncmalaysia.org.netlify.app`
- ✅ No more "Network error" messages

## 🛠 **Files Updated for Deployment**

- ✅ `package.json` - Added engines and metadata
- ✅ `render.yaml` - Render.com configuration
- ✅ `server.js` - Already production-ready
- ✅ All authentication fixes applied
- ✅ Frontend build updated

## 🚨 **Important Notes**

1. **MongoDB Connection:** Make sure to set `MONGODB_URI` in Render environment variables
2. **JWT Secrets:** Change the default JWT secrets in production
3. **CORS:** Your domains are already configured in `server.js`
4. **Free Tier:** Render free tier may sleep after 15 minutes of inactivity

## 🔍 **Troubleshooting**

**If deployment fails:**
1. Check Render logs for errors
2. Verify all environment variables are set
3. Ensure Node.js version compatibility
4. Check for missing dependencies

**If login still fails after deployment:**
1. Verify backend URL is accessible
2. Check browser network tab for errors
3. Ensure frontend environment is updated
4. Test backend endpoints directly

## 📞 **Support**

Your repository is now ready for deployment. All authentication fixes are included and the backend is production-ready!

**Repository:** https://github.com/tawfig2020/rncplatform
**Deployment Platform:** Render.com
**Expected Backend URL:** https://rnc-malaysia-api.onrender.com
