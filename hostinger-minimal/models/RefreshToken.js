const mongoose = require('mongoose');
const crypto = require('crypto');

/**
 * Refresh Token Schema
 * Stores refresh tokens for JWT authentication
 */
const RefreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  revoked: {
    type: Boolean,
    default: false
  },
  revokedAt: {
    type: Date
  },
  replacedByToken: {
    type: String
  },
  userAgent: {
    type: String
  },
  ipAddress: {
    type: String
  }
});

// Add index for faster queries
RefreshTokenSchema.index({ user: 1, revoked: 1 });
RefreshTokenSchema.index({ token: 1 });
RefreshTokenSchema.index({ expiresAt: 1 });

/**
 * Generate a new refresh token
 * @param {Object} user - User object
 * @param {String} ipAddress - IP address of the client
 * @param {String} userAgent - User agent of the client
 * @returns {Object} - Refresh token object
 */
RefreshTokenSchema.statics.generateRefreshToken = function(user, ipAddress, userAgent) {
  // Create expiration date - 7 days from now
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  
  // Generate a random token
  const token = crypto.randomBytes(40).toString('hex');
  
  // Create and return the refresh token
  return new this({
    token,
    user: user._id,
    expiresAt,
    ipAddress,
    userAgent
  });
};

/**
 * Check if the refresh token is expired
 * @returns {Boolean} - True if expired, false otherwise
 */
RefreshTokenSchema.methods.isExpired = function() {
  return new Date() >= this.expiresAt;
};

/**
 * Check if the refresh token is revoked
 * @returns {Boolean} - True if revoked, false otherwise
 */
RefreshTokenSchema.methods.isRevoked = function() {
  return this.revoked;
};

/**
 * Check if the refresh token is active
 * @returns {Boolean} - True if active, false otherwise
 */
RefreshTokenSchema.methods.isActive = function() {
  return !this.isRevoked() && !this.isExpired();
};

/**
 * Revoke the refresh token
 * @param {String} replacedByToken - New token that replaces this one
 */
RefreshTokenSchema.methods.revoke = function(replacedByToken = null) {
  this.revoked = true;
  this.revokedAt = new Date();
  this.replacedByToken = replacedByToken;
};

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);
