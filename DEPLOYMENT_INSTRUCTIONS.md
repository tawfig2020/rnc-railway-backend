# Deployment Instructions

## ✅ Quick Deploy (Recommended)

### Single Command Deployment:
```powershell
cd C:\Users\Lenovo\CascadeProjects\RNC\CascadeProjects\windsurf-project
.\deploy-all.ps1
```

**This script will:**
1. ✅ Install i18next dependencies (if needed)
2. ✅ Build frontend for production (`npm run build`)
3. ✅ Push frontend to GitHub (Netlify auto-builds)
4. ✅ Push backend to GitHub (Railway auto-deploys)
5. ✅ Update main repository with documentation

**Time:** ~5-10 minutes total

---

## 📦 What Gets Deployed

### Frontend (Netlify):
- **Repository:** `rncplatform/client`
- **Branch:** `master`
- **Build Command:** `npm run build`
- **Deploy Time:** ~3-5 minutes

**Changes:**
- ✅ Multi-language support (6 languages)
- ✅ About page redesign (flip cards, animations)
- ✅ Login page (Member instead of Refugee)
- ✅ Admin enhancements (Community Projects, Courses)
- ✅ Language switcher component
- ✅ Translation files (en, ar, fa, fr, my, so)

### Backend (Railway):
- **Repository:** `rnc-railway-backend`
- **Branch:** `main`
- **Deploy Time:** ~2-3 minutes

**Changes:**
- ✅ User model (Refugee → Member)
- ✅ Course model (added admin fields)
- ✅ Community Projects API (optional auth)
- ✅ Course creation API (relaxed validation)
- ✅ Better error handling

---

## 🔍 Verify Deployment

### Check Frontend (Netlify):
1. Go to: https://app.netlify.com
2. Find your site
3. Check "Deploys" tab
4. Wait for "Published" status
5. Click "Open production deploy"

### Check Backend (Railway):
1. Go to: https://railway.app
2. Find your project
3. Check "Deployments" tab
4. Wait for "Success" status
5. Check logs for any errors

### Test Your Site:
1. **Home Page:**
   - Language switcher appears in header
   - Can switch between languages
   - Content translates

2. **About Page:**
   - No empty space at top
   - Story cards have gradients
   - Value cards flip on click
   - Links work properly

3. **Login Page:**
   - "Member" option shows (not "Refugee")
   - All 7 roles listed

4. **Admin Panel:**
   - Community Projects shows all projects
   - Filters work
   - Course creation works

---

## 🗂️ Build Folder Contents

After running `npm run build`, the `client/build/` folder contains:

```
build/
├── static/
│   ├── css/          # Compiled CSS
│   ├── js/           # Compiled JavaScript
│   └── media/        # Images, fonts, etc.
├── index.html        # Main HTML file
├── manifest.json     # PWA manifest
└── asset-manifest.json
```

**This folder is what Netlify serves to users.**

---

## 🔄 Manual Deployment (If Needed)

### Frontend Only:
```powershell
cd C:\Users\Lenovo\CascadeProjects\RNC\CascadeProjects\windsurf-project\client

# Install dependencies
npm install i18next react-i18next i18next-browser-languagedetector

# Build
npm run build

# Push to GitHub
git add build/ src/ public/ package.json
git commit -m "Deploy: Frontend build"
git push origin master
```

### Backend Only:
```powershell
cd C:\Users\Lenovo\CascadeProjects\RNC\CascadeProjects\windsurf-project\railway-backend-only

# Push to GitHub
git add models/ routes/ config/
git commit -m "Deploy: Backend updates"
git push origin main
```

---

## 📊 Deployment Timeline

| Step | Duration | Status |
|------|----------|--------|
| Install i18next | 1-2 min | Auto |
| Build frontend | 2-3 min | Auto |
| Push to GitHub | 30 sec | Auto |
| Netlify build | 3-5 min | Auto |
| Railway deploy | 2-3 min | Auto |
| **Total** | **~10 min** | - |

---

## ⚠️ Important Notes

### Before First Deployment:
1. ✅ Run database migration:
   ```powershell
   node scripts/migrate-refugee-to-member.js
   ```

2. ✅ Verify environment variables in Railway:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`

3. ✅ Verify Netlify build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
   - Node version: 18.x or higher

### After Deployment:
1. ✅ Clear browser cache (Ctrl + Shift + R)
2. ✅ Test all major features
3. ✅ Check browser console for errors
4. ✅ Monitor Railway logs for backend errors

---

## 🚨 Troubleshooting

### Issue: Build fails with "i18next not found"
**Solution:**
```powershell
cd client
npm install i18next react-i18next i18next-browser-languagedetector
npm run build
```

### Issue: Netlify build fails
**Solution:**
1. Check Netlify build logs
2. Verify `package.json` has all dependencies
3. Check Node version (should be 18.x+)
4. Try manual build locally first

### Issue: Railway deployment fails
**Solution:**
1. Check Railway logs
2. Verify environment variables
3. Check database connection
4. Verify MongoDB URI is correct

### Issue: Language switcher not appearing
**Solution:**
1. Clear browser cache
2. Check if `src/i18n.js` is imported in `src/index.js`
3. Verify translation files exist in `src/locales/`

### Issue: "Member" not showing in Login
**Solution:**
1. Verify `client/src/pages/Login.js` was updated
2. Clear browser cache
3. Check if build includes latest changes

---

## 📝 Deployment Checklist

### Pre-Deployment:
- [ ] All code changes committed
- [ ] Database migration script ready
- [ ] Environment variables verified
- [ ] Local build successful (`npm run build`)
- [ ] Local preview tested (`npm start`)

### During Deployment:
- [ ] Run `deploy-all.ps1`
- [ ] Monitor script output
- [ ] Check for errors
- [ ] Wait for completion

### Post-Deployment:
- [ ] Verify Netlify build succeeded
- [ ] Verify Railway deployment succeeded
- [ ] Test live site
- [ ] Check all features work
- [ ] Run database migration (if not done)
- [ ] Monitor for errors

---

## 🎯 Quick Commands Reference

### Deploy Everything:
```powershell
.\deploy-all.ps1
```

### Preview Before Deploy:
```powershell
.\preview-changes.ps1
```

### Deploy Frontend Only:
```powershell
cd client
npm run build
git add -A
git commit -m "Deploy: Frontend"
git push origin master
```

### Deploy Backend Only:
```powershell
cd railway-backend-only
git add -A
git commit -m "Deploy: Backend"
git push origin main
```

### Run Migration:
```powershell
node scripts/migrate-refugee-to-member.js
```

---

## 📞 Support

If deployment fails:
1. Check the error message in terminal
2. Review deployment logs (Netlify/Railway)
3. Check browser console (F12)
4. Verify all files are committed
5. Try manual deployment steps

---

**Deployment is automated and should complete in ~10 minutes!** 🚀
