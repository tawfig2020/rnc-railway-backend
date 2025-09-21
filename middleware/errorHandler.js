const { logger } = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  // Log the error securely without exposing sensitive information
  const errorMetadata = {
    url: req.originalUrl,
    method: req.method,
    userAgent: req.get('User-Agent'),
    ip: req.ip || req.connection.remoteAddress,
    userId: req.user ? req.user.id : 'anonymous',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    errorName: err.name,
    statusCode: err.statusCode
  };
  
  logger.error(`API Error: ${err.message}`, errorMetadata);

  // Check for Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      error: messages
    });
  }

  // Check for Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: 'Duplicate field value entered'
    });
  }

  // Check for Mongoose casting error
  if (err.name === 'CastError') {
    return res.status(404).json({
      success: false,
      error: `Resource not found with id of ${err.value}`
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expired'
    });
  }

  // Default server error
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error'
  });
};

module.exports = errorHandler;
