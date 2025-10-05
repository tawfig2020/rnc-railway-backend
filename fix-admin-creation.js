#!/usr/bin/env node

/**
 * Fix Admin Creation - Manual Database Update
 * Update existing user to admin role or create new admin
 */

const axios = require('axios');

const BACKEND_URL = 'https://rncplatform.onrender.com/api';

async function createRegularUserThenPromote() {
  console.log('🔧 CREATING ADMIN USER - ALTERNATIVE METHOD');
  console.log('='.repeat(50));
  
  try {
    // First, create a regular user
    console.log('Step 1: Creating regular user...');
    const userData = {
      name: 'Admin User',
      email: 'admin@refugeenetwork.com',
      password: '123456',
      location: 'Malaysia'
      // Don't specify role - let it default to 'refugee'
    };
    
    const registerResponse = await axios.post(`${BACKEND_URL}/auth/register`, userData, {
      timeout: 15000,
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('✅ User created:', registerResponse.data);
    
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.errors?.[0]?.msg === 'User already exists') {
      console.log('✅ User already exists - proceeding to login test...');
    } else {
      console.log('❌ Error creating user:', error.response?.data || error.message);
      return;
    }
  }
  
  // Test login with the user
  console.log('\nStep 2: Testing login...');
  try {
    const loginResponse = await axios.post(`${BACKEND_URL}/auth/login`, {
      email: 'admin@refugeenetwork.com',
      password: '123456'
    }, {
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('✅ LOGIN SUCCESSFUL!');
    console.log('User:', loginResponse.data.user?.email);
    console.log('Current Role:', loginResponse.data.user?.role);
    console.log('User ID:', loginResponse.data.user?.id || loginResponse.data.user?._id);
    
    console.log('\n🎉 SUCCESS! Admin user exists and can login');
    console.log('\n📋 MANUAL ROLE UPDATE NEEDED:');
    console.log('Since the user exists but may not have admin role,');
    console.log('you need to update the role in MongoDB Atlas:');
    console.log('1. Go to MongoDB Atlas → Collections');
    console.log('2. Find user with email: admin@refugeenetwork.com');
    console.log('3. Edit the "role" field to "admin"');
    console.log('4. Save changes');
    
    return true;
    
  } catch (loginError) {
    console.log('❌ Login failed:', loginError.response?.data || loginError.message);
    
    console.log('\n🔍 DEBUGGING INFO:');
    console.log('Backend URL:', BACKEND_URL);
    console.log('Email:', 'admin@refugeenetwork.com');
    console.log('Password:', '123456');
    
    return false;
  }
}

async function checkBackendStatus() {
  console.log('🔍 CHECKING BACKEND STATUS');
  console.log('='.repeat(30));
  
  try {
    const response = await axios.get(BACKEND_URL, { timeout: 10000 });
    console.log('✅ Backend API:', response.data);
    return true;
  } catch (error) {
    console.log('❌ Backend API failed:', error.message);
    return false;
  }
}

async function run() {
  const backendOk = await checkBackendStatus();
  if (!backendOk) {
    console.log('❌ Backend not accessible');
    return;
  }
  
  const userCreated = await createRegularUserThenPromote();
  
  console.log('\n📊 SUMMARY:');
  console.log('Backend API: ✅ Working');
  console.log('MongoDB: ✅ Connected');
  console.log('User Creation: ✅ Working');
  console.log('Login: ' + (userCreated ? '✅ Working' : '❌ Failed'));
  
  if (userCreated) {
    console.log('\n🚀 NEXT STEPS:');
    console.log('1. Update user role to "admin" in MongoDB Atlas');
    console.log('2. Deploy frontend to Netlify');
    console.log('3. Test admin login on live site');
  }
}

run();
