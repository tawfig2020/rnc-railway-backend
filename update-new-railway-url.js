#!/usr/bin/env node
/**
 * Update frontend with new Railway URL
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 Update Frontend with New Railway URL');
console.log('');
console.log('After deploying to Railway, you should have a new URL.');
console.log('It should look like: https://rnc-railway-backend-production-abc123.railway.app');
console.log('');

rl.question('Enter your NEW Railway URL (without /api): ', (newRailwayUrl) => {
  if (!newRailwayUrl || !newRailwayUrl.includes('railway.app')) {
    console.log('❌ Invalid URL. Please enter a valid Railway URL.');
    rl.close();
    return;
  }

  // Clean the URL
  const cleanUrl = newRailwayUrl.replace(/\/$/, '').replace('/api', '');
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
      /const RAILWAY_BACKEND_URL = 'https:\/\/[^']+';/,
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
      /baseURL = process\.env\.REACT_APP_API_URL \|\| 'https:\/\/[^']+';/,
      `baseURL = process.env.REACT_APP_API_URL || '${apiUrl}';`
    );
    fs.writeFileSync(apiJsPath, content);
    console.log('✅ Updated client/src/services/api.js');
  }

  console.log('');
  console.log('🎉 Frontend updated with new Railway URL!');
  console.log('');
  console.log('📋 Next steps:');
  console.log('1. Test your new backend:');
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
