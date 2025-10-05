#!/usr/bin/env node
/**
 * Build React frontend for Hostinger deployment
 * This script builds the React app with Railway backend URL
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building React frontend for Hostinger...');

// Set the Render backend URL
// Updated with actual Render URL
const RAILWAY_BACKEND_URL = 'https://rnc-railway-backend.onrender.com/api';

console.log('🔗 Backend URL:', RAILWAY_BACKEND_URL);

// Set environment variable for build
process.env.REACT_APP_API_URL = RAILWAY_BACKEND_URL;

// Build the React app
exec('npm run build', { cwd: path.join(__dirname, 'client') }, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Build failed:', error);
    return;
  }
  
  console.log('✅ Build completed successfully!');
  console.log('📁 Built files are in: client/build/');
  console.log('');
  console.log('📋 Next steps:');
  console.log('1. Copy contents of client/build/ to Hostinger');
  console.log('2. Test your website at https://rncmalaysia.net');
  console.log('3. Try logging in with admin@refugeenetwork.com / 123456');
  console.log('');
  console.log('🌐 Your setup:');
  console.log('- Frontend: https://rncmalaysia.net (Hostinger)');
  console.log('- Backend: ' + RAILWAY_BACKEND_URL.replace('/api', '') + ' (Railway)');
});
