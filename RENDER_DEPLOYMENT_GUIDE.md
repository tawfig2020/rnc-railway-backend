# 🚀 Complete Render.com Deployment Guide

## **Your API Key:** `rnd_elQxbwWwuEgMdU4jWXrudSK36ZNX`

## 📁 **Files Ready for Deployment**

I've created a complete backend deployment package in the `backend-deploy/` folder:

- ✅ `server.js` - Production-ready backend with all auth endpoints
- ✅ `package.json` - All dependencies and scripts
- ✅ `README.md` - Complete documentation
- ✅ `.gitignore` - Proper file exclusions

## 🎯 **Step-by-Step Deployment**

### **Method 1: GitHub + Render (Recommended)**

1. **Create GitHub Repository:**
   ```bash
   # Navigate to backend-deploy folder
   cd backend-deploy
   
   # Initialize git
   git init
   git add .
   git commit -m "Initial backend deployment"
   
   # Create repository on GitHub and push
   git remote add origin https://github.com/yourusername/rnc-backend-api.git
   git push -u origin main
   ```

2. **Deploy on Render:**
   - Go to [render.com](https://render.com)
   - Login with your account
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Configure:
     ```
     Name: rnc-malaysia-api
     Environment: Node
     Build Command: npm install
     Start Command: npm start
     Instance Type: Free
     ```

3. **Set Environment Variables:**
   ```
   NODE_ENV=production
   JWT_SECRET=rnc-super-secret-jwt-key-2025-CHANGE-THIS
   JWT_REFRESH_SECRET=rnc-refresh-secret-2025-CHANGE-THIS
   ```

4. **Deploy and Get URL:**
   - Click "Create Web Service"
   - Wait 2-3 minutes for deployment
   - Your backend will be at: `https://rnc-malaysia-api.onrender.com`

### **Method 2: Direct File Upload**

If you prefer not to use GitHub:

1. **Zip the backend-deploy folder**
2. **Use Render's manual deployment option**
3. **Upload the zip file**
4. **Configure as above**

## 🧪 **Test Your Deployment**

Once deployed, test these URLs in your browser:

1. **Root Endpoint:**
   ```
   https://rnc-malaysia-api.onrender.com/
   ```
   Should return API information

2. **Health Check:**
   ```
   https://rnc-malaysia-api.onrender.com/api/health
   ```
   Should return status: OK

3. **Login Test (use Postman or curl):**
   ```bash
   curl -X POST https://rnc-malaysia-api.onrender.com/api/auth/login \
   -H "Content-Type: application/json" \
   -d '{"email":"admin@refugeenetwork.com","password":"123456"}'
   ```

## 🔄 **Update Frontend After Backend Deployment**

1. **Update Environment File:**
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
   - Your login should now work!

## 🔑 **Working Credentials**

After deployment, test with:
- **Admin:** `admin@refugeenetwork.com` / `123456`
- **Test User:** `test@example.com` / `123456`
- **Staff:** `staff@refugeenetwork.com` / `123456`

## 🎉 **Expected Result**

After completing these steps:
- ✅ Backend deployed and accessible
- ✅ Frontend connects to backend successfully
- ✅ Login works on `rncmalaysia.org.netlify.app`
- ✅ No more "Network error" messages

## 🆘 **Troubleshooting**

**If deployment fails:**
1. Check Render logs for errors
2. Ensure all files are in the repository
3. Verify environment variables are set
4. Check Node.js version compatibility

**If login still fails:**
1. Verify backend URL is accessible
2. Check browser network tab for CORS errors
3. Ensure frontend is rebuilt with correct API URL
4. Test backend endpoints directly

## 📞 **Need Help?**

If you encounter issues:
1. Check Render deployment logs
2. Test backend endpoints individually
3. Verify CORS settings
4. Check environment variables

**Your backend is production-ready and optimized for Render.com!** 🚀
