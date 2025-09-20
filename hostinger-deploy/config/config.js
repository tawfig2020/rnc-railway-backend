const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Helper function to properly handle MongoDB URI with special characters in password
function getMongoURI(uri) {
  if (!uri) return null;
  
  try {
    // Extract parts of the connection string
    const matches = uri.match(/^(mongodb\+srv?:\/\/)([^:]+):([^@]+)@(.+)$/);
    if (!matches) return uri; // Return original if format doesn't match expected pattern
    
    const [_, protocol, username, password, rest] = matches;
    // Properly encode the password portion only
    return `${protocol}${encodeURIComponent(username)}:${encodeURIComponent(password)}@${rest}`;
  } catch (err) {
    console.error('Error encoding MongoDB URI:', err.message);
    return uri; // Return original on error
  }
}

const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    port: process.env.PORT || 5000,
    // Use env, otherwise fall back to local Mongo in development only
    mongoURI: getMongoURI(process.env.MONGODB_URI) || process.env.MONGODB_URI_LOCAL || 'mongodb://localhost:27017/rnc',
    // Enhanced JWT security with shorter expiration
    jwtSecret: process.env.JWT_SECRET || 'dev_secret',
    jwtExpire: process.env.JWT_EXPIRE || '1h', // Reduced from 30d to 1h
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret',
    jwtRefreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d', // 7 days for refresh token
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    fromName: process.env.FROM_NAME || 'Refugee Network Centre',
    fromEmail: process.env.FROM_EMAIL || 'noreply@refugeenetwork.com',
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.example.com',
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      user: process.env.SMTP_USER || '',
      password: process.env.SMTP_PASSWORD || ''
    },
    // Rate limiting configuration
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per windowMs
      standardHeaders: true,
      legacyHeaders: false
    },
    // Authentication rate limiting (more strict)
    authRateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 10, // Limit each IP to 10 login attempts per windowMs
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: 'Too many login attempts, please try again later' }
    }
  },
  test: {
    port: process.env.PORT || 5000,
    // Use env, otherwise fall back to local Mongo for tests
    mongoURI: process.env.MONGODB_URI_TEST || process.env.MONGODB_URI_LOCAL || 'mongodb://localhost:27017/rnc-test',
    // Enhanced JWT security with shorter expiration
    jwtSecret: process.env.JWT_SECRET || 'test_secret',
    jwtExpire: process.env.JWT_EXPIRE || '1h', // Reduced from 30d to 1h
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'test_refresh_secret',
    jwtRefreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d', // 7 days for refresh token
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    fromName: process.env.FROM_NAME || 'Refugee Network Centre',
    fromEmail: process.env.FROM_EMAIL || 'noreply@refugeenetwork.com',
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.example.com',
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      user: process.env.SMTP_USER || '',
      password: process.env.SMTP_PASSWORD || ''
    }
  },
  production: {
    port: process.env.PORT || 5000,
    // In production, require env-provided URI (validated in server startup)
    mongoURI: process.env.MONGODB_URI || process.env.MONGODB_URI_PRODUCTION,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpire: process.env.JWT_EXPIRE || '30d',
    frontendUrl: process.env.FRONTEND_URL || 'https://refugeenetwork.com',
    fromName: process.env.FROM_NAME || 'Refugee Network Centre',
    fromEmail: process.env.FROM_EMAIL || 'noreply@refugeenetwork.com',
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.example.com',
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      user: process.env.SMTP_USER || '',
      password: process.env.SMTP_PASSWORD || ''
    },
    // Rate limiting configuration for production
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // Limit each IP to 100 requests per windowMs
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: 'Too many requests, please try again later' }
    },
    // Authentication rate limiting (more strict for production)
    authRateLimit: {
      windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
      max: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS) || 5, // Limit each IP to 5 login attempts per windowMs
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: 'Too many login attempts, please try again later' }
    }
  }
};

module.exports = config[env];
