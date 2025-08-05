const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/refugee_network_centre');
    console.log('✅ Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    return false;
  }
};

const verifyAdminUser = async () => {
  console.log('🔍 Verifying admin user...');
  
  try {
    const adminUser = await User.findOne({ email: 'admin@refugeenetwork.com' });
    
    if (!adminUser) {
      console.log('❌ Admin user not found. Creating admin user...');
      
      // Create admin user
      const hashedPassword = await bcrypt.hash('Admin@123', 12);
      
      const newAdmin = new User({
        name: 'Admin User',
        email: 'admin@refugeenetwork.com',
        password: hashedPassword,
        role: 'admin',
        isEmailVerified: true,
        profile: {
          firstName: 'Admin',
          lastName: 'User'
        }
      });
      
      await newAdmin.save();
      console.log('✅ Admin user created successfully');
      return true;
    } else {
      console.log('✅ Admin user found');
      console.log('   Email:', adminUser.email);
      console.log('   Role:', adminUser.role);
      console.log('   Email Verified:', adminUser.isEmailVerified);
      
      // Verify password
      console.log('🔐 Checking password...');
      const isPasswordValid = await bcrypt.compare('Admin@123', adminUser.password || '');
      if (isPasswordValid) {
        console.log('✅ Admin password is correct');
      } else {
        console.log('❌ Admin password is incorrect. Updating...');
        
        const hashedPassword = await bcrypt.hash('Admin@123', 12);
        adminUser.password = hashedPassword;
        adminUser.isEmailVerified = true;
        adminUser.role = 'admin';
        await adminUser.save();
        
        console.log('✅ Admin password updated');
      }
      
      return true;
    }
  } catch (error) {
    console.error('❌ Error verifying admin user:', error.message);
    return false;
  }
};

const main = async () => {
  console.log('🧪 ADMIN USER VERIFICATION');
  console.log('==========================');
  
  const connected = await connectDB();
  if (!connected) {
    process.exit(1);
  }
  
  const verified = await verifyAdminUser();
  
  await mongoose.connection.close();
  console.log('🔌 Database connection closed');
  
  if (verified) {
    console.log('🎉 Admin verification complete');
    process.exit(0);
  } else {
    console.log('❌ Admin verification failed');
    process.exit(1);
  }
};

main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
