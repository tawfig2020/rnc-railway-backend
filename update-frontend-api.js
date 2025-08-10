#!/usr/bin/env node

/**
 * Update Frontend API URL Script
 * Updates the frontend .env.production file with the deployed backend URL
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 Frontend API URL Update Script');
console.log('='.repeat(40));

console.log('\nThis script will update your frontend to connect to the deployed backend.');

rl.question('\n📝 Enter your deployed backend URL (e.g., https://rnc-malaysia-api.onrender.com): ', (backendUrl) => {
  
  // Validate URL format
  if (!backendUrl.startsWith('http://') && !backendUrl.startsWith('https://')) {
    console.log('❌ Invalid URL format. URL must start with http:// or https://');
    rl.close();
    return;
  }

  // Remove trailing slash if present
  const cleanUrl = backendUrl.replace(/\/$/, '');
  const apiUrl = `${cleanUrl}/api`;

  // Update client/.env.production
  const envProductionPath = path.join(__dirname, 'client', '.env.production');
  
  try {
    let envContent = fs.readFileSync(envProductionPath, 'utf8');
    
    // Update the REACT_APP_API_URL line
    const updatedContent = envContent.replace(
      /REACT_APP_API_URL=.*/,
      `REACT_APP_API_URL=${apiUrl}`
    );
    
    fs.writeFileSync(envProductionPath, updatedContent);
    
    console.log('\n✅ Frontend configuration updated successfully!');
    console.log(`📝 API URL set to: ${apiUrl}`);
    
    console.log('\n🔄 Next steps:');
    console.log('1. Rebuild the frontend:');
    console.log('   cd client');
    console.log('   npm run build');
    console.log('\n2. Deploy the updated build folder to your web hosting');
    console.log('\n3. Test the login at: http://rncmalaysia.org/login');
    
    console.log('\n🧪 Test your deployed backend:');
    console.log(`   Health Check: ${cleanUrl}/health`);
    console.log(`   Login Test: ${apiUrl}/auth/login`);
    
  } catch (error) {
    console.log('❌ Error updating frontend configuration:', error.message);
  }
  
  rl.close();
});

rl.on('close', () => {
  console.log('\n🎉 Configuration update complete!');
});
