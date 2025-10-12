/**
 * Password Verification Script
 * Checks if the admin password is correctly hashed
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rnc-platform';

console.log('🔗 Connecting to MongoDB...');
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Load User model
require('./models/User');
const User = mongoose.model('User');

async function verifyPassword() {
  try {
    console.log('✅ Connected to MongoDB\n');

    // Find admin user
    const admin = await User.findOne({ email: 'admin@rncmalaysia.net' }).select('+password');
    
    if (!admin) {
      console.log('❌ Admin user not found!');
      process.exit(1);
    }

    console.log('👤 Admin User Found:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Name: ${admin.name}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   Password Hash: ${admin.password.substring(0, 20)}...`);
    console.log();

    // Test password
    const testPassword = 'admin123';
    const isMatch = await bcrypt.compare(testPassword, admin.password);

    console.log('🔐 Password Verification:');
    console.log(`   Testing password: "${testPassword}"`);
    console.log(`   Result: ${isMatch ? '✅ CORRECT' : '❌ INCORRECT'}`);
    console.log();

    if (!isMatch) {
      console.log('⚠️  Password does not match! Updating password...');
      
      // Hash new password
      const newHashedPassword = await bcrypt.hash(testPassword, 10);
      admin.password = newHashedPassword;
      await admin.save();
      
      console.log('✅ Password updated successfully!');
      console.log();
      
      // Verify again
      const admin2 = await User.findOne({ email: 'admin@rncmalaysia.net' }).select('+password');
      const isMatch2 = await bcrypt.compare(testPassword, admin2.password);
      console.log('🔐 Re-verification:');
      console.log(`   Result: ${isMatch2 ? '✅ CORRECT' : '❌ STILL INCORRECT'}`);
    }

    console.log('\n✅ Verification complete!');
    console.log('\n📝 Login Credentials:');
    console.log('   Email: admin@rncmalaysia.net');
    console.log('   Password: admin123');
    console.log('   Role: Admin');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Wait for MongoDB connection
mongoose.connection.once('open', () => {
  verifyPassword();
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});
