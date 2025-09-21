# 🚀 Railway Backend Deployment Guide

## 📦 Package Contents
This package contains your Node.js backend optimized for Railway deployment.

## 🔧 Railway Deployment Steps

### Step 1: Sign Up for Railway
1. Go to https://railway.app
2. Sign up with GitHub account
3. Verify your email

### Step 2: Create New Project
1. Click "New Project"
2. Choose "Deploy from GitHub repo"
3. Connect your GitHub account
4. Select your repository

### Step 3: Configure Environment Variables
In Railway dashboard -> Variables, add these:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://tawfig2020ifbp:mRhNa1sFvlJRgbeW@rncmalaysia.dfz2nfi.mongodb.net/refugee-network?retryWrites=true&w=majority&appName=rncmalaysia
JWT_SECRET=9f72b9d6c4b14e34a2c1d7f80cdd1a8f5d01a38f94247689b3d7e5c6a1f09e44
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d
FRONTEND_URL=https://rncmalaysia.net
CORS_ORIGIN=https://rncmalaysia.net,https://www.rncmalaysia.net
FROM_EMAIL=noreply@rncmalaysia.net
FROM_NAME=Refugee Network Centre Malaysia
```

### Step 4: Deploy
1. Railway will automatically detect Node.js
2. It will run `npm install` and start your app
3. You'll get a URL like: https://your-app.railway.app

### Step 5: Test Your Backend
- Health: https://your-app.railway.app/health
- API: https://your-app.railway.app/api

## 🌐 Expected URLs
- **Backend**: https://your-app.railway.app
- **API Endpoints**: https://your-app.railway.app/api/*
- **Health Check**: https://your-app.railway.app/health

## 🔄 Next Steps
1. Update your React frontend to use Railway backend URL
2. Test authentication flow
3. Deploy frontend to Hostinger

## 💰 Pricing
- **Free Tier**: $0/month (with sleep after inactivity)
- **Pro Plan**: $5/month (always-on, recommended)
