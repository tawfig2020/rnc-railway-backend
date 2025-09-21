const fs = require('fs');
const path = require('path');

console.log('🚀 Creating Railway backend deployment package...');

// Create railway backend directory
const railwayDir = path.join(__dirname, 'railway-backend');
if (!fs.existsSync(railwayDir)) {
  fs.mkdirSync(railwayDir, { recursive: true });
}

// Backend files to copy
const backendFiles = [
  'server.js',
  'package.json'
];

const backendFolders = [
  'config',
  'middleware', 
  'models',
  'routes',
  'utils',
  'data'
];

// Copy backend files
backendFiles.forEach(file => {
  const srcPath = path.join(__dirname, 'hostinger-deploy', file);
  const destPath = path.join(railwayDir, file);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`✅ Copied: ${file}`);
  }
});

// Copy backend folders
function copyFolderSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const files = fs.readdirSync(src);
  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyFolderSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

backendFolders.forEach(folder => {
  const srcPath = path.join(__dirname, 'hostinger-deploy', folder);
  const destPath = path.join(railwayDir, folder);
  
  if (fs.existsSync(srcPath)) {
    copyFolderSync(srcPath, destPath);
    console.log(`✅ Copied folder: ${folder}`);
  }
});

// Create Railway-specific environment template
const railwayEnvTemplate = `# Railway Environment Variables Template
# Copy these to Railway dashboard -> Variables section

NODE_ENV=production
PORT=3000

# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://tawfig2020ifbp:mRhNa1sFvlJRgbeW@rncmalaysia.dfz2nfi.mongodb.net/refugee-network?retryWrites=true&w=majority&appName=rncmalaysia

# JWT Configuration
JWT_SECRET=9f72b9d6c4b14e34a2c1d7f80cdd1a8f5d01a38f94247689b3d7e5c6a1f09e44
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d

# Domain Configuration (will be updated after Railway deployment)
FRONTEND_URL=https://rncmalaysia.net
CORS_ORIGIN=https://rncmalaysia.net,https://www.rncmalaysia.net

# Email Configuration
FROM_EMAIL=noreply@rncmalaysia.net
FROM_NAME=Refugee Network Centre Malaysia
`;

fs.writeFileSync(path.join(railwayDir, '.env.template'), railwayEnvTemplate);
console.log('✅ Created Railway environment template');

// Update server.js for Railway deployment
const railwayServerJs = `const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS Configuration - Allow your Hostinger frontend
const allowedOrigins = [
  'https://rncmalaysia.net',
  'https://www.rncmalaysia.net',
  'http://localhost:3000', // For development
  'http://127.0.0.1:3000'
];

// Add environment-specific origins
if (process.env.CORS_ORIGIN) {
  const envOrigins = process.env.CORS_ORIGIN.split(',').map(origin => origin.trim());
  allowedOrigins.push(...envOrigins);
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'Accept']
}));

app.use(express.json());

// MongoDB Connection
const mongoose = require('mongoose');
const config = require('./config/config');

let isDbConnected = false;

mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB Connected to Atlas');
  isDbConnected = true;
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  isDbConnected = false;
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'RNC Malaysia Backend - Railway Deployment',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    database: isDbConnected ? 'Connected' : 'Disconnected',
    cors: allowedOrigins
  });
});

// API root endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'RNC Malaysia API - Railway Backend',
    status: 'active',
    version: '1.0.0',
    database: isDbConnected ? 'Connected' : 'Disconnected'
  });
});

// API Routes - Only serve real routes when DB is connected
app.use('/api', (req, res, next) => {
  if (!isDbConnected) {
    return res.status(503).json({
      error: 'Service temporarily unavailable',
      reason: 'Database not connected'
    });
  }
  next();
});

// Load API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/profiles'));
app.use('/api/profile', require('./routes/profiles'));
app.use('/api/blog', require('./routes/blogs'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/events', require('./routes/events'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/health', require('./routes/health'));
app.use('/api/support', require('./routes/support'));

// Catch-all for undefined routes
app.get('*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    message: 'This is a backend API server. Frontend is hosted at https://rncmalaysia.net'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`🚀 RNC Malaysia Backend running on port \${PORT}\`);
  console.log(\`🌐 Environment: \${process.env.NODE_ENV || 'production'}\`);
  console.log(\`📡 Health check: http://localhost:\${PORT}/health\`);
  console.log(\`🔗 API root: http://localhost:\${PORT}/api\`);
  console.log(\`✅ CORS origins:\`, allowedOrigins);
});
`;

fs.writeFileSync(path.join(railwayDir, 'server.js'), railwayServerJs);
console.log('✅ Updated server.js for Railway');

// Create Railway deployment guide
const railwayGuide = `# 🚀 Railway Backend Deployment Guide

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

\`\`\`
NODE_ENV=production
MONGODB_URI=mongodb+srv://tawfig2020ifbp:mRhNa1sFvlJRgbeW@rncmalaysia.dfz2nfi.mongodb.net/refugee-network?retryWrites=true&w=majority&appName=rncmalaysia
JWT_SECRET=9f72b9d6c4b14e34a2c1d7f80cdd1a8f5d01a38f94247689b3d7e5c6a1f09e44
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d
FRONTEND_URL=https://rncmalaysia.net
CORS_ORIGIN=https://rncmalaysia.net,https://www.rncmalaysia.net
FROM_EMAIL=noreply@rncmalaysia.net
FROM_NAME=Refugee Network Centre Malaysia
\`\`\`

### Step 4: Deploy
1. Railway will automatically detect Node.js
2. It will run \`npm install\` and start your app
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
`;

fs.writeFileSync(path.join(railwayDir, 'RAILWAY-DEPLOYMENT-GUIDE.md'), railwayGuide);
console.log('✅ Created Railway deployment guide');

console.log('');
console.log('🎉 Railway backend package created successfully!');
console.log('📁 Location: ./railway-backend/');
console.log('');
console.log('📋 Package contents:');
console.log('- server.js (Railway-optimized)');
console.log('- package.json (dependencies)');
console.log('- .env.template (environment variables)');
console.log('- config/ (configuration)');
console.log('- middleware/ (authentication)');
console.log('- models/ (database models)');
console.log('- routes/ (API endpoints)');
console.log('- utils/ (utilities)');
console.log('- data/ (seed data)');
console.log('- RAILWAY-DEPLOYMENT-GUIDE.md');
console.log('');
console.log('🚀 Ready for Railway deployment!');
