/**
 * Comprehensive Authentication Integration Tests
 * Tests registration, login, token refresh, and admin access
 */

const axios = require('axios');
const colors = require('colors');

// Test configuration
const BASE_URL = 'http://localhost:5000';
const API_URL = `${BASE_URL}/api`;

// Test timeout
const TIMEOUT = 10000;

// Test user data
const testUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'testuser@example.com',
  password: 'testpass123',
  location: 'Test City'
};

const adminUser = {
  email: 'admin@refugeenetwork.com',
  password: '123456'
};

const existingUser = {
  email: 'test@example.com',
  password: '123456'
};

// Test results tracking
let testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

// Helper function to log test results
function logTest(testName, passed, message = '') {
  const status = passed ? '✅ PASS'.green : '❌ FAIL'.red;
  console.log(`${status} ${testName}`);
  if (message) {
    console.log(`   ${message}`);
  }
  
  testResults.tests.push({ name: testName, passed, message });
  if (passed) {
    testResults.passed++;
  } else {
    testResults.failed++;
  }
}

// Helper function to make API requests with error handling
async function makeRequest(method, url, data = null, headers = {}) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
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
      error: error.response ? error.response.data : error.message,
      status: error.response ? error.response.status : 0
    };
  }
}

// Test 1: Server connectivity
async function testServerConnectivity() {
  console.log('\n🔍 Testing Server Connectivity...'.cyan);
  
  try {
    const response = await axios.get(`${BASE_URL.replace('/api', '')}/health`);
    logTest('Server Health Check', response.status === 200, 'Server is running and accessible');
  } catch (error) {
    // Try basic server connection
    try {
      const response = await axios.get(BASE_URL.replace('/api', ''));
      logTest('Server Basic Connection', true, 'Server is running (no health endpoint)');
    } catch (err) {
      logTest('Server Basic Connection', false, `Server not accessible: ${err.message}`);
    }
  }
}

// Test 2: User Registration
async function testUserRegistration() {
  console.log('\n📝 Testing User Registration...'.cyan);
  
  const result = await makeRequest('POST', '/auth/register', TEST_USER);
  
  if (result.success) {
    logTest('User Registration', true, 'User registered successfully');
    return result.data;
  } else {
    logTest('User Registration', false, `Registration failed: ${JSON.stringify(result.error)}`);
    return null;
  }
}

// Test 3: User Login
async function testUserLogin() {
  console.log('\n🔐 Testing User Login...'.cyan);
  
  const loginData = {
    email: TEST_USER.email,
    password: TEST_USER.password
  };
  
  const result = await makeRequest('POST', '/auth/login', loginData);
  
  if (result.success && result.data.accessToken) {
    logTest('User Login', true, 'Login successful with access token');
    return {
      accessToken: result.data.accessToken,
      refreshToken: result.data.refreshToken,
      user: result.data.user
    };
  } else {
    logTest('User Login', false, `Login failed: ${JSON.stringify(result.error)}`);
    return null;
  }
}

// Test 4: Protected Route Access
async function testProtectedRouteAccess(accessToken) {
  console.log('\n🛡️ Testing Protected Route Access...'.cyan);
  
  if (!accessToken) {
    logTest('Protected Route Access', false, 'No access token available');
    return;
  }
  
  const result = await makeRequest('GET', '/auth/me', null, {
    'x-auth-token': accessToken
  });
  
  if (result.success) {
    logTest('Protected Route Access', true, 'Successfully accessed protected route');
  } else {
    logTest('Protected Route Access', false, `Protected route failed: ${JSON.stringify(result.error)}`);
  }
}

// Test 5: Token Refresh
async function testTokenRefresh(refreshToken) {
  console.log('\n🔄 Testing Token Refresh...'.cyan);
  
  if (!refreshToken) {
    logTest('Token Refresh', false, 'No refresh token available');
    return null;
  }
  
  const result = await makeRequest('POST', '/auth/refresh-token', {
    refreshToken: refreshToken
  });
  
  if (result.success && result.data.accessToken) {
    logTest('Token Refresh', true, 'Token refreshed successfully');
    return result.data.accessToken;
  } else {
    logTest('Token Refresh', false, `Token refresh failed: ${JSON.stringify(result.error)}`);
    return null;
  }
}

// Test 6: Admin Login
async function testAdminLogin() {
  console.log('\n👑 Testing Admin Login...'.cyan);
  
  const result = await makeRequest('POST', '/auth/login', ADMIN_USER);
  
  if (result.success && result.data.accessToken) {
    const isAdmin = result.data.user && result.data.user.role === 'admin';
    logTest('Admin Login', isAdmin, isAdmin ? 'Admin login successful' : 'Login successful but not admin role');
    return isAdmin ? {
      accessToken: result.data.accessToken,
      user: result.data.user
    } : null;
  } else {
    logTest('Admin Login', false, `Admin login failed: ${JSON.stringify(result.error)}`);
    return null;
  }
}

// Test 7: Community Projects API (Admin)
async function testCommunityProjectsAPI(adminToken) {
  console.log('\n🏘️ Testing Community Projects API...'.cyan);
  
  if (!adminToken) {
    logTest('Community Projects API', false, 'No admin token available');
    return;
  }
  
  const result = await makeRequest('GET', '/campaigns', null, {
    'x-auth-token': adminToken
  });
  
  if (result.success) {
    const hasData = result.data && (result.data.campaigns || Array.isArray(result.data));
    logTest('Community Projects API', hasData, hasData ? 'Successfully fetched campaigns/projects' : 'API responded but no data structure');
  } else {
    logTest('Community Projects API', false, `Community projects API failed: ${JSON.stringify(result.error)}`);
  }
}

// Test 8: Invalid Login Attempts
async function testInvalidLogin() {
  console.log('\n🚫 Testing Invalid Login Attempts...'.cyan);
  
  // Test with wrong password
  const wrongPasswordResult = await makeRequest('POST', '/auth/login', {
    email: TEST_USER.email,
    password: 'wrongpassword'
  });
  
  const wrongPasswordBlocked = !wrongPasswordResult.success && wrongPasswordResult.status === 400;
  logTest('Invalid Password Block', wrongPasswordBlocked, wrongPasswordBlocked ? 'Invalid password correctly blocked' : 'Invalid password not blocked');
  
  // Test with non-existent email
  const wrongEmailResult = await makeRequest('POST', '/auth/login', {
    email: 'nonexistent@example.com',
    password: 'anypassword'
  });
  
  const wrongEmailBlocked = !wrongEmailResult.success && wrongEmailResult.status === 400;
  logTest('Invalid Email Block', wrongEmailBlocked, wrongEmailBlocked ? 'Invalid email correctly blocked' : 'Invalid email not blocked');
}

// Test 9: Registration Validation
async function testRegistrationValidation() {
  console.log('\n✅ Testing Registration Validation...'.cyan);
  
  // Test with missing required fields
  const incompleteResult = await makeRequest('POST', '/auth/register', {
    email: 'incomplete@example.com'
    // Missing name, password, location
  });
  
  const validationWorks = !incompleteResult.success && incompleteResult.status === 400;
  logTest('Registration Validation', validationWorks, validationWorks ? 'Validation correctly blocks incomplete data' : 'Validation not working');
  
  // Test with duplicate email
  const duplicateResult = await makeRequest('POST', '/auth/register', TEST_USER);
  const duplicateBlocked = !duplicateResult.success && duplicateResult.status === 400;
  logTest('Duplicate Email Block', duplicateBlocked, duplicateBlocked ? 'Duplicate email correctly blocked' : 'Duplicate email not blocked');
}

// Main test runner
async function runAllTests() {
  console.log('🧪 Starting Comprehensive Authentication Tests'.yellow.bold);
  console.log('='.repeat(50).yellow);
  
  try {
    // Run all tests in sequence
    await testServerConnectivity();
    
    const registrationResult = await testUserRegistration();
    
    const loginResult = await testUserLogin();
    if (loginResult) {
      await testProtectedRouteAccess(loginResult.accessToken);
      await testTokenRefresh(loginResult.refreshToken);
    }
    
    const adminResult = await testAdminLogin();
    if (adminResult) {
      await testCommunityProjectsAPI(adminResult.accessToken);
    }
    
    await testInvalidLogin();
    await testRegistrationValidation();
    
  } catch (error) {
    console.error('Test runner error:', error);
  }
  
  // Print summary
  console.log('\n' + '='.repeat(50).yellow);
  console.log('📊 Test Summary'.yellow.bold);
  console.log(`✅ Passed: ${testResults.passed}`.green);
  console.log(`❌ Failed: ${testResults.failed}`.red);
  console.log(`📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);
  
  if (testResults.failed > 0) {
    console.log('\n❌ Failed Tests:'.red.bold);
    testResults.tests.filter(t => !t.passed).forEach(test => {
      console.log(`   • ${test.name}: ${test.message}`.red);
    });
  }
  
  console.log('\n🏁 Tests completed!'.yellow.bold);
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  runAllTests,
  testResults,
  TEST_USER,
  ADMIN_USER
};
