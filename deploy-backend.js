/**
 * Standalone Mock Backend for Deployment
 * This can be deployed to any Node.js hosting service
 */

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 10000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors({
  origin: [
    'https://rncmalaysia.org.netlify.app',
    'https://rnc-platform-updated.netlify.app',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json());

// Mock users with hashed passwords
const mockUsers = [
  {
    _id: 'admin001',
    name: 'Admin User',
    email: 'admin@refugeenetwork.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 123456
    role: 'admin',
    isEmailVerified: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'user001',
    name: 'Test User',
    email: 'test@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 123456
    role: 'refugee',
    isEmailVerified: true,
    createdAt: new Date().toISOString()
  }
];

let mockRefreshTokens = [];

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'RNC Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT tokens
    const payload = {
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
    const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    // Store refresh token
    mockRefreshTokens.push({
      token: refreshToken,
      userId: user._id,
      createdAt: new Date()
    });

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if user exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = {
      _id: 'user' + Date.now(),
      name,
      email,
      password: hashedPassword,
      role: 'refugee',
      isEmailVerified: true,
      createdAt: new Date().toISOString()
    };

    mockUsers.push(newUser);

    // Generate JWT tokens
    const payload = {
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role
      }
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
    const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      accessToken,
      refreshToken,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// Profile endpoint
app.get('/api/auth/profile', authenticateToken, (req, res) => {
  const user = mockUsers.find(u => u._id === req.user.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({
    success: true,
    user: userWithoutPassword
  });
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    req.user = decoded.user;
    next();
  });
}

// Catch all for API routes
app.get('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    availableEndpoints: [
      'GET /api/health',
      'POST /api/auth/login',
      'POST /api/auth/register',
      'GET /api/auth/profile'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 RNC Backend API running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔑 Admin credentials: admin@refugeenetwork.com / 123456`);
});

module.exports = app;
