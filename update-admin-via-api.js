#!/usr/bin/env node

/**
 * Update Admin Password via Backend API
 * Alternative to MongoDB Atlas interface editing
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://tawfig2020:Tawfig2020@cluster0.dfz2nfi.mongodb.net/refugee-network?retryWrites=true&w=majority';

// User schema (simplified)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  location: String,
  isEmailVerified: Boolean,
  profileImage: String,
  languages: [String],
  bio: String,
  skills: [String],
  interests: [String],
  createdAt: Date
});

async function updateAdminPassword() {
  console.log('🔧 UPDATING ADMIN PASSWORD VIA DIRECT DATABASE CONNECTION');
  console.log('='.repeat(60));
  
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');
    
    // Create User model
    const User = mongoose.model('User', userSchema);
    
    // Find admin user
    console.log('\nFinding admin user...');
    const adminUser = await User.findOne({ email: 'admin@refugeenetwork.com' });
    
    if (!adminUser) {
      console.log('❌ Admin user not found');
      
      // Create new admin user
      console.log('\nCreating new admin user...');
      const hashedPassword = await bcrypt.hash('123456', 10);
      
      const newAdmin = new User({
        name: 'Admin User',
        email: 'admin@refugeenetwork.com',
        password: hashedPassword,
        role: 'admin',
        location: 'Malaysia',
        isEmailVerified: true,
        profileImage: 'default-avatar.jpg',
        languages: ['English'],
        bio: 'Platform administrator',
        skills: ['Administration'],
        interests: ['Management'],
        createdAt: new Date()
      });
      
      await newAdmin.save();
      console.log('✅ New admin user created successfully!');
      
    } else {
      console.log('✅ Admin user found:', adminUser.email);
      console.log('   Current role:', adminUser.role);
      console.log('   Email verified:', adminUser.isEmailVerified);
      
      // Update password and verification status
      console.log('\nUpdating password and verification...');
      const hashedPassword = await bcrypt.hash('123456', 10);
      
      adminUser.password = hashedPassword;
      adminUser.isEmailVerified = true;
      adminUser.role = 'admin'; // Ensure role is admin
      
      await adminUser.save();
      console.log('✅ Admin user updated successfully!');
    }
    
    // Verify the update worked
    console.log('\nVerifying password...');
    const updatedUser = await User.findOne({ email: 'admin@refugeenetwork.com' });
    const passwordMatch = await bcrypt.compare('123456', updatedUser.password);
    
    console.log('✅ Password verification:', passwordMatch ? 'CORRECT' : 'INCORRECT');
    console.log('✅ Email verified:', updatedUser.isEmailVerified);
    console.log('✅ Role:', updatedUser.role);
    
    console.log('\n🎉 ADMIN USER READY!');
    console.log('Email: admin@refugeenetwork.com');
    console.log('Password: 123456');
    console.log('Role: admin');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

updateAdminPassword();
