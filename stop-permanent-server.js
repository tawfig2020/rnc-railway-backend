#!/usr/bin/env node
const { execSync } = require('child_process');

console.log('⏹️ Stopping RNC Malaysia Server...');
try {
  execSync('pm2 stop rnc-malaysia-server', { stdio: 'inherit' });
  console.log('✅ Server stopped successfully');
} catch (error) {
  console.error('❌ Failed to stop server:', error.message);
}