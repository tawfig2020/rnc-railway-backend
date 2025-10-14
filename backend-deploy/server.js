/**
 * RNC Platform Backend API - Production Ready
 * Optimized for Render.com deployment with stability enhancements
 */

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 10000;
const JWT_SECRET = process.env.JWT_SECRET || 'rnc-super-secret-jwt-key-2025-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'rnc-refresh-secret-2025-change-in-production';

// Stability Configuration
const MAX_REFRESH_TOKENS = 1000; // Prevent memory leak
const TOKEN_CLEANUP_INTERVAL = 3600000; // 1 hour
const REQUEST_TIMEOUT = 30000; // 30 seconds
const MAX_REQUEST_SIZE = '10mb';

// Server health tracking
let serverHealth = {
  status: 'starting',
  startTime: Date.now(),
  requestCount: 0,
  errorCount: 0,
  lastError: null
};

// Trust proxy for Render.com
app.set('trust proxy', 1);

// Request timeout middleware - prevent hanging requests
app.use((req, res, next) => {
  req.setTimeout(REQUEST_TIMEOUT, () => {
    console.error(`[Timeout] Request timeout: ${req.method} ${req.path}`);
    serverHealth.errorCount++;
    res.status(408).json({
      success: false,
      message: 'Request timeout'
    });
  });
  next();
});

// Middleware
app.use(cors({
  origin: [
    'https://rncmalaysia.org.netlify.app',
    'https://rnc-platform-updated.netlify.app',
    'https://rnc-malaysia.netlify.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: MAX_REQUEST_SIZE }));
app.use(express.urlencoded({ extended: true, limit: MAX_REQUEST_SIZE }));

// Request logging and tracking middleware
app.use((req, res, next) => {
  serverHealth.requestCount++;
  const start = Date.now();
  
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  
  // Track response time
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (duration > 5000) {
      console.warn(`[Slow Request] ${req.method} ${req.path} took ${duration}ms`);
    }
  });
  
  next();
});

// Mock users with properly hashed passwords (password: 123456)
const mockUsers = [
  {
    _id: 'admin001',
    name: 'Admin User',
    email: 'admin@refugeenetwork.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role: 'admin',
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    profileImage: null,
    bio: 'System Administrator'
  },
  {
    _id: 'user001',
    name: 'Test User',
    email: 'test@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role: 'refugee',
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    profileImage: null,
    bio: 'Test user account'
  },
  {
    _id: 'staff001',
    name: 'Staff Member',
    email: 'staff@refugeenetwork.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role: 'staff',
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    profileImage: null,
    bio: 'Staff member'
  }
];

let mockRefreshTokens = [];

// Periodic cleanup of expired refresh tokens to prevent memory leak
setInterval(() => {
  const now = Date.now();
  const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
  
  const beforeCount = mockRefreshTokens.length;
  mockRefreshTokens = mockRefreshTokens.filter(t => {
    return t.createdAt.getTime() > sevenDaysAgo;
  });
  
  const cleaned = beforeCount - mockRefreshTokens.length;
  if (cleaned > 0) {
    console.log(`[Cleanup] Removed ${cleaned} expired refresh tokens. Current: ${mockRefreshTokens.length}`);
  }
  
  // Enforce hard limit to prevent unbounded growth
  if (mockRefreshTokens.length > MAX_REFRESH_TOKENS) {
    const excess = mockRefreshTokens.length - MAX_REFRESH_TOKENS;
    mockRefreshTokens = mockRefreshTokens.slice(excess);
    console.log(`[Cleanup] Enforced token limit. Removed ${excess} oldest tokens.`);
  }
}, TOKEN_CLEANUP_INTERVAL);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'RNC Platform Backend API',
    version: '1.0.0',
    status: 'Running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        profile: 'GET /api/auth/profile',
        refresh: 'POST /api/auth/refresh'
      }
    }
  });
});

// Health check endpoint with detailed metrics
app.get('/api/health', (req, res) => {
  const memUsage = process.memoryUsage();
  const uptime = process.uptime();
  
  // Calculate health score
  const errorRate = serverHealth.requestCount > 0 
    ? (serverHealth.errorCount / serverHealth.requestCount) * 100 
    : 0;
  
  const isHealthy = errorRate < 5 && memUsage.heapUsed < memUsage.heapTotal * 0.9;
  
  const healthData = { 
    status: isHealthy ? 'OK' : 'DEGRADED',
    service: 'RNC Backend API',
    version: '1.0.1',
    timestamp: new Date().toISOString(),
    uptime: uptime,
    uptimeHuman: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`,
    memory: {
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
      rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
      external: `${Math.round(memUsage.external / 1024 / 1024)}MB`
    },
    metrics: {
      totalRequests: serverHealth.requestCount,
      totalErrors: serverHealth.errorCount,
      errorRate: `${errorRate.toFixed(2)}%`,
      activeTokens: mockRefreshTokens.length,
      lastError: serverHealth.lastError
    },
    environment: process.env.NODE_ENV || 'development'
  };
  
  res.status(isHealthy ? 200 : 503).json(healthData);
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Login attempt:', { email: req.body.email, hasPassword: !!req.body.password });
    
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for user:', email);
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

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });

    // Store refresh token
    mockRefreshTokens.push({
      token: refreshToken,
      userId: user._id,
      createdAt: new Date()
    });

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;

    console.log('Login successful for:', email);
    
    res.json({
      success: true,
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Login error:', error);
    serverHealth.errorCount++;
    serverHealth.lastError = {
      endpoint: '/api/auth/login',
      message: error.message,
      timestamp: new Date().toISOString()
    };
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('Registration attempt:', { email: req.body.email, name: req.body.name });
    
    const { name, email, password, role = 'refugee' } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (name, email, password)'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user exists
    const existingUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
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
      _id: 'user' + Date.now(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: ['admin', 'staff', 'refugee'].includes(role) ? role : 'refugee',
      isEmailVerified: true, // Auto-verify in mock mode
      createdAt: new Date().toISOString(),
      profileImage: null,
      bio: ''
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

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });

    // Store refresh token
    mockRefreshTokens.push({
      token: refreshToken,
      userId: newUser._id,
      createdAt: new Date()
    });

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = newUser;

    console.log('Registration successful for:', email);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      accessToken,
      refreshToken,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Registration error:', error);
    serverHealth.errorCount++;
    serverHealth.lastError = {
      endpoint: '/api/auth/register',
      message: error.message,
      timestamp: new Date().toISOString()
    };
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// Profile endpoint
app.get('/api/auth/profile', authenticateToken, (req, res) => {
  try {
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
  } catch (error) {
    console.error('Profile error:', error);
    serverHealth.errorCount++;
    serverHealth.lastError = {
      endpoint: '/api/auth/profile',
      message: error.message,
      timestamp: new Date().toISOString()
    };
    res.status(500).json({
      success: false,
      message: 'Server error retrieving profile'
    });
  }
});

// Refresh token endpoint
app.post('/api/auth/refresh', (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required'
      });
    }

    // Check if refresh token exists in our store
    const tokenRecord = mockRefreshTokens.find(t => t.token === refreshToken);
    if (!tokenRecord) {
      return res.status(403).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Verify refresh token
    jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Invalid or expired refresh token'
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

      const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

      res.json({
        success: true,
        accessToken
      });
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    serverHealth.errorCount++;
    serverHealth.lastError = {
      endpoint: '/api/auth/refresh',
      message: error.message,
      timestamp: new Date().toISOString()
    };
    res.status(500).json({
      success: false,
      message: 'Server error during token refresh'
    });
  }
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

// Get all users (admin only)
app.get('/api/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  const usersWithoutPasswords = mockUsers.map(({ password, ...user }) => user);
  res.json({
    success: true,
    users: usersWithoutPasswords,
    total: usersWithoutPasswords.length
  });
});

// Create new user (admin only)
app.post('/api/admin/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  try {
    const { name, email, password, role, location } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const newUser = {
      _id: `user_${Date.now()}`,
      name,
      email,
      password, // In production with real DB, hash this!
      role: role || 'user',
      location: location || 'Malaysia',
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockUsers.push(newUser);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;

    console.log(`[Admin] User created: ${email} by ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: userWithoutPassword,
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Error creating user:', error);
    serverHealth.errorCount++;
    res.status(500).json({
      success: false,
      message: 'Failed to create user'
    });
  }
});

// Update user (admin only)
app.put('/api/admin/users/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  try {
    const { id } = req.params;
    const { name, email, role, location } = req.body;

    const userIndex = mockUsers.findIndex(u => u._id === id);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      name: name || mockUsers[userIndex].name,
      email: email || mockUsers[userIndex].email,
      role: role || mockUsers[userIndex].role,
      location: location || mockUsers[userIndex].location,
      updatedAt: new Date()
    };

    const { password, ...userWithoutPassword } = mockUsers[userIndex];

    console.log(`[Admin] User updated: ${id} by ${req.user.email}`);

    res.json({
      success: true,
      message: 'User updated successfully',
      user: userWithoutPassword,
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Error updating user:', error);
    serverHealth.errorCount++;
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
});

// Delete user (admin only)
app.delete('/api/admin/users/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  try {
    const { id } = req.params;

    const userIndex = mockUsers.findIndex(u => u._id === id);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const deletedUser = mockUsers[userIndex];
    mockUsers.splice(userIndex, 1);

    console.log(`[Admin] User deleted: ${deletedUser.email} by ${req.user.email}`);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    serverHealth.errorCount++;
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
});

// Catch all for undefined API routes
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.path}`,
    availableEndpoints: [
      'GET /api/health',
      'POST /api/auth/login',
      'POST /api/auth/register',
      'GET /api/auth/profile',
      'POST /api/auth/refresh',
      'GET /api/users (admin only)',
      'POST /api/admin/users (admin only)',
      'PUT /api/admin/users/:id (admin only)',
      'DELETE /api/admin/users/:id (admin only)'
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  serverHealth.errorCount++;
  serverHealth.lastError = {
    endpoint: req.path,
    message: err.message,
    timestamp: new Date().toISOString()
  };
  
  res.status(err.status || 500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Configure server timeouts
const server = app.listen(PORT, '0.0.0.0', () => {
  serverHealth.status = 'running';
  console.log(`🚀 RNC Backend API running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔑 Admin credentials: admin@refugeenetwork.com / 123456`);
  console.log(`👤 Test user: test@example.com / 123456`);
  console.log(`👥 Staff user: staff@refugeenetwork.com / 123456`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏱️  Request timeout: ${REQUEST_TIMEOUT}ms`);
  console.log(`💾 Max request size: ${MAX_REQUEST_SIZE}`);
  console.log(`🔄 Token cleanup interval: ${TOKEN_CLEANUP_INTERVAL / 1000}s`);
});

// Set server timeouts
server.timeout = REQUEST_TIMEOUT + 5000; // Slightly longer than request timeout
server.keepAliveTimeout = 65000; // Standard for load balancers
server.headersTimeout = 66000; // Slightly longer than keepAliveTimeout

// Graceful shutdown handlers
let isShuttingDown = false;

const gracefulShutdown = (signal) => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  
  console.log(`\n${signal} received, shutting down gracefully...`);
  serverHealth.status = 'shutting_down';
  
  // Stop accepting new connections
  server.close(() => {
    console.log('✅ Server closed. No longer accepting connections.');
    console.log(`📊 Final stats: ${serverHealth.requestCount} requests, ${serverHealth.errorCount} errors`);
    process.exit(0);
  });
  
  // Force shutdown after 30 seconds
  setTimeout(() => {
    console.error('⚠️  Forced shutdown after timeout');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  serverHealth.errorCount++;
  serverHealth.lastError = {
    type: 'uncaughtException',
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  };
  
  // Don't exit immediately in production, log and continue
  if (process.env.NODE_ENV === 'production') {
    console.error('⚠️  Continuing despite uncaught exception (production mode)');
  } else {
    gracefulShutdown('UNCAUGHT_EXCEPTION');
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  serverHealth.errorCount++;
  serverHealth.lastError = {
    type: 'unhandledRejection',
    message: reason?.message || String(reason),
    timestamp: new Date().toISOString()
  };
});

// Log memory usage periodically
setInterval(() => {
  const memUsage = process.memoryUsage();
  const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
  const heapTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
  const heapPercent = ((memUsage.heapUsed / memUsage.heapTotal) * 100).toFixed(1);
  
  console.log(`[Memory] Heap: ${heapUsedMB}MB / ${heapTotalMB}MB (${heapPercent}%) | Tokens: ${mockRefreshTokens.length}`);
  
  // Warn if memory usage is high
  if (heapPercent > 85) {
    console.warn(`⚠️  High memory usage: ${heapPercent}%`);
  }
}, 300000); // Every 5 minutes

module.exports = app;
