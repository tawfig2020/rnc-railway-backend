#!/usr/bin/env node

/**
 * Check Password Hash in Database
 * Verify what's actually stored in MongoDB
 */

const bcrypt = require('bcryptjs');

async function checkPasswordHash() {
  console.log('🔍 CHECKING PASSWORD HASH FROM YOUR COMPASS UPDATE');
  console.log('='.repeat(50));
  
  // From your Compass screenshot, I can see the password hash
  const hashFromCompass = '$2a$10$2FRSUSwfu7tnnjjipYXQAu5RIzetQ95atVicOUE3TzoXdBwTWsw86';
  const password = '123456';
  
  try {
    console.log('Password from Compass:', hashFromCompass);
    console.log('Testing password "123456" against this hash...');
    
    const isValid = await bcrypt.compare(password, hashFromCompass);
    console.log('Hash validation:', isValid ? '✅ VALID' : '❌ INVALID');
    
    if (isValid) {
      console.log('\n🎉 PASSWORD HASH IS CORRECT!');
      console.log('The issue is rate limiting (429 error)');
      console.log('Your backend is protecting against too many login attempts');
      
      console.log('\n⏰ RATE LIMIT SOLUTION:');
      console.log('1. Wait 15-30 minutes before testing again');
      console.log('2. Rate limiting resets automatically');
      console.log('3. This is actually good security!');
      
      console.log('\n✅ ADMIN USER IS READY:');
      console.log('Email: admin@refugeenetwork.com');
      console.log('Password: 123456');
      console.log('Status: Working (just rate limited)');
      
    } else {
      console.log('\n❌ Hash mismatch - need to update with correct hash');
      
      // Generate correct hash
      const correctHash = await bcrypt.hash(password, 10);
      console.log('\nUse this hash instead:');
      console.log(correctHash);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkPasswordHash();
