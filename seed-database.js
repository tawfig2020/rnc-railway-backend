#!/usr/bin/env node

/**
 * Database Seeding Script
 * Creates comprehensive test users for all roles
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('./config/config');

// Load models
require('./models/User');
const User = mongoose.model('User');

// Comprehensive test users for all roles
const testUsers = [
  {
    name: 'Admin User',
    email: 'admin@refugeenetwork.com',
    password: '123456',
    role: 'admin',
    location: 'Kuala Lumpur, Malaysia',
    languages: ['English', 'Malay'],
    isEmailVerified: true,
    bio: 'System administrator with full access'
  },
  {
    name: 'Refugee User',
    email: 'refugee@example.com',
    password: '123456',
    role: 'refugee',
    location: 'Selangor, Malaysia',
    languages: ['Arabic', 'English'],
    isEmailVerified: true,
    bio: 'Refugee seeking community support and resources'
  },
  {
    name: 'Volunteer Helper',
    email: 'volunteer@example.com',
    password: '123456',
    role: 'volunteer',
    location: 'Penang, Malaysia',
    languages: ['English', 'Malay', 'Tamil'],
    isEmailVerified: true,
    bio: 'Community volunteer helping refugees integrate'
  },
  {
    name: 'Staff Member',
    email: 'staff@refugeenetwork.com',
    password: '123456',
    role: 'staff',
    location: 'Johor Bahru, Malaysia',
    languages: ['English', 'Malay'],
    isEmailVerified: true,
    bio: 'RNC staff member managing programs and services'
  },
  {
    name: 'Partner Organization',
    email: 'partner@example.com',
    password: '123456',
    role: 'partner',
    location: 'Kuching, Malaysia',
    languages: ['English', 'Malay'],
    isEmailVerified: true,
    bio: 'Partner organization providing specialized services'
  },
  {
    name: 'Vendor Business',
    email: 'vendor@example.com',
    password: '123456',
    role: 'vendor',
    location: 'Kota Kinabalu, Malaysia',
    languages: ['English', 'Malay'],
    isEmailVerified: true,
    bio: 'Local business vendor offering products and services'
  },
  {
    name: 'Test User',
    email: 'test@example.com',
    password: '123456',
    role: 'refugee',
    location: 'Shah Alam, Malaysia',
    languages: ['English'],
    isEmailVerified: true,
    bio: 'General test user for system testing'
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting Database Seeding...');
    console.log('='.repeat(40));
    
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected Successfully');
    
    // Clear existing test users (optional)
    console.log('\n🧹 Clearing existing test users...');
    const testEmails = testUsers.map(user => user.email);
    await User.deleteMany({ email: { $in: testEmails } });
    console.log(`✅ Cleared ${testEmails.length} existing test users`);
    
    // Create new users
    console.log('\n👥 Creating test users...');
    const createdUsers = [];
    
    for (const userData of testUsers) {
      try {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        
        // Create user
        const user = new User({
          ...userData,
          password: hashedPassword
        });
        
        await user.save();
        createdUsers.push(user);
        
        console.log(`   ✅ Created: ${userData.role.toUpperCase()} - ${userData.email}`);
        
      } catch (error) {
        console.log(`   ❌ Failed to create ${userData.email}: ${error.message}`);
      }
    }
    
    console.log(`\n🎉 Successfully created ${createdUsers.length} test users!`);
    
    // Display credentials
    console.log('\n🔐 TEST CREDENTIALS:');
    console.log('='.repeat(30));
    testUsers.forEach(user => {
      console.log(`${user.role.toUpperCase().padEnd(10)} | ${user.email.padEnd(30)} | ${user.password}`);
    });
    
    console.log('\n📊 USER ROLES CREATED:');
    const roleCounts = {};
    testUsers.forEach(user => {
      roleCounts[user.role] = (roleCounts[user.role] || 0) + 1;
    });
    
    Object.entries(roleCounts).forEach(([role, count]) => {
      console.log(`   ${role.toUpperCase()}: ${count} user(s)`);
    });
    
    console.log('\n✅ Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error.message);
    
    if (error.message.includes('IP')) {
      console.log('\n🔧 SOLUTION: Update MongoDB Atlas IP Whitelist');
      console.log('1. Go to MongoDB Atlas → Network Access');
      console.log('2. Add IP: 0.0.0.0/0 (Allow access from anywhere)');
      console.log('3. Wait for status to become Active');
      console.log('4. Run this script again');
    }
    
  } finally {
    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
  }
}

// Run the seeding
seedDatabase();
