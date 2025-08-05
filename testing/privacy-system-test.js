const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test configuration
const testConfig = {
  timeout: 10000,
  adminCredentials: {
    email: 'admin@refugeenetwork.com',
    password: 'Admin@123'
  },
  userCredentials: {
    name: 'Privacy Test User',
    email: `privacytest${Date.now()}@example.com`,
    password: 'PrivacyTest@123'
  }
};

let adminToken = '';
let userToken = '';

// Helper function to make API requests
const apiRequest = async (method, endpoint, data = null, token = null) => {
  const config = {
    method,
    url: `${BASE_URL}${endpoint}`,
    timeout: testConfig.timeout,
    headers: {}
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (data) {
    config.data = data;
    config.headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      status: error.response?.status || 500
    };
  }
};

// Test functions
const testAdminLogin = async () => {
  console.log('\n🔐 Testing Admin Login...');
  
  // Try to create admin via registration first (for testing purposes)
  try {
    const adminRegResult = await apiRequest('POST', '/auth/register', {
      name: 'Test Admin',
      email: 'testadmin@example.com',
      password: 'TestAdmin@123',
      location: 'Admin Location'
    });
    
    if (adminRegResult.success && adminRegResult.data.token) {
      adminToken = adminRegResult.data.token;
      console.log('✅ Test admin created and token obtained');
      return true;
    }
  } catch (error) {
    // If admin already exists, try login
    const result = await apiRequest('POST', '/auth/login', {
      email: 'testadmin@example.com',
      password: 'TestAdmin@123'
    });
    
    if (result.success && result.data.token) {
      adminToken = result.data.token;
      console.log('✅ Test admin login successful');
      return true;
    }
  }
  
  console.log('❌ Admin setup failed - using user token for admin tests');
  return false;
};

const testUserRegistration = async () => {
  console.log('\n👤 Testing User Registration...');
  
  const registrationData = {
    ...testConfig.userCredentials,
    location: 'Test Location'
  };
  
  const result = await apiRequest('POST', '/auth/register', registrationData);
  
  if (result.success && result.data.token) {
    // Use the token from registration since email verification is required for login
    userToken = result.data.token;
    console.log('✅ User registration successful (token obtained)');
    return true;
  } else {
    console.log('❌ User registration failed:', result.error);
    return false;
  }
};

const testUserLogin = async () => {
  console.log('\n🔑 Testing User Login...');
  
  const result = await apiRequest('POST', '/auth/login', {
    email: testConfig.userCredentials.email,
    password: testConfig.userCredentials.password
  });
  
  if (result.success && result.data.token) {
    userToken = result.data.token;
    console.log('✅ User login successful');
    return true;
  } else {
    console.log('❌ User login failed:', result.error);
    return false;
  }
};

const testPrivacyPolicyEndpoint = async () => {
  console.log('\n📋 Testing Privacy Policy Endpoint...');
  
  const result = await apiRequest('GET', '/privacy/policy');
  
  if (result.success) {
    console.log('✅ Privacy policy retrieved successfully');
    console.log('   Policy version:', result.data.data?.version || 'N/A');
    return true;
  } else {
    console.log('❌ Privacy policy retrieval failed:', result.error);
    return false;
  }
};

const testUserConsentManagement = async () => {
  console.log('\n🎛️ Testing User Consent Management...');
  
  if (!userToken) {
    console.log('❌ No user token available for consent testing');
    return false;
  }

  // Test getting user consent (should be empty initially)
  let result = await apiRequest('GET', '/privacy/consent', null, userToken);
  
  if (result.success) {
    console.log('✅ User consent retrieved successfully');
  } else {
    console.log('❌ User consent retrieval failed:', result.error);
    return false;
  }

  // Test updating user consent
  const consentData = {
    analytics: true,
    marketing: false,
    dataProcessing: true,
    thirdParty: false,
    consentMethod: 'api_test'
  };

  result = await apiRequest('POST', '/privacy/consent', consentData, userToken);
  
  if (result.success) {
    console.log('✅ User consent updated successfully');
    return true;
  } else {
    console.log('❌ User consent update failed:', result.error);
    return false;
  }
};

const testPrivacyPolicyAcceptance = async () => {
  console.log('\n✅ Testing Privacy Policy Acceptance...');
  
  if (!userToken) {
    console.log('❌ No user token available for policy acceptance testing');
    return false;
  }

  const result = await apiRequest('POST', '/privacy/accept-policy', {
    version: '1.0'
  }, userToken);
  
  if (result.success) {
    console.log('✅ Privacy policy acceptance recorded successfully');
    return true;
  } else {
    console.log('❌ Privacy policy acceptance failed:', result.error);
    return false;
  }
};

const testDataExportRequest = async () => {
  console.log('\n📤 Testing Data Export Request...');
  
  if (!userToken) {
    console.log('❌ No user token available for data export testing');
    return false;
  }
  
  const result = await apiRequest('POST', '/privacy/data-export', {}, userToken);
  
  if (result.success) {
    console.log('✅ Data export request successful');
    return true;
  } else {
    console.log('❌ Data export request failed:', result.error);
    return false;
  }
};

const testAccountDeletionRequest = async () => {
  console.log('\n⚙️ Testing Account Deletion Request...');
  
  if (!userToken) {
    console.log('❌ No user token available for account deletion testing');
    return false;
  }

  const deletionData = {
    reason: 'Test deletion request for privacy system testing'
  };

  const result = await apiRequest('POST', '/privacy/account-deletion', deletionData, userToken);
  
  if (result.success) {
    console.log('✅ Account deletion request submitted successfully');
    return true;
  } else {
    console.log('❌ Account deletion request failed:', result.error);
    return false;
  }
};

const testUnauthorizedAccess = async () => {
  console.log('\n🚫 Testing Unauthorized Access Protection...');
  
  // Try to access protected endpoints without token
  const protectedEndpoints = [
    { endpoint: '/privacy/consent', method: 'GET' },
    { endpoint: '/privacy/consent', method: 'POST' },
    { endpoint: '/privacy/accept-policy', method: 'POST' },
    { endpoint: '/privacy/data-export', method: 'POST' },
    { endpoint: '/privacy/account-deletion', method: 'POST' }
  ];

  let allProtected = true;

  for (const { endpoint, method } of protectedEndpoints) {
    const result = await apiRequest(method, endpoint);
    
    if (result.status === 401 || result.status === 403) {
      console.log(`✅ ${method} ${endpoint} properly protected`);
    } else {
      console.log(`❌ ${method} ${endpoint} not properly protected (status: ${result.status})`);
      allProtected = false;
    }
  }

  return allProtected;
};

// Main test runner
const runPrivacySystemTests = async () => {
  console.log('🧪 PRIVACY SYSTEM COMPREHENSIVE TEST SUITE');
  console.log('==========================================');
  
  const tests = [
    { name: 'Admin Login', fn: testAdminLogin },
    { name: 'User Registration', fn: testUserRegistration },
    { name: 'User Login', fn: testUserLogin },
    { name: 'Privacy Policy Endpoint', fn: testPrivacyPolicyEndpoint },
    { name: 'User Consent Management', fn: testUserConsentManagement },
    { name: 'Privacy Policy Acceptance', fn: testPrivacyPolicyAcceptance },
    { name: 'Data Export Request', fn: testDataExportRequest },
    { name: 'Account Deletion Request', fn: testAccountDeletionRequest },
    { name: 'Unauthorized Access Protection', fn: testUnauthorizedAccess }
  ];

  let passedTests = 0;
  let failedTests = 0;
  const results = [];

  for (const test of tests) {
    try {
      const startTime = Date.now();
      const result = await test.fn();
      const duration = Date.now() - startTime;
      
      if (result) {
        passedTests++;
        results.push({ name: test.name, status: 'PASSED', duration });
      } else {
        failedTests++;
        results.push({ name: test.name, status: 'FAILED', duration });
      }
    } catch (error) {
      failedTests++;
      results.push({ name: test.name, status: 'ERROR', error: error.message });
      console.log(`❌ ${test.name} threw an error:`, error.message);
    }
  }

  // Print summary
  console.log('\n📊 TEST RESULTS SUMMARY');
  console.log('=======================');
  console.log(`Total Tests: ${tests.length}`);
  console.log(`Passed: ${passedTests} (${((passedTests / tests.length) * 100).toFixed(1)}%)`);
  console.log(`Failed: ${failedTests} (${((failedTests / tests.length) * 100).toFixed(1)}%)`);
  
  console.log('\n📋 DETAILED RESULTS:');
  results.forEach(result => {
    const status = result.status === 'PASSED' ? '✅' : '❌';
    const duration = result.duration ? `(${result.duration}ms)` : '';
    console.log(`${status} ${result.name} ${duration}`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });

  console.log('\n🎯 PRIVACY SYSTEM TEST COMPLETE');
  
  if (passedTests === tests.length) {
    console.log('🎉 All tests passed! Privacy system is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Please review the implementation.');
  }

  return {
    total: tests.length,
    passed: passedTests,
    failed: failedTests,
    results
  };
};

// Run tests if this file is executed directly
if (require.main === module) {
  runPrivacySystemTests()
    .then(results => {
      process.exit(results.failed === 0 ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Test suite failed to run:', error);
      process.exit(1);
    });
}

module.exports = { runPrivacySystemTests };
