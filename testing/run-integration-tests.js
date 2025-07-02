/**
 * Integration Test Helper
 * Starts the development server and runs tests against it
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const CLIENT_DIR = path.join(__dirname, '../client');
const SERVER_START_TIMEOUT = 20000; // 20 seconds to wait for server to start
const SERVER_PORT = 3000;

console.log('\n======================================');
console.log('RNC Component Integration Test Runner');
console.log('======================================\n');

// Check if server is already running
const isPortInUse = async (port) => {
  return new Promise((resolve) => {
    const net = require('net');
    const tester = net.createServer()
      .once('error', () => resolve(true))
      .once('listening', () => {
        tester.close();
        resolve(false);
      })
      .listen(port);
  });
};

// Main function
async function runIntegrationTests() {
  try {
    // Check if port is already in use
    const portInUse = await isPortInUse(SERVER_PORT);
    
    let serverProcess = null;
    
    if (!portInUse) {
      console.log(`Starting development server on port ${SERVER_PORT}...`);
      
      // Start development server
      serverProcess = spawn('npm', ['start'], {
        cwd: CLIENT_DIR,
        shell: true,
        stdio: ['ignore', 'pipe', 'pipe']
      });
      
      // Log server output for debugging
      serverProcess.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('Compiled successfully') || output.includes('on port')) {
          console.log('Development server started successfully!');
        }
      });
      
      serverProcess.stderr.on('data', (data) => {
        console.error(`Server error: ${data}`);
      });
      
      // Wait for server to start
      await new Promise(resolve => {
        console.log(`Waiting up to ${SERVER_START_TIMEOUT/1000} seconds for server to start...`);
        const startTime = Date.now();
        
        const checkServer = async () => {
          if (await isPortInUse(SERVER_PORT)) {
            console.log(`Server detected on port ${SERVER_PORT}`);
            resolve();
            return;
          }
          
          if (Date.now() - startTime > SERVER_START_TIMEOUT) {
            console.error('Timed out waiting for server to start');
            process.exit(1);
          }
          
          setTimeout(checkServer, 1000);
        };
        
        checkServer();
      });
      
    } else {
      console.log(`Server already running on port ${SERVER_PORT}`);
    }
    
    // Run the tests
    console.log('\nRunning component integration tests...');
    
    const testProcess = spawn('node', ['run-tests.js'], {
      cwd: __dirname,
      shell: true,
      stdio: 'inherit'
    });
    
    // Wait for tests to complete
    const testResult = await new Promise(resolve => {
      testProcess.on('close', code => resolve(code));
    });
    
    // Cleanup
    if (serverProcess) {
      console.log('\nShutting down development server...');
      serverProcess.kill();
    }
    
    console.log(`\nTests completed with exit code: ${testResult}`);
    process.exit(testResult);
    
  } catch (error) {
    console.error('Error running tests:', error);
    process.exit(1);
  }
}

runIntegrationTests();
