#!/usr/bin/env node

/**
 * Check What Password Hash You Actually Updated
 * Let's see what's currently in the database
 */

const axios = require('axios');

const BACKEND_URL = 'https://rncplatform.onrender.com/api';

async function checkCurrentPassword() {
  console.log('🔍 CHECKING CURRENT ADMIN USER STATUS');
  console.log('='.repeat(40));
  
  // Test different common passwords that might be in the database
  const testPasswords = [
    '123456',
    'admin123',
    'password',
    'admin',
    'Tawfig2020'
  ];
  
  console.log('Testing backend connectivity...');
  try {
    const healthCheck = await axios.get(BACKEND_URL, { timeout: 30000 });
    console.log('✅ Backend:', healthCheck.data.message);
  } catch (error) {
    console.log('❌ Backend timeout - but this is normal on Render');
    console.log('Proceeding with login tests...');
  }
  
  console.log('\n🧪 TESTING DIFFERENT PASSWORDS:');
  
  for (const password of testPasswords) {
    try {
      console.log(`\nTrying password: "${password}"`);
      const response = await axios.post(`${BACKEND_URL}/auth/login`, {
        email: 'admin@refugeenetwork.com',
        password: password
      }, {
        timeout: 30000,
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log(`✅ SUCCESS with password: "${password}"`);
      console.log('User:', response.data.user?.email);
      console.log('Role:', response.data.user?.role);
      console.log('Verified:', response.data.user?.isEmailVerified);
      
      console.log('\n🎉 ADMIN LOGIN WORKING!');
      console.log(`✅ Correct password is: "${password}"`);
      return password;
      
    } catch (error) {
      console.log(`❌ Failed with "${password}"`);
    }
  }
  
  console.log('\n❌ None of the common passwords worked');
  console.log('\n💡 POSSIBLE ISSUES:');
  console.log('1. Password hash not updated correctly');
  console.log('2. User email case sensitivity');
  console.log('3. Database changes not propagated yet');
  
  console.log('\n🔧 SOLUTION: Use this EXACT hash in MongoDB:');
  console.log('$2a$10$34GTKr0fV0reQJbNoNZRe.475EOhR6yXtQG6UKS5ZGcPEayugpLi2');
  
  return null;
}

checkCurrentPassword();
