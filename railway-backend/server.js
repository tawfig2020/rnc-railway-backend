const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS Configuration - Allow your Hostinger frontend
const allowedOrigins = [
  'https://rncmalaysia.net',
  'https://www.rncmalaysia.net',
  'http://localhost:3000', // For development
  'http://127.0.0.1:3000'
];

// Add environment-specific origins
if (process.env.CORS_ORIGIN) {
  const envOrigins = process.env.CORS_ORIGIN.split(',').map(origin => origin.trim());
  allowedOrigins.push(...envOrigins);
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'Accept']
}));

app.use(express.json());

// MongoDB Connection
const mongoose = require('mongoose');
const config = require('./config/config');

let isDbConnected = false;

console.log('🔗 Attempting MongoDB connection...');
console.log('📍 MongoDB URI:', config.mongoURI ? 'Set' : 'Not set');

mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000, // 10 second timeout
  socketTimeoutMS: 45000, // 45 second socket timeout
}).then(() => {
  console.log('✅ MongoDB Connected to Atlas');
  isDbConnected = true;
}).catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  console.error('🔍 Full error:', err);
  isDbConnected = false;
});

// Monitor connection status
mongoose.connection.on('connected', () => {
  console.log('🟢 Mongoose connected to MongoDB Atlas');
  isDbConnected = true;
});

mongoose.connection.on('error', (err) => {
  console.error('🔴 Mongoose connection error:', err);
  isDbConnected = false;
});

mongoose.connection.on('disconnected', () => {
  console.log('🟡 Mongoose disconnected from MongoDB Atlas');
  isDbConnected = false;
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'RNC Malaysia Backend - Railway Deployment',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    database: isDbConnected ? 'Connected' : 'Disconnected',
    mongoUri: process.env.MONGODB_URI ? 'Set' : 'Not set',
    mongoState: mongoose.connection.readyState, // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
    cors: allowedOrigins
  });
});

// API root endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'RNC Malaysia API - Railway Backend',
    status: 'active',
    version: '1.0.0',
    database: isDbConnected ? 'Connected' : 'Disconnected'
  });
});

// API Routes - Only serve real routes when DB is connected
app.use('/api', (req, res, next) => {
  if (!isDbConnected) {
    return res.status(503).json({
      error: 'Service temporarily unavailable',
      reason: 'Database not connected'
    });
  }
  next();
});

// Load API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/profiles'));
app.use('/api/profile', require('./routes/profiles'));
app.use('/api/blog', require('./routes/blogs'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/events', require('./routes/events'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/health', require('./routes/health'));
app.use('/api/support', require('./routes/support'));

// Catch-all for undefined routes
app.get('*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    message: 'This is a backend API server. Frontend is hosted at https://rncmalaysia.net'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 RNC Malaysia Backend running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API root: http://localhost:${PORT}/api`);
  console.log(`✅ CORS origins:`, allowedOrigins);
});
