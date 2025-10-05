#!/usr/bin/env node

/**
 * Simple Admin Login Test
 * Quick test with shorter timeout
 */

const axios = require('axios');

const BACKEND_URL = 'https://rncplatform.onrender.com/api';

async function quickAdminTest() {
  console.log('🧪 TESTING ADMIN LOGIN');
  console.log('='.repeat(25));
  
  try {
    console.log('Testing admin login...');
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
    
    console.log('\n✅ AUTHENTICATION WORKING!');
    console.log('✅ Backend connected');
    console.log('✅ MongoDB connected');
    console.log('✅ Admin user functional');
    
    console.log('\n🚀 READY FOR FRONTEND DEPLOYMENT!');
    return true;
    
  } catch (error) {
    console.log('❌ Login failed');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data?.message || error.message);
    
    if (error.response?.data?.errors) {
      console.log('Details:', error.response.data.errors);
    }
    
    if (error.code === 'ECONNABORTED') {
      console.log('⚠️ Timeout - backend may be slow but working');
    }
    
    return false;
  }
}

quickAdminTest();
