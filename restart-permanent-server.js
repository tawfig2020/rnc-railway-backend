#!/usr/bin/env node
const { execSync } = require('child_process');

console.log('🔄 Restarting RNC Malaysia Server...');
try {
  execSync('pm2 restart rnc-malaysia-server', { stdio: 'inherit' });
  console.log('✅ Server restarted successfully');
} catch (error) {
  console.error('❌ Failed to restart server:', error.message);
}