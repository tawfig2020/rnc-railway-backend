#!/usr/bin/env node

/**
 * Permanent Server Setup using PM2
 * Makes your RNC Malaysia server run permanently
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up Permanent RNC Malaysia Server');
console.log('='.repeat(45));

// Install PM2 globally
console.log('📦 Installing PM2 (Process Manager)...');
try {
  execSync('npm install -g pm2', { stdio: 'inherit' });
  console.log('✅ PM2 installed successfully');
} catch (error) {
  console.log('⚠️ PM2 might already be installed or installation failed');
  console.log('Continuing with setup...');
}

// Create PM2 ecosystem configuration
const pm2Config = {
  apps: [{
    name: 'rnc-malaysia-server',
    script: 'server.js',
    cwd: __dirname,
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 5000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    log_date_format: 'YYYY-MM-DD HH:mm Z'
  }]
};

// Create logs directory
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
  console.log('✅ Logs directory created');
}

// Write PM2 configuration
const configPath = path.join(__dirname, 'ecosystem.config.js');
const configContent = `module.exports = ${JSON.stringify(pm2Config, null, 2)};`;
fs.writeFileSync(configPath, configContent);
console.log('✅ PM2 configuration created');

// Create management scripts
const startScript = `#!/usr/bin/env node
const { execSync } = require('child_process');

console.log('🚀 Starting RNC Malaysia Server...');
try {
  execSync('pm2 start ecosystem.config.js', { stdio: 'inherit' });
  console.log('✅ Server started successfully');
  console.log('🌐 Server running at: http://localhost:5000');
  console.log('📊 Monitor with: pm2 monit');
} catch (error) {
  console.error('❌ Failed to start server:', error.message);
}`;

const stopScript = `#!/usr/bin/env node
const { execSync } = require('child_process');

console.log('⏹️ Stopping RNC Malaysia Server...');
try {
  execSync('pm2 stop rnc-malaysia-server', { stdio: 'inherit' });
  console.log('✅ Server stopped successfully');
} catch (error) {
  console.error('❌ Failed to stop server:', error.message);
}`;

const restartScript = `#!/usr/bin/env node
const { execSync } = require('child_process');

console.log('🔄 Restarting RNC Malaysia Server...');
try {
  execSync('pm2 restart rnc-malaysia-server', { stdio: 'inherit' });
  console.log('✅ Server restarted successfully');
} catch (error) {
  console.error('❌ Failed to restart server:', error.message);
}`;

const statusScript = `#!/usr/bin/env node
const { execSync } = require('child_process');

console.log('📊 RNC Malaysia Server Status:');
try {
  execSync('pm2 list', { stdio: 'inherit' });
  console.log('\\n📈 Detailed monitoring: pm2 monit');
  console.log('📋 Logs: pm2 logs rnc-malaysia-server');
} catch (error) {
  console.error('❌ Failed to get status:', error.message);
}`;

fs.writeFileSync(path.join(__dirname, 'start-permanent-server.js'), startScript);
fs.writeFileSync(path.join(__dirname, 'stop-permanent-server.js'), stopScript);
fs.writeFileSync(path.join(__dirname, 'restart-permanent-server.js'), restartScript);
fs.writeFileSync(path.join(__dirname, 'server-status.js'), statusScript);

console.log('✅ Management scripts created');

// Setup PM2 to start on boot
console.log('🔧 Setting up auto-start on boot...');
try {
  execSync('pm2 startup', { stdio: 'inherit' });
  console.log('✅ Auto-start configured');
} catch (error) {
  console.log('⚠️ Auto-start setup may require manual configuration');
}

// Start the server
console.log('\n🚀 Starting RNC Malaysia Server...');
try {
  execSync('pm2 start ecosystem.config.js', { stdio: 'inherit' });
  
  // Save PM2 configuration
  execSync('pm2 save', { stdio: 'inherit' });
  
  console.log('\n🎉 SUCCESS! RNC Malaysia Server is now running permanently!');
  console.log('='.repeat(60));
  
  console.log('\n🌐 SERVER ACCESS:');
  console.log('• Server URL: http://localhost:5000');
  console.log('• API URL: http://localhost:5000/api');
  console.log('• Health Check: http://localhost:5000/health');
  
  console.log('\n📋 MANAGEMENT COMMANDS:');
  console.log('• Start: node start-permanent-server.js');
  console.log('• Stop: node stop-permanent-server.js');
  console.log('• Restart: node restart-permanent-server.js');
  console.log('• Status: node server-status.js');
  console.log('• Monitor: pm2 monit');
  console.log('• Logs: pm2 logs rnc-malaysia-server');
  
  console.log('\n✅ PERMANENT SERVER BENEFITS:');
  console.log('• ✅ Runs permanently (survives computer restart)');
  console.log('• ✅ Auto-restarts on crash');
  console.log('• ✅ Memory monitoring and restart');
  console.log('• ✅ Detailed logging');
  console.log('• ✅ Real-time monitoring dashboard');
  console.log('• ✅ No need to keep terminal open');
  
  console.log('\n🔍 MONITORING:');
  execSync('pm2 list', { stdio: 'inherit' });
  
} catch (error) {
  console.error('❌ Failed to start server:', error.message);
  console.log('\n💡 TROUBLESHOOTING:');
  console.log('1. Make sure port 5000 is available');
  console.log('2. Check if MongoDB is accessible');
  console.log('3. Verify Node.js is properly installed');
  console.log('4. Run: npm install (to install dependencies)');
}
