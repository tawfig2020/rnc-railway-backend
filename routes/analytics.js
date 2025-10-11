const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const User = require('../models/User');
const Partner = require('../models/Partner');

/**
 * @route   GET /api/analytics/members
 * @desc    Get member statistics and trends
 * @access  Private/Admin
 */
router.get('/members', [auth, adminAuth], async (req, res) => {
  try {
    const { range = '30days' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (range) {
      case '7days':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'all':
        startDate = new Date(0); // Beginning of time
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Total members
    const totalMembers = await User.countDocuments();
    
    // New members in time range
    const newMembers = await User.countDocuments({
      createdAt: { $gte: startDate }
    });
    
    // Profile completed
    const profileCompleted = await User.countDocuments({
      profileCompleted: true
    });
    
    // Active members (logged in within last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);
    const activeMembers = await User.countDocuments({
      lastActive: { $gte: thirtyDaysAgo }
    });

    // Role statistics
    const volunteers = await User.countDocuments({
      'roles.volunteer.status': 'approved'
    });
    
    const interns = await User.countDocuments({
      'roles.intern.status': 'approved'
    });
    
    const vendors = await User.countDocuments({
      'roles.vendor.status': 'approved'
    });
    
    const pendingApplications = await User.countDocuments({
      $or: [
        { 'roles.volunteer.status': 'pending' },
        { 'roles.intern.status': 'pending' },
        { 'roles.vendor.status': 'pending' }
      ]
    });

    // Registration trend (daily for last 30 days)
    const trendData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);
      
      const registrations = await User.countDocuments({
        createdAt: { $gte: date, $lt: nextDate }
      });
      
      const profileCompletions = await User.countDocuments({
        createdAt: { $gte: date, $lt: nextDate },
        profileCompleted: true
      });
      
      trendData.push({
        date: date.toISOString().split('T')[0],
        registrations,
        profileCompletions
      });
    }

    // Role distribution
    const roleDistribution = [
      { name: 'Members', value: totalMembers },
      { name: 'Volunteers', value: volunteers },
      { name: 'Interns', value: interns },
      { name: 'Vendors', value: vendors }
    ];

    res.json({
      success: true,
      stats: {
        total: totalMembers,
        newThisMonth: newMembers,
        profileCompleted,
        active: activeMembers
      },
      roles: {
        volunteers,
        interns,
        vendors,
        pendingApplications
      },
      trend: trendData,
      roleDistribution
    });
  } catch (err) {
    console.error('Member analytics error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});

/**
 * @route   GET /api/analytics/engagement
 * @desc    Get engagement metrics
 * @access  Private/Admin
 */
router.get('/engagement', [auth, adminAuth], async (req, res) => {
  try {
    const { range = '30days' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (range) {
      case '7days':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'all':
        startDate = new Date(0);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Note: These would connect to actual blog, forum, course, event models
    // For now, returning sample data structure
    
    const stats = {
      blogPosts: 0, // await BlogPost.countDocuments({ createdAt: { $gte: startDate } })
      forumPosts: 0, // await ForumPost.countDocuments({ createdAt: { $gte: startDate } })
      courseEnrollments: 0, // await CourseEnrollment.countDocuments({ createdAt: { $gte: startDate } })
      eventAttendance: 0 // await EventAttendance.countDocuments({ createdAt: { $gte: startDate } })
    };

    // Recent activities
    const recentActivities = [
      {
        timestamp: new Date(),
        type: 'Registration',
        userName: 'Sample User',
        details: 'New member registered',
        status: 'completed'
      }
      // This would be populated from actual activity logs
    ];

    res.json({
      success: true,
      stats,
      recentActivities
    });
  } catch (err) {
    console.error('Engagement analytics error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});

/**
 * @route   GET /api/analytics/partners
 * @desc    Get partner analytics
 * @access  Private/Admin
 */
router.get('/partners', [auth, adminAuth], async (req, res) => {
  try {
    // Partner type distribution
    const partnerTypes = await Partner.aggregate([
      {
        $group: {
          _id: '$partnerType',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          type: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    // Partnership type distribution
    const partnershipTypes = await Partner.aggregate([
      {
        $group: {
          _id: '$partnershipType',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          type: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    // Top performing partners (by successful placements)
    const topPartners = await Partner.find()
      .sort({ successfulPlacements: -1 })
      .limit(10)
      .select('organizationName successfulPlacements totalNominations');

    res.json({
      success: true,
      partnerTypes,
      partnershipTypes,
      topPartners
    });
  } catch (err) {
    console.error('Partner analytics error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});

/**
 * @route   GET /api/analytics/activity-log
 * @desc    Get detailed activity log
 * @access  Private/Admin
 */
router.get('/activity-log', [auth, adminAuth], async (req, res) => {
  try {
    const { page = 1, limit = 50, type, userId } = req.query;
    
    // This would query an ActivityLog model
    // For now, returning structure
    
    const activities = [
      {
        _id: '1',
        timestamp: new Date(),
        userId: 'user123',
        userName: 'John Doe',
        activityType: 'profile_completion',
        details: 'Completed profile',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0...'
      }
      // More activities...
    ];

    res.json({
      success: true,
      activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: activities.length,
        pages: Math.ceil(activities.length / limit)
      }
    });
  } catch (err) {
    console.error('Activity log error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});

/**
 * @route   GET /api/analytics/reports/summary
 * @desc    Generate comprehensive summary report
 * @access  Private/Admin
 */
router.get('/reports/summary', [auth, adminAuth], async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Member statistics
    const totalMembers = await User.countDocuments();
    const newMembers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    const completedProfiles = await User.countDocuments({
      profileCompleted: true
    });

    // Role statistics
    const approvedVolunteers = await User.countDocuments({
      'roles.volunteer.status': 'approved'
    });
    const approvedInterns = await User.countDocuments({
      'roles.intern.status': 'approved'
    });
    const approvedVendors = await User.countDocuments({
      'roles.vendor.status': 'approved'
    });

    // Partner statistics
    const totalPartners = await Partner.countDocuments();
    const approvedPartners = await Partner.countDocuments({
      applicationStatus: 'approved'
    });
    const pendingPartners = await Partner.countDocuments({
      applicationStatus: 'pending'
    });

    // Opportunity statistics
    const totalOpportunities = await Partner.aggregate([
      { $unwind: '$opportunities' },
      { $count: 'total' }
    ]);

    const activeOpportunities = await Partner.aggregate([
      { $unwind: '$opportunities' },
      { $match: { 'opportunities.status': 'active' } },
      { $count: 'total' }
    ]);

    // Nomination statistics
    const totalNominations = await Partner.aggregate([
      { $group: { _id: null, total: { $sum: '$totalNominations' } } }
    ]);

    const successfulPlacements = await Partner.aggregate([
      { $group: { _id: null, total: { $sum: '$successfulPlacements' } } }
    ]);

    const report = {
      generatedAt: now,
      period: {
        from: thirtyDaysAgo,
        to: now
      },
      members: {
        total: totalMembers,
        new: newMembers,
        completedProfiles,
        growthRate: totalMembers > 0 ? ((newMembers / totalMembers) * 100).toFixed(2) + '%' : '0%'
      },
      roles: {
        volunteers: approvedVolunteers,
        interns: approvedInterns,
        vendors: approvedVendors
      },
      partners: {
        total: totalPartners,
        approved: approvedPartners,
        pending: pendingPartners,
        approvalRate: totalPartners > 0 ? ((approvedPartners / totalPartners) * 100).toFixed(2) + '%' : '0%'
      },
      opportunities: {
        total: totalOpportunities[0]?.total || 0,
        active: activeOpportunities[0]?.total || 0
      },
      placements: {
        nominations: totalNominations[0]?.total || 0,
        successful: successfulPlacements[0]?.total || 0,
        successRate: totalNominations[0]?.total > 0 
          ? ((successfulPlacements[0]?.total / totalNominations[0]?.total) * 100).toFixed(2) + '%' 
          : '0%'
      }
    };

    res.json({
      success: true,
      report
    });
  } catch (err) {
    console.error('Summary report error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});

/**
 * @route   GET /api/analytics/export
 * @desc    Export analytics data as CSV
 * @access  Private/Admin
 */
router.get('/export', [auth, adminAuth], async (req, res) => {
  try {
    const { type = 'members' } = req.query;
    
    let data = [];
    let headers = [];
    
    switch (type) {
      case 'members':
        const members = await User.find()
          .select('name email profileCompleted createdAt roles')
          .lean();
        
        headers = ['Name', 'Email', 'Profile Completed', 'Registration Date', 'Roles'];
        data = members.map(m => [
          m.name,
          m.email,
          m.profileCompleted ? 'Yes' : 'No',
          new Date(m.createdAt).toLocaleDateString(),
          Object.keys(m.roles || {}).filter(r => m.roles[r]?.status === 'approved').join(', ')
        ]);
        break;
        
      case 'partners':
        const partners = await Partner.find()
          .select('organizationName partnerType applicationStatus totalNominations successfulPlacements')
          .lean();
        
        headers = ['Organization', 'Type', 'Status', 'Nominations', 'Placements'];
        data = partners.map(p => [
          p.organizationName,
          p.partnerType,
          p.applicationStatus,
          p.totalNominations,
          p.successfulPlacements
        ]);
        break;
    }
    
    // Create CSV
    const csv = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${type}_export_${Date.now()}.csv`);
    res.send(csv);
  } catch (err) {
    console.error('Export error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});

module.exports = router;
