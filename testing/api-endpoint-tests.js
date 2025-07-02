/**
 * RNC Application API Endpoint Tests
 * 
 * This script tests all API endpoints before deployment
 * to ensure they are functioning correctly.
 */

const axios = require('axios');
const assert = require('assert').strict;
// Import chalk with CommonJS compatibility
const chalk = require('chalk');
const log = {
  blue: (text) => console.log('\x1b[34m%s\x1b[0m', text),
  green: (text) => console.log('\x1b[32m%s\x1b[0m', text),
  red: (text) => console.log('\x1b[31m%s\x1b[0m', text),
  yellow: (text) => console.log('\x1b[33m%s\x1b[0m', text)
};
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  baseUrl: 'http://localhost:5000/api', // Updated to match the currently running server port
  testResultsPath: path.join(__dirname, 'api-test-results.md')
};

// Test results storage
const testResults = {
  passed: 0,
  failed: 0,
  skipped: 0,
  results: []
};

/**
 * Log test result
 */
function logResult(endpoint, method, status, notes = '') {
  const timestamp = new Date().toISOString();
  const result = {
    endpoint: `${method} ${endpoint}`,
    status,
    timestamp,
    notes
  };
  
  testResults.results.push(result);
  
  if (status === 'PASS') {
    testResults.passed++;
    console.log(log.green(`✓ PASS: ${method} ${endpoint}`));
  } else if (status === 'FAIL') {
    testResults.failed++;
    console.log(log.red(`✗ FAIL: ${method} ${endpoint} - ${notes}`));
  } else {
    testResults.skipped++;
    console.log(log.yellow(`⚠ SKIP: ${method} ${endpoint} - ${notes}`));
  }
}

/**
 * Save test results to file
 */
function saveTestResults() {
  let content = `# RNC Application API Endpoint Test Results\n\n`;
  content += `Test run completed at: ${new Date().toISOString()}\n\n`;
  content += `## Summary\n\n`;
  content += `- Total tests: ${testResults.passed + testResults.failed + testResults.skipped}\n`;
  content += `- Passed: ${testResults.passed}\n`;
  content += `- Failed: ${testResults.failed}\n`;
  content += `- Skipped: ${testResults.skipped}\n\n`;
  content += `## Detailed Results\n\n`;
  content += `| Endpoint | Status | Timestamp | Notes |\n`;
  content += `|----------|--------|-----------|-------|\n`;
  
  testResults.results.forEach(result => {
    const status = result.status === 'PASS' 
      ? 'PASS ✓' 
      : result.status === 'FAIL' 
        ? 'FAIL ✗' 
        : 'SKIP ⚠';
    content += `| ${result.endpoint} | ${status} | ${result.timestamp} | ${result.notes} |\n`;
  });
  
  fs.writeFileSync(config.testResultsPath, content);
  console.log(log.blue(`\nAPI test results saved to ${config.testResultsPath}`));
}

/**
 * Helper function to make API requests
 */
async function makeRequest(method, endpoint, data = null, token = null) {
  try {
    const headers = {};
    if (token) {
      headers['x-auth-token'] = token;
    }
    
    const response = await axios({
      method,
      url: `${config.baseUrl}${endpoint}`,
      data,
      headers
    });
    
    return {
      success: true,
      status: response.status,
      data: response.data
    };
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        status: error.response.status,
        data: error.response.data
      };
    } else {
      return {
        success: false,
        status: 500,
        data: { error: error.message }
      };
    }
  }
}

/**
 * Main test runner
 */
async function runApiTests() {
  console.log(log.blue('Starting RNC API Endpoint Tests'));
  console.log(log.blue('===============================\n'));
  
  let authToken = null;
  
  // Test 1: GET /api - Welcome message
  try {
    const response = await makeRequest('get', '');
    
    if (response.success && response.data.message) {
      logResult('/', 'GET', 'PASS');
    } else {
      logResult('/', 'GET', 'FAIL', `Status: ${response.status}, Expected welcome message`);
    }
  } catch (error) {
    logResult('/', 'GET', 'FAIL', error.message);
  }
  
  // Test 2: POST /api/auth/register - Register a new user
  try {
    // Generate a unique email using timestamp
    const timestamp = new Date().getTime();
    const testUser = {
      name: 'Test User',
      email: `testuser${timestamp}@example.com`,
      password: 'password123',
      location: 'Test Location',
      languages: ['English']
    };
    
    const response = await makeRequest('post', '/auth/register', testUser);
    
    if (response.success && response.data.token) {
      logResult('/auth/register', 'POST', 'PASS');
      authToken = response.data.token; // Save token for subsequent tests
    } else {
      logResult('/auth/register', 'POST', 'FAIL', `Status: ${response.status}, ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    logResult('/auth/register', 'POST', 'FAIL', error.message);
  }
  
  // Test 3: POST /api/auth/login - Login with test user
  try {
    const timestamp = new Date().getTime();
    const loginData = {
      email: `testuser${timestamp}@example.com`,
      password: 'password123'
    };
    
    const response = await makeRequest('post', '/auth/login', loginData);
    
    if (response.success && response.data.token) {
      logResult('/auth/login', 'POST', 'PASS');
      authToken = response.data.token; // Update token
    } else {
      logResult('/auth/login', 'POST', 'FAIL', `Status: ${response.status}, ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    logResult('/auth/login', 'POST', 'FAIL', error.message);
  }
  
  // Test 4: GET /api/auth/me - Get user profile
  try {
    if (!authToken) {
      logResult('/auth/me', 'GET', 'SKIP', 'No auth token available');
    } else {
      const response = await makeRequest('get', '/auth/me', null, authToken);
      
      if (response.success) {
        logResult('/auth/me', 'GET', 'PASS');
      } else {
        logResult('/auth/me', 'GET', 'FAIL', `Status: ${response.status}, ${JSON.stringify(response.data)}`);
      }
    }
  } catch (error) {
    logResult('/auth/me', 'GET', 'FAIL', error.message);
  }
  
  // Test 5: GET /api/blogs - Get all blog posts
  try {
    const response = await makeRequest('get', '/blogs');
    
    if (response.success && Array.isArray(response.data)) {
      logResult('/blogs', 'GET', 'PASS');
    } else {
      logResult('/blogs', 'GET', 'FAIL', `Status: ${response.status}, Expected array of blogs`);
    }
  } catch (error) {
    logResult('/blogs', 'GET', 'FAIL', error.message);
  }
  
  // Test 6: GET /api/courses - Get all courses
  try {
    const response = await makeRequest('get', '/courses');
    
    if (response.success && Array.isArray(response.data)) {
      logResult('/courses', 'GET', 'PASS');
    } else {
      logResult('/courses', 'GET', 'FAIL', `Status: ${response.status}, Expected array of courses`);
    }
  } catch (error) {
    logResult('/courses', 'GET', 'FAIL', error.message);
  }
  
  // Test 7: GET /api/events - Get all events
  try {
    const response = await makeRequest('get', '/events');
    
    if (response.success && Array.isArray(response.data)) {
      logResult('/events', 'GET', 'PASS');
    } else {
      logResult('/events', 'GET', 'FAIL', `Status: ${response.status}, Expected array of events`);
    }
  } catch (error) {
    logResult('/events', 'GET', 'FAIL', error.message);
  }
  
  // Test 8: GET /api/resources - Get all resources
  try {
    const response = await makeRequest('get', '/resources');
    
    if (response.success && Array.isArray(response.data)) {
      logResult('/resources', 'GET', 'PASS');
    } else {
      logResult('/resources', 'GET', 'FAIL', `Status: ${response.status}, Expected array of resources`);
    }
  } catch (error) {
    logResult('/resources', 'GET', 'FAIL', error.message);
  }
  
  // Print summary
  console.log(log.blue('\nAPI Test Summary:'));
  console.log(log.green(`Passed: ${testResults.passed}`));
  console.log(log.red(`Failed: ${testResults.failed}`));
  console.log(log.yellow(`Skipped: ${testResults.skipped}`));
  
  // Save results
  saveTestResults();
}

// Run the tests
runApiTests().catch(console.error);
