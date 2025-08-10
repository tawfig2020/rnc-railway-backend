/**
 * Authentication Connection Test
 * Tests the connection between frontend and backend authentication
 */

const axios = require('axios');

const baseURL = 'http://localhost:5000/api';
const healthURL = 'http://localhost:5000/health';

async function testAuthConnection() {
  console.log('🔍 Testing Authentication Connection...\n');
  
  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing backend health...');
    const healthResponse = await axios.get(healthURL);
    console.log('✅ Health check passed:', healthResponse.data);
    
    // Test 2: Auth endpoint availability
    console.log('\n2️⃣ Testing auth endpoint availability...');
    try {
      await axios.post(`${baseURL}/auth/login`, {});
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Auth endpoint is accessible (400 expected for empty request)');
      } else {
        throw error;
      }
    }
    
    // Test 3: Valid login
    console.log('\n3️⃣ Testing valid admin login...');
    const loginResponse = await axios.post(`${baseURL}/auth/login`, {
      email: 'admin@refugeenetwork.com',
      password: '123456'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('✅ Login successful:', {
      success: loginResponse.data.success,
      user: loginResponse.data.user.email,
      role: loginResponse.data.user.role,
      hasToken: !!loginResponse.data.accessToken
    });
    
    // Test 4: Invalid login
    console.log('\n4️⃣ Testing invalid login...');
    try {
      await axios.post(`${baseURL}/auth/login`, {
        email: 'invalid@example.com',
        password: 'wrongpassword'
      });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Invalid login properly rejected:', error.response.data.message);
      } else {
        throw error;
      }
    }
    
    console.log('\n🎉 All authentication tests passed!');
    console.log('\n📋 Summary:');
    console.log('- Backend server: ✅ Running on port 5000');
    console.log('- Health endpoint: ✅ Responding');
    console.log('- Auth endpoint: ✅ Accessible');
    console.log('- Valid login: ✅ Working');
    console.log('- Invalid login: ✅ Properly rejected');
    console.log('\n🔧 If frontend login still fails, the issue is likely in the React app configuration.');
    
  } catch (error) {
    console.error('❌ Authentication test failed:', {
      message: error.message,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data
      } : 'No response',
      code: error.code
    });
  }
}

// Run the test
testAuthConnection();
