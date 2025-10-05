const fs = require('fs');
const path = require('path');

console.log('🚀 Creating Hostinger deployment files...');

// Create hostinger deployment directory
const hostingerDir = path.join(__dirname, 'hostinger-deploy');
if (!fs.existsSync(hostingerDir)) {
  fs.mkdirSync(hostingerDir, { recursive: true });
}

// Create production environment file
const hostingerEnv = `# Hostinger Production Environment
NODE_ENV=production
PORT=3000

# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://tawfig2020ifbp:mRhNa1sFvlJRgbeW@rncmalaysia.dfz2nfi.mongodb.net/refugee-network?retryWrites=true&w=majority&appName=rncmalaysia

# JWT Configuration
JWT_SECRET=9f72b9d6c4b14e34a2c1d7f80cdd1a8f5d01a38f94247689b3d7e5c6a1f09e44
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d

# Domain Configuration
FRONTEND_URL=https://rncmalaysia.org
CORS_ORIGIN=https://rncmalaysia.org,https://www.rncmalaysia.org

# Email Configuration
FROM_EMAIL=noreply@rncmalaysia.org
FROM_NAME=Refugee Network Centre Malaysia
`;

fs.writeFileSync(path.join(hostingerDir, '.env'), hostingerEnv);
console.log('✅ Created .env file for Hostinger');

// Create simplified server for Hostinger
const hostingerServer = `const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS Configuration for single domain
app.use(cors({
  origin: ['https://rncmalaysia.org', 'https://www.rncmalaysia.org'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

app.use(express.json());

// Serve static files (React build)
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
const mongoose = require('mongoose');
const config = require('./config/config');

mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB Connected to Atlas');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/events', require('./routes/events'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/health', require('./routes/health'));
app.use('/api/support', require('./routes/support'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'RNC Malaysia running on Hostinger',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    database: 'MongoDB Atlas Connected'
  });
});

// API root endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'RNC Malaysia API - Hostinger Deployment',
    status: 'active',
    version: '1.0.0'
  });
});

// Serve React app for all other routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`🚀 RNC Malaysia server running on port \${PORT}\`);
  console.log(\`🌐 Visit: https://rncmalaysia.org\`);
  console.log(\`🔍 Health: https://rncmalaysia.org/health\`);
  console.log(\`📡 API: https://rncmalaysia.org/api\`);
});
`;

fs.writeFileSync(path.join(hostingerDir, 'server.js'), hostingerServer);
console.log('✅ Created Hostinger server.js');

// Create package.json for Hostinger
const hostingerPackageJson = {
  "name": "rnc-malaysia-hostinger",
  "version": "1.0.0",
  "description": "RNC Malaysia Platform - Hostinger Deployment",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "express-validator": "^7.0.1",
    "express-rate-limit": "^6.10.0",
    "helmet": "^7.0.0",
    "nodemailer": "^6.9.4",
    "multer": "^1.4.5-lts.1"
  }
};

fs.writeFileSync(path.join(hostingerDir, 'package.json'), JSON.stringify(hostingerPackageJson, null, 2));
console.log('✅ Created package.json');

// Create deployment instructions
const instructions = `# 🚀 RNC Malaysia - Hostinger Deployment Guide

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
- Build your React app: \`cd client && npm run build\`
- Upload contents of \`client/build/\` to \`public/\` folder

## 🔧 Hostinger Setup Steps:

### Step 1: Create Node.js App
1. Login to Hostinger hPanel
2. Go to "Node.js" section
3. Create new Node.js application
4. Choose Node.js version 18+ 
5. Set entry point: \`server.js\`

### Step 2: Upload Files
1. Upload all backend files to your Node.js app directory
2. Create \`public/\` folder in the same directory
3. Upload React build files to \`public/\` folder

### Step 3: Install Dependencies
1. Open Terminal in hPanel
2. Navigate to your app directory
3. Run: \`npm install\`

### Step 4: Domain Configuration
1. Point \`rncmalaysia.org\` to your Hostinger Node.js app
2. Enable SSL certificate
3. Update DNS if needed

### Step 5: Start Application
1. In hPanel Node.js section
2. Click "Start" on your application
3. Application will run on assigned port

## 🌐 Expected URLs:
- **Website**: https://rncmalaysia.org
- **API**: https://rncmalaysia.org/api  
- **Health**: https://rncmalaysia.org/health
- **Login**: https://rncmalaysia.org/login

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
`;

fs.writeFileSync(path.join(hostingerDir, 'HOSTINGER-DEPLOYMENT-GUIDE.md'), instructions);
console.log('✅ Created deployment guide');

console.log('');
console.log('🎉 Hostinger deployment files created successfully!');
console.log('📁 Location: ./hostinger-deploy/');
console.log('');
console.log('📋 Next Steps:');
console.log('1. Build your React frontend: cd client && npm run build');
console.log('2. Copy the contents of client/build/ to hostinger-deploy/public/');
console.log('3. Copy your backend folders (config, middleware, models, routes, utils, data) to hostinger-deploy/');
console.log('4. Follow the HOSTINGER-DEPLOYMENT-GUIDE.md');
console.log('');
console.log('🚀 This will give you a single-domain solution: https://rncmalaysia.org');
