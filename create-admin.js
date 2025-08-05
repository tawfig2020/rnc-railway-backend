const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Set up MongoDB connection
const uri = process.env.NODE_ENV === 'production' 
  ? process.env.MONGODB_URI_PRODUCTION 
  : process.env.MONGODB_URI;

// Admin account details - you can change these before running
const adminDetails = {
  name: 'Admin User',
  email: 'admin@refugeenetwork.com',
  password: 'Admin@123',
  location: 'System',
  role: 'admin',
  isEmailVerified: true
};

console.log('Connecting to MongoDB to create admin account...');

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  // Import the User model
  require('./models/User');
  const User = mongoose.model('User');
  
  try {
    // Check if admin with this email already exists
    const existingAdmin = await User.findOne({ email: adminDetails.email });
    
    if (existingAdmin) {
      console.log(`\nAdmin account with email ${adminDetails.email} already exists.`);
      console.log('Updating password for this account instead...');
      
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminDetails.password, salt);
      
      // Update user
      existingAdmin.password = hashedPassword;
      existingAdmin.isEmailVerified = true;
      await existingAdmin.save();
      
      console.log('\n=== ADMIN PASSWORD UPDATED ===');
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Password: ${adminDetails.password}`);
      console.log('\nYou can now log in with these credentials.');
    } else {
      // Create new admin user
      const user = new User({
        name: adminDetails.name,
        email: adminDetails.email,
        password: adminDetails.password, // Will be hashed via pre-save hook
        location: adminDetails.location,
        role: adminDetails.role,
        isEmailVerified: adminDetails.isEmailVerified
      });
      
      await user.save();
      
      console.log('\n=== ADMIN ACCOUNT CREATED ===');
      console.log(`Email: ${adminDetails.email}`);
      console.log(`Password: ${adminDetails.password}`);
      console.log('\nYou can now log in with these credentials.');
    }
  } catch (err) {
    console.error('Error creating admin account:', err);
  }
  
  mongoose.disconnect();
  console.log('Disconnected from MongoDB');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});
