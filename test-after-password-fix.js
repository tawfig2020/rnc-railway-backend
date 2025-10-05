#!/usr/bin/env node

/**
 * Test Admin Login After Password Fix
 * Verify the password update worked
 */

const axios = require('axios');

const BACKEND_URL = 'https://rncplatform.onrender.com/api';

async function testAdminAfterFix() {
  console.log('🧪 TESTING ADMIN LOGIN AFTER PASSWORD FIX');
  console.log('='.repeat(45));
  
  try {
    // Test backend connectivity
    console.log('1. Testing backend API...');
    const apiResponse = await axios.get(BACKEND_URL, { timeout: 10000 });
    console.log('✅ Backend API:', apiResponse.data.message);
    
    // Test admin login
    console.log('\n2. Testing admin login...');
    const loginResponse = await axios.post(`${BACKEND_URL}/auth/login`, {
      email: 'admin@refugeenetwork.com',
      password: '123456'
    }, {
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('✅ ADMIN LOGIN SUCCESSFUL!');
    console.log('   Email:', loginResponse.data.user?.email);
    console.log('   Role:', loginResponse.data.user?.role);
    console.log('   Verified:', loginResponse.data.user?.isEmailVerified);
    console.log('   Token:', loginResponse.data.token ? 'Present' : 'Missing');
    
    console.log('\n🎉 SUCCESS! Everything is working:');
    console.log('✅ Backend API connected');
    console.log('✅ MongoDB connected');
    console.log('✅ Admin user exists');
    console.log('✅ Password correct');
    console.log('✅ Authentication working');
    
    console.log('\n🚀 READY FOR FRONTEND DEPLOYMENT!');
    console.log('Deploy client/build folder to Netlify');
    
    return true;
    
  } catch (error) {
    console.log('❌ Test failed:', error.response?.status);
    console.log('   Error:', error.response?.data?.message || error.message);
    
    if (error.response?.data?.errors) {
      console.log('   Details:', error.response.data.errors);
    }
    
    if (error.response?.status === 400) {
      console.log('\n💡 If still getting "Invalid credentials":');
      console.log('   - Double-check password hash was updated correctly');
      console.log('   - Ensure isEmailVerified is set to true');
      console.log('   - Wait a few minutes for MongoDB changes to propagate');
    }
    
    return false;
  }
}

testAdminAfterFix();
