#!/usr/bin/env node

/**
 * Test Fixed Backend
 * Verify MongoDB connection and authentication after fixes
 */

const axios = require('axios');

const BACKEND_URL = 'https://rncplatform.onrender.com';
const API_URL = 'https://rncplatform.onrender.com/api';

async function testBackendStatus() {
  console.log('🚀 TESTING FIXED BACKEND');
  console.log('='.repeat(40));
  
  // Test health
  try {
    const health = await axios.get(`${BACKEND_URL}/health`, { timeout: 10000 });
    console.log('✅ Health Check:', health.data);
  } catch (error) {
    console.log('❌ Health Check Failed:', error.message);
    return false;
  }
  
  // Test API root
  try {
    const api = await axios.get(API_URL, { timeout: 10000 });
    console.log('✅ API Root:', api.data);
    
    if (api.data.message && api.data.message.includes('Mock')) {
      console.log('⚠️  Still in Mock Mode - MongoDB connection issue persists');
      return 'mock';
    } else {
      console.log('🎉 Real Mode Active - MongoDB connected successfully!');
      return 'real';
    }
  } catch (error) {
    console.log('❌ API Root Failed:', error.response?.status, error.message);
    return false;
  }
}

async function testAuthentication() {
  console.log('\n🔍 Testing Authentication...');
  
  const credentials = {
    email: 'admin@refugeenetwork.com',
    password: '123456'
  };
  
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials, {
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('✅ Authentication SUCCESS!');
    console.log('   User:', response.data.user?.email);
    console.log('   Role:', response.data.user?.role);
    console.log('   Token:', response.data.token ? 'Present' : 'Missing');
    return true;
  } catch (error) {
    console.log('❌ Authentication Failed:', error.response?.status);
    console.log('   Error:', error.response?.data?.message || error.message);
    
    if (error.response?.status === 429) {
      console.log('   💡 Rate limited - wait 15 minutes or increase rate limit');
    }
    return false;
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
    const response = await axios.post(`${API_URL}/auth/register`, testUser, {
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('✅ Registration SUCCESS!');
    console.log('   Message:', response.data.message);
    return true;
  } catch (error) {
    console.log('❌ Registration Failed:', error.response?.status);
    console.log('   Error:', error.response?.data?.message || error.message);
    
    if (error.response?.status === 429) {
      console.log('   💡 Rate limited - wait 15 minutes');
    }
    return false;
  }
}

async function runTests() {
  const backendStatus = await testBackendStatus();
  
  if (backendStatus === 'real') {
    console.log('\n🎉 MONGODB CONNECTION SUCCESSFUL!');
    await testAuthentication();
    await testRegistration();
  } else if (backendStatus === 'mock') {
    console.log('\n⚠️  STILL IN MOCK MODE - Need to fix MongoDB connection');
  } else {
    console.log('\n❌ BACKEND NOT RESPONDING');
  }
  
  console.log('\n📊 NEXT STEPS:');
  if (backendStatus === 'real') {
    console.log('✅ Backend fixed! Deploy frontend to Netlify');
    console.log('✅ Test authentication on your live site');
  } else {
    console.log('🔧 Check MongoDB Atlas IP whitelist is Active');
    console.log('🔧 Verify MONGODB_URI in Render environment variables');
    console.log('🔧 Redeploy backend if needed');
  }
}

runTests().catch(console.error);
