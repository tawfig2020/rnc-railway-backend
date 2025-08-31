#!/usr/bin/env node

/**
 * Test Deployment Status
 * Verify backend and frontend connectivity
 */

const axios = require('axios');

const BACKEND_URL = 'https://rncplatform.onrender.com';
const TEST_CREDENTIALS = {
  mock: {
    email: 'admin@refugeenetwork.com',
    password: '123456'
  },
  real: {
    email: 'admin@refugeenetwork.com',
    password: '123456'
  }
};

async function testBackendHealth() {
  console.log('🔍 Testing Backend Health...');
  try {
    const response = await axios.get(`${BACKEND_URL}/health`, { timeout: 10000 });
    console.log('✅ Backend Health:', response.data);
    return true;
  } catch (error) {
    console.log('❌ Backend Health Failed:', error.message);
    return false;
  }
}

async function testBackendAPI() {
  console.log('\n🔍 Testing Backend API Root...');
  try {
    const response = await axios.get(`${BACKEND_URL}/api`, { timeout: 10000 });
    console.log('✅ Backend API Response:', response.data);
    
    if (response.data.message && response.data.message.includes('Mock')) {
      console.log('⚠️  Backend is in MOCK MODE - MongoDB connection failed');
      return 'mock';
    } else {
      console.log('✅ Backend is in REAL MODE - MongoDB connected');
      return 'real';
    }
  } catch (error) {
    console.log('❌ Backend API Failed:', error.message);
    return false;
  }
}

async function testAuthentication(mode) {
  console.log('\n🔍 Testing Authentication...');
  const credentials = mode === 'mock' ? TEST_CREDENTIALS.mock : TEST_CREDENTIALS.real;
  
  try {
    const response = await axios.post(`${BACKEND_URL}/api/auth/login`, credentials, {
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('✅ Authentication Success');
    console.log('   User:', response.data.user?.email || 'Unknown');
    console.log('   Role:', response.data.user?.role || 'Unknown');
    console.log('   Token:', response.data.token ? 'Present' : 'Missing');
    return true;
  } catch (error) {
    console.log('❌ Authentication Failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 DEPLOYMENT STATUS TEST');
  console.log('='.repeat(40));
  
  const healthOk = await testBackendHealth();
  if (!healthOk) {
    console.log('\n❌ Backend is not responding. Check Render deployment.');
    return;
  }
  
  const apiMode = await testBackendAPI();
  if (!apiMode) {
    console.log('\n❌ Backend API is not responding.');
    return;
  }
  
  const authOk = await testAuthentication(apiMode);
  
  console.log('\n📊 SUMMARY:');
  console.log('='.repeat(20));
  console.log(`Backend Health: ${healthOk ? '✅' : '❌'}`);
  console.log(`Backend API: ${apiMode === 'real' ? '✅ Real Mode' : apiMode === 'mock' ? '⚠️  Mock Mode' : '❌ Failed'}`);
  console.log(`Authentication: ${authOk ? '✅' : '❌'}`);
  
  if (apiMode === 'mock') {
    console.log('\n🔧 TO FIX MOCK MODE:');
    console.log('1. Go to MongoDB Atlas → Network Access');
    console.log('2. Add IP: 0.0.0.0/0 (Allow access from anywhere)');
    console.log('3. Go to Render Dashboard → Environment Variables');
    console.log('4. Add MONGODB_URI with your Atlas connection string');
    console.log('5. Redeploy backend on Render');
  }
  
  if (healthOk && apiMode && authOk) {
    console.log('\n🎉 DEPLOYMENT IS WORKING!');
  } else {
    console.log('\n⚠️  DEPLOYMENT NEEDS FIXES');
  }
}

runTests().catch(console.error);
