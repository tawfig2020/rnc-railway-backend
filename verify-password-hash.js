#!/usr/bin/env node

/**
 * Verify Password Hash
 * Check if the password hash was updated correctly
 */

const bcrypt = require('bcryptjs');

async function verifyPasswordHash() {
  console.log('🔍 VERIFYING PASSWORD HASH');
  console.log('='.repeat(30));
  
  const password = '123456';
  const expectedHash = '$2a$10$2FRSUSwfu7tnnjjipYXQAu5RIzetQ95atVicOUE3TzoXdBwTWsw86';
  
  try {
    // Test if our generated hash works
    const isValid = await bcrypt.compare(password, expectedHash);
    console.log('Password:', password);
    console.log('Expected Hash:', expectedHash);
    console.log('Hash Valid:', isValid ? '✅ YES' : '❌ NO');
    
    // Generate a fresh hash to compare
    console.log('\nGenerating fresh hash...');
    const freshHash = await bcrypt.hash(password, 10);
    console.log('Fresh Hash:', freshHash);
    
    const freshValid = await bcrypt.compare(password, freshHash);
    console.log('Fresh Hash Valid:', freshValid ? '✅ YES' : '❌ NO');
    
    console.log('\n📋 MONGODB UPDATE INSTRUCTIONS:');
    console.log('Use this EXACT hash in MongoDB:');
    console.log(freshHash);
    
    console.log('\n🔧 STEPS TO UPDATE:');
    console.log('1. In MongoDB Compass or Atlas');
    console.log('2. Find admin user: admin@refugeenetwork.com');
    console.log('3. Update password field to:');
    console.log('   ' + freshHash);
    console.log('4. Set isEmailVerified: true');
    console.log('5. Set role: "admin"');
    console.log('6. Save changes');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

verifyPasswordHash();
