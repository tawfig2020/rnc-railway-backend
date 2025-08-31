#!/usr/bin/env node

/**
 * Seed Admin User
 * Create admin user in MongoDB database
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// User Schema (simplified)
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'staff', 'refugee', 'volunteer', 'partner', 'vendor'], default: 'refugee' },
  location: { type: String, required: true },
  isEmailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function seedAdminUser() {
  try {
    console.log('🌱 SEEDING ADMIN USER');
    console.log('='.repeat(30));
    
    // Connect to MongoDB
    const mongoURI = 'mongodb+srv://tawfig2020ifbp:bdLp5inJJ05ZcbFN@rncmalaysia.dfz2nfi.mongodb.net/refugee-network';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');
    
    // Check if admin exists
    const existingAdmin = await User.findOne({ email: 'admin@refugeenetwork.com' });
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log('   Email:', existingAdmin.email);
      console.log('   Role:', existingAdmin.role);
      console.log('   Verified:', existingAdmin.isEmailVerified);
      
      // Update password to ensure it's correct
      const hashedPassword = await bcrypt.hash('123456', 12);
      await User.updateOne(
        { email: 'admin@refugeenetwork.com' },
        { 
          password: hashedPassword,
          isEmailVerified: true,
          role: 'admin'
        }
      );
      console.log('✅ Admin password updated and verified');
    } else {
      // Create admin user
      console.log('Creating admin user...');
      const hashedPassword = await bcrypt.hash('123456', 12);
      
      const adminUser = new User({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@refugeenetwork.com',
        password: hashedPassword,
        role: 'admin',
        location: 'Malaysia',
        isEmailVerified: true
      });
      
      await adminUser.save();
      console.log('✅ Admin user created successfully');
    }
    
    // Create other test users
    const testUsers = [
      { firstName: 'Refugee', lastName: 'User', email: 'refugee@example.com', role: 'refugee', location: 'Malaysia' },
      { firstName: 'Volunteer', lastName: 'User', email: 'volunteer@example.com', role: 'volunteer', location: 'Malaysia' },
      { firstName: 'Staff', lastName: 'User', email: 'staff@refugeenetwork.com', role: 'staff', location: 'Malaysia' }
    ];
    
    for (const userData of testUsers) {
      const existing = await User.findOne({ email: userData.email });
      if (!existing) {
        const hashedPassword = await bcrypt.hash('123456', 12);
        const user = new User({
          ...userData,
          password: hashedPassword,
          isEmailVerified: true
        });
        await user.save();
        console.log(`✅ Created ${userData.role}: ${userData.email}`);
      } else {
        console.log(`✅ ${userData.role} already exists: ${userData.email}`);
      }
    }
    
    console.log('\n🎉 DATABASE SEEDING COMPLETE');
    console.log('\n🧪 TEST CREDENTIALS:');
    console.log('ADMIN:     admin@refugeenetwork.com    | 123456');
    console.log('REFUGEE:   refugee@example.com         | 123456');
    console.log('VOLUNTEER: volunteer@example.com       | 123456');
    console.log('STAFF:     staff@refugeenetwork.com    | 123456');
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

seedAdminUser();
