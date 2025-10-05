# 🚀 RNC PLATFORM - HOSTINGER DEPLOYMENT GUIDE

## 📊 DEPLOYMENT READINESS ASSESSMENT

### ✅ **PLATFORM STATUS: READY FOR DEPLOYMENT**

**Frontend Status:**
- ✅ Production build completed (`client/build` folder ready)
- ✅ API configuration set to production URL
- ✅ All React components optimized for production
- ✅ Static assets properly bundled
- ✅ Environment variables configured

**Backend Status:**
- ✅ Node.js server ready for deployment
- ✅ MongoDB Atlas integration configured
- ✅ JWT authentication system implemented
- ✅ API endpoints fully functional
- ✅ CORS configured for production

**Issues Fixed:**
- ✅ All markdown linting errors resolved
- ✅ Authentication system working
- ✅ Production environment variables secured
- ✅ Frontend API URL properly configured

---

## 🎯 HOSTINGER DEPLOYMENT STRATEGY

### **Deployment Architecture:**
- **Frontend**: Hostinger Web Hosting (Static Files)
- **Backend**: Hostinger VPS or Cloud Hosting (Node.js)
- **Database**: MongoDB Atlas (Cloud Database)

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### **1. Hostinger Account Requirements:**
- [ ] Hostinger hosting account (Premium or Business plan recommended)
- [ ] Domain name configured
- [ ] SSL certificate enabled
- [ ] Node.js support enabled (for backend)

### **2. External Services:**
- [ ] MongoDB Atlas cluster active
- [ ] Email service configured (Gmail/SMTP)
- [ ] Cloudinary account for image uploads (optional)

### **3. Local Preparation:**
- [x] Frontend build completed
- [x] Environment variables prepared
- [x] Database seeded with initial data
- [x] All dependencies updated

---

## 🚀 STEP-BY-STEP DEPLOYMENT GUIDE

### **PHASE 1: FRONTEND DEPLOYMENT (Static Website)**

#### **Step 1: Prepare Frontend Files**
```bash
# Navigate to client directory
cd client

# Create production build (if not already done)
npm run build

# Verify build folder exists
ls build/
```

#### **Step 2: Upload to Hostinger**
1. **Access Hostinger File Manager:**
   - Login to Hostinger control panel
   - Go to **Files** → **File Manager**
   - Navigate to `public_html` folder

2. **Upload Build Files:**
   - Delete default files in `public_html`
   - Upload ALL contents from `client/build/` folder
   - Ensure `index.html` is in the root directory

3. **Configure .htaccess for React Router:**
   Create `.htaccess` file in `public_html`:
   ```apache
   Options -MultiViews
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteRule ^ index.html [QR,L]
   
   # Enable compression
   <IfModule mod_deflate.c>
       AddOutputFilterByType DEFLATE text/plain
       AddOutputFilterByType DEFLATE text/html
       AddOutputFilterByType DEFLATE text/xml
       AddOutputFilterByType DEFLATE text/css
       AddOutputFilterByType DEFLATE application/xml
       AddOutputFilterByType DEFLATE application/xhtml+xml
       AddOutputFilterByType DEFLATE application/rss+xml
       AddOutputFilterByType DEFLATE application/javascript
       AddOutputFilterByType DEFLATE application/x-javascript
   </IfModule>
   
   # Set cache headers
   <IfModule mod_expires.c>
       ExpiresActive on
       ExpiresByType text/css "access plus 1 year"
       ExpiresByType application/javascript "access plus 1 year"
       ExpiresByType image/png "access plus 1 year"
       ExpiresByType image/jpg "access plus 1 year"
       ExpiresByType image/jpeg "access plus 1 year"
   </IfModule>
   ```

#### **Step 3: Configure Environment Variables**
Since Hostinger static hosting doesn't support environment variables, the API URL is already hardcoded in the build. Verify in `client/src/services/api.js`:
```javascript
baseURL = 'https://rncplatform.onrender.com/api'
```

---

### **PHASE 2: BACKEND DEPLOYMENT (Node.js Application)**

#### **Option A: Hostinger VPS (Recommended)**

#### **Step 1: Set Up VPS**
1. **Purchase Hostinger VPS:**
   - Choose VPS plan (minimum 2GB RAM recommended)
   - Select Ubuntu 20.04 LTS
   - Configure SSH access

2. **Connect to VPS:**
   ```bash
   ssh root@your-vps-ip
   ```

#### **Step 2: Install Dependencies**
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2 for process management
npm install -g pm2

# Install Nginx for reverse proxy
apt install nginx -y

# Install Git
apt install git -y
```

#### **Step 3: Deploy Backend Code**
```bash
# Clone repository
git clone https://github.com/tawfig2020/rncplatform.git
cd rncplatform

# Install dependencies
npm install

# Create production environment file
nano .env
```

#### **Step 4: Configure Environment Variables**
Create `.env` file with production values:
```env
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://tawfig2020ifbp:kQuvm2epZlnho6XM@rncmalaysia.dfz2nfi.mongodb.net/

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-here-min-32-chars
JWT_EXPIRE=30d

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USERNAME=refugeenc@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=noreply@rncmalaysia.org
EMAIL_NAME=Refugee Network Centre Malaysia

# CORS Configuration
CORS_ORIGIN=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com

# Security Settings
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
HELMET_ENABLED=true
```

#### **Step 5: Configure Nginx Reverse Proxy**
```bash
# Create Nginx configuration
nano /etc/nginx/sites-available/rnc-backend
```

Add configuration:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/rnc-backend /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### **Step 6: Start Application with PM2**
```bash
# Start application
pm2 start server.js --name "rnc-backend"

# Save PM2 configuration
pm2 save
pm2 startup

# Check status
pm2 status
```

#### **Option B: Hostinger Cloud Hosting**

If using Hostinger Cloud Hosting with Node.js support:

1. **Upload Code via File Manager**
2. **Configure Environment Variables in Control Panel**
3. **Set Start Command:** `node server.js`
4. **Configure Domain/Subdomain**

---

### **PHASE 3: DATABASE CONFIGURATION**

#### **Step 1: MongoDB Atlas Setup**
1. **Access MongoDB Atlas:**
   - Go to https://cloud.mongodb.com/
   - Login to your account

2. **Configure Network Access:**
   - **Network Access** → **Add IP Address**
   - Add: `0.0.0.0/0` (Allow access from anywhere)
   - Comment: "Hostinger Deployment"
   - Click **Confirm**

3. **Verify Connection String:**
   ```
   mongodb+srv://tawfig2020ifbp:kQuvm2epZlnho6XM@rncmalaysia.dfz2nfi.mongodb.net/
   ```

#### **Step 2: Seed Database (if needed)**
```bash
# Run seeder script
npm run data:import
```

---

### **PHASE 4: DOMAIN AND SSL CONFIGURATION**

#### **Step 1: Configure Domain**
1. **Main Domain:** Point to frontend (static files)
2. **API Subdomain:** Point to backend server
   - Create A record: `api.yourdomain.com` → VPS IP

#### **Step 2: SSL Certificate**
```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get SSL certificate
certbot --nginx -d api.yourdomain.com

# Auto-renewal
crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### **Step 3: Update Frontend API URL**
If using custom domain for backend, update and rebuild frontend:
```javascript
// In client/src/services/api.js
baseURL = 'https://api.yourdomain.com/api'
```

Then rebuild and redeploy frontend:
```bash
npm run build
# Upload new build files to Hostinger
```

---

## 🧪 TESTING AND VERIFICATION

### **Step 1: Backend Health Check**
```bash
curl https://api.yourdomain.com/health
# Expected: {"status":"OK","timestamp":"...","environment":"production"}
```

### **Step 2: API Endpoints Test**
```bash
# Test user registration
curl -X POST https://api.yourdomain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"123456","role":"refugee"}'
```

### **Step 3: Frontend Functionality**
1. **Access Website:** https://yourdomain.com
2. **Test Login:** admin@refugeenetwork.com / 123456
3. **Verify Navigation:** All pages load correctly
4. **Check API Calls:** Network tab shows successful API requests

### **Step 4: Performance Test**
- **Page Load Speed:** < 3 seconds
- **API Response Time:** < 500ms
- **Mobile Responsiveness:** All devices
- **SSL Certificate:** Valid and secure

---

## 🔧 TROUBLESHOOTING GUIDE

### **Common Issues and Solutions:**

#### **1. Frontend Not Loading**
```bash
# Check .htaccess file exists
# Verify all build files uploaded
# Check browser console for errors
```

#### **2. API 404 Errors**
```bash
# Check backend server status
pm2 status

# Check Nginx configuration
nginx -t

# Verify environment variables
cat .env
```

#### **3. Database Connection Failed**
```bash
# Check MongoDB Atlas IP whitelist
# Verify connection string
# Test connection manually
```

#### **4. CORS Errors**
```bash
# Update CORS_ORIGIN in .env
# Restart backend server
pm2 restart rnc-backend
```

---

## 📊 MONITORING AND MAINTENANCE

### **Daily Monitoring:**
```bash
# Check server status
pm2 status

# Check logs
pm2 logs rnc-backend

# Monitor disk space
df -h

# Check memory usage
free -m
```

### **Weekly Maintenance:**
```bash
# Update system packages
apt update && apt upgrade -y

# Restart services
pm2 restart all
systemctl restart nginx

# Check SSL certificate expiry
certbot certificates
```

### **Monthly Tasks:**
- Review server logs
- Update Node.js dependencies
- Database backup
- Performance optimization

---

## 🎯 DEPLOYMENT SUMMARY

### **What You'll Have After Deployment:**

1. **Frontend:** https://yourdomain.com
   - React application served as static files
   - Fast loading with CDN benefits
   - Mobile-responsive design

2. **Backend API:** https://api.yourdomain.com
   - RESTful API endpoints
   - JWT authentication
   - Rate limiting and security

3. **Database:** MongoDB Atlas
   - Cloud-hosted database
   - Automatic backups
   - High availability

### **Test Credentials:**
- **Admin:** admin@refugeenetwork.com / 123456
- **Refugee:** refugee@example.com / 123456
- **Volunteer:** volunteer@example.com / 123456

---

## 💰 ESTIMATED COSTS

### **Hostinger Hosting:**
- **Premium Plan:** $2.99/month (static frontend)
- **VPS Plan:** $3.99/month (Node.js backend)
- **Domain:** $8.99/year
- **SSL:** Free with hosting

### **External Services:**
- **MongoDB Atlas:** Free tier (512MB)
- **Email Service:** Free (Gmail)

**Total Monthly Cost:** ~$7-10/month

---

## 🚀 READY FOR DEPLOYMENT!

Your RNC platform is fully prepared for Hostinger deployment. Follow this guide step-by-step, and you'll have a production-ready application running smoothly.

**Need Help?** Check the troubleshooting section or contact Hostinger support for hosting-specific issues.

---

**🎉 Your refugee support platform will be live and helping communities worldwide!**
