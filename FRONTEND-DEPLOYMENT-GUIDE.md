# 🚀 RNC Malaysia Frontend Deployment Guide

## 📋 Overview
This guide will help you deploy the RNC Malaysia frontend to various hosting platforms and push updates to GitHub.

## 🔧 Prerequisites
- ✅ Backend deployed to Render (https://rnc-malaysia-api.onrender.com)
- ✅ GitHub account
- ✅ Node.js 18+ installed
- ✅ Git configured locally

## 🎯 Quick Start

### 1. Build Frontend for Production
```bash
# Run the automated build script
node deploy-frontend.js

# Or manually:
cd client
npm install
npm run build
```

### 2. Push to GitHub
```bash
# Run the GitHub setup script
node setup-github-deployment.js

# Choose option 2 if repository exists, or option 1 for new repository
```

### 3. Deploy to Hosting Platform
Choose one of the deployment options below:

---

## 🌐 Deployment Options

### Option 1: Netlify (Recommended) ⭐
**Why Netlify?**
- ✅ Free tier with generous limits
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Easy custom domain setup
- ✅ Automatic deployments from GitHub

**Deployment Steps:**
1. **Manual Deploy:**
   - Go to https://netlify.com
   - Drag & drop the `client/build` folder
   - Site will be live instantly

2. **GitHub Integration:**
   - Connect your GitHub repository
   - Netlify will auto-detect `netlify.toml`
   - Automatic deployments on every push

**Configuration:** `netlify.toml` (already created)

---

### Option 2: Vercel
**Why Vercel?**
- ✅ Excellent for React apps
- ✅ Fast global CDN
- ✅ Automatic deployments
- ✅ Great developer experience

**Deployment Steps:**
1. Go to https://vercel.com
2. Import your GitHub repository
3. Vercel will auto-detect React app
4. Deploy with one click

**Configuration:** `vercel.json` (already created)

---

### Option 3: GitHub Pages
**Why GitHub Pages?**
- ✅ Free hosting
- ✅ Integrated with GitHub
- ✅ Custom domain support

**Deployment Steps:**
1. Enable GitHub Pages in repository settings
2. Use GitHub Actions workflow (already created)
3. Automatic deployment on push to main branch

**Configuration:** `.github/workflows/deploy.yml` (created by setup script)

---

### Option 4: Traditional Web Hosting
**For existing web hosting:**
1. Build the project: `cd client && npm run build`
2. Upload `client/build` folder contents to your web server
3. Configure server to serve `index.html` for all routes
4. Point your domain to the uploaded files

---

## 🔐 Environment Configuration

### Production API URL
The frontend is configured to use:
```
REACT_APP_API_URL=https://rnc-malaysia-api.onrender.com/api
```

### Update API URL (if needed)
```bash
node update-frontend-api.js
# Enter your deployed backend URL
```

---

## 🧪 Testing Deployment

### 1. Health Check
After deployment, verify these URLs work:
- ✅ Homepage: `https://your-site.com`
- ✅ Login page: `https://your-site.com/login`
- ✅ About page: `https://your-site.com/about`

### 2. Authentication Test
1. Go to login page
2. Use test credentials:
   - **Admin:** admin@refugeenetwork.com / 123456
   - **User:** test@example.com / 123456
3. Login should work without "Network error"

### 3. API Connectivity
Check browser console for:
- ✅ No CORS errors
- ✅ Successful API calls to backend
- ✅ JWT tokens being stored

---

## 🔄 Continuous Deployment

### Automatic Deployment Setup
1. **Netlify:** Connect GitHub repo, auto-deploy on push
2. **Vercel:** Connect GitHub repo, auto-deploy on push
3. **GitHub Pages:** Use GitHub Actions workflow

### Manual Updates
```bash
# Make your changes
git add .
git commit -m "Update frontend"
git push origin main

# Hosting platforms will auto-deploy
```

---

## 🛠️ Troubleshooting

### Common Issues

#### 1. "Network Error" on Login
**Cause:** Backend not accessible
**Solution:**
- Verify backend is deployed and running
- Check API URL in `.env.production`
- Verify CORS settings on backend

#### 2. 404 Errors on Page Refresh
**Cause:** Server not configured for SPA routing
**Solution:**
- Netlify: `netlify.toml` handles this
- Vercel: `vercel.json` handles this
- Other hosts: Configure server to serve `index.html` for all routes

#### 3. Build Failures
**Cause:** Missing dependencies or environment variables
**Solution:**
```bash
cd client
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 4. CORS Errors
**Cause:** Backend CORS not configured for your domain
**Solution:**
- Update backend CORS settings
- Redeploy backend with correct domain

---

## 📊 Performance Optimization

### Build Optimization
- ✅ Code splitting enabled
- ✅ Asset optimization
- ✅ Gzip compression
- ✅ CDN delivery

### Security Headers
- ✅ X-Frame-Options: DENY
- ✅ X-XSS-Protection: enabled
- ✅ Content-Security-Policy: configured
- ✅ X-Content-Type-Options: nosniff

---

## 🎉 Success Checklist

After deployment, verify:
- [ ] Site loads at your domain
- [ ] All pages accessible (Home, About, Programs, etc.)
- [ ] Login works without errors
- [ ] User registration works
- [ ] API calls successful
- [ ] No console errors
- [ ] Mobile responsive
- [ ] HTTPS enabled

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify backend is running: https://rnc-malaysia-api.onrender.com/health
3. Check browser console for errors
4. Verify environment variables are correct

---

## 🔗 Useful Links

- **Netlify Docs:** https://docs.netlify.com
- **Vercel Docs:** https://vercel.com/docs
- **GitHub Pages:** https://pages.github.com
- **React Deployment:** https://create-react-app.dev/docs/deployment

---

**🎯 Your RNC Malaysia platform is now ready for production deployment!**

The frontend will work perfectly once deployed, resolving the "Network error" issues on your live site.
