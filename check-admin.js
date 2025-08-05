const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Set up MongoDB connection
const uri = process.env.NODE_ENV === 'production' 
  ? process.env.MONGODB_URI_PRODUCTION 
  : process.env.MONGODB_URI;

console.log('Connecting to MongoDB to check for admin accounts...');

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
    // Check for any admin accounts
    const admins = await User.find({ role: 'admin' });
    
    if (admins.length > 0) {
      console.log('\n=== ADMIN ACCOUNTS FOUND ===');
      admins.forEach((admin, index) => {
        console.log(`\nAdmin #${index + 1}:`);
        console.log(`Name: ${admin.name}`);
        console.log(`Email: ${admin.email}`);
        console.log(`ID: ${admin._id}`);
        console.log(`Email Verified: ${admin.isEmailVerified ? 'Yes' : 'No'}`);
      });
      console.log('\nUse one of these email addresses to log in. If you don\'t know the password, use Option 2 below to reset it.');
    } else {
      console.log('\n=== NO ADMIN ACCOUNTS FOUND ===');
      console.log('You need to create a new admin account using the create-admin.js script.');
    }
  } catch (err) {
    console.error('Error finding admin accounts:', err);
  }
  
  mongoose.disconnect();
  console.log('Disconnected from MongoDB');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});
