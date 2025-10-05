#!/usr/bin/env node
/**
 * Update all files with your actual Railway URL
 * Run this script after you get your Railway URL
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 Railway URL Update Helper');
console.log('');
console.log('First, get your Railway URL from https://railway.app dashboard');
console.log('It should look like: https://web-production-abc123.railway.app');
console.log('');

rl.question('Enter your Railway URL (without /api): ', (railwayUrl) => {
  if (!railwayUrl || !railwayUrl.includes('railway.app')) {
    console.log('❌ Invalid URL. Please enter a valid Railway URL.');
    rl.close();
    return;
  }

  // Clean the URL (remove trailing slash and /api if present)
  const cleanUrl = railwayUrl.replace(/\/$/, '').replace('/api', '');
  const apiUrl = cleanUrl + '/api';

  console.log('');
  console.log('🔗 Using URLs:');
  console.log('- Backend:', cleanUrl);
  console.log('- API:', apiUrl);
  console.log('');

  // Update build-frontend-for-hostinger.js
  const buildScriptPath = path.join(__dirname, 'build-frontend-for-hostinger.js');
  if (fs.existsSync(buildScriptPath)) {
    let content = fs.readFileSync(buildScriptPath, 'utf8');
    content = content.replace(
      /const RAILWAY_BACKEND_URL = 'https:\/\/YOUR_RAILWAY_URL\.railway\.app\/api';/,
      `const RAILWAY_BACKEND_URL = '${apiUrl}';`
    );
    fs.writeFileSync(buildScriptPath, content);
    console.log('✅ Updated build-frontend-for-hostinger.js');
  }

  // Update client/src/services/api.js
  const apiJsPath = path.join(__dirname, 'client', 'src', 'services', 'api.js');
  if (fs.existsSync(apiJsPath)) {
    let content = fs.readFileSync(apiJsPath, 'utf8');
    content = content.replace(
      /baseURL = process\.env\.REACT_APP_API_URL \|\| 'https:\/\/YOUR_RAILWAY_URL\.railway\.app\/api';/,
      `baseURL = process.env.REACT_APP_API_URL || '${apiUrl}';`
    );
    fs.writeFileSync(apiJsPath, content);
    console.log('✅ Updated client/src/services/api.js');
  }

  console.log('');
  console.log('🎉 All files updated successfully!');
  console.log('');
  console.log('📋 Next steps:');
  console.log('1. Test your backend:');
  console.log('   - Health: ' + cleanUrl + '/health');
  console.log('   - API: ' + apiUrl);
  console.log('');
  console.log('2. Build frontend:');
  console.log('   node build-frontend-for-hostinger.js');
  console.log('');
  console.log('3. Deploy to Hostinger:');
  console.log('   Upload contents of client/build/ to your Hostinger public_html');

  rl.close();
});
