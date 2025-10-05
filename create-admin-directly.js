#!/usr/bin/env node

/**
 * Create Admin User Directly via Backend API
 * Since registration page doesn't have admin role option
 */

const axios = require('axios');

const BACKEND_URL = 'https://rncplatform.onrender.com/api';

async function createAdminUser() {
  console.log('🔧 CREATING ADMIN USER VIA BACKEND API');
  console.log('='.repeat(50));
  
  try {
    // Test backend connectivity first
    console.log('Testing backend API...');
    const apiTest = await axios.get(BACKEND_URL, { timeout: 10000 });
    console.log('✅ Backend API Response:', apiTest.data);
    
    // Create admin user via registration endpoint
    console.log('\nCreating admin user...');
    const adminData = {
      name: 'Admin User',
      email: 'admin@refugeenetwork.com',
      password: '123456',
      location: 'Malaysia',
      role: 'admin' // Try to set admin role directly
    };
    
    const response = await axios.post(`${BACKEND_URL}/auth/register`, adminData, {
      timeout: 15000,
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('Response:', response.data);
    
    // Test login immediately
    console.log('\nTesting admin login...');
    const loginResponse = await axios.post(`${BACKEND_URL}/auth/login`, {
      email: 'admin@refugeenetwork.com',
      password: '123456'
    }, {
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('✅ Admin login successful!');
    console.log('User:', loginResponse.data.user?.email);
    console.log('Role:', loginResponse.data.user?.role);
    console.log('Token:', loginResponse.data.token ? 'Present' : 'Missing');
    
  } catch (error) {
    console.log('❌ Error:', error.response?.status);
    console.log('Message:', error.response?.data?.message || error.message);
    
    if (error.response?.data) {
      console.log('Full response:', JSON.stringify(error.response.data, null, 2));
    }
    
    if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
      console.log('\n💡 Admin user already exists! Trying to login...');
      
      try {
        const loginResponse = await axios.post(`${BACKEND_URL}/auth/login`, {
          email: 'admin@refugeenetwork.com',
          password: '123456'
        }, {
          timeout: 10000,
          headers: { 'Content-Type': 'application/json' }
        });
        
        console.log('✅ Admin login successful!');
        console.log('User:', loginResponse.data.user?.email);
        console.log('Role:', loginResponse.data.user?.role);
        
      } catch (loginError) {
        console.log('❌ Login failed:', loginError.response?.data?.message || loginError.message);
      }
    }
  }
  
  console.log('\n📋 NEXT STEPS:');
  console.log('1. Deploy frontend to Netlify');
  console.log('2. Test login on your live site');
  console.log('3. Admin credentials: admin@refugeenetwork.com / 123456');
}

createAdminUser();
