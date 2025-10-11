const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');

/**
 * Middleware to check if user is a registered member (has completed profile)
 * This ensures only members can access certain features like blog, forum, etc.
 */
module.exports = async function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'No token, authorization denied. Please login to access this feature.' 
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Check if profile is completed (member status)
    if (!user.profileCompleted) {
      return res.status(403).json({ 
        success: false,
        message: 'Please complete your profile to access this feature',
        requiresProfileCompletion: true,
        redirectTo: '/complete-profile'
      });
    }

    // User is a valid member, attach to request
    req.user = decoded;
    req.userDetails = user;
    next();
  } catch (err) {
    console.error('Member auth error:', err.message);
    res.status(401).json({ 
      success: false,
      message: 'Token is not valid' 
    });
  }
};
