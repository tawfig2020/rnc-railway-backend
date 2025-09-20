# 🚀 HOSTINGER CLOUD BUSINESS DEPLOYMENT INSTRUCTIONS

## 📦 Package Contents:
- ✅ Backend server (Node.js)
- ✅ Frontend application (React)
- ✅ Database models and configurations
- ✅ Environment template
- ✅ Hostinger-optimized configurations

## 🎯 DEPLOYMENT STEPS:

### 1. Upload to Hostinger
- Compress this entire folder as ZIP
- Upload via Hostinger File Manager to public_html
- Extract all files

### 2. Set Environment Variables
- Go to Hostinger Control Panel
- Navigate to "Environment Variables"
- Add all variables from .env.template

### 3. Install Dependencies
- SSH into your hosting account
- Run: npm install

### 4. Build Frontend
- Run: npm run build-client

### 5. Start Application
- Hostinger will automatically start your Node.js app
- Access via your domain

## 🔧 Configuration Notes:
- Server runs on port 3000 (Hostinger default)
- Frontend and backend served from same domain
- MongoDB Atlas connection required
- SSL automatically handled by Hostinger

## 🧪 Testing:
- Health check: https://yourdomain.com/health
- API: https://yourdomain.com/api/
- Frontend: https://yourdomain.com/

Your RNC Platform is ready for Hostinger Cloud Business! 🎉
