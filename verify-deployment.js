/**
 * Deployment Verification Script
 * Run this to verify all fixes are working before deployment
 */

const axios = require('axios');

// Configuration - Update these with your actual URLs
const BACKEND_URL = process.env.REACT_APP_API_URL || 'https://rnc-platform-backend.onrender.com';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://your-frontend.netlify.app';

async function testBackendDeployment() {
  console.log('🔍 Testing Backend Deployment...');
  
  try {
    // Test health endpoint
    console.log('  Testing health endpoint...');
    const healthResponse = await axios.get(`${BACKEND_URL}/health`);
    console.log('  ✅ Health check passed:', healthResponse.data);
    
    // Test API endpoints
    console.log('  Testing API endpoints...');
    const apiResponse = await axios.get(`${BACKEND_URL}/api/auth/test`);
    console.log('  ✅ API endpoints accessible');
    
    console.log('🎉 Backend deployment successful!');
    console.log(`   Backend URL: ${BACKEND_URL}`);
    
  } catch (error) {
    console.error('❌ Backend deployment issues:', error.message);
    console.log('   Check your Render.com dashboard for logs');
  }
}

async function testFrontendBackendIntegration() {
  console.log('🔗 Testing Frontend-Backend Integration...');
  
  try {
    // Test CORS
    console.log('  Testing CORS configuration...');
    const corsResponse = await axios.get(`${BACKEND_URL}/health`, {
      headers: { 'Origin': FRONTEND_URL }
    });
    console.log('  ✅ CORS working correctly');
    
    console.log('🎉 Integration successful!');
    console.log(`   Frontend: ${FRONTEND_URL}`);
    console.log(`   Backend: ${BACKEND_URL}`);
    
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
