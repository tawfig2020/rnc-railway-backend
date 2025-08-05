/**
 * Registration Flow Test Script
 * 
 * This script tests the full registration flow including:
 * - API connection
 * - User registration
 * - JWT token handling
 * - Email sending
 * 
 * Run with: node test-registration-flow.js
 */

const axios = require('axios');
const colors = require('colors/safe');
const readline = require('readline');

// Configuration
const API_URL = 'http://localhost:5001'; // Update this if your API runs on a different port
const TEST_USER = {
  name: 'Test User',
  email: `test.user.${Date.now()}@example.com`,
  password: 'password123',
  location: 'Test Location',
  role: 'refugee'
};

// Set up readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Utility functions
const log = {
  info: (msg) => console.log(colors.blue('ℹ INFO: ') + msg),
  success: (msg) => console.log(colors.green('✓ SUCCESS: ') + msg),
  error: (msg) => console.log(colors.red('✗ ERROR: ') + msg),
  warning: (msg) => console.log(colors.yellow('⚠ WARNING: ') + msg),
  step: (msg) => console.log(colors.cyan('\n== ' + msg + ' =='))
};

const prompt = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

// Test functions
async function testApiConnection() {
  log.step('Testing API Connection');
  
  try {
    const response = await axios.get(`${API_URL}/api`, { timeout: 5000 });
    log.success(`Connected to API at ${API_URL}`);
    log.info(`Response: ${JSON.stringify(response.data)}`);
    return true;
  } catch (error) {
    log.error(`Failed to connect to API at ${API_URL}`);
    if (error.code === 'ECONNREFUSED') {
      log.error('API server appears to be offline. Make sure it is running.');
    } else {
      log.error(`Error: ${error.message}`);
    }
    return false;
  }
}

async function testUserRegistration() {
  log.step('Testing User Registration');
  
  try {
    log.info(`Registering user: ${TEST_USER.email}`);
    const response = await axios.post(`${API_URL}/api/auth/register`, TEST_USER);
    
    log.success('Registration API call succeeded');
    log.info(`Response: ${JSON.stringify(response.data)}`);
    
    if (response.data.success) {
      log.success('Registration successful');
      
      if (response.data.token) {
        log.success('JWT token received');
        return response.data.token;
      } else {
        log.warning('JWT token not received in response');
      }
      
      if (response.data.message && response.data.message.includes('verification')) {
        log.info('Email verification required: ' + response.data.message);
      }
      
      return true;
    } else {
      log.warning('Registration API responded with success: false');
      return false;
    }
  } catch (error) {
    log.error('Registration failed');
    
    if (error.response) {
      log.error(`Server responded with status: ${error.response.status}`);
      log.error(`Response data: ${JSON.stringify(error.response.data)}`);
      
      if (error.response.data && error.response.data.errors) {
        log.error('Validation errors:');
        error.response.data.errors.forEach(err => {
          console.log(`  - ${err.param}: ${err.msg}`);
        });
      }
    } else if (error.request) {
      log.error('No response received from server');
    } else {
      log.error(`Error: ${error.message}`);
    }
    
    return false;
  }
}

async function testTokenVerification(token) {
  if (!token || typeof token !== 'string') {
    log.warning('No token available to verify');
    return false;
  }
  
  log.step('Testing JWT Token Verification');
  
  try {
    const response = await axios.get(`${API_URL}/api/auth/me`, {
      headers: {
        'x-auth-token': token
      }
    });
    
    log.success('Token verification successful');
    log.info(`User data: ${JSON.stringify(response.data)}`);
    return true;
  } catch (error) {
    log.error('Token verification failed');
    
    if (error.response) {
      if (error.response.status === 401) {
        log.warning('Email verification may be required before token is valid');
      }
      log.error(`Server responded with status: ${error.response.status}`);
      log.error(`Response data: ${JSON.stringify(error.response.data)}`);
    } else {
      log.error(`Error: ${error.message}`);
    }
    
    return false;
  }
}

async function checkUserInDatabase() {
  log.step('Checking User in Database');
  log.info('To verify if the user was properly saved, check your MongoDB database');
  log.info(`Look for a user with email: ${TEST_USER.email}`);
  
  const answer = await prompt('Did you find the user in the database? (yes/no) ');
  
  if (answer.toLowerCase().startsWith('y')) {
    log.success('User was successfully saved in the database');
    return true;
  } else {
    log.error('User was not found in the database');
    return false;
  }
}

// Main function
async function runTests() {
  console.log(colors.bold('\n🧪 REGISTRATION FLOW TEST\n'));
  
  // Step 1: Test API connection
  const apiConnected = await testApiConnection();
  if (!apiConnected) {
    log.error('Cannot proceed with tests - API connection failed');
    return;
  }
  
  // Step 2: Test user registration
  const registrationResult = await testUserRegistration();
  if (!registrationResult) {
    log.error('Cannot proceed with tests - Registration failed');
    return;
  }
  
  // Step 3: Test token verification if we got a token
  if (typeof registrationResult === 'string') {
    await testTokenVerification(registrationResult);
  }
  
  // Step 4: Check database (manual step)
  await checkUserInDatabase();
  
  // Summary
  log.step('Test Summary');
  log.info('API Connection: ' + (apiConnected ? colors.green('PASS') : colors.red('FAIL')));
  log.info('User Registration: ' + (registrationResult ? colors.green('PASS') : colors.red('FAIL')));
  
  console.log(colors.bold('\nNext Steps:'));
  console.log('1. If all tests passed, your registration flow is working correctly');
  console.log('2. If email verification is required, check for any email delivery issues');
  console.log('3. Try the actual signup process in your application');
  
  rl.close();
}

// Run the tests
runTests();
