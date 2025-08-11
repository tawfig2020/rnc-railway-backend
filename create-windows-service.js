#!/usr/bin/env node

/**
 * Windows Service Creator for RNC Malaysia Server
 * Makes your server run permanently on Windows
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Creating Windows Service for RNC Malaysia Server');
console.log('='.repeat(50));

// Check if running as administrator
function isAdmin() {
  try {
    execSync('net session', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

if (!isAdmin()) {
  console.log('❌ This script requires Administrator privileges');
  console.log('💡 Right-click Command Prompt and select "Run as Administrator"');
  console.log('💡 Then run: node create-windows-service.js');
  process.exit(1);
}

console.log('✅ Running with Administrator privileges');

// Install node-windows if not present
console.log('📦 Installing node-windows...');
try {
  execSync('npm install -g node-windows', { stdio: 'inherit' });
  console.log('✅ node-windows installed');
} catch (error) {
  console.error('❌ Failed to install node-windows:', error.message);
  process.exit(1);
}

// Create service script
const serviceScript = `
const Service = require('node-windows').Service;
const path = require('path');

// Create a new service object
const svc = new Service({
  name: 'RNC Malaysia Server',
  description: 'Refugee Network Community Malaysia Backend Server',
  script: path.join(__dirname, 'server.js'),
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ],
  env: [
    {
      name: "NODE_ENV",
      value: "production"
    },
    {
      name: "PORT",
      value: "5000"
    }
  ]
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', function() {
  console.log('✅ RNC Malaysia Server installed as Windows Service');
  console.log('🚀 Starting service...');
  svc.start();
});

svc.on('start', function() {
  console.log('🎉 RNC Malaysia Server is now running permanently!');
  console.log('🌐 Server URL: http://localhost:5000');
  console.log('🔗 API URL: http://localhost:5000/api');
});

// Install the service
console.log('📥 Installing RNC Malaysia Server as Windows Service...');
svc.install();
`;

const serviceScriptPath = path.join(__dirname, 'install-service.js');
fs.writeFileSync(serviceScriptPath, serviceScript);
console.log('✅ Service installation script created');

// Create uninstall script
const uninstallScript = `
const Service = require('node-windows').Service;
const path = require('path');

// Create a new service object
const svc = new Service({
  name: 'RNC Malaysia Server',
  script: path.join(__dirname, 'server.js')
});

// Listen for the "uninstall" event so we know when it's done.
svc.on('uninstall', function() {
  console.log('✅ RNC Malaysia Server uninstalled successfully');
});

// Uninstall the service
console.log('🗑️ Uninstalling RNC Malaysia Server...');
svc.uninstall();
`;

const uninstallScriptPath = path.join(__dirname, 'uninstall-service.js');
fs.writeFileSync(uninstallScriptPath, uninstallScript);
console.log('✅ Service uninstall script created');

// Create service management scripts
const startServiceScript = `
const { execSync } = require('child_process');

try {
  console.log('🚀 Starting RNC Malaysia Server...');
  execSync('net start "RNC Malaysia Server"', { stdio: 'inherit' });
  console.log('✅ Server started successfully');
} catch (error) {
  console.error('❌ Failed to start service:', error.message);
}
`;

const stopServiceScript = `
const { execSync } = require('child_process');

try {
  console.log('⏹️ Stopping RNC Malaysia Server...');
  execSync('net stop "RNC Malaysia Server"', { stdio: 'inherit' });
  console.log('✅ Server stopped successfully');
} catch (error) {
  console.error('❌ Failed to stop service:', error.message);
}
`;

fs.writeFileSync(path.join(__dirname, 'start-service.js'), startServiceScript);
fs.writeFileSync(path.join(__dirname, 'stop-service.js'), stopServiceScript);

console.log('✅ Service management scripts created');

// Run the installation
console.log('\n🔧 Installing Windows Service...');
try {
  execSync(`node "${serviceScriptPath}"`, { stdio: 'inherit' });
  
  console.log('\n🎉 SUCCESS! RNC Malaysia Server is now a Windows Service');
  console.log('='.repeat(60));
  
  console.log('\n📋 SERVICE MANAGEMENT:');
  console.log('• Start Service: node start-service.js');
  console.log('• Stop Service: node stop-service.js');
  console.log('• Uninstall Service: node uninstall-service.js');
  console.log('• Windows Services: services.msc');
  
  console.log('\n🌐 SERVER ACCESS:');
  console.log('• Server URL: http://localhost:5000');
  console.log('• API URL: http://localhost:5000/api');
  console.log('• Health Check: http://localhost:5000/health');
  
  console.log('\n✅ BENEFITS:');
  console.log('• ✅ Runs permanently (even after restart)');
  console.log('• ✅ Auto-starts with Windows');
  console.log('• ✅ Runs in background');
  console.log('• ✅ Auto-restarts on crash');
  console.log('• ✅ No need to keep terminal open');
  
} catch (error) {
  console.error('❌ Service installation failed:', error.message);
  console.log('\n💡 TROUBLESHOOTING:');
  console.log('1. Make sure you are running as Administrator');
  console.log('2. Check if port 5000 is available');
  console.log('3. Ensure Node.js is in system PATH');
}
