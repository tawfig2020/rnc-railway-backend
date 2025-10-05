#!/usr/bin/env node
/**
 * Hostinger Deployment Package Creator
 * Creates a production-ready package for Hostinger hosting
 */

const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');

const createHostingerPackage = async () => {
  console.log('🚀 Creating Hostinger deployment package...');

  const packageDir = path.join(__dirname, '..', 'hostinger-deploy');
  const zipPath = path.join(__dirname, '..', 'hostinger-rncmalaysia-deployment.zip');

  try {
    // Clean and create package directory
    await fs.remove(packageDir);
    await fs.ensureDir(packageDir);

    // Copy backend files
    console.log('📦 Copying backend files...');
    const backendFiles = [
      'server.js',
      'package.json',
      'config/',
      'middleware/',
      'models/',
      'routes/',
      'utils/',
      'data/',
      'scripts/'
    ];

    for (const file of backendFiles) {
      const srcPath = path.join(__dirname, '..', file);
      const destPath = path.join(packageDir, 'backend', file);
      
      if (await fs.pathExists(srcPath)) {
        await fs.copy(srcPath, destPath);
        console.log(`✅ Copied: ${file}`);
      }
    }

    // Create production environment file for Hostinger
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

# Email Configuration (Optional)
FROM_EMAIL=noreply@rncmalaysia.org
FROM_NAME=Refugee Network Centre Malaysia
`;

    await fs.writeFile(path.join(packageDir, 'backend', '.env'), hostingerEnv);
    console.log('✅ Created Hostinger .env file');

    // Build frontend
    console.log('🔨 Building frontend for production...');
    const { exec } = require('child_process');
    
    // Set environment for frontend build
    process.env.REACT_APP_API_URL = 'https://rncmalaysia.org/api';
    
    await new Promise((resolve, reject) => {
      exec('npm run build', { cwd: path.join(__dirname, '..', 'client') }, (error, stdout, stderr) => {
        if (error) {
          console.error('Frontend build error:', error);
          reject(error);
        } else {
          console.log('✅ Frontend built successfully');
          resolve();
        }
      });
    });

    // Copy built frontend
    const frontendBuildPath = path.join(__dirname, '..', 'client', 'build');
    const frontendDestPath = path.join(packageDir, 'frontend');
    
    if (await fs.pathExists(frontendBuildPath)) {
      await fs.copy(frontendBuildPath, frontendDestPath);
      console.log('✅ Copied frontend build');
    }

    // Create Hostinger-specific files
    
    // 1. Main entry point that serves both frontend and API
    const hostingerServer = `const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

// Import your existing server setup
const mongoose = require('mongoose');
const config = require('./config/config');

const app = express();

// CORS Configuration
app.use(cors({
  origin: ['https://rncmalaysia.org', 'https://www.rncmalaysia.org'],
  credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Connect to MongoDB
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB Connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
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

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'RNC Malaysia is running on Hostinger',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`🚀 RNC Malaysia server running on port \${PORT}\`);
});
`;

    await fs.writeFile(path.join(packageDir, 'backend', 'hostinger-server.js'), hostingerServer);
    console.log('✅ Created Hostinger-specific server file');

    // Create package.json for Hostinger
    const hostingerPackageJson = {
      "name": "rnc-malaysia-hostinger",
      "version": "1.0.0",
      "description": "RNC Malaysia Platform - Hostinger Deployment",
      "main": "hostinger-server.js",
      "scripts": {
        "start": "node hostinger-server.js",
        "dev": "nodemon hostinger-server.js"
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

    await fs.writeJson(path.join(packageDir, 'backend', 'package.json'), hostingerPackageJson, { spaces: 2 });
    console.log('✅ Created Hostinger package.json');

    // Create deployment instructions
    const instructions = `# RNC Malaysia - Hostinger Deployment Instructions

## 📁 Package Contents:
- \`backend/\` - Node.js backend application
- \`frontend/\` - Built React frontend (static files)

## 🚀 Deployment Steps:

### 1. Upload Files:
- Upload the entire \`backend/\` folder to your Hostinger Node.js hosting
- Upload the entire \`frontend/\` folder to your public_html or web root

### 2. Install Dependencies:
\`\`\`bash
cd backend
npm install
\`\`\`

### 3. Start Application:
\`\`\`bash
npm start
\`\`\`

### 4. Domain Configuration:
- Point your domain \`rncmalaysia.org\` to the Hostinger hosting
- Ensure SSL certificate is enabled

## 🔧 Configuration:

### Environment Variables:
All required environment variables are in \`.env\` file:
- MongoDB Atlas connection
- JWT secrets
- CORS settings
- Domain configuration

### Database:
- Uses existing MongoDB Atlas cluster
- No additional database setup required

## 🌐 URLs After Deployment:
- **Website**: https://rncmalaysia.org
- **API**: https://rncmalaysia.org/api
- **Health Check**: https://rncmalaysia.org/health

## 🔍 Testing:
1. Visit https://rncmalaysia.org/health (should return OK)
2. Try registration/login functionality
3. Check all website features

## 📞 Support:
If you encounter issues, check:
1. Node.js version compatibility (14+ recommended)
2. MongoDB Atlas network access
3. Domain DNS configuration
4. SSL certificate status

## 🎯 Benefits of This Setup:
✅ Single hosting provider (Hostinger)
✅ One domain for everything
✅ Simplified maintenance
✅ Cost effective
✅ Better performance (same server)
`;

    await fs.writeFile(path.join(packageDir, 'DEPLOYMENT-INSTRUCTIONS.md'), instructions);
    console.log('✅ Created deployment instructions');

    // Create ZIP package
    console.log('📦 Creating ZIP package...');
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`🎉 Hostinger package created: ${zipPath}`);
      console.log(`📦 Package size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
      console.log('');
      console.log('🚀 Ready for Hostinger deployment!');
      console.log('📋 Next steps:');
      console.log('1. Extract the ZIP file');
      console.log('2. Follow DEPLOYMENT-INSTRUCTIONS.md');
      console.log('3. Upload to Hostinger');
    });

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(output);
    archive.directory(packageDir, false);
    archive.finalize();

  } catch (error) {
    console.error('❌ Error creating package:', error);
    process.exit(1);
  }
};

// Check if archiver is installed
try {
  require('archiver');
  createHostingerPackage();
} catch (err) {
  console.log('📦 Installing required dependencies...');
  const { exec } = require('child_process');
  exec('npm install archiver fs-extra', (error) => {
    if (error) {
      console.error('❌ Failed to install dependencies:', error);
      process.exit(1);
    } else {
      console.log('✅ Dependencies installed');
      createHostingerPackage();
    }
  });
}
