#!/usr/bin/env node

/**
 * Render MongoDB Connection Fix
 * Comprehensive solution for backend mock mode issue
 */

const axios = require('axios');

const BACKEND_URL = 'https://rncplatform.onrender.com';

async function diagnoseBackendMode() {
  console.log('🔍 DIAGNOSING BACKEND MODE');
  console.log('='.repeat(40));
  
  try {
    // Test API root to determine mode
    const response = await axios.get(`${BACKEND_URL}/api`, { timeout: 10000 });
    
    if (response.data.message && response.data.message.includes('Mock Mode')) {
      console.log('❌ BACKEND IS IN MOCK MODE');
      console.log('   Reason: MongoDB connection failed');
      return 'MOCK';
    } else {
      console.log('✅ BACKEND IS IN REAL DATABASE MODE');
      return 'REAL';
    }
    
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log('❌ API ROUTING ERROR');
      console.log('   API endpoints not accessible');
      return 'ROUTING_ERROR';
    } else {
      console.log(`❌ CONNECTION ERROR: ${error.message}`);
      return 'CONNECTION_ERROR';
    }
  }
}

async function testMockCredentials() {
  console.log('\n🧪 TESTING MOCK CREDENTIALS');
  console.log('='.repeat(30));
  
  const mockCreds = [
    { email: 'admin@refugeenetwork.com', password: '123456', role: 'Admin' },
    { email: 'test@example.com', password: '123456', role: 'User' }
  ];
  
  for (const cred of mockCreds) {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email: cred.email,
        password: cred.password
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });
      
      console.log(`✅ ${cred.role} Login: SUCCESS`);
      console.log(`   User: ${response.data.user?.name}`);
      console.log(`   Role: ${response.data.user?.role}`);
      console.log(`   Token: ${response.data.accessToken ? 'Generated' : 'Missing'}`);
      
    } catch (error) {
      if (error.response) {
        console.log(`❌ ${cred.role} Login: ${error.response.status} - ${error.response.data.message || 'Failed'}`);
      } else {
        console.log(`❌ ${cred.role} Login: Network error`);
      }
    }
  }
}

async function main() {
  const mode = await diagnoseBackendMode();
  
  if (mode === 'MOCK') {
    console.log('\n🚨 CRITICAL ISSUE: Backend in Mock Mode');
    console.log('\n🔧 REQUIRED FIXES:');
    console.log('1. MongoDB Atlas IP Whitelist: Add 0.0.0.0/0');
    console.log('2. Render Environment: Verify MONGODB_URI');
    console.log('3. Redeploy backend service');
    
    await testMockCredentials();
    
  } else if (mode === 'REAL') {
    console.log('\n✅ Backend connected to real database');
    console.log('Testing authentication...');
    await testMockCredentials();
    
  } else if (mode === 'ROUTING_ERROR') {
    console.log('\n🚨 CRITICAL ISSUE: API Routing Problem');
    console.log('\n🔧 REQUIRED FIXES:');
    console.log('1. Backend deployment incomplete');
    console.log('2. API routes not properly registered');
    console.log('3. Need to redeploy backend');
  }
  
  console.log('\n📋 IMMEDIATE ACTION PLAN:');
  console.log('='.repeat(35));
  console.log('1. Go to MongoDB Atlas → Network Access');
  console.log('2. Add IP: 0.0.0.0/0 (Allow access from anywhere)');
  console.log('3. Go to Render Dashboard → Environment');
  console.log('4. Verify MONGODB_URI is correctly set');
  console.log('5. Manual Deploy → Deploy latest commit');
  console.log('6. Check logs for "MongoDB Connected" message');
  console.log('7. Test login again');
}

main().catch(console.error);
