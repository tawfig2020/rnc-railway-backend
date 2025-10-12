/**
 * Test Login Script
 * Tests the login functionality locally
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rnc-platform';

console.log('🔗 Connecting to MongoDB...');
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Load models
require('./models/User');
require('./models/RefreshToken');

const User = mongoose.model('User');
const RefreshToken = mongoose.model('RefreshToken');

async function testLogin() {
  try {
    console.log('✅ Connected to MongoDB\n');

    const email = 'admin@rncmalaysia.net';
    const password = 'admin123';

    console.log('🔐 Testing Login Process...\n');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}\n`);

    // Step 1: Find user
    console.log('Step 1: Finding user...');
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ User not found!');
      process.exit(1);
    }
    console.log(`✅ User found: ${user.name} (${user.role})\n`);

    // Step 2: Match password
    console.log('Step 2: Matching password...');
    const isMatch = await user.matchPassword(password);
    console.log(`Password match: ${isMatch ? '✅ YES' : '❌ NO'}\n`);

    if (!isMatch) {
      console.log('❌ Password does not match!');
      process.exit(1);
    }

    // Step 3: Check email verification
    console.log('Step 3: Checking email verification...');
    console.log(`Email verified: ${user.isEmailVerified}`);
    console.log(`User role: ${user.role}`);
    
    if (!user.isEmailVerified && user.role !== 'admin') {
      console.log('⚠️  Email not verified (but admin bypass should work)\n');
    } else {
      console.log('✅ Email verification check passed\n');
    }

    // Step 4: Generate tokens
    console.log('Step 4: Generating tokens...');
    
    try {
      const accessToken = user.getSignedJwtToken();
      console.log(`✅ Access token generated: ${accessToken.substring(0, 20)}...\n`);
    } catch (err) {
      console.log('❌ Error generating access token:', err.message);
      throw err;
    }

    try {
      const refreshToken = user.getRefreshToken();
      console.log(`✅ Refresh token generated: ${refreshToken.substring(0, 20)}...\n`);
    } catch (err) {
      console.log('❌ Error generating refresh token:', err.message);
      throw err;
    }

    // Step 5: Save refresh token
    console.log('Step 5: Saving refresh token to database...');
    
    try {
      const refreshToken = user.getRefreshToken();
      const refreshTokenDoc = new RefreshToken({
        token: refreshToken,
        user: user._id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ipAddress: '127.0.0.1',
        userAgent: 'Test Script'
      });
      
      await refreshTokenDoc.save();
      console.log('✅ Refresh token saved to database\n');
    } catch (err) {
      console.log('❌ Error saving refresh token:', err.message);
      throw err;
    }

    console.log('═══════════════════════════════════════');
    console.log('🎉 LOGIN TEST SUCCESSFUL!');
    console.log('═══════════════════════════════════════\n');
    console.log('All steps completed without errors.');
    console.log('The login endpoint should work correctly.\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ LOGIN TEST FAILED!');
    console.error('Error:', error.message);
    console.error('\nFull error:');
    console.error(error);
    process.exit(1);
  }
}

// Wait for MongoDB connection
mongoose.connection.once('open', () => {
  testLogin();
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});
