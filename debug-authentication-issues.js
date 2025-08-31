#!/usr/bin/env node

/**
 * Debug Authentication Issues
 * Comprehensive test of backend API and authentication
 */

const axios = require('axios');

const BACKEND_URL = 'https://rncplatform.onrender.com';
const FRONTEND_API_URL = 'https://rncplatform.onrender.com/api';

// Test all possible credentials
const TEST_CREDENTIALS = [
  { email: 'admin@refugeenetwork.com', password: '123456', role: 'Admin' },
  { email: 'staff@refugeenetwork.com', password: '123456', role: 'Staff' },
  { email: 'refugee@example.com', password: '123456', role: 'Refugee' },
  { email: 'volunteer@example.com', password: '123456', role: 'Volunteer' },
  { email: 'test@example.com', password: '123456', role: 'Test User' }
];

async function testBackendConnectivity() {
  console.log('🔍 Testing Backend Connectivity...');
  
  try {
    // Test health endpoint
    const health = await axios.get(`${BACKEND_URL}/health`, { timeout: 10000 });
    console.log('✅ Health Check:', health.data);
    
    // Test API root
    try {
      const apiRoot = await axios.get(`${FRONTEND_API_URL}`, { timeout: 10000 });
      console.log('✅ API Root:', apiRoot.data);
      return apiRoot.data;
    } catch (apiError) {
      console.log('❌ API Root Failed:', apiError.response?.status, apiError.response?.data || apiError.message);
      return null;
    }
  } catch (error) {
    console.log('❌ Backend Health Failed:', error.message);
    return null;
  }
}

async function testAuthEndpoints() {
  console.log('\n🔍 Testing Auth Endpoints...');
  
  // Test auth routes availability
  const endpoints = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/me'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await axios.post(`${BACKEND_URL}${endpoint}`, {}, { 
        timeout: 5000,
        validateStatus: () => true // Accept all status codes
      });
      console.log(`${endpoint}: ${response.status} - ${response.data?.message || 'Available'}`);
    } catch (error) {
      console.log(`${endpoint}: ERROR - ${error.message}`);
    }
  }
}

async function testAuthentication() {
  console.log('\n🔍 Testing Authentication with All Credentials...');
  
  for (const cred of TEST_CREDENTIALS) {
    console.log(`\nTesting ${cred.role}: ${cred.email}`);
    
    try {
      const response = await axios.post(`${FRONTEND_API_URL}/auth/login`, {
        email: cred.email,
        password: cred.password
      }, {
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log(`✅ SUCCESS - Token: ${response.data.token ? 'Present' : 'Missing'}`);
      console.log(`   User: ${response.data.user?.email || 'Unknown'}`);
      console.log(`   Role: ${response.data.user?.role || 'Unknown'}`);
      
    } catch (error) {
      console.log(`❌ FAILED - Status: ${error.response?.status || 'No Response'}`);
      console.log(`   Error: ${error.response?.data?.message || error.message}`);
      
      if (error.response?.data) {
        console.log(`   Response:`, JSON.stringify(error.response.data, null, 2));
      }
    }
  }
}

async function testRegistration() {
  console.log('\n🔍 Testing Registration...');
  
  const testUser = {
    firstName: 'Test',
    lastName: 'User',
    email: 'testuser' + Date.now() + '@example.com',
    password: '123456',
    confirmPassword: '123456',
    location: 'Test Location',
    role: 'refugee'
  };
  
  try {
    const response = await axios.post(`${FRONTEND_API_URL}/auth/register`, testUser, {
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('✅ Registration Success:', response.data);
  } catch (error) {
    console.log('❌ Registration Failed:', error.response?.status);
    console.log('   Error:', error.response?.data?.message || error.message);
    
    if (error.response?.data) {
      console.log('   Full Response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

async function checkDatabaseMode() {
  console.log('\n🔍 Checking Database Mode...');
  
  try {
    // Check if we can access any API endpoint to determine mode
    const response = await axios.get(`${FRONTEND_API_URL}`, { 
      timeout: 10000,
      validateStatus: () => true 
    });
    
    if (response.status === 404) {
      console.log('❌ API endpoints not accessible - Backend likely in mock mode or routing issue');
      return 'unknown';
    }
    
    if (response.data?.message?.includes('Mock')) {
      console.log('⚠️  Backend is in MOCK MODE');
      return 'mock';
    } else {
      console.log('✅ Backend appears to be in REAL MODE');
      return 'real';
    }
  } catch (error) {
    console.log('❌ Cannot determine database mode:', error.message);
    return 'error';
  }
}

async function runDiagnostics() {
  console.log('🚀 AUTHENTICATION DEBUGGING');
  console.log('='.repeat(50));
  
  const apiStatus = await testBackendConnectivity();
  const dbMode = await checkDatabaseMode();
  
  await testAuthEndpoints();
  await testAuthentication();
  await testRegistration();
  
  console.log('\n📊 DIAGNOSIS SUMMARY:');
  console.log('='.repeat(30));
  console.log(`Backend Health: ${apiStatus ? '✅ Working' : '❌ Failed'}`);
  console.log(`API Root: ${apiStatus ? '✅ Accessible' : '❌ 404 Error'}`);
  console.log(`Database Mode: ${dbMode}`);
  
  console.log('\n🔧 LIKELY ISSUES:');
  if (!apiStatus) {
    console.log('1. Backend API routes not properly registered');
    console.log('2. MongoDB connection failed - backend in mock mode');
    console.log('3. Environment variables missing on Render');
  }
  
  console.log('\n💡 SOLUTIONS:');
  console.log('1. Check Render logs for MongoDB connection errors');
  console.log('2. Verify MONGODB_URI in Render environment variables');
  console.log('3. Ensure MongoDB Atlas IP whitelist includes 0.0.0.0/0');
  console.log('4. Redeploy backend after fixing environment variables');
}

runDiagnostics().catch(console.error);
