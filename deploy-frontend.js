#!/usr/bin/env node

/**
 * Frontend Deployment Script for RNC Malaysia
 * Builds and prepares frontend for deployment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎨 RNC Malaysia Frontend Deployment');
console.log('='.repeat(40));

// Check if we're in the right directory
const clientDir = path.join(__dirname, 'client');
if (!fs.existsSync(clientDir)) {
  console.error('❌ Client directory not found. Please run from project root.');
  process.exit(1);
}

console.log('✅ Client directory found');

// Check if package.json exists in client
const clientPackageJson = path.join(clientDir, 'package.json');
if (!fs.existsSync(clientPackageJson)) {
  console.error('❌ Client package.json not found');
  process.exit(1);
}

console.log('✅ Client package.json found');

// Read client package.json
const packageData = JSON.parse(fs.readFileSync(clientPackageJson, 'utf8'));
console.log(`📦 Frontend: ${packageData.name} v${packageData.version}`);

// Check if node_modules exists
const nodeModulesDir = path.join(clientDir, 'node_modules');
if (!fs.existsSync(nodeModulesDir)) {
  console.log('📥 Installing frontend dependencies...');
  try {
    execSync('npm install', { cwd: clientDir, stdio: 'inherit' });
    console.log('✅ Dependencies installed');
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ Dependencies already installed');
}

// Check production environment
const envProdPath = path.join(clientDir, '.env.production');
if (fs.existsSync(envProdPath)) {
  const envContent = fs.readFileSync(envProdPath, 'utf8');
  const apiUrlMatch = envContent.match(/REACT_APP_API_URL=(.+)/);
  if (apiUrlMatch) {
    console.log(`🔗 API URL: ${apiUrlMatch[1]}`);
  }
  console.log('✅ Production environment configured');
} else {
  console.log('⚠️  No .env.production file found');
}

// Build the frontend
console.log('\n🔨 Building frontend for production...');
try {
  execSync('npm run build', { cwd: clientDir, stdio: 'inherit' });
  console.log('✅ Frontend build completed');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Check build directory
const buildDir = path.join(clientDir, 'build');
if (fs.existsSync(buildDir)) {
  const buildFiles = fs.readdirSync(buildDir);
  console.log(`📁 Build directory contains ${buildFiles.length} items`);
  
  // Check build size
  const staticDir = path.join(buildDir, 'static');
  if (fs.existsSync(staticDir)) {
    const jsDir = path.join(staticDir, 'js');
    const cssDir = path.join(staticDir, 'css');
    
    if (fs.existsSync(jsDir)) {
      const jsFiles = fs.readdirSync(jsDir);
      console.log(`📄 JavaScript files: ${jsFiles.length}`);
    }
    
    if (fs.existsSync(cssDir)) {
      const cssFiles = fs.readdirSync(cssDir);
      console.log(`🎨 CSS files: ${cssFiles.length}`);
    }
  }
  
  console.log('✅ Build directory ready for deployment');
} else {
  console.error('❌ Build directory not found');
  process.exit(1);
}

// Display deployment options
console.log('\n🚀 DEPLOYMENT OPTIONS:');
console.log('='.repeat(25));

console.log('\n1️⃣ STATIC HOSTING (Recommended):');
console.log('   • Netlify: Drag & drop the build folder');
console.log('   • Vercel: Connect GitHub repo for auto-deploy');
console.log('   • GitHub Pages: Use gh-pages branch');
console.log('   • Firebase Hosting: firebase deploy');

console.log('\n2️⃣ TRADITIONAL WEB HOSTING:');
console.log('   • Upload build folder contents to your web server');
console.log('   • Point domain to the uploaded files');
console.log('   • Ensure server serves index.html for all routes');

console.log('\n3️⃣ CDN DEPLOYMENT:');
console.log('   • AWS S3 + CloudFront');
console.log('   • Azure Static Web Apps');
console.log('   • Google Cloud Storage');

console.log('\n📁 BUILD LOCATION:');
console.log(`   ${buildDir}`);

console.log('\n🔧 NEXT STEPS:');
console.log('1. Choose a deployment method above');
console.log('2. Upload/deploy the build folder contents');
console.log('3. Configure your domain to point to the deployed files');
console.log('4. Test login at http://rncmalaysia.org/login');

console.log('\n🎯 FOR AUTOMATIC DEPLOYMENT:');
console.log('   Run: node setup-github-deployment.js');
console.log('   This will set up GitHub Actions for auto-deployment');

console.log('\n✅ Frontend deployment preparation complete!');
