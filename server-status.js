#!/usr/bin/env node
const { execSync } = require('child_process');

console.log('📊 RNC Malaysia Server Status:');
try {
  execSync('pm2 list', { stdio: 'inherit' });
  console.log('\n📈 Detailed monitoring: pm2 monit');
  console.log('📋 Logs: pm2 logs rnc-malaysia-server');
} catch (error) {
  console.error('❌ Failed to get status:', error.message);
}