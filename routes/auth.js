const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { check, validationResult } = require('express-validator');
const config = require('../config/config');
const auth = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');
const { authLimiter } = require('../middleware/rateLimiter');

const User = mongoose.model('User');
const RefreshToken = mongoose.model('RefreshToken');

// @route   POST /api/auth/register
// @desc    Register a user
// @access  Public
router.post(
  '/register',
  authLimiter,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    check('location', 'Location is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role, location, languages } = req.body;

    try {
      // Check if user exists
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
      }

      // Generate email verification token (random bytes converted to hex string)
      const verificationToken = crypto.randomBytes(20).toString('hex');
      
      user = new User({
        name,
        email,
        password,
        role: role || 'refugee',
        location,
        languages: languages || [],
        emailVerificationToken: verificationToken,
        isEmailVerified: false
      });

      // Password is encrypted via the pre-save hook in the User model
      await user.save();
      
      try {
        // Create verification URL
        const verificationURL = `${config.frontendUrl}/verify-email/${verificationToken}`;
        
        // Email content
        const message = `
          <h1>Email Verification</h1>
          <p>Thank you for registering with Refugee Network Centre!</p>
          <p>Please click the link below to verify your email address:</p>
          <a href="${verificationURL}" style="display: inline-block; padding: 10px 20px; background-color: #2A7D6F; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Verify Email</a>
          <p>If the button doesn't work, please copy and paste this URL into your browser:</p>
          <p>${verificationURL}</p>
          <p>This link will expire in 24 hours.</p>
        `;
        
        await sendEmail({
          to: user.email,
          subject: 'Please verify your email address',
          html: message
        });
        
        // Return JWT along with message about verification email
        const token = user.getSignedJwtToken();
        
        res.status(201).json({
          success: true,
          message: 'Registration successful! Please check your email to verify your account.',
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      } catch (err) {
        console.error('Email sending failed:', err);
        
        // If email fails, still allow registration but inform the user
        const token = user.getSignedJwtToken();
        
        res.status(201).json({
          success: true,
          message: 'Registration successful but verification email could not be sent. Please contact support.',
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  authLimiter,
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if user exists
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      // Match password
      const isMatch = await user.matchPassword(password);

      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      // Check if email is verified (bypass for admin users)
      if (!user.isEmailVerified && user.role !== 'admin') {
        return res.status(401).json({
          success: false,
          message: 'Please verify your email address before logging in.'
        });
      }

      // Generate access token (JWT) with shorter expiration
      const accessToken = user.getSignedJwtToken();
      
      // Generate refresh token
      const refreshToken = user.getRefreshToken();
      
      // Store refresh token in database
      const refreshTokenDoc = new RefreshToken({
        token: refreshToken,
        user: user._id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });
      
      await refreshTokenDoc.save();

      res.json({
        success: true,
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        }
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ 
        success: false,
        error: 'Server error',
        message: err.message,
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
    }
  }
);

// @route   GET /api/auth/verify-email/:token
// @desc    Verify email address with token
// @access  Public
router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    // Find user with this token
    const user = await User.findOne({ emailVerificationToken: token });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification token. The token may be expired or already used.'
      });
    }
    
    // Update user to verified
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();
    
    return res.status(200).json({
      success: true,
      message: 'Email verified successfully! You can now log in.'
    });
  } catch (err) {
    console.error('Email verification error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during email verification'
    });
  }
});

// @route   POST /api/auth/resend-verification
// @desc    Resend email verification link
// @access  Public
router.post('/resend-verification', [
  check('email', 'Please include a valid email').isEmail(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({
        success: true,
        message: 'If your email exists in our system, a verification email will be sent.'
      });
    }

    // If already verified, inform the user
    if (user.isEmailVerified) {
      return res.json({
        success: true,
        message: 'Your email is already verified. You can log in.'
      });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');
    user.emailVerificationToken = verificationToken;
    await user.save();

    // Create verification URL
    const verificationURL = `${config.frontendUrl}/verify-email/${verificationToken}`;

    // Email content
    const message = `
      <h1>Email Verification</h1>
      <p>Thank you for registering with Refugee Network Centre!</p>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationURL}" style="display: inline-block; padding: 10px 20px; background-color: #2A7D6F; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Verify Email</a>
      <p>If the button doesn't work, please copy and paste this URL into your browser:</p>
      <p>${verificationURL}</p>
      <p>This link will expire in 24 hours.</p>
    `;

    await sendEmail({
      to: user.email,
      subject: 'Please verify your email address',
      html: message
    });

    res.json({
      success: true,
      message: 'Verification email has been sent. Please check your inbox.'
    });
  } catch (err) {
    console.error('Resend verification error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error, could not resend verification email'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    // req.user is set by the auth middleware
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/auth/update
// @desc    Update user profile
// @access  Private
router.put('/update', auth, [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, location, languages, bio, profileImage } = req.body;

  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Update fields
    if (name) user.name = name;
    if (email && email !== user.email) {
      // Check if email is already taken
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser.id !== user.id) {
        return res.status(400).json({ msg: 'Email already in use' });
      }
      user.email = email;
    }
    if (location) user.location = location;
    if (languages) user.languages = languages;
    if (bio) user.bio = bio;
    if (profileImage) user.profileImage = profileImage;
    
    await user.save();
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', auth, [
  check('currentPassword', 'Current password is required').exists(),
  check('newPassword', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id).select('+password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({ msg: 'Password updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/auth/users/:id
// @desc    Delete user (for testing purposes)
// @access  Private (Admin only)
router.delete('/users/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Don't allow deletion of admin users
    if (user.role === 'admin') {
      return res.status(400).json({ error: 'Cannot delete admin users' });
    }
    
    await User.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
