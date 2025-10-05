# 🚀 RNC Malaysia - Hostinger Cloud Professional Deployment Guide

## 📦 What You Need to Upload:

### 1. Backend Files (Node.js):
- server.js (main server file)
- package.json (dependencies)
- .env (environment variables)
- config/ (configuration files)
- middleware/ (authentication middleware)
- models/ (database models)
- routes/ (API routes)
- utils/ (utility functions)
- data/ (seed data)

### 2. Frontend Files (React Build):
- All files in `public/` folder (React build already included)

## 🔧 Hostinger Cloud Professional Setup Steps:

### Step 1: Access Hostinger hPanel
1. Login to your Hostinger account
2. Go to "Cloud Hosting" section
3. Access your Cloud Professional package
4. Open "File Manager" or use SSH/SFTP

### Step 2: Upload Files
1. Navigate to your domain's public_html folder
2. Upload ALL files from this deployment package
3. Ensure file permissions are set correctly (755 for directories, 644 for files)

### Step 3: Node.js Configuration
1. In hPanel, go to "Advanced" → "Node.js"
2. Create new Node.js application
3. Set entry point: `server.js`
4. Choose Node.js version 18+ or 20+
5. Set startup file: `server.js`

### Step 4: Install Dependencies
1. Open Terminal in hPanel or use SSH
2. Navigate to your app directory
3. Run: `npm install`

### Step 5: Domain Configuration
1. Point `rncmalaysia.net` to your Hostinger Cloud server
2. Enable SSL certificate (Let's Encrypt)
3. Update DNS if needed

### Step 6: Start Application
1. In hPanel Node.js section
2. Click "Start" on your application
3. Application will run on assigned port (usually 3000)

## 🌐 Expected URLs:
- **Website**: https://rncmalaysia.net
- **API**: https://rncmalaysia.net/api  
- **Health**: https://rncmalaysia.net/health
- **Login**: https://rncmalaysia.net/login

## ✅ Testing Checklist:
- [ ] Health endpoint returns OK
- [ ] Website loads properly
- [ ] Registration works
- [ ] Login works (admin@refugeenetwork.com / 123456)
- [ ] All pages accessible

## 🎯 Benefits:
✅ Single hosting provider
✅ One domain for everything  
✅ Simplified management
✅ Better performance
✅ Cost effective
✅ No CORS issues

## 🆘 Troubleshooting:
- Check Node.js app logs in hPanel
- Verify MongoDB Atlas network access
- Ensure all files uploaded correctly
- Check domain DNS configuration

## 📞 Support:
If issues persist, check:
1. Hostinger Node.js app status
2. MongoDB Atlas connection
3. Domain DNS settings
4. SSL certificate status
