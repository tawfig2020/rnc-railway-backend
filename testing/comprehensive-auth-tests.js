/**
 * Comprehensive Authentication Integration Tests
 * Tests both registration and login functionality with the RNC backend
 */

const axios = require('axios');
const colors = require('colors');

// Test configuration
const BASE_URL = 'http://localhost:5000';
const API_URL = `${BASE_URL}/api`;
const TIMEOUT = 10000;

// Configure axios defaults
axios.defaults.timeout = TIMEOUT;

// Test user data
const testUsers = {
  newUser: {
    firstName: 'Integration',
    lastName: 'Test',
    email: `test.${Date.now()}@example.com`,
    password: 'TestPass123!',
    location: 'Test City'
  },
  existingUser: {
    email: 'test@example.com',
    password: '123456'
  },
  adminUser: {
    email: 'admin@refugeenetwork.com',
    password: '123456'
  },
  invalidUser: {
    email: 'nonexistent@example.com',
    password: 'wrongpassword'
  }
};

// Test results tracking
let testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

// Helper functions
function logTest(testName, passed, message = '', details = null) {
  const status = passed ? '✅ PASS'.green : '❌ FAIL'.red;
  console.log(`${status} ${testName}`);
  if (message) {
    console.log(`   ${message.gray}`);
  }
  if (details && !passed) {
    console.log(`   Details: ${JSON.stringify(details, null, 2).red}`);
  }
  
  testResults.tests.push({ name: testName, passed, message, details });
  if (passed) {
    testResults.passed++;
  } else {
    testResults.failed++;
  }
}

function logSection(title) {
  console.log(`\n${'='.repeat(50)}`.cyan);
  console.log(`${title.toUpperCase()}`.cyan.bold);
  console.log(`${'='.repeat(50)}`.cyan);
}

async function makeRequest(method, endpoint, data = null, headers = {}) {
  try {
    const config = {
      method,
      url: `${API_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status || 500
    };
  }
}

// Test functions
async function testServerHealth() {
  logSection('Server Health Check');
  
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    const isHealthy = response.status === 200 && response.data.status === 'OK';
    
    logTest(
      'Server Health Check',
      isHealthy,
      `Server status: ${response.data.status}, Database: ${response.data.database}`,
      response.data
    );
    
    return isHealthy;
  } catch (error) {
    logTest('Server Health Check', false, 'Server is not responding', error.message);
    return false;
  }
}

async function testUserRegistration() {
  logSection('User Registration Tests');
  
  // Test 1: Valid registration
  const registerResult = await makeRequest('POST', '/auth/register', testUsers.newUser);
  
  const registrationSuccess = registerResult.success && 
    registerResult.data.success && 
    registerResult.data.accessToken &&
    registerResult.data.user;
    
  logTest(
    'Valid User Registration',
    registrationSuccess,
    registrationSuccess ? 
      `User registered: ${registerResult.data.user.email}` : 
      'Registration failed',
    registerResult.error
  );

  // Store token for later tests
  if (registrationSuccess) {
    testUsers.newUser.token = registerResult.data.accessToken;
    testUsers.newUser.refreshToken = registerResult.data.refreshToken;
    testUsers.newUser.userData = registerResult.data.user;
  }

  // Test 2: Duplicate email registration
  const duplicateResult = await makeRequest('POST', '/auth/register', testUsers.newUser);
  
  const duplicateRejected = !duplicateResult.success && 
    duplicateResult.status === 400;
    
  logTest(
    'Duplicate Email Rejection',
    duplicateRejected,
    duplicateRejected ? 
      'Duplicate registration properly rejected' : 
      'Duplicate registration was allowed (should be rejected)',
    duplicateResult.error
  );

  // Test 3: Invalid registration (missing fields)
  const invalidData = { email: 'incomplete@test.com' }; // Missing required fields
  const invalidResult = await makeRequest('POST', '/auth/register', invalidData);
  
  const invalidRejected = !invalidResult.success && invalidResult.status === 400;
  
  logTest(
    'Invalid Registration Data Rejection',
    invalidRejected,
    invalidRejected ? 
      'Invalid registration properly rejected' : 
      'Invalid registration was allowed (should be rejected)',
    invalidResult.error
  );

  return registrationSuccess;
}

async function testUserLogin() {
  logSection('User Login Tests');
  
  // Test 1: Valid login with existing user
  const loginResult = await makeRequest('POST', '/auth/login', {
    email: testUsers.existingUser.email,
    password: testUsers.existingUser.password
  });
  
  const loginSuccess = loginResult.success && 
    loginResult.data.success && 
    loginResult.data.accessToken &&
    loginResult.data.user;
    
  logTest(
    'Valid User Login',
    loginSuccess,
    loginSuccess ? 
      `User logged in: ${loginResult.data.user.email}` : 
      'Login failed',
    loginResult.error
  );

  // Store token for later tests
  if (loginSuccess) {
    testUsers.existingUser.token = loginResult.data.accessToken;
    testUsers.existingUser.refreshToken = loginResult.data.refreshToken;
    testUsers.existingUser.userData = loginResult.data.user;
  }

  // Test 2: Admin login
  const adminLoginResult = await makeRequest('POST', '/auth/login', {
    email: testUsers.adminUser.email,
    password: testUsers.adminUser.password
  });
  
  const adminLoginSuccess = adminLoginResult.success && 
    adminLoginResult.data.success && 
    adminLoginResult.data.user?.role === 'admin';
    
  logTest(
    'Admin User Login',
    adminLoginSuccess,
    adminLoginSuccess ? 
      `Admin logged in: ${adminLoginResult.data.user.email}` : 
      'Admin login failed',
    adminLoginResult.error
  );

  // Test 3: Invalid credentials
  const invalidLoginResult = await makeRequest('POST', '/auth/login', {
    email: testUsers.invalidUser.email,
    password: testUsers.invalidUser.password
  });
  
  const invalidLoginRejected = !invalidLoginResult.success && invalidLoginResult.status === 400;
  
  logTest(
    'Invalid Credentials Rejection',
    invalidLoginRejected,
    invalidLoginRejected ? 
      'Invalid login properly rejected' : 
      'Invalid login was allowed (should be rejected)',
    invalidLoginResult.error
  );

  // Test 4: Missing credentials
  const missingCredsResult = await makeRequest('POST', '/auth/login', {
    email: 'test@example.com'
    // Missing password
  });
  
  const missingCredsRejected = !missingCredsResult.success && missingCredsResult.status === 400;
  
  logTest(
    'Missing Credentials Rejection',
    missingCredsRejected,
    missingCredsRejected ? 
      'Missing credentials properly rejected' : 
      'Missing credentials was allowed (should be rejected)',
    missingCredsResult.error
  );

  return loginSuccess;
}

async function testTokenAuthentication() {
  logSection('Token Authentication Tests');
  
  // Test 1: Access profile with valid token
  const token = testUsers.existingUser.token || testUsers.newUser.token;
  
  if (!token) {
    logTest('Profile Access with Token', false, 'No valid token available from previous tests');
    return false;
  }

  const profileResult = await makeRequest('GET', '/auth/profile', null, {
    'Authorization': `Bearer ${token}`
  });
  
  const profileSuccess = profileResult.success && profileResult.data.success && profileResult.data.user;
  
  logTest(
    'Profile Access with Valid Token',
    profileSuccess,
    profileSuccess ? 
      `Profile retrieved for: ${profileResult.data.user.email}` : 
      'Profile access failed',
    profileResult.error
  );

  // Test 2: Access profile without token
  const noTokenResult = await makeRequest('GET', '/auth/profile');
  
  const noTokenRejected = !noTokenResult.success && noTokenResult.status === 401;
  
  logTest(
    'Profile Access without Token Rejection',
    noTokenRejected,
    noTokenRejected ? 
      'Unauthorized access properly rejected' : 
      'Unauthorized access was allowed (should be rejected)',
    noTokenResult.error
  );

  // Test 3: Access profile with invalid token
  const invalidTokenResult = await makeRequest('GET', '/auth/profile', null, {
    'Authorization': 'Bearer invalid-token-here'
  });
  
  const invalidTokenRejected = !invalidTokenResult.success && invalidTokenResult.status === 401;
  
  logTest(
    'Profile Access with Invalid Token Rejection',
    invalidTokenRejected,
    invalidTokenRejected ? 
      'Invalid token properly rejected' : 
      'Invalid token was allowed (should be rejected)',
    invalidTokenResult.error
  );

  return profileSuccess;
}

async function testRefreshToken() {
  logSection('Refresh Token Tests');
  
  // Note: This test depends on having refresh tokens from login/registration
  const refreshToken = testUsers.existingUser.refreshToken || testUsers.newUser.refreshToken;
  
  if (!refreshToken) {
    logTest('Refresh Token Test', false, 'No refresh token available from previous tests');
    return false;
  }

  const refreshResult = await makeRequest('POST', '/auth/refresh', {
    refreshToken: refreshToken
  });
  
  const refreshSuccess = refreshResult.success && 
    refreshResult.data.success && 
    refreshResult.data.accessToken;
    
  logTest(
    'Token Refresh with Valid Refresh Token',
    refreshSuccess,
    refreshSuccess ? 
      'New access token generated successfully' : 
      'Token refresh failed',
    refreshResult.error
  );

  return refreshSuccess;
}

async function runAllTests() {
  console.log('🚀 Starting Comprehensive Authentication Integration Tests'.blue.bold);
  console.log(`Target Server: ${BASE_URL}`.gray);
  console.log(`Test Timeout: ${TIMEOUT}ms`.gray);
  console.log(`Timestamp: ${new Date().toISOString()}`.gray);

  // Run tests in sequence
  const serverHealthy = await testServerHealth();
  
  if (!serverHealthy) {
    console.log('\n❌ Server is not healthy. Aborting tests.'.red.bold);
    return;
  }

  await testUserRegistration();
  await testUserLogin();
  await testTokenAuthentication();
  await testRefreshToken();

  // Print final results
  logSection('Test Results Summary');
  
  const totalTests = testResults.passed + testResults.failed;
  const successRate = totalTests > 0 ? ((testResults.passed / totalTests) * 100).toFixed(1) : 0;
  
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${testResults.passed.toString().green}`);
  console.log(`Failed: ${testResults.failed.toString().red}`);
  console.log(`Success Rate: ${successRate}%`.cyan);
  
  if (testResults.failed === 0) {
    console.log('\n🎉 All tests passed! Authentication system is working correctly.'.green.bold);
  } else {
    console.log('\n⚠️  Some tests failed. Please review the issues above.'.yellow.bold);
    
    // List failed tests
    const failedTests = testResults.tests.filter(test => !test.passed);
    if (failedTests.length > 0) {
      console.log('\nFailed Tests:'.red.bold);
      failedTests.forEach(test => {
        console.log(`  • ${test.name}: ${test.message}`.red);
      });
    }
  }

  console.log('\n' + '='.repeat(50).cyan);
  console.log('Authentication Integration Tests Complete'.cyan.bold);
  console.log('='.repeat(50).cyan);
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message.red);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(error => {
    console.error('❌ Test execution failed:', error.message.red);
    process.exit(1);
  });
}

module.exports = {
  runAllTests,
  testServerHealth,
  testUserRegistration,
  testUserLogin,
  testTokenAuthentication,
  testRefreshToken
};
