#!/usr/bin/env node

/**
 * Test Admin Login with Rate Limit Handling
 * Handle 429 rate limit errors
 */

const axios = require('axios');

const BACKEND_URL = 'https://rncplatform.onrender.com/api';

async function testWithDelay() {
  console.log('🧪 TESTING ADMIN LOGIN (WITH RATE LIMIT HANDLING)');
  console.log('='.repeat(50));
  
  console.log('Waiting 30 seconds to avoid rate limiting...');
  await new Promise(resolve => setTimeout(resolve, 30000));
  
  try {
    console.log('\nTesting admin login...');
    const response = await axios.post(`${BACKEND_URL}/auth/login`, {
      email: 'admin@refugeenetwork.com',
      password: '123456'
    }, {
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('🎉 ADMIN LOGIN SUCCESSFUL!');
    console.log('Email:', response.data.user?.email);
    console.log('Role:', response.data.user?.role);
    console.log('Verified:', response.data.user?.isEmailVerified);
    console.log('Token:', response.data.token ? 'Present' : 'Missing');
    
    console.log('\n✅ PASSWORD UPDATE WORKED!');
    console.log('✅ Backend connected');
    console.log('✅ MongoDB connected');
    console.log('✅ Admin authentication functional');
    
    console.log('\n🚀 READY FOR FRONTEND DEPLOYMENT!');
    return true;
    
  } catch (error) {
    if (error.response?.status === 429) {
      console.log('⚠️ Still rate limited - need to wait longer');
      console.log('Rate limit is working (good security)');
      console.log('Try again in a few minutes');
    } else if (error.response?.status === 400) {
      console.log('❌ Invalid credentials - password hash may need adjustment');
      console.log('Details:', error.response?.data?.errors);
    } else {
      console.log('❌ Other error:', error.response?.status);
      console.log('Message:', error.response?.data?.message || error.message);
    }
    
    return false;
  }
}

testWithDelay();
