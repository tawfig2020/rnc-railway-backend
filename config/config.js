const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    port: process.env.PORT || 5000,
    mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/refugee-network',
    jwtSecret: process.env.JWT_SECRET || 'dev_secret',
    jwtExpire: process.env.JWT_EXPIRE || '30d',
    email: {
      service: process.env.EMAIL_SERVICE,
      username: process.env.EMAIL_USERNAME,
      password: process.env.EMAIL_PASSWORD,
      from: process.env.EMAIL_FROM || 'noreply@refugeenetwork.com'
    }
  },
  test: {
    port: process.env.PORT || 5000,
    mongoURI: process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/refugee-network-test',
    jwtSecret: process.env.JWT_SECRET || 'test_secret',
    jwtExpire: process.env.JWT_EXPIRE || '30d',
    email: {
      service: process.env.EMAIL_SERVICE,
      username: process.env.EMAIL_USERNAME,
      password: process.env.EMAIL_PASSWORD,
      from: process.env.EMAIL_FROM || 'noreply@refugeenetwork.com'
    }
  },
  production: {
    port: process.env.PORT || 5000,
    mongoURI: process.env.MONGODB_URI_PRODUCTION,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpire: process.env.JWT_EXPIRE || '30d',
    email: {
      service: process.env.EMAIL_SERVICE,
      username: process.env.EMAIL_USERNAME,
      password: process.env.EMAIL_PASSWORD,
      from: process.env.EMAIL_FROM || 'noreply@refugeenetwork.com'
    }
  }
};

module.exports = config[env];
