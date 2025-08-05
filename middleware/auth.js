const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const config = require('../config/config');

// Error messages
const ERROR_MESSAGES = {
  NO_TOKEN: 'No token, authorization denied',
  INVALID_TOKEN: 'Token is not valid',
  EXPIRED_TOKEN: 'Token has expired, please login again',
  USER_NOT_FOUND: 'User not found'
};

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 */
module.exports = async function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ error: ERROR_MESSAGES.NO_TOKEN });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Get user from token payload
    // The token contains {id, role, email} from our updated token structure
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: ERROR_MESSAGES.USER_NOT_FOUND });
    }
    
    // Set user in request
    req.user = user;
    
    // Add token data to request for potential use in other middleware
    req.tokenData = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
      exp: decoded.exp
    };
    
    next();
  } catch (err) {
    console.error('Auth error:', err);
    
    // Provide more specific error messages
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: ERROR_MESSAGES.EXPIRED_TOKEN,
        code: 'TOKEN_EXPIRED'
      });
    }
    
    res.status(401).json({ error: ERROR_MESSAGES.INVALID_TOKEN });
  }
};
