# RNC Backend Deployment to Render.com

## 🚀 Quick Deployment Steps

### **Step 1: Create GitHub Repository**
1. Create a new repository on GitHub (e.g., `rnc-backend-api`)
2. Upload these files:
   - `server.js`
   - `package.json`
   - `README.md`

### **Step 2: Deploy to Render.com**

1. **Go to [render.com](https://render.com) and login**

2. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository you just created

3. **Configure Service:**
   ```
   Name: rnc-malaysia-api
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Set Environment Variables:**
   ```
   NODE_ENV=production
   JWT_SECRET=rnc-super-secret-jwt-key-2025-change-this-in-production
   JWT_REFRESH_SECRET=rnc-refresh-secret-2025-change-this-in-production
   ```

5. **Deploy!**
   - Click "Create Web Service"
   - Wait for deployment (usually 2-3 minutes)
   - Get your URL: `https://rnc-malaysia-api.onrender.com`

### **Step 3: Test Your Backend**

Once deployed, test these endpoints:

1. **Health Check:**
   ```
   GET https://rnc-malaysia-api.onrender.com/api/health
   ```

2. **Login Test:**
   ```bash
   curl -X POST https://rnc-malaysia-api.onrender.com/api/auth/login \
   -H "Content-Type: application/json" \
   -d '{"email":"admin@refugeenetwork.com","password":"123456"}'
   ```

### **Step 4: Update Frontend**

1. **Update `.env.production`:**
   ```
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

## 🔑 **Test Credentials**

- **Admin:** `admin@refugeenetwork.com` / `123456`
- **Test User:** `test@example.com` / `123456`
- **Staff:** `staff@refugeenetwork.com` / `123456`

## 📋 **Available Endpoints**

- `GET /` - API info
- `GET /api/health` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile (requires auth)
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/users` - Get all users (admin only)

## 🔧 **Features Included**

- ✅ Complete authentication system
- ✅ JWT token management
- ✅ CORS configured for your domains
- ✅ Password hashing with bcrypt
- ✅ Error handling and logging
- ✅ Mock user database
- ✅ Admin, staff, and refugee roles
- ✅ Token refresh functionality

## 🌐 **CORS Domains Configured**

- `https://rncmalaysia.org.netlify.app`
- `https://rnc-platform-updated.netlify.app`
- `https://rnc-malaysia.netlify.app`
- `http://localhost:3000`
- `http://localhost:3001`

## 🔒 **Security Notes**

- Change JWT secrets in production
- Passwords are properly hashed with bcrypt
- Tokens expire appropriately (24h access, 7d refresh)
- Input validation on all endpoints
- CORS properly configured

## 🚨 **Important**

After deployment, your login at `rncmalaysia.org.netlify.app` should work perfectly!

The backend will be available at: `https://rnc-malaysia-api.onrender.com`
