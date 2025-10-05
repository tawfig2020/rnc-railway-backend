#!/usr/bin/env node

/**
 * Hostinger Cloud Business Deployment Package Creator
 * Creates a deployment-ready package for Hostinger Cloud hosting
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Creating Hostinger Cloud Business Deployment Package...\n');

// Step 1: Create deployment directory
const deployDir = path.join(__dirname, 'hostinger-deploy');
if (fs.existsSync(deployDir)) {
    fs.rmSync(deployDir, { recursive: true });
}
fs.mkdirSync(deployDir);

console.log('✅ Created deployment directory');

// Step 2: Copy backend files
const backendFiles = [
    'server.js',
    'package.json',
    'config/',
    'controllers/',
    'middleware/',
    'models/',
    'routes/',
    'utils/',
    'seeder.js'
];

backendFiles.forEach(file => {
    const srcPath = path.join(__dirname, file);
    const destPath = path.join(deployDir, file);
    
    if (fs.existsSync(srcPath)) {
        if (fs.statSync(srcPath).isDirectory()) {
            fs.cpSync(srcPath, destPath, { recursive: true });
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
        console.log(`✅ Copied ${file}`);
    }
});

// Step 3: Create production package.json
const packageJson = {
    "name": "rnc-platform-hostinger",
    "version": "1.0.0",
    "description": "RNC Platform for Hostinger Cloud Business",
    "main": "server.js",
    "scripts": {
        "start": "node server.js",
        "postinstall": "npm run build-client",
        "build-client": "cd client && npm install && npm run build"
    },
    "dependencies": {
        "axios": "^1.11.0",
        "bcryptjs": "^2.4.3",
        "colors": "^1.4.0",
        "cors": "^2.8.5",
        "dotenv": "^16.3.1",
        "express": "^4.18.2",
        "express-rate-limit": "^8.0.1",
        "express-validator": "^7.0.1",
        "jsonwebtoken": "^9.0.2",
        "mongoose": "^7.5.0",
        "multer": "^2.0.1",
        "nodemailer": "^7.0.5",
        "public-ip": "^7.0.1",
        "path": "^0.12.7"
    },
    "engines": {
        "node": ">=18.0.0",
        "npm": ">=8.0.0"
    },
    "keywords": ["refugee", "network", "community", "platform", "hostinger"],
    "author": "RNC Team",
    "license": "MIT"
};

fs.writeFileSync(
    path.join(deployDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
);

console.log('✅ Created production package.json');

// Step 4: Copy and modify client
const clientSrc = path.join(__dirname, 'client');
const clientDest = path.join(deployDir, 'client');

if (fs.existsSync(clientSrc)) {
    fs.cpSync(clientSrc, clientDest, { recursive: true });
    console.log('✅ Copied client application');
}

// Step 5: Create Hostinger-specific server configuration
const hostingerServer = `const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const config = require('./config/config');
const errorHandler = require('./middleware/errorHandler');
const { standardLimiter } = require('./middleware/rateLimiter');

// Load models
require('./models/User');
require('./models/RefreshToken');
require('./models/BlogPost');
require('./models/Course');
require('./models/Event');
require('./models/Resource');
require('./models/Product');
require('./models/Vendor');
require('./models/Order');
require('./models/Campaign');
require('./models/Donation');
require('./models/Profile');
require('./models/HealthRecord');
require('./models/Support');
require('./models/Service');
require('./models/Category');
require('./models/Discount');
require('./models/Address');
require('./models/ForumQuestion');
require('./models/AIResource');
require('./models/UserConsent');

const app = express();

// Hostinger Cloud Business specific configuration
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'production';

// CORS Configuration for Hostinger
const allowedOrigins = [
    'http://localhost:3000',
    'https://yourdomain.com',
    'https://www.yourdomain.com'
];

if (process.env.CORS_ORIGIN) {
    const envOrigins = process.env.CORS_ORIGIN.split(',').map(origin => origin.trim());
    allowedOrigins.push(...envOrigins);
}

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(standardLimiter);

// Serve static files from React build (Hostinger optimization)
if (NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));
}

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/events', require('./routes/events'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/marketplace', require('./routes/marketplace'));
app.use('/api/campaigns', require('./routes/campaigns'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/profiles', require('./routes/profiles'));
app.use('/api/health-records', require('./routes/healthRecords'));
app.use('/api/support', require('./routes/support'));
app.use('/api/services', require('./routes/services'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/forum', require('./routes/forum'));
app.use('/api/ai', require('./routes/ai'));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: NODE_ENV,
        platform: 'Hostinger Cloud Business'
    });
});

// Serve React app for all other routes (SPA support)
if (NODE_ENV === 'production') {
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

// Error handling middleware
app.use(errorHandler);

// Database connection and server start
const startServer = async () => {
    try {
        console.log('🚀 Starting RNC Platform on Hostinger Cloud Business...');
        
        // Connect to MongoDB
        await mongoose.connect(config.mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('✅ MongoDB Connected');
        
        // Start server
        app.listen(PORT, () => {
            console.log(\`🌟 Server running on port \${PORT}\`);
            console.log(\`🌍 Environment: \${NODE_ENV}\`);
            console.log(\`📱 Platform: Hostinger Cloud Business\`);
        });
        
    } catch (error) {
        console.error('❌ Server startup error:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;
`;

fs.writeFileSync(path.join(deployDir, 'server.js'), hostingerServer);
console.log('✅ Created Hostinger-optimized server.js');

// Step 6: Create environment template
const envTemplate = `# Hostinger Cloud Business Environment Variables
# Set these in your Hostinger control panel

# Server Configuration
PORT=3000
NODE_ENV=production

# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://tawfig2020ifbp:kQuvm2epZlnho6XM@rncmalaysia.dfz2nfi.mongodb.net/

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-here-min-32-chars
JWT_EXPIRE=30d

# Email Configuration (Gmail recommended)
EMAIL_SERVICE=gmail
EMAIL_USERNAME=refugeenc@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=noreply@yourdomain.com
EMAIL_NAME=Refugee Network Centre

# CORS Configuration
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
FRONTEND_URL=https://yourdomain.com

# Security Settings
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
HELMET_ENABLED=true

# Cloudinary (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
`;

fs.writeFileSync(path.join(deployDir, '.env.template'), envTemplate);
console.log('✅ Created environment template');

// Step 7: Create deployment instructions
const deployInstructions = `# 🚀 HOSTINGER CLOUD BUSINESS DEPLOYMENT INSTRUCTIONS

## 📦 Package Contents:
- ✅ Backend server (Node.js)
- ✅ Frontend application (React)
- ✅ Database models and configurations
- ✅ Environment template
- ✅ Hostinger-optimized configurations

## 🎯 DEPLOYMENT STEPS:

### 1. Upload to Hostinger
- Compress this entire folder as ZIP
- Upload via Hostinger File Manager to public_html
- Extract all files

### 2. Set Environment Variables
- Go to Hostinger Control Panel
- Navigate to "Environment Variables"
- Add all variables from .env.template

### 3. Install Dependencies
- SSH into your hosting account
- Run: npm install

### 4. Build Frontend
- Run: npm run build-client

### 5. Start Application
- Hostinger will automatically start your Node.js app
- Access via your domain

## 🔧 Configuration Notes:
- Server runs on port 3000 (Hostinger default)
- Frontend and backend served from same domain
- MongoDB Atlas connection required
- SSL automatically handled by Hostinger

## 🧪 Testing:
- Health check: https://yourdomain.com/health
- API: https://yourdomain.com/api/
- Frontend: https://yourdomain.com/

Your RNC Platform is ready for Hostinger Cloud Business! 🎉
`;

fs.writeFileSync(path.join(deployDir, 'DEPLOYMENT-INSTRUCTIONS.md'), deployInstructions);
console.log('✅ Created deployment instructions');

console.log('\n🎉 Hostinger Cloud Business deployment package created!');
console.log('📁 Location: ./hostinger-deploy/');
console.log('\n📋 Next steps:');
console.log('1. Compress the hostinger-deploy folder as ZIP');
console.log('2. Upload to your Hostinger Cloud Business hosting');
console.log('3. Follow the DEPLOYMENT-INSTRUCTIONS.md file');
