const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { authLimiter } = require('../middleware/rateLimiter');

const User = mongoose.model('User');
const RefreshToken = mongoose.model('RefreshToken');

/**
 * @route   POST /api/refresh-token
 * @desc    Refresh access token using refresh token
 * @access  Public
 */
router.post('/', authLimiter, async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }
    
    // Find the refresh token in the database
    const storedRefreshToken = await RefreshToken.findOne({ token: refreshToken });
    
    if (!storedRefreshToken) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    
    // Check if the token is active (not expired and not revoked)
    if (!storedRefreshToken.isActive()) {
      return res.status(401).json({ error: 'Refresh token expired or revoked' });
    }
    
    // Verify the refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, config.jwtRefreshSecret);
    } catch (err) {
      // If token verification fails, revoke the token
      storedRefreshToken.revoke();
      await storedRefreshToken.save();
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    
    // Get the user associated with the token
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Generate new tokens
    const newAccessToken = user.getSignedJwtToken();
    const newRefreshToken = user.getRefreshToken();
    
    // Create a new refresh token document
    const newRefreshTokenDoc = new RefreshToken({
      token: newRefreshToken,
      user: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    
    // Revoke the old refresh token and link it to the new one
    storedRefreshToken.revoke(newRefreshToken);
    
    // Save both tokens
    await Promise.all([
      storedRefreshToken.save(),
      newRefreshTokenDoc.save()
    ]);
    
    // Return the new tokens
    res.json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (err) {
    console.error('Refresh token error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   POST /api/refresh-token/revoke
 * @desc    Revoke a refresh token (logout)
 * @access  Public
 */
router.post('/revoke', authLimiter, async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }
    
    // Find the refresh token in the database
    const storedRefreshToken = await RefreshToken.findOne({ token: refreshToken });
    
    if (!storedRefreshToken) {
      return res.status(200).json({ success: true, message: 'Token already revoked or not found' });
    }
    
    // Revoke the token
    storedRefreshToken.revoke();
    await storedRefreshToken.save();
    
    res.json({ success: true, message: 'Token revoked successfully' });
  } catch (err) {
    console.error('Revoke token error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
