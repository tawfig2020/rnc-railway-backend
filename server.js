const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const config = require('./config/config');
const errorHandler = require('./middleware/errorHandler');
const { standardLimiter } = require('./middleware/rateLimiter');
const { updateMongoDBAtlasIpWhitelist } = require('./utils/mongodbAtlasIpManager');

// Load models
require('./models/User');
require('./models/RefreshToken'); // Added for JWT refresh token support
require('./models/BlogPost');
require('./models/Course');
require('./models/Event');
require('./models/Resource');
require('./models/Product');
require('./models/Vendor');
require('./models/Order');
require('./models/Campaign');
require('./models/Donation');
require('./models/Profile');
require('./models/HealthRecord');
require('./models/Support');
require('./models/Service');
require('./models/Category');
require('./models/Discount');
require('./models/Address');
require('./models/ForumQuestion');
require('./models/AIResource');
require('./models/UserConsent');

const app = express();

// Middleware
// CORS Configuration - supports both development and production
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000', 
  'http://127.0.0.1:3000',
  'http://rncmalaysia.org',
  'https://rncmalaysia.org',
  'https://www.rncmalaysia.org',
  'https://rncplatform.netlify.app',
  'http://rnc.malaysia.org',
  'https://rnc.malaysia.org',
  'https://www.rnc.malaysia.org',
  'http://rncmalaysia.net',
  'https://rncmalaysia.net',
  'https://www.rncmalaysia.net'
];

// Add environment-specific origins
if (process.env.CORS_ORIGIN) {
  const envOrigins = process.env.CORS_ORIGIN.split(',').map(origin => origin.trim());
  allowedOrigins.push(...envOrigins);
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'Accept']
}));
app.use(express.json({ extended: false }));

// Trust proxy for Render deployment (fixes rate limiting)
app.set('trust proxy', true);

// Note: Avoid setting permissive wildcard CORS headers manually here.
// The cors() middleware above already handles allowed origins and headers.
// Adding '*' with credentials true breaks browsers; keep configuration centralized.

// MongoDB Connection
const connectDB = async () => {
  try {
    // Attempt to update MongoDB Atlas IP whitelist before connecting
    // The automatic IP whitelisting is ideal for local development but not for a cloud deployment environment like Render.
    // In production, it's better to whitelist Render's IP ranges or 0.0.0.0/0 in the MongoDB Atlas UI and rely on strong credentials.
    // This logic is disabled to prevent potential startup failures or delays in production.
    /* try {
      console.log('Attempting to update MongoDB Atlas IP whitelist...');
      await updateMongoDBAtlasIpWhitelist();
      console.log('IP whitelist update process completed');
    } catch (ipError) {
      console.warn('Failed to update IP whitelist, will still attempt connection:', ipError.message);
      // Continue with connection attempt even if IP update fails
    } */

    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn('Running in test mode with mock database');
    return false;
  }
};

// Mock data for testing
const mockData = {
  users: [
    { id: '1', name: 'Test User', email: 'test@example.com', role: 'user' }
  ],
  blogs: [
    { id: '1', title: 'Test Blog', content: 'This is a test blog post', author: 'Test Author', date: new Date() }
  ],
  courses: [
    { id: '1', title: 'Test Course', description: 'This is a test course', instructor: 'Test Instructor' }
  ],
  events: [
    { id: '1', title: 'Test Event', description: 'This is a test event', date: new Date(), location: 'Test Location' }
  ],
  resources: [
    { id: '1', title: 'Test Resource', description: 'This is a test resource', url: 'https://example.com' }
  ]
};

// Variable to track database connection status
let isDbConnected = false;

// Connect to database
// Connect to the database and set the connection status flag
connectDB().then(result => {
  isDbConnected = result;
  if (isDbConnected) {
    console.log('✅ Database connection successful. Real API routes are active.');
  } else {
    console.log('⚠️ Database connection failed. Mock API routes are active.');
  }
});

// --- Real API Routes --- 
const realApiRouter = express.Router();
realApiRouter.use(standardLimiter); // Apply rate limiter to all real API routes
realApiRouter.get('/', (req, res) => res.json({ message: 'Welcome to Refugee Network Centre API - Real Mode', status: 'connected', database: 'MongoDB Atlas' }));
realApiRouter.use('/auth', require('./routes/auth'));
realApiRouter.use('/refresh-token', require('./routes/refreshToken'));
realApiRouter.use('/blogs', require('./routes/blogs'));
realApiRouter.use('/courses', require('./routes/courses'));
realApiRouter.use('/events', require('./routes/events'));
realApiRouter.use('/resources', require('./routes/resources'));
realApiRouter.use('/forum', require('./routes/forum'));
realApiRouter.use('/ai', require('./routes/ai'));
realApiRouter.use('/products', require('./routes/products'));
realApiRouter.use('/vendors', require('./routes/vendors'));
realApiRouter.use('/orders', require('./routes/orders'));
realApiRouter.use('/campaigns', require('./routes/campaigns'));
realApiRouter.use('/donations', require('./routes/donations'));
realApiRouter.use('/profiles', require('./routes/profiles'));
realApiRouter.use('/health', require('./routes/health'));
realApiRouter.use('/support', require('./routes/support'));
realApiRouter.use('/services', require('./routes/services'));
realApiRouter.use('/categories', require('./routes/categories'));
realApiRouter.use('/discounts', require('./routes/discounts'));
realApiRouter.use('/addresses', require('./routes/addresses'));
realApiRouter.use('/partnerships', require('./routes/partnerships'));
realApiRouter.use('/privacy', require('./routes/privacy'));

// --- Mock API Routes ---
const mockApiRouter = express.Router();
mockApiRouter.use(standardLimiter); // Apply rate limiter to mock API routes too
mockApiRouter.get('/', (req, res) => res.json({ message: 'Welcome to Refugee Network Centre API - Mock Mode' }));
mockApiRouter.use('/auth', require('./routes/mockAuth'));
mockApiRouter.get('/blogs', (req, res) => res.json(mockData.blogs));
mockApiRouter.get('/courses', (req, res) => res.json(mockData.courses));
mockApiRouter.get('/events', (req, res) => res.json(mockData.events));
mockApiRouter.get('/resources', (req, res) => res.json(mockData.resources));
// Add other mock routes here as needed to ensure full test coverage

// --- Dynamic API Router ---
// This middleware dynamically selects the real or mock router based on DB connection status.
// This ensures that routes are registered immediately on startup.
app.use('/api', (req, res, next) => {
  if (isDbConnected) {
    return realApiRouter(req, res, next);
  }
  // In production, do NOT expose mock API/auth. Fail fast with 503.
  if (process.env.NODE_ENV === 'production') {
    console.error('Database not connected - refusing to serve mock API in production');
    return res.status(503).json({
      error: 'Service temporarily unavailable',
      reason: 'Database not connected'
    });
  }
  // Development fallback: allow mock API for local testing only
  return mockApiRouter(req, res, next);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'RNC Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Ensure API routes are prioritized over static file serving
// First handle all API routes defined above

// Disable static file serving since frontend is deployed on Netlify
// All frontend requests will be handled by the Netlify deployment
// Backend only serves API endpoints

// Error handling middleware (should be after all routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
// Validate required environment in production before starting server
function validateEnv() {
  if (process.env.NODE_ENV === 'production') {
    const missing = [];
    if (!process.env.MONGODB_URI && !process.env.MONGODB_URI_PRODUCTION) missing.push('MONGODB_URI');
    if (!process.env.JWT_SECRET) missing.push('JWT_SECRET');
    // CORS_ORIGIN is recommended but not strictly required because we have defaults
    if (missing.length) {
      console.error('Missing required environment variables in production:', missing.join(', '));
      process.exit(1);
    }
  }
}

validateEnv();

console.log('Allowed CORS origins:', allowedOrigins);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
