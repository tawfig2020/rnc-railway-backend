# 🔧 Frontend Update Instructions

## Step 1: Update Railway URL

After your Railway backend is deployed:

1. **Get your Railway URL** (e.g., https://your-app.railway.app)
2. **Update** the following files:

### Update build-frontend-for-hostinger.js
Replace `YOUR_RAILWAY_URL` with your actual Railway URL:
```javascript
const RAILWAY_BACKEND_URL = 'https://your-actual-railway-url.railway.app/api';
```

### Update client/src/services/api.js
Replace `YOUR_RAILWAY_URL` with your actual Railway URL:
```javascript
baseURL = process.env.REACT_APP_API_URL || 'https://your-actual-railway-url.railway.app/api';
```

## Step 2: Build Frontend

Run the build script:
```bash
node build-frontend-for-hostinger.js
```

## Step 3: Deploy to Hostinger

1. **Copy** all files from `client/build/` folder
2. **Upload** to your Hostinger public_html directory
3. **Replace** existing files

## Step 4: Test

1. **Visit** https://rncmalaysia.net
2. **Try** logging in with admin@refugeenetwork.com / 123456
3. **Check** browser dev tools for any errors

## 🎯 Final Setup

- **Frontend**: https://rncmalaysia.net (Hostinger)
- **Backend**: https://your-railway-url.railway.app (Railway)
- **Authentication**: Should work perfectly!

## 🆘 Troubleshooting

If login doesn't work:
1. Check browser console for errors
2. Verify Railway backend is running
3. Test Railway health endpoint
4. Check CORS configuration
