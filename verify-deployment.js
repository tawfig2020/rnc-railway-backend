/**
 * Deployment Verification Script
 * Run this to verify all fixes are working before deployment
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000';
const FRONTEND_URL = 'http://localhost:3000';

async function verifyDeployment() {
  console.log('🔍 Verifying RNC Platform Deployment Readiness...\n');
  
  const results = {
    backend: false,
    frontend: false,
    auth: false,
    build: false
  };

  // 1. Check Backend Health
  try {
    console.log('1. Checking Backend Health...');
    const response = await axios.get(`${BASE_URL}/api/health`);
    if (response.data.status === 'OK') {
      console.log('   ✅ Backend is healthy');
      results.backend = true;
    }
  } catch (error) {
    console.log('   ❌ Backend health check failed:', error.message);
  }

  // 2. Check Frontend Build
  try {
    console.log('2. Checking Frontend Build...');
    const buildPath = path.join(__dirname, 'client', 'build', 'index.html');
    if (fs.existsSync(buildPath)) {
      const buildStats = fs.statSync(buildPath);
      console.log('   ✅ Build folder exists');
      console.log(`   📁 Build date: ${buildStats.mtime.toISOString()}`);
      results.build = true;
    } else {
      console.log('   ❌ Build folder not found');
    }
  } catch (error) {
    console.log('   ❌ Build check failed:', error.message);
  }

  // 3. Test Authentication
  try {
    console.log('3. Testing Authentication...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'admin@refugeenetwork.com',
      password: '123456'
    });
    
    if (loginResponse.data.success && loginResponse.data.accessToken) {
      console.log('   ✅ Admin login working');
      console.log('   🔑 JWT token generated successfully');
      results.auth = true;
    }
  } catch (error) {
    console.log('   ❌ Authentication test failed:', error.message);
  }

  // 4. Check Frontend Accessibility
  try {
    console.log('4. Checking Frontend Accessibility...');
    const frontendResponse = await axios.get(FRONTEND_URL);
    if (frontendResponse.status === 200 && frontendResponse.data.includes('RNC Platform')) {
      console.log('   ✅ Frontend is accessible');
      results.frontend = true;
    }
  } catch (error) {
    console.log('   ❌ Frontend accessibility check failed:', error.message);
  }

  // Summary
  console.log('\n📊 Deployment Readiness Summary:');
  console.log('================================');
  console.log(`Backend Health:     ${results.backend ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Frontend Build:     ${results.build ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Authentication:     ${results.auth ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Frontend Access:    ${results.frontend ? '✅ PASS' : '❌ FAIL'}`);

  const passCount = Object.values(results).filter(Boolean).length;
  const totalCount = Object.keys(results).length;
  
  console.log(`\n🎯 Overall Score: ${passCount}/${totalCount} (${Math.round(passCount/totalCount*100)}%)`);
  
  if (passCount === totalCount) {
    console.log('\n🎉 ALL CHECKS PASSED! Ready for deployment! 🚀');
    console.log('\n📋 Next Steps:');
    console.log('1. Upload client/build/ folder to your hosting provider');
    console.log('2. Set REACT_APP_API_URL environment variable');
    console.log('3. Test with admin credentials: admin@refugeenetwork.com / 123456');
  } else {
    console.log('\n⚠️  Some checks failed. Please review the issues above.');
  }
}

// Run verification
verifyDeployment().catch(console.error);
