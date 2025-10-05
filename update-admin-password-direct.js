#!/usr/bin/env node

/**
 * Direct Admin Password Update via MongoDB Connection
 * This script connects directly to your MongoDB Atlas database and updates the admin password
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Your MongoDB connection string from Render environment
const MONGODB_URI = 'mongodb+srv://tawfig2020:Tawfig2020@cluster0.dfz2nfi.mongodb.net/refugee-network?retryWrites=true&w=majority';

// User schema
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
}, { collection: 'users' });

async function updateAdminPassword() {
  console.log('🔧 UPDATING ADMIN PASSWORD DIRECTLY');
  console.log('='.repeat(40));
  
  try {
    // Connect to MongoDB Atlas
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB Atlas');
    
    // Create User model
    const User = mongoose.model('User', userSchema);
    
    // Find existing admin user
    console.log('\nSearching for admin user...');
    let adminUser = await User.findOne({ email: 'admin@refugeenetwork.com' });
    
    if (adminUser) {
      console.log('✅ Found existing admin user');
      console.log('   Current role:', adminUser.role);
      console.log('   Email verified:', adminUser.isEmailVerified);
      
      // Update password and verification
      console.log('\nUpdating password and verification status...');
      const newHashedPassword = await bcrypt.hash('123456', 10);
      
      await User.updateOne(
        { email: 'admin@refugeenetwork.com' },
        {
          $set: {
            password: newHashedPassword,
            isEmailVerified: true,
            role: 'admin'
          }
        }
      );
      
      console.log('✅ Admin user updated successfully!');
      
    } else {
      console.log('❌ Admin user not found, creating new one...');
      
      // Create new admin user
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
        bio: 'Platform administrator with experience in refugee support programs',
        skills: ['Administration', 'Management', 'Support'],
        interests: ['Community Service', 'Refugee Support', 'Management'],
        createdAt: new Date()
      });
      
      await newAdmin.save();
      console.log('✅ New admin user created successfully!');
    }
    
    // Verify the password works
    console.log('\nVerifying password...');
    const updatedUser = await User.findOne({ email: 'admin@refugeenetwork.com' });
    const passwordMatch = await bcrypt.compare('123456', updatedUser.password);
    
    console.log('✅ Password verification:', passwordMatch ? 'SUCCESS' : 'FAILED');
    console.log('✅ Email verified:', updatedUser.isEmailVerified);
    console.log('✅ User role:', updatedUser.role);
    
    console.log('\n🎉 ADMIN USER IS READY!');
    console.log('Email: admin@refugeenetwork.com');
    console.log('Password: 123456');
    console.log('Role: admin');
    console.log('Status: Ready for login');
    
  } catch (error) {
    console.error('❌ Error updating admin password:', error.message);
    if (error.code === 11000) {
      console.log('💡 Duplicate key error - admin user already exists with different data');
    }
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

updateAdminPassword();
