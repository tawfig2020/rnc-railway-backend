const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Donation = mongoose.model('Donation');
const Campaign = mongoose.model('Campaign');
const User = mongoose.model('User');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// @route   POST /api/donations
// @desc    Create a new donation
// @access  Public (can be anonymous)
router.post('/', async (req, res) => {
  try {
    const {
      amount, currency, paymentMethod, isAnonymous,
      donorName, donorEmail, donorPhone, donorAddress,
      message, campaignId, paymentDetails
    } = req.body;
    
    // Validate required fields
    if (!amount || !paymentMethod) {
      return res.status(400).json({ error: 'Amount and payment method are required' });
    }
    
    // Check if campaign exists if provided
    let campaign = null;
    if (campaignId) {
      campaign = await Campaign.findById(campaignId);
      
      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }
      
      // Check if campaign is active or allows donations after end
      const now = new Date();
      const isActive = campaign.status === 'active';
      const isExpired = now > campaign.endDate;
      const canAcceptDonations = isActive && (!isExpired || campaign.allowDonationsAfterEnd);
      
      if (!canAcceptDonations) {
        return res.status(400).json({ error: 'Campaign is not currently accepting donations' });
      }
      
      // Check minimum donation
      if (parseFloat(amount) < campaign.minimumDonation) {
        return res.status(400).json({ 
          error: `Minimum donation amount is ${campaign.minimumDonation} ${campaign.currency}`
        });
      }
    }
    
    // Create donation object
    const donationData = {
      amount: parseFloat(amount),
      currency: currency || 'USD',
      paymentMethod,
      isAnonymous: isAnonymous === 'true',
      message,
      status: 'pending' // Will be updated when payment is confirmed
    };
    
    // Add donor information if provided
    if (req.user) {
      // Logged in user
      donationData.donor = req.user.id;
    } else {
      // Anonymous or guest donor
      if (!isAnonymous && !donorName) {
        return res.status(400).json({ error: 'Donor name is required for non-anonymous donations' });
      }
      
      if (donorName) donationData.donorName = donorName;
      if (donorEmail) donationData.donorEmail = donorEmail;
      if (donorPhone) donationData.donorPhone = donorPhone;
      
      // Process address if provided
      if (donorAddress) {
        try {
          donationData.donorAddress = JSON.parse(donorAddress);
        } catch (e) {
          // If not valid JSON, use as is
          donationData.donorAddress = {
            street: req.body.street || '',
            city: req.body.city || '',
            state: req.body.state || '',
            postalCode: req.body.postalCode || '',
            country: req.body.country || ''
          };
        }
      }
    }
    
    // Add campaign if provided
    if (campaign) {
      donationData.campaign = campaign._id;
    }
    
    // Add payment details if provided
    if (paymentDetails) {
      try {
        donationData.paymentDetails = JSON.parse(paymentDetails);
      } catch (e) {
        donationData.paymentDetails = {
          transactionId: req.body.transactionId,
          paymentProcessor: req.body.paymentProcessor
        };
      }
      
      // If payment is already confirmed
      if (donationData.paymentDetails.status === 'completed') {
        donationData.status = 'completed';
        donationData.completedAt = new Date();
      }
    }
    
    // Create and save donation
    const donation = new Donation(donationData);
    await donation.save();
    
    // Update campaign raised amount if donation is completed
    if (campaign && donation.status === 'completed') {
      campaign.raised += donation.amount;
      campaign.donorsCount += 1;
      await campaign.save();
    }
    
    res.status(201).json({
      message: 'Donation recorded successfully',
      donation
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/donations/me
// @desc    Get logged in user's donations
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user.id })
      .sort({ createdAt: -1 })
      .populate('campaign', 'title coverImage');
    
    res.json(donations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/donations/:id
// @desc    Get donation by ID
// @access  Private (Donor or Admin)
router.get('/:id', auth, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donor', 'name email')
      .populate('campaign', 'title coverImage');
    
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    
    // Check if user has permission
    const isDonor = donation.donor && donation.donor._id.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    if (!isDonor && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    res.json(donation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/donations/:id/status
// @desc    Update donation status
// @access  Private (Admin only)
router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['pending', 'completed', 'failed', 'refunded'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    
    const previousStatus = donation.status;
    donation.status = status;
    
    // Handle status changes
    if (status === 'completed' && previousStatus !== 'completed') {
      donation.completedAt = new Date();
      
      // Update campaign funds if applicable
      if (donation.campaign) {
        const campaign = await Campaign.findById(donation.campaign);
        if (campaign) {
          campaign.raised += donation.amount;
          campaign.donorsCount = campaign.donorsCount ? campaign.donorsCount + 1 : 1;
          await campaign.save();
        }
      }
    } else if (previousStatus === 'completed' && status !== 'completed') {
      // Reverting a completed donation
      // Update campaign funds if applicable
      if (donation.campaign) {
        const campaign = await Campaign.findById(donation.campaign);
        if (campaign) {
          campaign.raised = Math.max(0, campaign.raised - donation.amount);
          campaign.donorsCount = Math.max(0, campaign.donorsCount - 1);
          await campaign.save();
        }
      }
    }
    
    await donation.save();
    
    res.json({
      message: `Donation status updated to ${status}`,
      donation
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/donations/:id/receipt
// @desc    Mark donation receipt as sent
// @access  Private (Admin only)
router.put('/:id/receipt', adminAuth, async (req, res) => {
  try {
    const { receiptSent, receiptDetails } = req.body;
    
    if (receiptSent === undefined) {
      return res.status(400).json({ error: 'Receipt sent status is required' });
    }
    
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    
    donation.receiptSent = receiptSent === 'true';
    
    if (donation.receiptSent && receiptDetails) {
      try {
        donation.receiptDetails = JSON.parse(receiptDetails);
      } catch (e) {
        donation.receiptDetails = {
          sentDate: new Date(),
          receiptNumber: req.body.receiptNumber,
          receiptUrl: req.body.receiptUrl
        };
      }
    }
    
    await donation.save();
    
    res.json({
      message: `Receipt status updated`,
      donation
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/donations/:id/thank
// @desc    Mark thank you as sent
// @access  Private (Admin only)
router.put('/:id/thank', adminAuth, async (req, res) => {
  try {
    const { thankyouSent } = req.body;
    
    if (thankyouSent === undefined) {
      return res.status(400).json({ error: 'Thank you status is required' });
    }
    
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    
    donation.thankyouSent = thankyouSent === 'true';
    
    if (donation.thankyouSent) {
      donation.thankyouSentAt = new Date();
    }
    
    await donation.save();
    
    res.json({
      message: `Thank you status updated`,
      donation
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/donations/:id/notes
// @desc    Update donation notes
// @access  Private (Admin only)
router.put('/:id/notes', adminAuth, async (req, res) => {
  try {
    const { notes, followUpNeeded, followUpDate } = req.body;
    
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    
    if (notes !== undefined) donation.notes = notes;
    if (followUpNeeded !== undefined) donation.followUpNeeded = followUpNeeded === 'true';
    if (followUpDate) donation.followUpDate = new Date(followUpDate);
    
    await donation.save();
    
    res.json({
      message: 'Donation notes updated',
      donation
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/donations/admin/all
// @desc    Get all donations (admin)
// @access  Private (Admin only)
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const { 
      status, campaign, donor, startDate, endDate, 
      minAmount, maxAmount, sort, limit, page 
    } = req.query;
    
    // Build query
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (campaign) {
      query.campaign = campaign;
    }
    
    if (donor) {
      query.donor = donor;
    }
    
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = parseFloat(minAmount);
      if (maxAmount) query.amount.$lte = parseFloat(maxAmount);
    }
    
    // Pagination
    const currentPage = parseInt(page) || 1;
    const perPage = parseInt(limit) || 20;
    const skip = (currentPage - 1) * perPage;
    
    // Sort options
    let sortOptions = {};
    if (sort) {
      switch (sort) {
        case 'amount-high':
          sortOptions = { amount: -1 };
          break;
        case 'amount-low':
          sortOptions = { amount: 1 };
          break;
        case 'oldest':
          sortOptions = { createdAt: 1 };
          break;
        default:
          sortOptions = { createdAt: -1 };
      }
    } else {
      sortOptions = { createdAt: -1 };
    }
    
    // Count total donations
    const totalDonations = await Donation.countDocuments(query);
    
    // Get donations
    const donations = await Donation.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(perPage)
      .populate('donor', 'name email')
      .populate('campaign', 'title');
    
    res.json({
      donations,
      pagination: {
        total: totalDonations,
        page: currentPage,
        pages: Math.ceil(totalDonations / perPage),
        perPage
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/donations/admin/dashboard
// @desc    Get donation statistics for admin dashboard
// @access  Private (Admin only)
router.get('/admin/dashboard', adminAuth, async (req, res) => {
  try {
    // Total donations (only completed)
    const totalDonationsData = await Donation.aggregate([
      { $match: { status: 'completed' } },
      { 
        $group: { 
          _id: null, 
          total: { $sum: '$amount' }, 
          count: { $sum: 1 } 
        } 
      }
    ]);
    
    const totalDonations = totalDonationsData.length > 0 
      ? totalDonationsData[0].total 
      : 0;
    
    const donationsCount = totalDonationsData.length > 0 
      ? totalDonationsData[0].count 
      : 0;
    
    // Donations by status
    const donationsByStatus = await Donation.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Recent donations
    const recentDonations = await Donation.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('donor', 'name')
      .populate('campaign', 'title');
    
    // Donations by day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const donationsByDay = await Donation.aggregate([
      { 
        $match: { 
          createdAt: { $gte: thirtyDaysAgo },
          status: 'completed'
        } 
      },
      {
        $group: {
          _id: { 
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } 
          },
          count: { $sum: 1 },
          amount: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Top campaigns by donations
    const topCampaigns = await Donation.aggregate([
      { 
        $match: { 
          campaign: { $exists: true, $ne: null },
          status: 'completed'
        } 
      },
      {
        $group: {
          _id: '$campaign',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } },
      { $limit: 5 }
    ]);
    
    // Get campaign details for top campaigns
    const campaignIds = topCampaigns.map(item => item._id);
    const campaigns = await Campaign.find({
      _id: { $in: campaignIds }
    }, { title: 1, coverImage: 1 });
    
    // Merge campaign details with donation data
    const topCampaignsWithDetails = topCampaigns.map(item => {
      const campaign = campaigns.find(c => c._id.toString() === item._id.toString());
      return {
        ...item,
        title: campaign ? campaign.title : 'Unknown Campaign',
        coverImage: campaign ? campaign.coverImage : null
      };
    });
    
    // Donation methods breakdown
    const donationMethods = await Donation.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: '$paymentMethod',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);
    
    res.json({
      totalDonations,
      donationsCount,
      donationsByStatus,
      recentDonations,
      donationsByDay,
      topCampaigns: topCampaignsWithDetails,
      donationMethods
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/donations
// @desc    Get donations (admin access or user's own donations)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let donations;
    
    if (req.user.role === 'admin') {
      // Admin can see all donations
      donations = await Donation.find()
        .sort({ createdAt: -1 })
        .populate('donor', 'name email')
        .populate('campaign', 'title');
    } else {
      // Regular users see only their donations
      donations = await Donation.find({ donor: req.user.id })
        .sort({ createdAt: -1 })
        .populate('campaign', 'title coverImage');
    }
    
    res.json(donations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/donations/stats/overview
// @desc    Get donation statistics overview
// @access  Private (Admin only)
router.get('/stats/overview', adminAuth, async (req, res) => {
  try {
    // Total donations
    const totalDonations = await Donation.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);
    
    // Donations by status
    const donationsByStatus = await Donation.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Recent donations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentDonations = await Donation.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
      status: 'completed'
    });
    
    const result = {
      totalAmount: totalDonations[0]?.total || 0,
      totalDonations: totalDonations[0]?.count || 0,
      recentDonations,
      statusBreakdown: donationsByStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    };
    
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/donations/:id/receipt
// @desc    Get donation receipt
// @access  Private
router.get('/:id/receipt', auth, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donor', 'name email')
      .populate('campaign', 'title');
    
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    
    // Check if user has permission
    const isDonor = donation.donor && donation.donor._id.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    if (!isDonor && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    // Generate receipt data
    const receiptData = {
      receiptNumber: donation.receiptDetails?.receiptNumber || `RNC-${donation._id.toString().slice(-8).toUpperCase()}`,
      donationId: donation._id,
      amount: donation.amount,
      currency: donation.currency,
      date: donation.createdAt,
      donorName: donation.donorName || donation.donor?.name || 'Anonymous',
      donorEmail: donation.donorEmail || donation.donor?.email,
      campaign: donation.campaign?.title || 'General Fund',
      paymentMethod: donation.paymentMethod,
      status: donation.status,
      taxDeductible: donation.taxDeductible
    };
    
    res.json(receiptData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/donations/:id
// @desc    Delete donation (Admin only)
// @access  Private (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    
    // If donation was completed, update campaign totals
    if (donation.status === 'completed' && donation.campaign) {
      const campaign = await Campaign.findById(donation.campaign);
      if (campaign) {
        campaign.raised = Math.max(0, campaign.raised - donation.amount);
        campaign.donorsCount = Math.max(0, campaign.donorsCount - 1);
        await campaign.save();
      }
    }
    
    await Donation.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Donation deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/donations/campaign/:id
// @desc    Get donations for a specific campaign
// @access  Private (Admin only)
router.get('/campaign/:id', adminAuth, async (req, res) => {
  try {
    const campaignId = req.params.id;
    
    const donations = await Donation.find({ campaign: campaignId })
      .sort({ createdAt: -1 })
      .populate('donor', 'name email')
      .populate('campaign', 'title');
    
    // Get campaign statistics
    const stats = await Donation.aggregate([
      { $match: { campaign: new mongoose.Types.ObjectId(campaignId) } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalDonations: { $sum: 1 },
          completedAmount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, '$amount', 0]
            }
          },
          completedDonations: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
            }
          }
        }
      }
    ]);
    
    const campaignStats = stats[0] || {
      totalAmount: 0,
      totalDonations: 0,
      completedAmount: 0,
      completedDonations: 0
    };
    
    res.json({
      donations,
      statistics: campaignStats
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
