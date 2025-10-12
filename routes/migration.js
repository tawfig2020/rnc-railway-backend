const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const adminAuth = require('../middleware/adminAuth');
const auth = require('../middleware/auth');

// @route   POST /api/migration/fix-user-locations
// @desc    Fix users without location field (ADMIN ONLY)
// @access  Private (Admin)
router.post('/fix-user-locations', [auth, adminAuth], async (req, res) => {
  try {
    console.log('🔍 Starting user location migration...');
    
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
      return res.json({
        success: true,
        message: 'All users already have location field!',
        updated: 0
      });
    }

    // Update each user
    const updatedUsers = [];
    for (const user of usersWithoutLocation) {
      console.log(`Updating user: ${user.email}`);
      
      user.location = 'Kuala Lumpur, Malaysia';
      await user.save();
      
      updatedUsers.push({
        email: user.email,
        name: user.name
      });
      
      console.log(`✅ Updated ${user.email}`);
    }

    console.log(`✅ Successfully updated ${usersWithoutLocation.length} users!`);

    res.json({
      success: true,
      message: `Successfully updated ${usersWithoutLocation.length} users!`,
      updated: usersWithoutLocation.length,
      users: updatedUsers
    });

  } catch (error) {
    console.error('❌ Error fixing user locations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user locations',
      message: error.message
    });
  }
});

// @route   GET /api/migration/check-user-locations
// @desc    Check how many users need location fix (ADMIN ONLY)
// @access  Private (Admin)
router.get('/check-user-locations', [auth, adminAuth], async (req, res) => {
  try {
    const usersWithoutLocation = await User.find({
      $or: [
        { location: { $exists: false } },
        { location: null },
        { location: '' }
      ]
    }).select('email name');

    res.json({
      success: true,
      count: usersWithoutLocation.length,
      users: usersWithoutLocation.map(u => ({
        email: u.email,
        name: u.name
      }))
    });

  } catch (error) {
    console.error('Error checking user locations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check user locations',
      message: error.message
    });
  }
});

module.exports = router;
