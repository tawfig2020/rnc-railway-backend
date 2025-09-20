const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS Configuration for single domain
app.use(cors({
  origin: ['https://rncmalaysia.net', 'https://www.rncmalaysia.net'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

app.use(express.json());

// Serve static files (React build)
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
const mongoose = require('mongoose');
const config = require('./config/config');

mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB Connected to Atlas');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/events', require('./routes/events'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/health', require('./routes/health'));
app.use('/api/support', require('./routes/support'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'RNC Malaysia running on Hostinger',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    database: 'MongoDB Atlas Connected'
  });
});

// API root endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'RNC Malaysia API - Hostinger Deployment',
    status: 'active',
    version: '1.0.0'
  });
});

// Serve React app for all other routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 RNC Malaysia server running on port ${PORT}`);
  console.log(`🌐 Visit: https://rncmalaysia.net`);
  console.log(`🔍 Health: https://rncmalaysia.net/health`);
  console.log(`📡 API: https://rncmalaysia.net/api`);
});
