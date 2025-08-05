/**
 * API Connection Test Script
 * 
 * This script tests connectivity to your backend API server.
 * Run with: node test-api-connection.js
 */

const axios = require('axios');

// Configuration
const API_URLS = [
  'http://localhost:5000/api',  // Default Express port
  'http://localhost:5001/api',  // Your current configured port
  'http://localhost:3001/api',  // Another common API port
];

// Test function
async function testApiEndpoint(url) {
  try {
    console.log(`Testing connection to ${url}...`);
    const response = await axios.get(url, { 
      timeout: 5000,
      validateStatus: false // Accept any status code
    });
    
    console.log(`✓ Connected to ${url}`);
    console.log(`  Status: ${response.status}`);
    console.log(`  Content-Type: ${response.headers['content-type']}`);
    
    if (response.headers['content-type'] && response.headers['content-type'].includes('application/json')) {
      console.log('  Response data:', response.data);
    } else {
      console.log('  Warning: Server returned non-JSON response');
      console.log(`  Response begins with: ${typeof response.data === 'string' ? response.data.substring(0, 50) + '...' : 'Not a string'}`);
    }
  } catch (error) {
    console.log(`✗ Failed to connect to ${url}`);
    console.log(`  Error: ${error.message}`);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('  No server is running at this address/port');
    }
  }
  console.log('-------------------------------------------');
}

// Main function
async function runTests() {
  console.log('🔍 API CONNECTION TEST');
  console.log('-------------------------------------------');
  
  for (const url of API_URLS) {
    await testApiEndpoint(url);
  }
  
  console.log('\n📋 RECOMMENDATIONS:');
  console.log('1. Make sure your backend server is running');
  console.log('2. Check that your API_URL in Register.js matches your backend server port');
  console.log('3. Verify that your backend has CORS enabled for your frontend origin');
  console.log('4. Check your backend logs for any errors');
}

// Run the tests
runTests();
