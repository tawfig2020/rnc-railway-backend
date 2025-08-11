#!/usr/bin/env node
const { execSync } = require('child_process');

console.log('🚀 Starting RNC Malaysia Server...');
try {
  execSync('pm2 start ecosystem.config.js', { stdio: 'inherit' });
  console.log('✅ Server started successfully');
  console.log('🌐 Server running at: http://localhost:5000');
  console.log('📊 Monitor with: pm2 monit');
} catch (error) {
  console.error('❌ Failed to start server:', error.message);
}