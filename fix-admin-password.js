#!/usr/bin/env node

/**
 * Fix Admin Password
 * Generate correct bcrypt hash for password "123456"
 */

const bcrypt = require('bcryptjs');

async function generatePasswordHash() {
  console.log('🔧 GENERATING CORRECT PASSWORD HASH');
  console.log('='.repeat(40));
  
  try {
    // Generate hash for password "123456" with salt rounds 10 (to match existing)
    const password = '123456';
    const saltRounds = 10;
    
    console.log('Password:', password);
    console.log('Salt Rounds:', saltRounds);
    
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('Generated Hash:', hash);
    
    // Verify the hash works
    const isValid = await bcrypt.compare(password, hash);
    console.log('Hash Verification:', isValid ? '✅ Valid' : '❌ Invalid');
    
    console.log('\n📋 MONGODB UPDATE INSTRUCTIONS:');
    console.log('='.repeat(35));
    console.log('1. Go to MongoDB Atlas → Collections');
    console.log('2. Database: refugee-network');
    console.log('3. Collection: users');
    console.log('4. Find user with email: admin@refugeenetwork.com');
    console.log('5. Edit the document');
    console.log('6. Update these fields:');
    console.log('   password:', hash);
    console.log('   isEmailVerified: true');
    console.log('7. Save changes');
    
    console.log('\n🧪 AFTER UPDATE - TEST LOGIN:');
    console.log('Email: admin@refugeenetwork.com');
    console.log('Password: 123456');
    console.log('Expected: ✅ Successful login');
    
  } catch (error) {
    console.error('❌ Error generating hash:', error.message);
  }
}

generatePasswordHash();
