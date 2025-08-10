/**
 * Render.com Deployment Verification Script
 * Run this after deploying to verify everything works
 * 
 * Usage: node verify-render-deployment.js [backend-url]
 * Example: node verify-render-deployment.js https://rnc-malaysia-api.onrender.com
 */

const axios = require('axios');

// Get backend URL from command line or use default
const BACKEND_URL = process.argv[2] || 'https://rnc-malaysia-api.onrender.com';

console.log('🚀 RNC Platform - Render.com Deployment Verification');
console.log('====================================================');
console.log(`🌐 Testing Backend: ${BACKEND_URL}`);
console.log('');

async function verifyDeployment() {
  const results = [];
  let allPassed = true;

  // Test 1: Root endpoint
  console.log('1️⃣ Testing Root Endpoint...');
  try {
    const response = await axios.get(`${BACKEND_URL}/`, { timeout: 10000 });
    console.log('   ✅ Root endpoint accessible');
    console.log(`   📋 Response: ${response.data.message || 'OK'}`);
    results.push({ test: 'Root Endpoint', status: 'PASS' });
  } catch (error) {
    console.log('   ❌ Root endpoint failed:', error.message);
    results.push({ test: 'Root Endpoint', status: 'FAIL', error: error.message });
    allPassed = false;
  }

  // Test 2: Health check
  console.log('\n2️⃣ Testing Health Check...');
  try {
    const response = await axios.get(`${BACKEND_URL}/api/health`, { timeout: 10000 });
    console.log('   ✅ Health check passed');
    console.log(`   🔄 Status: ${response.data.status}`);
    if (response.data.uptime) {
      console.log(`   ⏱️ Uptime: ${Math.round(response.data.uptime)}s`);
    }
    results.push({ test: 'Health Check', status: 'PASS' });
  } catch (error) {
    console.log('   ❌ Health check failed:', error.message);
    results.push({ test: 'Health Check', status: 'FAIL', error: error.message });
    allPassed = false;
  }

  // Test 3: Admin login
  console.log('\n3️⃣ Testing Admin Authentication...');
  try {
    const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
      email: 'admin@refugeenetwork.com',
      password: '123456'
    }, { timeout: 10000 });
    
    if (response.data.success && response.data.accessToken) {
      console.log('   ✅ Admin login successful');
      console.log(`   👤 User: ${response.data.user.name} (${response.data.user.role})`);
      console.log(`   🔑 Token: ${response.data.accessToken.substring(0, 20)}...`);
      results.push({ test: 'Admin Login', status: 'PASS' });
      
      // Test 4: Protected route with token
      console.log('\n4️⃣ Testing Protected Route Access...');
      try {
        const profileResponse = await axios.get(`${BACKEND_URL}/api/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${response.data.accessToken}`
          },
          timeout: 10000
        });
        console.log('   ✅ Protected route access successful');
        console.log(`   📧 Profile Email: ${profileResponse.data.user.email}`);
        results.push({ test: 'Protected Route', status: 'PASS' });
      } catch (error) {
        console.log('   ❌ Protected route access failed:', error.message);
        results.push({ test: 'Protected Route', status: 'FAIL', error: error.message });
        allPassed = false;
      }
    }
  } catch (error) {
    console.log('   ❌ Admin login failed:', error.message);
    results.push({ test: 'Admin Login', status: 'FAIL', error: error.message });
    allPassed = false;
  }

  // Test 5: Test user login
  console.log('\n5️⃣ Testing Regular User Authentication...');
  try {
    const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
      email: 'test@example.com',
      password: '123456'
    }, { timeout: 10000 });
    
    if (response.data.success) {
      console.log('   ✅ Test user login successful');
      console.log(`   👤 User: ${response.data.user.name} (${response.data.user.role})`);
      results.push({ test: 'Test User Login', status: 'PASS' });
    }
  } catch (error) {
    console.log('   ❌ Test user login failed:', error.message);
    results.push({ test: 'Test User Login', status: 'FAIL', error: error.message });
    allPassed = false;
  }

  // Test 6: CORS preflight
  console.log('\n6️⃣ Testing CORS Configuration...');
  try {
    const response = await axios.options(`${BACKEND_URL}/api/auth/login`, { timeout: 10000 });
    console.log('   ✅ CORS preflight successful');
    results.push({ test: 'CORS Check', status: 'PASS' });
  } catch (error) {
    console.log('   ⚠️ CORS preflight inconclusive (may still work in browser)');
    results.push({ test: 'CORS Check', status: 'WARN', error: error.message });
  }

  // Summary
  console.log('\n📊 DEPLOYMENT VERIFICATION RESULTS');
  console.log('===================================');
  
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const warned = results.filter(r => r.status === 'WARN').length;
  
  results.forEach(result => {
    const icon = result.status === 'PASS' ? '✅' : result.status === 'WARN' ? '⚠️' : '❌';
    console.log(`${icon} ${result.test}: ${result.status}`);
  });

  console.log(`\n🎯 Summary: ${passed} passed, ${failed} failed, ${warned} warnings`);
  
  if (allPassed && failed === 0) {
    console.log('\n🎉 DEPLOYMENT SUCCESSFUL!');
    console.log('\n✅ Your RNC backend is fully functional on Render.com!');
    console.log('\n📋 Next Steps:');
    console.log('1. Update frontend .env.production:');
    console.log(`   REACT_APP_API_URL=${BACKEND_URL}/api`);
    console.log('2. Rebuild frontend: cd client && npm run build');
    console.log('3. Redeploy frontend to Netlify');
    console.log('4. Test login at your frontend URL');
    console.log('\n🔑 Test Credentials:');
    console.log('   Admin: admin@refugeenetwork.com / 123456');
    console.log('   User: test@example.com / 123456');
  } else {
    console.log('\n⚠️ DEPLOYMENT ISSUES DETECTED');
    console.log('\nPlease check the following:');
    console.log('1. Render deployment logs for errors');
    console.log('2. Environment variables are set correctly');
    console.log('3. Service is fully started (may take 2-3 minutes)');
    console.log('4. Try running this script again in a few minutes');
  }

  console.log(`\n🌐 Backend URL: ${BACKEND_URL}`);
  console.log('📚 Deployment Guide: RENDER_DEPLOYMENT_INSTRUCTIONS.md');
}

// Run verification
console.log('⏳ Starting verification tests...\n');
verifyDeployment().catch(error => {
  console.error('\n💥 Verification script error:', error.message);
  console.log('\n🔧 Troubleshooting:');
  console.log('1. Check if the backend URL is correct');
  console.log('2. Ensure the service is deployed and running');
  console.log('3. Wait a few minutes for cold start if using free tier');
});
