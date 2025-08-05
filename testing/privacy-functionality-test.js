const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test configuration
const testConfig = {
  adminCredentials: {
    name: 'Privacy Test Admin',
    email: `privacyadmin${Date.now()}@example.com`,
    password: 'PrivacyAdmin@123',
    location: 'Test Location'
  }
};

let adminToken = null;

const apiRequest = async (method, endpoint, data = {}, token = null) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      data,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      timeout: 10000
    };

    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.response?.data?.error || error.message,
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

const createTestUser = async () => {
  console.log('👤 Creating test user for privacy testing...');
  
  const result = await apiRequest('POST', '/auth/register', testConfig.adminCredentials);
  
  if (result.success && result.data.token) {
    adminToken = result.data.token;
    console.log('✅ Test user created and token obtained');
    return true;
  } else {
    console.log('❌ Test user creation failed:', result.error);
    return false;
  }
};

const testPrivacyPolicy = async () => {
  console.log('\n📋 Testing Privacy Policy Endpoint...');
  
  const result = await apiRequest('GET', '/privacy/policy');
  
  if (result.success) {
    console.log('✅ Privacy policy retrieved successfully');
    console.log('   Policy version:', result.data.version);
    return true;
  } else {
    console.log('❌ Privacy policy retrieval failed:', result.error);
    return false;
  }
};

const testConsentManagement = async () => {
  console.log('\n🎛️ Testing Consent Management...');
  
  if (!adminToken) {
    console.log('❌ No token available for consent testing');
    return false;
  }
  
  // Test getting consent
  const getResult = await apiRequest('GET', '/privacy/consent', {}, adminToken);
  
  if (getResult.success) {
    console.log('✅ User consent retrieved successfully');
    
    // Test updating consent
    const updateResult = await apiRequest('POST', '/privacy/consent', {
      analytics: true,
      marketing: false,
      dataProcessing: true,
      thirdParty: false,
      consentMethod: 'explicit_consent'
    }, adminToken);
    
    if (updateResult.success) {
      console.log('✅ User consent updated successfully');
      return true;
    } else {
      console.log('❌ User consent update failed:', updateResult.error);
      return false;
    }
  } else {
    console.log('❌ User consent retrieval failed:', getResult.error);
    return false;
  }
};

const testPolicyAcceptance = async () => {
  console.log('\n✅ Testing Privacy Policy Acceptance...');
  
  if (!adminToken) {
    console.log('❌ No token available for policy acceptance testing');
    return false;
  }
  
  const result = await apiRequest('POST', '/privacy/accept-policy', {
    version: '1.0'
  }, adminToken);
  
  if (result.success) {
    console.log('✅ Privacy policy acceptance recorded successfully');
    return true;
  } else {
    console.log('❌ Privacy policy acceptance failed:', result.error);
    return false;
  }
};

const testDataExport = async () => {
  console.log('\n📤 Testing Data Export Request...');
  
  if (!adminToken) {
    console.log('❌ No token available for data export testing');
    return false;
  }
  
  const result = await apiRequest('POST', '/privacy/data-export', {}, adminToken);
  
  if (result.success) {
    console.log('✅ Data export request submitted successfully');
    return true;
  } else {
    console.log('❌ Data export request failed:', result.error);
    return false;
  }
};

const testAccountDeletion = async () => {
  console.log('\n⚙️ Testing Account Deletion Request...');
  
  if (!adminToken) {
    console.log('❌ No token available for account deletion testing');
    return false;
  }
  
  const result = await apiRequest('POST', '/privacy/account-deletion', {
    reason: 'Test deletion request for privacy system testing'
  }, adminToken);
  
  if (result.success) {
    console.log('✅ Account deletion request submitted successfully');
    return true;
  } else {
    console.log('❌ Account deletion request failed:', result.error);
    return false;
  }
};

const main = async () => {
  console.log('🧪 PRIVACY FUNCTIONALITY TEST SUITE');
  console.log('====================================');
  
  const tests = [
    { name: 'Test User Creation', fn: createTestUser },
    { name: 'Privacy Policy Endpoint', fn: testPrivacyPolicy },
    { name: 'Consent Management', fn: testConsentManagement },
    { name: 'Policy Acceptance', fn: testPolicyAcceptance },
    { name: 'Data Export Request', fn: testDataExport },
    { name: 'Account Deletion Request', fn: testAccountDeletion }
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
    const duration = result.duration ? ` (${result.duration}ms)` : '';
    console.log(`${status} ${result.name}${duration}`);
  });

  console.log('\n🎯 PRIVACY FUNCTIONALITY TEST COMPLETE');
  
  if (passedTests === tests.length) {
    console.log('🎉 All privacy functionality tests passed!');
    process.exit(0);
  } else {
    console.log('⚠️ Some tests failed. Please review the implementation.');
    process.exit(1);
  }
};

main().catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});
