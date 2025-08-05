const rateLimit = require('express-rate-limit');
const config = require('../config/config');

/**
 * Standard rate limiter for general API endpoints
 * Limits requests based on IP address
 */
const standardLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: config.rateLimit.standardHeaders,
  legacyHeaders: config.rateLimit.legacyHeaders,
  message: { error: 'Too many requests, please try again later' }
});

/**
 * Stricter rate limiter for authentication endpoints
 * Provides additional security for login, registration, etc.
 */
const authLimiter = rateLimit({
  windowMs: config.authRateLimit.windowMs,
  max: config.authRateLimit.max,
  standardHeaders: config.authRateLimit.standardHeaders,
  legacyHeaders: config.authRateLimit.legacyHeaders,
  message: config.authRateLimit.message
});

module.exports = {
  standardLimiter,
  authLimiter
};
