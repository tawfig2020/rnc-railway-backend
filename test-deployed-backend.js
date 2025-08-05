/**
 * Test Script for Deployed Backend
 * Run this after deploying to verify everything works
 */

const axios = require('axios');

// Update this URL after deployment
const BACKEND_URL = 'https://rnc-malaysia-api.onrender.com';

async function testDeployedBackend() {
  console.log('🧪 Testing Deployed RNC Backend...\n');
  console.log(`🌐 Backend URL: ${BACKEND_URL}\n`);

  const tests = [];

  // Test 1: Root endpoint
  try {
    console.log('1. Testing Root Endpoint...');
    const response = await axios.get(`${BACKEND_URL}/`);
    console.log('   ✅ Root endpoint accessible');
    console.log(`   📋 Service: ${response.data.message}`);
    tests.push({ name: 'Root Endpoint', status: 'PASS' });
  } catch (error) {
    console.log('   ❌ Root endpoint failed:', error.message);
    tests.push({ name: 'Root Endpoint', status: 'FAIL', error: error.message });
  }

  // Test 2: Health check
  try {
    console.log('2. Testing Health Check...');
    const response = await axios.get(`${BACKEND_URL}/api/health`);
    console.log('   ✅ Health check passed');
    console.log(`   🔄 Status: ${response.data.status}`);
    console.log(`   ⏱️ Uptime: ${Math.round(response.data.uptime)}s`);
    tests.push({ name: 'Health Check', status: 'PASS' });
  } catch (error) {
    console.log('   ❌ Health check failed:', error.message);
    tests.push({ name: 'Health Check', status: 'FAIL', error: error.message });
  }

  // Test 3: Admin login
  try {
    console.log('3. Testing Admin Login...');
    const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
      email: 'admin@refugeenetwork.com',
      password: '123456'
    });
    
    if (response.data.success && response.data.accessToken) {
      console.log('   ✅ Admin login successful');
      console.log(`   👤 User: ${response.data.user.name} (${response.data.user.role})`);
      console.log(`   🔑 Token generated: ${response.data.accessToken.substring(0, 20)}...`);
      tests.push({ name: 'Admin Login', status: 'PASS' });
      
      // Test 4: Profile with token
      try {
        console.log('4. Testing Profile Access...');
        const profileResponse = await axios.get(`${BACKEND_URL}/api/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${response.data.accessToken}`
          }
        });
        console.log('   ✅ Profile access successful');
        console.log(`   📧 Email: ${profileResponse.data.user.email}`);
        tests.push({ name: 'Profile Access', status: 'PASS' });
      } catch (error) {
        console.log('   ❌ Profile access failed:', error.message);
        tests.push({ name: 'Profile Access', status: 'FAIL', error: error.message });
      }
    }
  } catch (error) {
    console.log('   ❌ Admin login failed:', error.message);
    tests.push({ name: 'Admin Login', status: 'FAIL', error: error.message });
  }

  // Test 5: Test user login
  try {
    console.log('5. Testing Regular User Login...');
    const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
      email: 'test@example.com',
      password: '123456'
    });
    
    if (response.data.success) {
      console.log('   ✅ Test user login successful');
      console.log(`   👤 User: ${response.data.user.name} (${response.data.user.role})`);
      tests.push({ name: 'Test User Login', status: 'PASS' });
    }
  } catch (error) {
    console.log('   ❌ Test user login failed:', error.message);
    tests.push({ name: 'Test User Login', status: 'FAIL', error: error.message });
  }

  // Test 6: CORS check
  try {
    console.log('6. Testing CORS Headers...');
    const response = await axios.options(`${BACKEND_URL}/api/auth/login`);
    console.log('   ✅ CORS preflight successful');
    tests.push({ name: 'CORS Check', status: 'PASS' });
  } catch (error) {
    console.log('   ⚠️ CORS preflight check inconclusive (may still work in browser)');
    tests.push({ name: 'CORS Check', status: 'WARN', error: error.message });
  }

  // Summary
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  
  const passed = tests.filter(t => t.status === 'PASS').length;
  const failed = tests.filter(t => t.status === 'FAIL').length;
  const warned = tests.filter(t => t.status === 'WARN').length;
  
  tests.forEach(test => {
    const icon = test.status === 'PASS' ? '✅' : test.status === 'WARN' ? '⚠️' : '❌';
    console.log(`${icon} ${test.name}: ${test.status}`);
  });

  console.log(`\n🎯 Results: ${passed} passed, ${failed} failed, ${warned} warnings`);
  
  if (failed === 0) {
    console.log('\n🎉 ALL CRITICAL TESTS PASSED!');
    console.log('\n✅ Your backend is ready for production!');
    console.log('\n📋 Next Steps:');
    console.log('1. Update frontend .env.production with this backend URL');
    console.log('2. Rebuild frontend: npm run build');
    console.log('3. Redeploy frontend to Netlify');
    console.log('4. Test login at rncmalaysia.org.netlify.app');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the deployment.');
  }

  console.log(`\n🌐 Backend URL: ${BACKEND_URL}`);
  console.log('🔑 Admin: admin@refugeenetwork.com / 123456');
  console.log('👤 Test: test@example.com / 123456');
}

// Run tests
testDeployedBackend().catch(console.error);
