#!/usr/bin/env node

/**
 * Comprehensive Deployment Fix Script
 * Diagnoses and fixes all deployment issues
 */

const axios = require('axios');

console.log('🔧 RNC Platform Deployment Diagnostic & Fix');
console.log('='.repeat(50));

const BACKEND_URLS_TO_TEST = [
  'https://rncplatform-8nt9.onrender.com',
  'https://rnc-malaysia-api.onrender.com',
  'https://rncplatform.onrender.com'
];

async function testBackendUrl(url) {
  console.log(`\n🌐 Testing: ${url}`);
  
  try {
    // Test health endpoint
    const healthResponse = await axios.get(`${url}/health`, { timeout: 15000 });
    console.log(`   ✅ Health: ${healthResponse.status} - ${healthResponse.data.message}`);
    
    // Test API root
    const apiResponse = await axios.get(`${url}/api`, { timeout: 10000 });
    console.log(`   ✅ API Root: ${apiResponse.status}`);
    
    // Test login endpoint with mock credentials
    try {
      const loginResponse = await axios.post(`${url}/api/auth/login`, {
        email: 'admin@refugeenetwork.com',
        password: '123456'
      }, { timeout: 10000 });
      console.log(`   ✅ Login: ${loginResponse.status} - Working!`);
      return { url, status: 'WORKING', details: loginResponse.data };
    } catch (loginError) {
      if (loginError.response) {
        console.log(`   ⚠️ Login: ${loginError.response.status} - ${loginError.response.data.message || 'Auth endpoint accessible'}`);
        return { url, status: 'PARTIAL', details: 'Auth endpoint accessible but credentials may need verification' };
      } else {
        console.log(`   ❌ Login: Network error`);
        return { url, status: 'FAILED', details: 'Network error on auth endpoint' };
      }
    }
    
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.log(`   ⏰ Timeout: Service may be sleeping (Render free tier)`);
      return { url, status: 'SLEEPING', details: 'Service appears to be sleeping' };
    } else if (error.response && error.response.status === 404) {
      console.log(`   ❌ 404: Service not found at this URL`);
      return { url, status: 'NOT_FOUND', details: '404 - Service not deployed at this URL' };
    } else {
      console.log(`   ❌ Error: ${error.message}`);
      return { url, status: 'ERROR', details: error.message };
    }
  }
}

async function main() {
  console.log('\n🔍 STEP 1: Testing all possible backend URLs...');
  
  const results = [];
  
  for (const url of BACKEND_URLS_TO_TEST) {
    const result = await testBackendUrl(url);
    results.push(result);
    
    // Add delay between requests to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n📊 RESULTS SUMMARY:');
  console.log('='.repeat(30));
  
  let workingUrl = null;
  let sleepingUrl = null;
  
  results.forEach(result => {
    console.log(`${result.url}: ${result.status}`);
    if (result.status === 'WORKING') {
      workingUrl = result.url;
    } else if (result.status === 'SLEEPING') {
      sleepingUrl = result.url;
    }
  });
  
  if (workingUrl) {
    console.log(`\n✅ WORKING BACKEND FOUND: ${workingUrl}`);
    console.log('\n🎯 NEXT STEPS:');
    console.log('1. Update frontend .env.production with this URL');
    console.log('2. Rebuild frontend');
    console.log('3. Deploy to Netlify');
    
    return workingUrl;
  } else if (sleepingUrl) {
    console.log(`\n⏰ BACKEND IS SLEEPING: ${sleepingUrl}`);
    console.log('\n🎯 SOLUTION:');
    console.log('1. Visit the URL in your browser to wake it up');
    console.log('2. Wait 30-60 seconds for the service to start');
    console.log('3. Try the login again');
    
    return sleepingUrl;
  } else {
    console.log('\n❌ NO WORKING BACKEND FOUND');
    console.log('\n🎯 SOLUTIONS:');
    console.log('1. Check your Render dashboard for the correct URL');
    console.log('2. Verify the deployment completed successfully');
    console.log('3. Check Render logs for deployment errors');
    console.log('4. Redeploy the backend service');
    
    return null;
  }
}

main().catch(console.error);
