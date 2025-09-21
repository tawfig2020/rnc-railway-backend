const mongoose = require('mongoose');
const User = mongoose.model('User');

/**
 * Volunteer Authentication Middleware
 * Verifies user has volunteer, staff, or admin role
 * This middleware should be used after the auth middleware
 */
module.exports = async function(req, res, next) {
  try {
    // Check if req.user exists (auth middleware should set this)
    if (!req.user) {
      return res.status(401).json({ error: 'Not authorized, no user found' });
    }
    
    // Check if user is volunteer, staff or admin
    if (req.user.role !== 'volunteer' && req.user.role !== 'staff' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Volunteer privileges required' });
    }
    
    next();
  } catch (err) {
    console.error('Volunteer auth error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
