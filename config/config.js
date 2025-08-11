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
    // Try environment variable first, then fallback to local MongoDB, then hardcoded Atlas URI as last resort
    mongoURI: getMongoURI(process.env.MONGODB_URI) || process.env.MONGODB_URI_LOCAL || 'mongodb+srv://tawfig2020ifbp:bdLp5inJJ05ZcbFN@rncmalaysia.dfz2nfi.mongodb.net/refugee-network',
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
    mongoURI: process.env.MONGODB_URI_TEST || 'mongodb+srv://tawfig2020ifbp:bdLp5inJJ05ZcbFN@rncmalaysia.dfz2nfi.mongodb.net/refugee-network-test',
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
    mongoURI: process.env.MONGODB_URI_PRODUCTION || 'mongodb+srv://tawfig2020ifbp:bdLp5inJJ05ZcbFN@rncmalaysia.dfz2nfi.mongodb.net/refugee-network',
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
