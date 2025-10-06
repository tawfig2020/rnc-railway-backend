# Quick Deploy Reference

## 🚀 One-Command Deploy

### Option 1: Use Automated Script (Recommended)
```powershell
cd C:\Users\Lenovo\CascadeProjects\RNC\CascadeProjects\windsurf-project
.\deploy.ps1
```

### Option 2: Manual Commands
```powershell
# Stage all changes
git add routes/campaigns.js routes/courses.js models/Course.js
git add railway-backend-only/routes/campaigns.js railway-backend-only/routes/courses.js railway-backend-only/models/Course.js
git add client/src/components/admin/sections/*.js
git add *.md deploy.ps1

# Commit
git commit -m "Fix: Community Projects & Course Management - Full CRUD"

# Push
git push origin master
```

## 📦 Build Frontend (Optional)

### If Deploying to Netlify/Vercel
**No build needed** - they build automatically from source

### If Deploying to Hostinger/Manual
```powershell
cd client
npm run build
cd ..
git add client/build/
git commit -m "Build: Updated frontend"
git push origin master
```

## ✅ Verify Deployment

### Check GitHub
```powershell
git log --oneline -3
```

### Check Railway (Backend)
- Visit: https://railway.app
- Check deployment logs
- Test: https://rnc-railway-backend.onrender.com/api/campaigns

### Check Netlify (Frontend)
- Visit: https://app.netlify.com
- Check build logs
- Test your site URL

## 🔧 Quick Fixes

### If Push Rejected
```powershell
git pull origin master
git push origin master
```

### If Build Fails
```powershell
cd client
npm install
npm run build
```

### If Deployment Not Updating
1. Clear browser cache (Ctrl + Shift + R)
2. Check deployment platform logs
3. Verify environment variables

## 📝 What Was Fixed

✅ **Community Projects Management**
- Shows all projects (not just active)
- Filters by status/category
- Bulk approve/reject/delete
- Statistics dashboard

✅ **Course Management**
- Fixed "Add New Course" validation
- Added Level, Language, Duration fields
- Auto-creates default instructor
- Better error messages

## 🎯 Test After Deploy

1. **Login as admin**
2. **Community Projects**: Check filters, bulk actions work
3. **Course Management**: Try adding a new course
4. **Verify**: All CRUD operations functional

---
**Quick Help**: See `DEPLOY_TO_GITHUB.md` for detailed guide
