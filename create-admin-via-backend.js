#!/usr/bin/env node

/**
 * Create Admin User via Backend Registration API
 * Uses the working backend API to create admin user properly
 */

const axios = require('axios');

const BACKEND_URL = 'https://rncplatform.onrender.com/api';

async function createAdminViaAPI() {
  console.log('🔧 CREATING ADMIN USER VIA BACKEND API');
  console.log('='.repeat(45));
  
  try {
    // Test backend connectivity
    console.log('1. Testing backend connection...');
    const healthCheck = await axios.get(`${BACKEND_URL}`, { timeout: 15000 });
    console.log('✅ Backend Status:', healthCheck.data.message);
    
    // First, try to create a regular user that we can promote
    console.log('\n2. Creating user account...');
    
    const userData = {
      name: 'Admin User',
      email: 'admin@refugeenetwork.com',
      password: '123456',
      location: 'Malaysia'
      // Don't specify role - let it default to 'refugee'
    };
    
    try {
      const registerResponse = await axios.post(`${BACKEND_URL}/auth/register`, userData, {
        timeout: 15000,
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log('✅ User registration successful!');
      console.log('   Response:', registerResponse.data);
      
    } catch (regError) {
      if (regError.response?.status === 400 && 
          regError.response?.data?.errors?.[0]?.msg === 'User already exists') {
        console.log('✅ User already exists - proceeding to login test...');
      } else {
        console.log('❌ Registration error:', regError.response?.data || regError.message);
        return false;
      }
    }
    
    // Test login with the created user
    console.log('\n3. Testing login...');
    const loginResponse = await axios.post(`${BACKEND_URL}/auth/login`, {
      email: 'admin@refugeenetwork.com',
      password: '123456'
    }, {
      timeout: 15000,
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('✅ LOGIN SUCCESSFUL!');
    console.log('   Email:', loginResponse.data.user?.email);
    console.log('   Role:', loginResponse.data.user?.role);
    console.log('   Verified:', loginResponse.data.user?.isEmailVerified);
    console.log('   Token:', loginResponse.data.token ? 'Present' : 'Missing');
    
    console.log('\n📋 MANUAL ROLE UPDATE NEEDED:');
    console.log('The user was created successfully but has role:', loginResponse.data.user?.role);
    console.log('You need to update the role to "admin" in MongoDB Atlas:');
    console.log('1. Go to MongoDB Atlas → Collections');
    console.log('2. Database: refugee-network → Collection: users');
    console.log('3. Find user: admin@refugeenetwork.com');
    console.log('4. Edit document and change role from "' + loginResponse.data.user?.role + '" to "admin"');
    console.log('5. Save changes');
    
    console.log('\n🎉 USER CREATION SUCCESSFUL!');
    console.log('✅ Backend: Working');
    console.log('✅ Database: Connected');
    console.log('✅ User: Created and can login');
    console.log('⚠️  Role: Needs manual update to "admin"');
    
    return true;
    
  } catch (error) {
    console.log('❌ Error:', error.response?.status || 'Network');
    console.log('   Message:', error.response?.data?.message || error.message);
    
    if (error.response?.data?.errors) {
      console.log('   Details:', error.response.data.errors);
    }
    
    return false;
  }
}

async function run() {
  const success = await createAdminViaAPI();
  
  console.log('\n📊 SUMMARY:');
  if (success) {
    console.log('✅ Admin user created via backend API');
    console.log('✅ Login works with password: 123456');
    console.log('⚠️  Manual role update needed in MongoDB Atlas');
    console.log('\n🚀 NEXT STEPS:');
    console.log('1. Update role to "admin" in MongoDB Atlas');
    console.log('2. Deploy frontend to Netlify');
    console.log('3. Test admin login on live site');
  } else {
    console.log('❌ Failed to create admin user');
    console.log('   Check backend logs for more details');
  }
}

run();
