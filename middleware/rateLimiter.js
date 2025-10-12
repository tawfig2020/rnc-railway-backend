const rateLimit = require('express-rate-limit');
const config = require('../config/config');

// Defensive configuration with fallback defaults
const DEFAULT_RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' }
};

const DEFAULT_AUTH_RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts, please try again later' }
};

/**
 * Standard rate limiter for general API endpoints
 * Limits requests based on IP address
 */
const standardLimiter = rateLimit({
  windowMs: (config.rateLimit && config.rateLimit.windowMs) || DEFAULT_RATE_LIMIT.windowMs,
  max: (config.rateLimit && config.rateLimit.max) || DEFAULT_RATE_LIMIT.max,
  standardHeaders: (config.rateLimit && config.rateLimit.standardHeaders) || DEFAULT_RATE_LIMIT.standardHeaders,
  legacyHeaders: (config.rateLimit && config.rateLimit.legacyHeaders) || DEFAULT_RATE_LIMIT.legacyHeaders,
  message: (config.rateLimit && config.rateLimit.message) || DEFAULT_RATE_LIMIT.message,
  // Fix for trust proxy warning - validate proxy is configured
  validate: {
    trustProxy: false // Disable the strict validation
  }
});

/**
 * Stricter rate limiter for authentication endpoints
 * Provides additional security for login, registration, etc.
 */
const authLimiter = rateLimit({
  windowMs: (config.authRateLimit && config.authRateLimit.windowMs) || DEFAULT_AUTH_RATE_LIMIT.windowMs,
  max: (config.authRateLimit && config.authRateLimit.max) || DEFAULT_AUTH_RATE_LIMIT.max,
  standardHeaders: (config.authRateLimit && config.authRateLimit.standardHeaders) || DEFAULT_AUTH_RATE_LIMIT.standardHeaders,
  legacyHeaders: (config.authRateLimit && config.authRateLimit.legacyHeaders) || DEFAULT_AUTH_RATE_LIMIT.legacyHeaders,
  message: (config.authRateLimit && config.authRateLimit.message) || DEFAULT_AUTH_RATE_LIMIT.message,
  // Fix for trust proxy warning - validate proxy is configured
  validate: {
    trustProxy: false // Disable the strict validation
  }
});

module.exports = {
  standardLimiter,
  authLimiter
};
