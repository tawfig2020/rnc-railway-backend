const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const Partner = require('../models/Partner');
const User = require('../models/User');

/**
 * @route   POST /api/partners/apply
 * @desc    Submit partner application
 * @access  Public
 */
router.post('/apply', [
  check('organizationName', 'Organization name is required').not().isEmpty(),
  check('partnerType', 'Partner type is required').not().isEmpty(),
  check('contactPerson.email', 'Valid email is required').isEmail(),
  check('description', 'Description is required').isLength({ min: 100 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }

  try {
    const {
      organizationName,
      partnerType,
      registrationNumber,
      website,
      country,
      city,
      address,
      contactPerson,
      partnershipType,
      description,
      areasOfInterest,
      offeredServices
    } = req.body;

    // Check if organization already applied
    const existingPartner = await Partner.findOne({ 
      organizationName: { $regex: new RegExp('^' + organizationName + '$', 'i') }
    });

    if (existingPartner) {
      return res.status(400).json({
        success: false,
        message: 'An application from this organization already exists'
      });
    }

    const partner = new Partner({
      organizationName,
      partnerType,
      registrationNumber,
      website,
      country,
      city,
      address,
      contactPerson,
      partnershipType,
      description,
      areasOfInterest,
      offeredServices,
      applicationStatus: 'pending',
      applicationDate: new Date()
    });

    await partner.save();

    res.json({
      success: true,
      message: 'Partner application submitted successfully',
      partnerId: partner._id
    });
  } catch (err) {
    console.error('Partner application error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while processing application',
      error: err.message
    });
  }
});

/**
 * @route   GET /api/partners/applications
 * @desc    Get all partner applications (Admin only)
 * @access  Private/Admin
 */
router.get('/applications', [auth, adminAuth], async (req, res) => {
  try {
    const { status, partnerType } = req.query;
    
    const query = {};
    if (status) query.applicationStatus = status;
    if (partnerType) query.partnerType = partnerType;

    const partners = await Partner.find(query)
      .sort({ applicationDate: -1 })
      .select('-adminNotes');

    res.json({
      success: true,
      count: partners.length,
      partners
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
 * @route   GET /api/partners/:id
 * @desc    Get partner details
 * @access  Private/Admin
 */
router.get('/:id', [auth, adminAuth], async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id)
      .populate('nominations.memberId', 'name email profileImage skills')
      .populate('nominations.nominatedBy', 'name');

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found'
      });
    }

    res.json({
      success: true,
      partner
    });
  } catch (err) {
    console.error('Get partner error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});

/**
 * @route   PUT /api/partners/:id/approve
 * @desc    Approve or reject partner application
 * @access  Private/Admin
 */
router.put('/:id/approve', [auth, adminAuth], async (req, res) => {
  try {
    const { action, rejectionReason } = req.body;

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action'
      });
    }

    const partner = await Partner.findById(req.params.id);

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found'
      });
    }

    if (action === 'approve') {
      partner.applicationStatus = 'approved';
      partner.approvedDate = new Date();
    } else {
      partner.applicationStatus = 'rejected';
      partner.rejectedDate = new Date();
      partner.rejectionReason = rejectionReason || 'Not specified';
    }

    await partner.save();

    res.json({
      success: true,
      message: `Partner application ${action}d successfully`,
      partner
    });
  } catch (err) {
    console.error('Approve partner error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});

/**
 * @route   POST /api/partners/:id/opportunities
 * @desc    Add job/opportunity posting
 * @access  Private/Admin
 */
router.post('/:id/opportunities', [auth, adminAuth], async (req, res) => {
  try {
    const {
      title,
      type,
      description,
      requirements,
      skills,
      location,
      salary,
      positions,
      deadline
    } = req.body;

    const partner = await Partner.findById(req.params.id);

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found'
      });
    }

    if (partner.applicationStatus !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Partner must be approved to post opportunities'
      });
    }

    const opportunity = {
      title,
      type,
      description,
      requirements,
      skills,
      location,
      salary,
      positions,
      deadline,
      status: 'active',
      postedDate: new Date()
    };

    partner.opportunities.push(opportunity);
    await partner.save();

    res.json({
      success: true,
      message: 'Opportunity posted successfully',
      opportunity: partner.opportunities[partner.opportunities.length - 1]
    });
  } catch (err) {
    console.error('Add opportunity error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});

/**
 * @route   GET /api/partners/:id/opportunities
 * @desc    Get all opportunities from a partner
 * @access  Private/Admin
 */
router.get('/:id/opportunities', [auth, adminAuth], async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found'
      });
    }

    res.json({
      success: true,
      opportunities: partner.opportunities
    });
  } catch (err) {
    console.error('Get opportunities error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});

/**
 * @route   POST /api/partners/:partnerId/nominate
 * @desc    Nominate member for opportunity (Admin only)
 * @access  Private/Admin
 */
router.post('/:partnerId/nominate', [auth, adminAuth], async (req, res) => {
  try {
    const { memberId, opportunityId, notes } = req.body;

    const partner = await Partner.findById(req.params.partnerId);
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found'
      });
    }

    const member = await User.findById(memberId);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    if (!member.profileCompleted) {
      return res.status(400).json({
        success: false,
        message: 'Member profile must be completed'
      });
    }

    // Check if already nominated
    const existingNomination = partner.nominations.find(
      n => n.memberId.toString() === memberId && n.opportunityId === opportunityId
    );

    if (existingNomination) {
      return res.status(400).json({
        success: false,
        message: 'Member already nominated for this opportunity'
      });
    }

    const nomination = {
      memberId,
      opportunityId,
      nominatedBy: req.user.id,
      nominatedDate: new Date(),
      status: 'nominated',
      notes
    };

    partner.nominations.push(nomination);
    partner.totalNominations += 1;
    await partner.save();

    res.json({
      success: true,
      message: 'Member nominated successfully',
      nomination: partner.nominations[partner.nominations.length - 1]
    });
  } catch (err) {
    console.error('Nomination error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});

/**
 * @route   PUT /api/partners/:partnerId/nominations/:nominationId
 * @desc    Update nomination status
 * @access  Private/Admin
 */
router.put('/:partnerId/nominations/:nominationId', [auth, adminAuth], async (req, res) => {
  try {
    const { status, notes } = req.body;

    const partner = await Partner.findById(req.params.partnerId);
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found'
      });
    }

    const nomination = partner.nominations.id(req.params.nominationId);
    if (!nomination) {
      return res.status(404).json({
        success: false,
        message: 'Nomination not found'
      });
    }

    nomination.status = status;
    if (notes) nomination.notes = notes;

    if (status === 'hired') {
      partner.successfulPlacements += 1;
    }

    await partner.save();

    res.json({
      success: true,
      message: 'Nomination updated successfully',
      nomination
    });
  } catch (err) {
    console.error('Update nomination error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});

/**
 * @route   GET /api/partners/matching/candidates
 * @desc    Get matching candidates for opportunity (Admin only)
 * @access  Private/Admin
 */
router.post('/matching/candidates', [auth, adminAuth], async (req, res) => {
  try {
    const { opportunityId, partnerId, requiredSkills } = req.body;

    // Get all members with completed profiles
    let query = { profileCompleted: true };

    // If skills provided, match them
    if (requiredSkills && requiredSkills.length > 0) {
      query.skills = { $in: requiredSkills };
    }

    const candidates = await User.find(query)
      .select('name email profileImage skills experience nationality city state country phoneNumber')
      .limit(50);

    // Get partner to check existing nominations
    const partner = await Partner.findById(partnerId);
    const nominatedMemberIds = partner.nominations
      .filter(n => n.opportunityId === opportunityId)
      .map(n => n.memberId.toString());

    // Filter out already nominated candidates
    const availableCandidates = candidates.filter(
      c => !nominatedMemberIds.includes(c._id.toString())
    );

    res.json({
      success: true,
      count: availableCandidates.length,
      candidates: availableCandidates
    });
  } catch (err) {
    console.error('Matching error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});

/**
 * @route   POST /api/partners/:id/notes
 * @desc    Add admin note to partner
 * @access  Private/Admin
 */
router.post('/:id/notes', [auth, adminAuth], async (req, res) => {
  try {
    const { note } = req.body;

    const partner = await Partner.findById(req.params.id);
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found'
      });
    }

    partner.adminNotes.push({
      note,
      addedBy: req.user.id,
      addedDate: new Date()
    });

    await partner.save();

    res.json({
      success: true,
      message: 'Note added successfully'
    });
  } catch (err) {
    console.error('Add note error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});

/**
 * @route   GET /api/partners/stats/overview
 * @desc    Get partner statistics (Admin only)
 * @access  Private/Admin
 */
router.get('/stats/overview', [auth, adminAuth], async (req, res) => {
  try {
    const totalPartners = await Partner.countDocuments();
    const pendingApplications = await Partner.countDocuments({ applicationStatus: 'pending' });
    const approvedPartners = await Partner.countDocuments({ applicationStatus: 'approved' });
    const totalOpportunities = await Partner.aggregate([
      { $unwind: '$opportunities' },
      { $count: 'total' }
    ]);
    const activeOpportunities = await Partner.aggregate([
      { $unwind: '$opportunities' },
      { $match: { 'opportunities.status': 'active' } },
      { $count: 'total' }
    ]);
    const totalNominations = await Partner.aggregate([
      { $group: { _id: null, total: { $sum: '$totalNominations' } } }
    ]);
    const successfulPlacements = await Partner.aggregate([
      { $group: { _id: null, total: { $sum: '$successfulPlacements' } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalPartners,
        pendingApplications,
        approvedPartners,
        totalOpportunities: totalOpportunities[0]?.total || 0,
        activeOpportunities: activeOpportunities[0]?.total || 0,
        totalNominations: totalNominations[0]?.total || 0,
        successfulPlacements: successfulPlacements[0]?.total || 0
      }
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});

module.exports = router;
