#!/usr/bin/env node

/**
 * Backend Connection Tester
 * Tests the actual backend deployment and identifies mock vs real mode
 */

const axios = require('axios');

const BACKEND_URL = 'https://rncplatform.onrender.com';

async function testBackendConnection() {
  console.log('🔍 Testing Backend Connection Status');
  console.log('='.repeat(40));
  
  try {
    // Test 1: Health check
    console.log('\n1️⃣ Testing Health Endpoint...');
    const healthResponse = await axios.get(`${BACKEND_URL}/health`, { timeout: 15000 });
    console.log(`   ✅ Health: ${healthResponse.status}`);
    console.log(`   📊 Environment: ${healthResponse.data.environment}`);
    console.log(`   🕐 Timestamp: ${healthResponse.data.timestamp}`);
    
    // Test 2: API root endpoint
    console.log('\n2️⃣ Testing API Root...');
    try {
      const apiResponse = await axios.get(`${BACKEND_URL}/api`, { timeout: 10000 });
      console.log(`   ✅ API Root: ${apiResponse.status}`);
      console.log(`   📝 Message: ${apiResponse.data.message}`);
      
      // Check if it's mock mode
      if (apiResponse.data.message && apiResponse.data.message.includes('Mock Mode')) {
        console.log('   ⚠️ BACKEND IS IN MOCK MODE!');
        return 'MOCK_MODE';
      } else {
        console.log('   ✅ Backend is in REAL DATABASE MODE');
        return 'REAL_MODE';
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('   ❌ API Root: 404 - Routing issue detected');
        return 'ROUTING_ERROR';
      } else {
        console.log(`   ❌ API Root Error: ${error.message}`);
        return 'API_ERROR';
      }
    }
    
  } catch (error) {
    console.log(`   ❌ Health Check Failed: ${error.message}`);
    return 'BACKEND_DOWN';
  }
}

async function testAuthentication() {
  console.log('\n3️⃣ Testing Authentication Endpoints...');
  
  // Test with mock credentials first
  const mockCredentials = [
    { email: 'admin@refugeenetwork.com', password: '123456', type: 'Mock Admin' },
    { email: 'test@example.com', password: '123456', type: 'Mock User' }
  ];
  
  for (const cred of mockCredentials) {
    try {
      console.log(`\n   Testing ${cred.type}: ${cred.email}`);
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email: cred.email,
        password: cred.password
      }, { 
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log(`   ✅ Login Success: ${response.status}`);
      console.log(`   👤 User: ${response.data.user?.name || 'Unknown'}`);
      console.log(`   🔑 Role: ${response.data.user?.role || 'Unknown'}`);
      console.log(`   🎫 Token: ${response.data.accessToken ? 'Generated' : 'Missing'}`);
      
      return { success: true, user: response.data.user, mode: 'WORKING' };
      
    } catch (error) {
      if (error.response) {
        console.log(`   ❌ Login Failed: ${error.response.status} - ${error.response.data.message || error.response.statusText}`);
      } else {
        console.log(`   ❌ Network Error: ${error.message}`);
      }
    }
  }
  
  return { success: false, mode: 'FAILED' };
}

async function main() {
  const backendStatus = await testBackendConnection();
  const authStatus = await testAuthentication();
  
  console.log('\n📊 DIAGNOSIS SUMMARY:');
  console.log('='.repeat(30));
  console.log(`Backend Status: ${backendStatus}`);
  console.log(`Auth Status: ${authStatus.mode}`);
  
  if (backendStatus === 'MOCK_MODE') {
    console.log('\n🔧 SOLUTION REQUIRED:');
    console.log('1. Backend is running in MOCK MODE');
    console.log('2. MongoDB connection failed');
    console.log('3. Need to fix MongoDB URI in Render environment variables');
    console.log('4. Need to whitelist Render IPs in MongoDB Atlas');
  } else if (backendStatus === 'ROUTING_ERROR') {
    console.log('\n🔧 SOLUTION REQUIRED:');
    console.log('1. API routing configuration issue');
    console.log('2. Backend deployment may be incomplete');
    console.log('3. Need to redeploy backend with correct routing');
  } else if (authStatus.success) {
    console.log('\n✅ BACKEND IS WORKING CORRECTLY!');
    console.log('Issue may be with frontend configuration or CORS');
  }
  
  console.log('\n🎯 NEXT STEPS:');
  console.log('1. Check Render environment variables');
  console.log('2. Verify MongoDB Atlas IP whitelist');
  console.log('3. Update frontend with correct backend URL');
  console.log('4. Test login from frontend');
}

main().catch(console.error);
