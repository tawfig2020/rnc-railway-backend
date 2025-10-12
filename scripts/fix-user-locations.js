/**
 * Script to fix users without location field
 * This adds a default location to all users missing this required field
 */

const mongoose = require('mongoose');
const config = require('../config/config');

// Connect to MongoDB
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Load User model
require('../models/User');
const User = mongoose.model('User');

async function fixUserLocations() {
  try {
    console.log('🔍 Finding users without location...');
    
    // Find all users without location or with empty location
    const usersWithoutLocation = await User.find({
      $or: [
        { location: { $exists: false } },
        { location: null },
        { location: '' }
      ]
    });

    console.log(`Found ${usersWithoutLocation.length} users without location`);

    if (usersWithoutLocation.length === 0) {
      console.log('✅ All users have location field!');
      process.exit(0);
    }

    // Update each user
    for (const user of usersWithoutLocation) {
      console.log(`Updating user: ${user.email}`);
      
      user.location = 'Kuala Lumpur, Malaysia'; // Default location
      await user.save();
      
      console.log(`✅ Updated ${user.email}`);
    }

    console.log(`\n✅ Successfully updated ${usersWithoutLocation.length} users!`);
    process.exit(0);

  } catch (error) {
    console.error('❌ Error fixing user locations:', error);
    process.exit(1);
  }
}

// Run the fix
fixUserLocations();
