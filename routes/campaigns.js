const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Campaign = mongoose.model('Campaign');
const Donation = mongoose.model('Donation');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadPath = 'uploads/campaigns';
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)){
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Define upload fields for campaign
const campaignUpload = upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'images', maxCount: 5 },
  { name: 'organizationLogo', maxCount: 1 }
]);

// Middleware to optionally authenticate (doesn't fail if no token)
const optionalAuth = (req, res, next) => {
  const token = req.header('x-auth-token') || req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return next();
  }
  
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');
    req.user = decoded.user;
    next();
  } catch (err) {
    // Invalid token, but continue as unauthenticated
    next();
  }
};

// @route   GET /api/campaigns
// @desc    Get all campaigns
// @access  Public (with optional auth for admin features)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      search, category, featured, status,
      sort, limit, page 
    } = req.query;

    const query = {};
    
    // Add filters if provided
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    if (category) {
      query.category = category;
    }
    
    if (featured) {
      query.featured = featured === 'true';
    }
    
    // Only admins can see non-active campaigns or filter by status
    if (req.user && req.user.role === 'admin') {
      // Admin can filter by status or see all campaigns
      if (status) {
        query.status = status;
      }
      // If no status filter, show all campaigns for admin
    } else {
      // Non-admin users only see active campaigns
      query.status = 'active';
      
      // Filter out expired campaigns that don't allow donations after end
      const now = new Date();
      query.$or = [
        { endDate: { $gte: now } },
        { allowDonationsAfterEnd: true }
      ];
    }
    
    // Pagination
    const currentPage = parseInt(page) || 1;
    const perPage = parseInt(limit) || 9;
    const skip = (currentPage - 1) * perPage;
    
    // Sort options
    let sortOptions = {};
    if (sort) {
      switch (sort) {
        case 'newest':
          sortOptions = { createdAt: -1 };
          break;
        case 'endingSoon':
          sortOptions = { endDate: 1 };
          break;
        case 'mostFunded':
          sortOptions = { raised: -1 };
          break;
        case 'leastFunded':
          sortOptions = { raised: 1 };
          break;
        default:
          sortOptions = { featured: -1, priority: -1, createdAt: -1 };
      }
    } else {
      sortOptions = { featured: -1, priority: -1, createdAt: -1 };
    }
    
    // Count total campaigns for pagination
    const totalCampaigns = await Campaign.countDocuments(query);
    
    // Get campaigns
    const campaigns = await Campaign.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(perPage)
      .populate('createdBy', 'name');
    
    // Calculate percentage funded and other virtual fields
    const campaignsWithStats = campaigns.map(campaign => {
      const campaignObj = campaign.toObject({ virtuals: true });
      return campaignObj;
    });
    
    res.json({
      campaigns: campaignsWithStats,
      pagination: {
        total: totalCampaigns,
        page: currentPage,
        pages: Math.ceil(totalCampaigns / perPage),
        perPage
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/campaigns/:id
// @desc    Get campaign by ID or slug
// @access  Public
router.get('/:idOrSlug', async (req, res) => {
  try {
    const idOrSlug = req.params.idOrSlug;
    let campaign;
    
    // Check if it's a valid MongoDB ID
    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      campaign = await Campaign.findById(idOrSlug)
        .populate('createdBy', 'name email');
    } else {
      // Look up by slug
      campaign = await Campaign.findOne({ slug: idOrSlug })
        .populate('createdBy', 'name email');
    }
    
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    
    // If campaign is not active, only creator or admin can view it
    if (campaign.status !== 'active') {
      const isCreator = req.user && req.user.id === campaign.createdBy._id.toString();
      const isAdmin = req.user && req.user.role === 'admin';
      
      if (!isCreator && !isAdmin) {
        return res.status(404).json({ error: 'Campaign not found' });
      }
    }
    
    // Get campaign donors count and recent donations
    const donorsCount = await Donation.countDocuments({ 
      campaign: campaign._id, 
      status: 'completed' 
    });
    
    const recentDonations = await Donation.find({ 
      campaign: campaign._id, 
      status: 'completed',
      isAnonymous: false 
    })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('donor', 'name profileImage');
    
    // Convert to object with virtual fields
    const campaignWithStats = campaign.toObject({ virtuals: true });
    
    // Add donation data
    campaignWithStats.donorsCount = donorsCount;
    campaignWithStats.recentDonations = recentDonations;
    
    res.json(campaignWithStats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/campaigns
// @desc    Create a new campaign
// @access  Private (Staff or Admin)
router.post('/', auth, campaignUpload, async (req, res) => {
  try {
    // Check if user has permission
    if (req.user.role !== 'staff' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to create campaigns' });
    }
    
    const {
      title, description, summary, goal,
      currency, category, startDate, endDate,
      allowDonationsAfterEnd, minimumDonation,
      organizationName, organizationDescription,
      contactEmail, contactPhone, beneficiaries,
      status, featured, slug
    } = req.body;
    
    // Process uploaded files
    let coverImage = 'default-campaign-cover.jpg';
    let organizationLogo = 'default-organization-logo.jpg';
    let images = [];
    
    if (req.files) {
      if (req.files.coverImage) {
        coverImage = req.files.coverImage[0].path;
      }
      
      if (req.files.organizationLogo) {
        organizationLogo = req.files.organizationLogo[0].path;
      }
      
      if (req.files.images) {
        req.files.images.forEach(image => {
          images.push(image.path);
        });
      }
    }
    
    // Process suggested donations
    let suggestedDonations = [];
    if (req.body.suggestedDonations) {
      try {
        suggestedDonations = JSON.parse(req.body.suggestedDonations);
      } catch (e) {
        console.error('Error parsing suggestedDonations', e);
      }
    }
    
    // Process social sharing settings
    let socialSharing = {
      enabled: true,
      platforms: {
        facebook: true,
        twitter: true,
        linkedin: true,
        email: true
      }
    };
    
    if (req.body.socialSharing) {
      try {
        socialSharing = JSON.parse(req.body.socialSharing);
      } catch (e) {
        console.error('Error parsing socialSharing', e);
      }
    }
    
    // Process tags - handle both string and array formats
    let tags = [];
    if (req.body.tags) {
      if (Array.isArray(req.body.tags)) {
        tags = req.body.tags; // Already an array
      } else if (typeof req.body.tags === 'string') {
        tags = req.body.tags.split(',').map(tag => tag.trim()); // Split string
      }
    }
    
    // Create campaign
    const campaign = new Campaign({
      title,
      slug,
      description,
      summary,
      coverImage,
      images,
      goal: parseFloat(goal),
      currency: currency || 'USD',
      category,
      tags,
      status: req.user.role === 'admin' ? (status || 'draft') : 'draft',
      featured: req.user.role === 'admin' ? (featured === 'true') : false,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      allowDonationsAfterEnd: allowDonationsAfterEnd === 'true',
      minimumDonation: parseFloat(minimumDonation) || 5,
      suggestedDonations,
      createdBy: req.user.id,
      organizationName,
      organizationLogo,
      organizationDescription,
      contactEmail,
      contactPhone,
      beneficiaries,
      socialSharing
    });
    
    await campaign.save();
    
    res.status(201).json({
      message: 'Campaign created successfully',
      campaign
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/campaigns/:id
// @desc    Update a campaign
// @access  Private (Owner, Staff or Admin)
router.put('/:id', auth, campaignUpload, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    
    // Check if user has permission
    const isOwner = req.user.id === campaign.createdBy.toString();
    const isAdmin = req.user.role === 'admin';
    const isStaff = req.user.role === 'staff';
    
    if (!isOwner && !isAdmin && !isStaff) {
      return res.status(403).json({ error: 'Not authorized to update campaign' });
    }
    
    const {
      title, description, summary, goal,
      currency, category, startDate, endDate,
      allowDonationsAfterEnd, minimumDonation,
      organizationName, organizationDescription,
      contactEmail, contactPhone, beneficiaries,
      status, featured, priority
    } = req.body;
    
    // Update fields if provided
    if (title) campaign.title = title;
    if (description) campaign.description = description;
    if (summary) campaign.summary = summary;
    if (goal) campaign.goal = parseFloat(goal);
    if (currency) campaign.currency = currency;
    if (category) campaign.category = category;
    if (startDate) campaign.startDate = new Date(startDate);
    if (endDate) campaign.endDate = new Date(endDate);
    if (allowDonationsAfterEnd !== undefined) campaign.allowDonationsAfterEnd = allowDonationsAfterEnd === 'true';
    if (minimumDonation) campaign.minimumDonation = parseFloat(minimumDonation);
    if (organizationName) campaign.organizationName = organizationName;
    if (organizationDescription) campaign.organizationDescription = organizationDescription;
    if (contactEmail) campaign.contactEmail = contactEmail;
    if (contactPhone) campaign.contactPhone = contactPhone;
    if (beneficiaries) campaign.beneficiaries = beneficiaries;
    
    // Process tags
    if (req.body.tags) {
      campaign.tags = req.body.tags.split(',').map(tag => tag.trim());
    }
    
    // Process uploaded files if any
    if (req.files) {
      if (req.files.coverImage) {
        // Delete old cover image if it's not the default
        if (campaign.coverImage !== 'default-campaign-cover.jpg') {
          const coverPath = path.join(__dirname, '..', campaign.coverImage);
          if (fs.existsSync(coverPath)) {
            fs.unlinkSync(coverPath);
          }
        }
        campaign.coverImage = req.files.coverImage[0].path;
      }
      
      if (req.files.organizationLogo) {
        // Delete old logo if it's not the default
        if (campaign.organizationLogo !== 'default-organization-logo.jpg') {
          const logoPath = path.join(__dirname, '..', campaign.organizationLogo);
          if (fs.existsSync(logoPath)) {
            fs.unlinkSync(logoPath);
          }
        }
        campaign.organizationLogo = req.files.organizationLogo[0].path;
      }
      
      if (req.files.images && req.files.images.length > 0) {
        // Delete old images
        campaign.images.forEach(image => {
          const imagePath = path.join(__dirname, '..', image);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        });
        
        // Add new images
        campaign.images = [];
        req.files.images.forEach(image => {
          campaign.images.push(image.path);
        });
      }
    }
    
    // Process suggested donations
    if (req.body.suggestedDonations) {
      try {
        campaign.suggestedDonations = JSON.parse(req.body.suggestedDonations);
      } catch (e) {
        console.error('Error parsing suggestedDonations', e);
      }
    }
    
    // Process social sharing settings
    if (req.body.socialSharing) {
      try {
        campaign.socialSharing = JSON.parse(req.body.socialSharing);
      } catch (e) {
        console.error('Error parsing socialSharing', e);
      }
    }
    
    // Admin only fields
    if (isAdmin) {
      if (status) campaign.status = status;
      if (featured !== undefined) campaign.featured = featured === 'true';
      if (priority !== undefined) campaign.priority = parseInt(priority);
    }
    
    await campaign.save();
    
    res.json({
      message: 'Campaign updated successfully',
      campaign
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/campaigns/:id/update
// @desc    Add campaign update
// @access  Private (Owner, Staff or Admin)
router.post('/:id/update', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    const campaign = await Campaign.findById(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    
    // Check if user has permission
    const isOwner = req.user.id === campaign.createdBy.toString();
    const isAdmin = req.user.role === 'admin';
    const isStaff = req.user.role === 'staff';
    
    if (!isOwner && !isAdmin && !isStaff) {
      return res.status(403).json({ error: 'Not authorized to update campaign' });
    }
    
    // Add update
    campaign.updates.push({
      title,
      content,
      date: Date.now(),
      author: req.user.id
    });
    
    await campaign.save();
    
    res.json({
      message: 'Campaign update added successfully',
      update: campaign.updates[campaign.updates.length - 1]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/campaigns/:id/comment
// @desc    Add campaign comment
// @access  Private
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { comment } = req.body;
    
    if (!comment) {
      return res.status(400).json({ error: 'Comment is required' });
    }
    
    const campaign = await Campaign.findById(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    
    if (!campaign.allowComments) {
      return res.status(403).json({ error: 'Comments are disabled for this campaign' });
    }
    
    // Add comment
    const newComment = {
      user: req.user.id,
      comment,
      date: Date.now(),
      isApproved: req.user.role === 'admin' || req.user.role === 'staff' // Auto-approve for staff/admin
    };
    
    campaign.comments.push(newComment);
    
    await campaign.save();
    
    res.json({
      message: newComment.isApproved 
        ? 'Comment added successfully' 
        : 'Comment submitted and awaiting approval',
      comment: campaign.comments[campaign.comments.length - 1]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/campaigns/:id/comment/:commentId
// @desc    Approve/reject comment
// @access  Private (Admin or Staff)
router.put('/:id/comment/:commentId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    const { approve } = req.body;
    
    const campaign = await Campaign.findById(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    
    // Find comment
    const comment = campaign.comments.id(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    // Update comment
    comment.isApproved = approve === 'true';
    
    await campaign.save();
    
    res.json({
      message: `Comment ${comment.isApproved ? 'approved' : 'rejected'} successfully`,
      comment
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/campaigns/admin/dashboard
// @desc    Get campaign statistics for admin dashboard
// @access  Private (Admin only)
router.get('/admin/dashboard', adminAuth, async (req, res) => {
  try {
    const totalCampaigns = await Campaign.countDocuments();
    
    // Campaigns by status
    const campaignsByStatus = await Campaign.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Active campaigns
    const activeCampaigns = await Campaign.countDocuments({ status: 'active' });
    
    // Total funds raised across all campaigns
    const fundsData = await Campaign.aggregate([
      { $group: { _id: null, totalRaised: { $sum: '$raised' } } }
    ]);
    
    const totalRaised = fundsData.length > 0 ? fundsData[0].totalRaised : 0;
    
    // Recent campaigns
    const recentCampaigns = await Campaign.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('createdBy', 'name');
    
    // Top performing campaigns
    const topCampaigns = await Campaign.find()
      .sort({ raised: -1 })
      .limit(5);
    
    // Funds raised by category
    const fundsByCategory = await Campaign.aggregate([
      { $group: { _id: '$category', raised: { $sum: '$raised' } } },
      { $sort: { raised: -1 } }
    ]);
    
    res.json({
      totalCampaigns,
      campaignsByStatus,
      activeCampaigns,
      totalRaised,
      recentCampaigns,
      topCampaigns,
      fundsByCategory
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/campaigns/:id
// @desc    Delete campaign (for testing purposes)
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const campaign = await Campaign.findById(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    
    // Delete associated donations first
    await mongoose.model('Donation').deleteMany({ campaign: req.params.id });
    
    // Delete the campaign
    await Campaign.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Campaign and associated donations deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
