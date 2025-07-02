const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const config = require('./config/config');

// Load models
require('./models/User');
require('./models/BlogPost');
require('./models/Course');
require('./models/Event');
require('./models/Resource');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`Error: ${error.message}`);
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
});

// Routes
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to Refugee Network Centre API' });
});

// Define Routes - Use mock data if database is not connected
if (isDbConnected) {
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/blogs', require('./routes/blogs'));
  app.use('/api/courses', require('./routes/courses'));
  app.use('/api/events', require('./routes/events'));
  app.use('/api/resources', require('./routes/resources'));
} else {
  // Mock auth routes
  app.post('/api/auth/register', (req, res) => {
    res.status(201).json({ message: 'User registered successfully', token: 'test-jwt-token' });
  });
  
  app.post('/api/auth/login', (req, res) => {
    res.json({ message: 'Login successful', token: 'test-jwt-token' });
  });
  
  app.get('/api/auth/me', (req, res) => {
    res.json({ user: mockData.users[0] });
  });
  
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
}

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
