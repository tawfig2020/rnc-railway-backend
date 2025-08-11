# 🔐 Environment Variables Configuration Guide

## 🌐 FRONTEND (Netlify)

### Required Environment Variables:
```bash
REACT_APP_API_URL=https://rnc-malaysia-api.onrender.com/api
```

### How to Add in Netlify:
1. Go to Netlify dashboard
2. Select your site
3. **Site settings** → **Environment variables**
4. Click **Add variable**
5. Add the variable above
6. **Redeploy** your site

---

## 🖥️ BACKEND (Render.com)

### ✅ REQUIRED (Add Manually):
```bash
MONGODB_URI=mongodb+srv://tawfig2020ifbp:kQuvm2epZlnho6XM@rncmalaysia.dfz2nfi.mongodb.net/rnc-malaysia
```

### ⚙️ AUTO-GENERATED (Render handles these):
```bash
JWT_SECRET=auto-generated-by-render
JWT_REFRESH_SECRET=auto-generated-by-render
```

### 📋 PRE-CONFIGURED (Already in render.yaml):
```bash
NODE_ENV=production
PORT=10000
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d
CORS_ORIGIN=http://rncmalaysia.org,https://rncmalaysia.org
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### How to Add in Render:
1. Go to Render dashboard
2. Select your web service
3. Go to **Environment** tab
4. Click **Add Environment Variable**
5. Add only the **MONGODB_URI** variable above
6. **Deploy** will happen automatically

---

## 🚀 Deployment Sequence

### Step 1: Deploy Backend
1. **Render.com** → New Web Service
2. Connect GitHub: `tawfig2020/rncplatform`
3. Add **MONGODB_URI** environment variable
4. Deploy (takes 2-5 minutes)
5. **Note your Render URL** (e.g., `https://rnc-malaysia-api.onrender.com`)

### Step 2: Deploy Frontend
1. Build frontend: `cd client && npm run build`
2. **Netlify.com** → Drag & drop `build` folder
3. Add **REACT_APP_API_URL** with your Render URL
4. Redeploy

### Step 3: Test
1. Visit your Netlify site
2. Go to login page
3. Test with: `admin@refugeenetwork.com` / `123456`
4. Should work without "Network error"

---

## 🔍 Troubleshooting

### Backend Issues:
- **Build fails**: Check if `MONGODB_URI` is correctly set
- **500 errors**: Check Render logs for database connection issues
- **CORS errors**: Verify `CORS_ORIGIN` includes your frontend domain

### Frontend Issues:
- **Network error**: Check if `REACT_APP_API_URL` points to correct backend
- **404 on refresh**: Netlify should handle this automatically with `netlify.toml`
- **Build fails**: Ensure all dependencies are installed

---

## 📞 Support URLs

- **Render Dashboard**: https://dashboard.render.com
- **Netlify Dashboard**: https://app.netlify.com
- **MongoDB Atlas**: https://cloud.mongodb.com
- **GitHub Repository**: https://github.com/tawfig2020/rncplatform

---

## ✅ Success Checklist

After deployment, verify:
- [ ] Backend health check: `https://your-render-app.onrender.com/health`
- [ ] Frontend loads: `https://your-netlify-site.netlify.app`
- [ ] Login works without errors
- [ ] API calls successful (check browser console)
- [ ] No CORS errors
- [ ] Authentication tokens stored properly

---

**🎯 That's it! Your RNC Malaysia platform will be fully operational with these environment variables.**
