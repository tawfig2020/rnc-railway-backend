const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const memberAuth = require('../middleware/memberAuth');
const adminAuth = require('../middleware/adminAuth');
const User = require('../models/User');

/**
 * @route   POST /api/roles/apply/:roleType
 * @desc    Apply for a role (volunteer, intern, vendor)
 * @access  Private (Members only)
 */
router.post('/apply/:roleType', memberAuth, async (req, res) => {
  try {
    const { roleType } = req.params;
    const validRoles = ['volunteer', 'intern', 'vendor'];

    if (!validRoles.includes(roleType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role type'
      });
    }

    const {
      motivation,
      experience,
      availability,
      skills,
      businessName,
      businessType,
      productDescription,
      businessRegistration
    } = req.body;

    // Validate required fields
    if (!motivation || !experience || !availability || !skills) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Additional validation for vendor
    if (roleType === 'vendor') {
      if (!businessName || !businessType || !productDescription) {
        return res.status(400).json({
          success: false,
          message: 'Business name, type, and description are required for vendor application'
        });
      }
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already applied or approved
    const currentStatus = user.roles?.[roleType]?.status;
    if (currentStatus === 'pending') {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending application for this role'
      });
    }

    if (currentStatus === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'You are already approved for this role'
      });
    }

    // Initialize roles object if it doesn't exist
    if (!user.roles) {
      user.roles = {
        member: true,
        volunteer: { status: 'none' },
        intern: { status: 'none' },
        vendor: { status: 'none' }
      };
    }

    // Update role application
    user.roles[roleType] = {
      status: 'pending',
      appliedDate: new Date(),
      motivation,
      experience,
      availability,
      skills
    };

    // Add vendor-specific fields
    if (roleType === 'vendor') {
      user.roles[roleType].businessName = businessName;
      user.roles[roleType].businessType = businessType;
      user.roles[roleType].productDescription = productDescription;
      user.roles[roleType].businessRegistration = businessRegistration || '';
    }

    await user.save();

    res.json({
      success: true,
      message: `Your ${roleType} application has been submitted successfully`,
      application: {
        roleType,
        status: 'pending',
        appliedDate: user.roles[roleType].appliedDate
      }
    });
  } catch (err) {
    console.error('Role application error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while processing application',
      error: err.message
    });
  }
});

/**
 * @route   GET /api/roles/status/:roleType
 * @desc    Get status of role application
 * @access  Private
 */
router.get('/status/:roleType', auth, async (req, res) => {
  try {
    const { roleType } = req.params;
    const validRoles = ['volunteer', 'intern', 'vendor'];

    if (!validRoles.includes(roleType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role type'
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const roleStatus = user.roles?.[roleType] || { status: 'none' };

    res.json({
      success: true,
      roleType,
      status: roleStatus.status,
      details: roleStatus
    });
  } catch (err) {
    console.error('Status check error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});

/**
 * @route   GET /api/roles/applications
 * @desc    Get all pending role applications (Admin only)
 * @access  Private/Admin
 */
router.get('/applications', [auth, adminAuth], async (req, res) => {
  try {
    const { roleType, status } = req.query;

    const query = {};
    
    // Build query based on filters
    if (roleType) {
      query[`roles.${roleType}.status`] = status || 'pending';
    } else {
      // Get all pending applications
      query.$or = [
        { 'roles.volunteer.status': 'pending' },
        { 'roles.intern.status': 'pending' },
        { 'roles.vendor.status': 'pending' }
      ];
    }

    const users = await User.find(query)
      .select('name email roles profileImage createdAt')
      .sort({ 'roles.volunteer.appliedDate': -1 });

    res.json({
      success: true,
      count: users.length,
      applications: users
    });
  } catch (err) {
    console.error('Get applications error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});

/**
 * @route   PUT /api/roles/approve/:userId/:roleType
 * @desc    Approve or reject role application (Admin only)
 * @access  Private/Admin
 */
router.put('/approve/:userId/:roleType', [auth, adminAuth], async (req, res) => {
  try {
    const { userId, roleType } = req.params;
    const { action, rejectionReason } = req.body; // action: 'approve' or 'reject'

    const validRoles = ['volunteer', 'intern', 'vendor'];
    if (!validRoles.includes(roleType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role type'
      });
    }

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Must be "approve" or "reject"'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.roles?.[roleType]?.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'No pending application found for this role'
      });
    }

    // Update role status
    if (action === 'approve') {
      user.roles[roleType].status = 'approved';
      user.roles[roleType].approvedDate = new Date();
      
      // Update main role field if needed
      if (roleType === 'volunteer' || roleType === 'intern' || roleType === 'vendor') {
        user.role = roleType;
      }
    } else {
      user.roles[roleType].status = 'rejected';
      user.roles[roleType].rejectedDate = new Date();
      user.roles[roleType].rejectionReason = rejectionReason || 'Not specified';
    }

    await user.save();

    res.json({
      success: true,
      message: `Application ${action}d successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roleStatus: user.roles[roleType]
      }
    });
  } catch (err) {
    console.error('Approve/reject error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});

module.exports = router;
