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
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'Accept']
}));
app.use(express.json({ extended: false }));

// Add headers before the routes are defined
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-auth-token, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// MongoDB Connection
const connectDB = async () => {
  try {
    // Attempt to update MongoDB Atlas IP whitelist before connecting
    try {
      console.log('Attempting to update MongoDB Atlas IP whitelist...');
      await updateMongoDBAtlasIpWhitelist();
      console.log('IP whitelist update process completed');
    } catch (ipError) {
      console.warn('Failed to update IP whitelist, will still attempt connection:', ipError.message);
      // Continue with connection attempt even if IP update fails
    }

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
connectDB().then(result => {
  isDbConnected = result;
  
  // Define Routes based on DB connection status
  if (isDbConnected) {
    console.log('✅ Database connected - Loading real API routes');
    
    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        database: 'connected',
        uptime: process.uptime()
      });
    });
    
    // Apply standard rate limiter to all API routes
    app.use('/api', standardLimiter);
    
    // Real API routes when DB is connected
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/refresh-token', require('./routes/refreshToken'));
    app.use('/api/blogs', require('./routes/blogs'));
    app.use('/api/courses', require('./routes/courses'));
    app.use('/api/events', require('./routes/events'));
    app.use('/api/resources', require('./routes/resources'));
    app.use('/api/forum', require('./routes/forum'));
    app.use('/api/ai', require('./routes/ai'));
    
    // New routes for marketplace and donation system
    app.use('/api/products', require('./routes/products'));
    app.use('/api/vendors', require('./routes/vendors'));
    app.use('/api/orders', require('./routes/orders'));
    app.use('/api/campaigns', require('./routes/campaigns'));
    app.use('/api/donations', require('./routes/donations'));
    
    // Routes for refugee profile, health records, and support services
    app.use('/api/profiles', require('./routes/profiles'));
    app.use('/api/health', require('./routes/health'));
    app.use('/api/support', require('./routes/support'));
    app.use('/api/services', require('./routes/services'));
    app.use('/api/categories', require('./routes/categories'));
    app.use('/api/discounts', require('./routes/discounts'));
    app.use('/api/addresses', require('./routes/addresses'));
    app.use('/api/partnerships', require('./routes/partnerships'));
    app.use('/api/privacy', require('./routes/privacy'));
  } else {
    console.log('⚠️ Database not connected - Loading mock API routes');
    
    // Mock routes when DB is not connected
    // Health check endpoint (mock mode)
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        database: 'mock_mode',
        uptime: process.uptime()
      });
    });
    
    // Welcome route
    app.get('/api', (req, res) => {
      res.json({ message: 'Welcome to Refugee Network Centre API - Mock Mode' });
    });
    
    // Apply rate limiter to mock API routes too
    app.use('/api', standardLimiter);
    
    // Comprehensive mock auth routes
    app.use('/api/auth', require('./routes/mockAuth'));
    
    // Mock blog routes
    app.get('/api/blogs', (req, res) => {
      res.json(mockData.blogs);
    });
    
    // Mock course routes
    app.get('/api/courses', (req, res) => {
      res.json(mockData.courses);
    });
    
    // Mock event routes
    app.get('/api/events', (req, res) => {
      res.json(mockData.events);
    });
    
    // Mock resource routes
    app.get('/api/resources', (req, res) => {
      res.json(mockData.resources);
    });
    
    // Mock categories routes
    app.get('/api/categories', (req, res) => {
      res.json([
        { _id: '1', name: 'Food & Groceries', description: 'Essential food items and groceries', featured: true },
        { _id: '2', name: 'Healthcare', description: 'Medical supplies and healthcare products', featured: true },
        { _id: '3', name: 'Education', description: 'Books and educational materials', featured: false }
      ]);
    });
    
    app.get('/api/categories/:id', (req, res) => {
      res.json({ _id: req.params.id, name: 'Test Category', description: 'A test category' });
    });
    
    // Mock discounts routes
    app.get('/api/discounts', (req, res) => {
      res.json([
        { _id: '1', code: 'WELCOME10', discountType: 'percentage', value: 10, isActive: true },
        { _id: '2', code: 'SUMMER20', discountType: 'percentage', value: 20, isActive: true },
        { _id: '3', code: 'FREESHIP', discountType: 'fixed', value: 5, isActive: true }
      ]);
    });
    
    app.get('/api/discounts/active', (req, res) => {
      res.json([
        { _id: '1', code: 'WELCOME10', discountType: 'percentage', value: 10 },
        { _id: '3', code: 'FREESHIP', discountType: 'fixed', value: 5 }
      ]);
    });
    
    app.get('/api/discounts/:id', (req, res) => {
      res.json({ _id: req.params.id, code: 'TEST10', discountType: 'percentage', value: 10 });
    });
    
    app.post('/api/discounts/validate', (req, res) => {
      const { code } = req.body;
      if (code === 'WELCOME10' || code === 'SUMMER20' || code === 'FREESHIP' || code.startsWith('TEST')) {
        res.json({ valid: true, discount: { code, value: 10, type: 'percentage' } });
      } else {
        res.status(400).json({ valid: false, msg: 'Invalid discount code' });
      }
    });
    
    // Mock addresses routes
    app.get('/api/addresses', (req, res) => {
      res.json([
        {
          _id: '1',
          fullName: 'Test User',
          addressLine1: '123 Test Street',
          city: 'Test City',
          state: 'Test State',
          postalCode: '12345',
          country: 'Test Country',
          isDefault: true
        }
      ]);
    });
    
    app.get('/api/addresses/:id', (req, res) => {
      res.json({
        _id: req.params.id,
        fullName: 'Test User',
        addressLine1: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        postalCode: '12345',
        country: 'Test Country',
        isDefault: true
      });
    });
    
    app.post('/api/addresses', (req, res) => {
      res.status(201).json({
        _id: 'new-address-id',
        ...req.body,
        user: 'test-user-id'
      });
    });
    
    app.put('/api/addresses/:id', (req, res) => {
      res.json({
        _id: req.params.id,
        ...req.body,
        user: 'test-user-id'
      });
    });
    
    app.post('/api/addresses/validate', (req, res) => {
      res.json({ valid: true });
    });
    
    // Mock vendors routes
    app.get('/api/vendors', (req, res) => {
      res.json([
        { _id: '1', name: 'Test Vendor 1', email: 'vendor1@test.com', status: 'approved' },
        { _id: '2', name: 'Test Vendor 2', email: 'vendor2@test.com', status: 'approved' }
      ]);
    });
    
    app.get('/api/vendors/:id', (req, res) => {
      res.json({ _id: req.params.id, name: 'Test Vendor', email: 'vendor@test.com', status: 'approved' });
    });
    
    // Mock products routes
    app.get('/api/products', (req, res) => {
      res.json([
        {
          _id: '1',
          name: 'Test Product 1',
          description: 'A test product',
          price: 29.99,
          category: '1',
          vendor: '1',
          images: ['test-image.jpg'],
          featured: true,
          status: 'active'
        },
        {
          _id: '2',
          name: 'Test Product 2',
          description: 'Another test product',
          price: 49.99,
          category: '2',
          vendor: '2',
          images: ['test-image2.jpg'],
          featured: false,
          status: 'active'
        }
      ]);
    });
    
    app.get('/api/products/featured', (req, res) => {
      res.json({
        products: [
          {
            _id: '1',
            name: 'Featured Product',
            description: 'A featured test product',
            price: 29.99,
            category: '1',
            vendor: '1',
            images: ['test-image.jpg'],
            featured: true,
            status: 'active'
          }
        ]
      });
    });
    
    app.get('/api/products/:id', (req, res) => {
      res.json({
        _id: req.params.id,
        name: 'Test Product',
        description: 'A test product',
        price: 29.99,
        category: '1',
        vendor: '1',
        images: ['test-image.jpg'],
        featured: false,
        status: 'active'
      });
    });
    
    app.post('/api/products', (req, res) => {
      res.status(201).json({
        _id: 'new-product-id',
        ...req.body,
        vendor: 'test-vendor-id',
        status: 'pending'
      });
    });
    
    app.put('/api/products/:id', (req, res) => {
      res.json({
        _id: req.params.id,
        ...req.body,
        vendor: 'test-vendor-id'
      });
    });
    
    // Mock orders routes
    app.get('/api/orders', (req, res) => {
      res.json([
        {
          _id: '1',
          user: 'test-user-id',
          items: [{ product: '1', quantity: 2, price: 29.99 }],
          totalPrice: 59.98,
          status: 'pending',
          createdAt: new Date().toISOString()
        }
      ]);
    });
    
    app.get('/api/orders/myorders', (req, res) => {
      res.json([
        {
          _id: '1',
          user: 'test-user-id',
          items: [{ product: '1', quantity: 2, price: 29.99 }],
          totalPrice: 59.98,
          status: 'pending',
          createdAt: new Date().toISOString()
        }
      ]);
    });
    
    app.get('/api/orders/:id', (req, res) => {
      res.json({
        _id: req.params.id,
        user: 'test-user-id',
        items: [{ product: '1', quantity: 2, price: 29.99 }],
        totalPrice: 59.98,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
    });
    
    app.post('/api/orders', (req, res) => {
      res.status(201).json({
        _id: 'new-order-id',
        ...req.body,
        user: 'test-user-id',
        status: 'pending',
        createdAt: new Date().toISOString()
      });
    });
    
    app.put('/api/orders/:id', (req, res) => {
      res.json({
        _id: req.params.id,
        ...req.body,
        user: 'test-user-id',
        updatedAt: new Date().toISOString()
      });
    });
    
    app.put('/api/orders/:id/status', (req, res) => {
      res.json({
        _id: req.params.id,
        status: req.body.status,
        updatedAt: new Date().toISOString()
      });
    });
    
    app.put('/api/orders/:id/tracking', (req, res) => {
      res.json({
        _id: req.params.id,
        trackingNumber: req.body.trackingNumber,
        carrier: req.body.carrier,
        status: 'shipped',
        updatedAt: new Date().toISOString()
      });
    });
    
    // Mock dashboard routes
    app.get('/api/dashboard/marketplace', (req, res) => {
      res.json({
        totalProducts: 150,
        totalOrders: 45,
        totalRevenue: 12500.75,
        totalUsers: 320,
        pendingOrders: 8,
        completedOrders: 37,
        activeProducts: 142,
        pendingProducts: 8,
        totalVendors: 25,
        activeVendors: 23
      });
    });
    
    // Mock categories POST route
    app.post('/api/categories', (req, res) => {
      res.status(201).json({
        _id: 'new-category-id',
        ...req.body,
        createdAt: new Date().toISOString()
      });
    });
    
    app.put('/api/categories/:id', (req, res) => {
      res.json({
        _id: req.params.id,
        ...req.body,
        updatedAt: new Date().toISOString()
      });
    });
    
    // Mock discounts POST route
    app.post('/api/discounts', (req, res) => {
      res.status(201).json({
        _id: 'new-discount-id',
        ...req.body,
        createdAt: new Date().toISOString()
      });
    });
    
    app.put('/api/discounts/:id', (req, res) => {
      res.json({
        _id: req.params.id,
        ...req.body,
        updatedAt: new Date().toISOString()
      });
    });
    
    // Mock events routes
    app.get('/api/events', (req, res) => {
      res.json([
        {
          _id: '1',
          title: 'Community Workshop: Digital Skills',
          description: 'Learn essential digital skills for the modern workplace',
          date: '2024-02-15T10:00:00Z',
          location: 'Community Center',
          category: 'Education',
          organizer: 'RNC Team',
          maxAttendees: 50,
          currentAttendees: 23,
          status: 'upcoming',
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          title: 'Cultural Exchange Evening',
          description: 'Share stories, food, and traditions from different cultures',
          date: '2024-02-20T18:00:00Z',
          location: 'Community Hall',
          category: 'Cultural',
          organizer: 'Cultural Committee',
          maxAttendees: 100,
          currentAttendees: 67,
          status: 'upcoming',
          createdAt: new Date().toISOString()
        },
        {
          _id: '3',
          title: 'Job Fair 2024',
          description: 'Connect with local employers and explore career opportunities',
          date: '2024-02-25T09:00:00Z',
          location: 'Convention Center',
          category: 'Career',
          organizer: 'Employment Services',
          maxAttendees: 200,
          currentAttendees: 145,
          status: 'upcoming',
          createdAt: new Date().toISOString()
        }
      ]);
    });
    
    app.get('/api/events/:id', (req, res) => {
      res.json({
        _id: req.params.id,
        title: 'Community Workshop: Digital Skills',
        description: 'Learn essential digital skills for the modern workplace',
        date: '2024-02-15T10:00:00Z',
        location: 'Community Center',
        category: 'Education',
        organizer: 'RNC Team',
        maxAttendees: 50,
        currentAttendees: 23,
        status: 'upcoming',
        createdAt: new Date().toISOString()
      });
    });
    
    app.post('/api/events', (req, res) => {
      res.status(201).json({
        _id: 'new-event-id',
        ...req.body,
        currentAttendees: 0,
        status: 'upcoming',
        createdAt: new Date().toISOString()
      });
    });
    
    app.put('/api/events/:id', (req, res) => {
      res.json({
        _id: req.params.id,
        ...req.body,
        updatedAt: new Date().toISOString()
      });
    });
  }
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
