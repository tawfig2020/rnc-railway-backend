#!/usr/bin/env node

/**
 * Test Admin Login
 * Verify admin user exists and can login
 */

const axios = require('axios');

const BACKEND_URL = 'https://rncplatform.onrender.com/api';

async function testAdminLogin() {
  console.log('🧪 TESTING ADMIN LOGIN');
  console.log('='.repeat(30));
  
  try {
    console.log('Testing admin login...');
    const loginResponse = await axios.post(`${BACKEND_URL}/auth/login`, {
      email: 'admin@refugeenetwork.com',
      password: '123456'
    }, {
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('✅ ADMIN LOGIN SUCCESSFUL!');
    console.log('User Email:', loginResponse.data.user?.email);
    console.log('User Role:', loginResponse.data.user?.role);
    console.log('Token Present:', loginResponse.data.token ? 'Yes' : 'No');
    console.log('User ID:', loginResponse.data.user?.id || loginResponse.data.user?._id);
    
    return true;
    
  } catch (error) {
    console.log('❌ ADMIN LOGIN FAILED');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data?.message || error.message);
    
    if (error.response?.data?.errors) {
      console.log('Validation Errors:', error.response.data.errors);
    }
    
    return false;
  }
}

async function runTest() {
  const loginSuccess = await testAdminLogin();
  
  console.log('\n📊 RESULT:');
  if (loginSuccess) {
    console.log('🎉 ADMIN ACCOUNT IS WORKING!');
    console.log('✅ Backend API: Connected');
    console.log('✅ MongoDB: Connected');
    console.log('✅ Admin User: Exists and can login');
    console.log('✅ Authentication: Working');
    
    console.log('\n🚀 READY FOR FRONTEND DEPLOYMENT!');
    console.log('Deploy client/build folder to Netlify');
    console.log('Then test login on your live site');
  } else {
    console.log('❌ Admin login failed - need to investigate');
  }
}

runTest();
