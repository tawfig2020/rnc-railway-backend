const express = require('express');
const router = express.Router();
const Partnership = require('../models/Partnership');
const auth = require('../middleware/auth');
const admin = require('../middleware/adminAuth');

// @route   POST /api/partnerships
// @desc    Submit a new partnership application
// @access  Public
router.post('/', async (req, res) => {
  try {
    const {
      // Company Information
      companyName,
      industry,
      companySize,
      companyWebsite,
      yearsInOperation,
      companyDescription,
      
      // Contact Information
      contactName,
      contactTitle,
      contactEmail,
      contactPhone,
      preferredContact,
      
      // Hiring Interests
      positionTypes,
      potentialOpenings,
      workArrangements,
      skillsNeeded,
      languageRequirements,
      
      // Diversity & Inclusion
      hasDiversityPolicy,
      diversityPolicyDetails,
      previousRefugeeHiring,
      previousExperience,
      supportSystems,
      
      // Partnership Expectations
      partnershipGoals,
      hiringTimeline,
      supportNeeded,
      mentorshipOpportunities,
      additionalInfo
    } = req.body;

    // Validate required fields
    if (!companyName || !industry || !companySize || !contactName || !contactEmail) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: companyName, industry, companySize, contactName, contactEmail'
      });
    }

    // Check if partnership application already exists for this company
    const existingApplication = await Partnership.findOne({ 
      companyName: companyName.trim(),
      contactEmail: contactEmail.trim().toLowerCase()
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'A partnership application already exists for this company and contact email'
      });
    }

    // Create new partnership application
    const partnership = new Partnership({
      companyName: companyName.trim(),
      industry,
      companySize,
      companyWebsite: companyWebsite?.trim(),
      yearsInOperation,
      companyDescription: companyDescription?.trim(),
      
      contactName: contactName.trim(),
      contactTitle: contactTitle?.trim(),
      contactEmail: contactEmail.trim().toLowerCase(),
      contactPhone: contactPhone?.trim(),
      preferredContact: preferredContact || 'email',
      
      positionTypes: positionTypes || [],
      potentialOpenings: potentialOpenings?.trim(),
      workArrangements: workArrangements || { onsite: false, hybrid: false, remote: false },
      skillsNeeded: skillsNeeded || [],
      languageRequirements: languageRequirements || [],
      
      hasDiversityPolicy,
      diversityPolicyDetails: diversityPolicyDetails?.trim(),
      previousRefugeeHiring,
      previousExperience: previousExperience?.trim(),
      supportSystems: supportSystems?.trim(),
      
      partnershipGoals: partnershipGoals?.trim(),
      hiringTimeline: hiringTimeline?.trim(),
      supportNeeded: supportNeeded?.trim(),
      mentorshipOpportunities: mentorshipOpportunities || false,
      additionalInfo: additionalInfo?.trim()
    });

    await partnership.save();

    res.status(201).json({
      success: true,
      message: 'Partnership application submitted successfully',
      data: {
        id: partnership._id,
        companyName: partnership.companyName,
        contactEmail: partnership.contactEmail,
        status: partnership.status,
        submittedAt: partnership.submittedAt
      }
    });

  } catch (error) {
    console.error('Partnership application submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting partnership application'
    });
  }
});

// @route   GET /api/partnerships
// @desc    Get all partnership applications (Admin only)
// @access  Private/Admin
router.get('/', [auth, admin], async (req, res) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;
    
    // Build query
    let query = {};
    if (status) {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { contactEmail: { $regex: search, $options: 'i' } },
        { industry: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const partnerships = await Partnership.find(query)
      .sort({ submittedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('reviewedBy', 'name email');

    const total = await Partnership.countDocuments(query);

    res.json({
      success: true,
      count: partnerships.length,
      total,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      },
      data: partnerships
    });

  } catch (error) {
    console.error('Get partnerships error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching partnership applications'
    });
  }
});

// @route   GET /api/partnerships/:id
// @desc    Get single partnership application (Admin only)
// @access  Private/Admin
router.get('/:id', [auth, admin], async (req, res) => {
  try {
    const partnership = await Partnership.findById(req.params.id)
      .populate('reviewedBy', 'name email');

    if (!partnership) {
      return res.status(404).json({
        success: false,
        message: 'Partnership application not found'
      });
    }

    res.json({
      success: true,
      data: partnership
    });

  } catch (error) {
    console.error('Get partnership error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Partnership application not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching partnership application'
    });
  }
});

// @route   PUT /api/partnerships/:id/status
// @desc    Update partnership application status (Admin only)
// @access  Private/Admin
router.put('/:id/status', [auth, admin], async (req, res) => {
  try {
    const { status, reviewNotes } = req.body;

    if (!status || !['pending', 'under_review', 'approved', 'rejected', 'on_hold'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required (pending, under_review, approved, rejected, on_hold)'
      });
    }

    const partnership = await Partnership.findById(req.params.id);

    if (!partnership) {
      return res.status(404).json({
        success: false,
        message: 'Partnership application not found'
      });
    }

    partnership.status = status;
    partnership.reviewNotes = reviewNotes?.trim() || '';
    partnership.reviewedBy = req.user.id;
    partnership.reviewedAt = new Date();

    await partnership.save();

    res.json({
      success: true,
      message: 'Partnership application status updated successfully',
      data: {
        id: partnership._id,
        status: partnership.status,
        reviewNotes: partnership.reviewNotes,
        reviewedAt: partnership.reviewedAt
      }
    });

  } catch (error) {
    console.error('Update partnership status error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Partnership application not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating partnership application'
    });
  }
});

// @route   DELETE /api/partnerships/:id
// @desc    Delete partnership application (Admin only)
// @access  Private/Admin
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const partnership = await Partnership.findById(req.params.id);

    if (!partnership) {
      return res.status(404).json({
        success: false,
        message: 'Partnership application not found'
      });
    }

    await Partnership.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Partnership application deleted successfully'
    });

  } catch (error) {
    console.error('Delete partnership error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Partnership application not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while deleting partnership application'
    });
  }
});

// @route   GET /api/partnerships/stats/overview
// @desc    Get partnership application statistics (Admin only)
// @access  Private/Admin
router.get('/stats/overview', [auth, admin], async (req, res) => {
  try {
    const stats = await Partnership.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await Partnership.countDocuments();
    const recentApplications = await Partnership.find()
      .sort({ submittedAt: -1 })
      .limit(5)
      .select('companyName contactEmail status submittedAt');

    const statusStats = {
      pending: 0,
      under_review: 0,
      approved: 0,
      rejected: 0,
      on_hold: 0
    };

    stats.forEach(stat => {
      statusStats[stat._id] = stat.count;
    });

    res.json({
      success: true,
      data: {
        total,
        statusStats,
        recentApplications
      }
    });

  } catch (error) {
    console.error('Get partnership stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching partnership statistics'
    });
  }
});

module.exports = router;
