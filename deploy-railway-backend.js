#!/usr/bin/env node
/**
 * Create a separate repository for Railway backend deployment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Creating separate Railway backend repository...');

// Create a new directory for Railway-only backend
const railwayOnlyDir = path.join(__dirname, 'railway-backend-only');
if (fs.existsSync(railwayOnlyDir)) {
  console.log('🗑️ Removing existing railway-backend-only directory...');
  fs.rmSync(railwayOnlyDir, { recursive: true, force: true });
}

fs.mkdirSync(railwayOnlyDir, { recursive: true });

// Copy all files from railway-backend to the new directory
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

// Copy railway-backend contents
const railwayBackendPath = path.join(__dirname, 'railway-backend');
if (fs.existsSync(railwayBackendPath)) {
  copyFolderSync(railwayBackendPath, railwayOnlyDir);
  console.log('✅ Copied railway-backend files');
} else {
  console.error('❌ railway-backend directory not found');
  process.exit(1);
}

// Initialize git repository
try {
  process.chdir(railwayOnlyDir);
  
  console.log('🔧 Initializing Git repository...');
  execSync('git init', { stdio: 'inherit' });
  
  console.log('📝 Adding files...');
  execSync('git add .', { stdio: 'inherit' });
  
  console.log('💾 Creating initial commit...');
  execSync('git commit -m "Initial Railway backend deployment"', { stdio: 'inherit' });
  
  console.log('');
  console.log('🎉 Railway backend repository created successfully!');
  console.log('📁 Location:', railwayOnlyDir);
  console.log('');
  console.log('📋 Next steps:');
  console.log('1. Create a new repository on GitHub (e.g., "rnc-railway-backend")');
  console.log('2. Add the remote origin:');
  console.log('   git remote add origin https://github.com/tawfig2020/rnc-railway-backend.git');
  console.log('3. Push to GitHub:');
  console.log('   git branch -M main');
  console.log('   git push -u origin main');
  console.log('4. Deploy this new repository to Railway');
  console.log('');
  console.log('🔗 Or use Railway CLI:');
  console.log('   railway login');
  console.log('   railway link');
  console.log('   railway up');
  
} catch (error) {
  console.error('❌ Git initialization failed:', error.message);
  console.log('');
  console.log('📋 Manual steps:');
  console.log('1. Navigate to:', railwayOnlyDir);
  console.log('2. Run: git init');
  console.log('3. Run: git add .');
  console.log('4. Run: git commit -m "Initial commit"');
  console.log('5. Create GitHub repo and push');
}
