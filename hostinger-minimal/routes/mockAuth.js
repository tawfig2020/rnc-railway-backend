const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const router = express.Router();

// Mock user database for testing
let mockUsers = [
  {
    _id: 'admin001',
    name: 'Admin User',
    email: 'admin@refugeenetwork.com',
    password: '$2a$10$lNIx3P/ixWBPaso.7Xbq5eg7U3cB1CZdHukdv6dlS2O7TKWwszusi', // password: 123456
    role: 'admin',
    isEmailVerified: true,
    createdAt: new Date()
  },
  {
    _id: 'user001',
    name: 'Test User',
    email: 'test@example.com',
    password: '$2a$10$lNIx3P/ixWBPaso.7Xbq5eg7U3cB1CZdHukdv6dlS2O7TKWwszusi', // password: 123456
    role: 'refugee',
    isEmailVerified: true,
    createdAt: new Date()
  }
];

// Mock refresh tokens storage
let mockRefreshTokens = [];

// @route   POST /api/auth/register
// @desc    Register user (Mock Mode)
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, location } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if user already exists
    const existingUser = mockUsers.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = {
      _id: `user${Date.now()}`,
      name: `${firstName} ${lastName}`,
      email,
      password: hashedPassword,
      role: 'refugee',
      location: location || '',
      isEmailVerified: true, // Auto-verify for mock mode
      createdAt: new Date()
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

    const accessToken = jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpire });
    const refreshToken = jwt.sign(payload, config.jwtRefreshSecret, { expiresIn: config.jwtRefreshExpire });

    // Store refresh token
    mockRefreshTokens.push({
      token: refreshToken,
      userId: newUser._id,
      createdAt: new Date()
    });

    // Return user data without password
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      accessToken,
      refreshToken,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Mock registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user (Mock Mode)
// @access  Public
router.post('/login', async (req, res) => {
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

    const accessToken = jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpire });
    const refreshToken = jwt.sign(payload, config.jwtRefreshSecret, { expiresIn: config.jwtRefreshExpire });

    // Store refresh token
    mockRefreshTokens.push({
      token: refreshToken,
      userId: user._id,
      createdAt: new Date()
    });

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Mock login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @route   GET /api/auth/profile
// @desc    Get user profile (Mock Mode)
// @access  Private
router.get('/profile', (req, res) => {
  try {
    // Extract token from header
    const token = req.header('x-auth-token') || req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = mockUsers.find(u => u._id === decoded.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Mock profile error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

// @route   POST /api/auth/refresh
// @desc    Refresh access token (Mock Mode)
// @access  Public
router.post('/refresh', (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret);
    const storedToken = mockRefreshTokens.find(t => t.token === refreshToken);
    
    if (!storedToken) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new access token
    const payload = {
      user: {
        id: decoded.user.id,
        email: decoded.user.email,
        role: decoded.user.role
      }
    };

    const newAccessToken = jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpire });

    res.json({
      success: true,
      accessToken: newAccessToken
    });

  } catch (error) {
    console.error('Mock refresh error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
});

module.exports = router;
