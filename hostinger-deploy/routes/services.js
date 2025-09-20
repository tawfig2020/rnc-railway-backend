const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const staffAuth = require('../middleware/staffAuth');

const Service = mongoose.model('Service');

/**
 * @route   GET /api/services
 * @desc    Get all services with filtering options
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { category, status, featured, search, sort, limit = 10, page = 1 } = req.query;

    // Build query
    const query = {};
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Filter by status (default to active for public)
    query.status = status || 'active';
    
    // Filter by featured
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Sorting
    let sortOptions = {};
    if (sort) {
      switch (sort) {
        case 'newest':
          sortOptions = { createdAt: -1 };
          break;
        case 'oldest':
          sortOptions = { createdAt: 1 };
          break;
        case 'name_asc':
          sortOptions = { name: 1 };
          break;
        case 'name_desc':
          sortOptions = { name: -1 };
          break;
        case 'rating_high':
          sortOptions = { averageRating: -1 };
          break;
        default:
          sortOptions = { createdAt: -1 };
      }
    } else {
      sortOptions = { createdAt: -1 };
    }
    
    // Execute query
    const services = await Service
      .find(query)
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip(skip)
      .populate('createdBy', 'name');
      
    // Get total count
    const total = await Service.countDocuments(query);
    
    res.json({
      success: true,
      count: services.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: services
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

/**
 * @route   GET /api/services/:id
 * @desc    Get service by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('createdBy', 'name email');
      
    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }
    
    // Increment view count
    service.metrics.views += 1;
    await service.save();
    
    res.json(service);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Service not found' });
    }
    res.status(500).send('Server error');
  }
});

/**
 * @route   POST /api/services
 * @desc    Create a service
 * @access  Private (Admin, Staff)
 */
router.post(
  '/',
  [
    auth,
    staffAuth,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('shortDescription', 'Short description is required').not().isEmpty(),
      check('category', 'Category is required').not().isEmpty(),
      check('provider.name', 'Provider name is required').not().isEmpty(),
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        name,
        description,
        shortDescription,
        category,
        image,
        status,
        eligibilityCriteria,
        applicationProcess,
        provider,
        location,
        schedule,
        capacity,
        cost,
        isFeatured,
        languages,
        requiredDocuments
      } = req.body;

      // Create service
      const service = new Service({
        name,
        description,
        shortDescription,
        category,
        image,
        status,
        eligibilityCriteria,
        applicationProcess,
        provider,
        location,
        schedule,
        capacity,
        cost,
        isFeatured,
        languages,
        requiredDocuments,
        createdBy: req.user.id
      });

      const savedService = await service.save();
      res.json(savedService);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

/**
 * @route   PUT /api/services/:id
 * @desc    Update a service
 * @access  Private (Admin, Staff)
 */
router.put(
  '/:id',
  [
    auth,
    staffAuth
  ],
  async (req, res) => {
    try {
      const service = await Service.findById(req.params.id);
      
      if (!service) {
        return res.status(404).json({ msg: 'Service not found' });
      }
      
      // Update fields
      const updateFields = [
        'name', 'description', 'shortDescription', 'category', 'image',
        'status', 'eligibilityCriteria', 'applicationProcess', 'provider',
        'location', 'schedule', 'capacity', 'cost', 'isFeatured',
        'languages', 'requiredDocuments'
      ];
      
      updateFields.forEach(field => {
        if (req.body[field] !== undefined) {
          if (field === 'provider' || field === 'location') {
            // For nested objects, merge instead of replace
            service[field] = { ...service[field], ...req.body[field] };
          } else {
            service[field] = req.body[field];
          }
        }
      });
      
      await service.save();
      res.json(service);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Service not found' });
      }
      res.status(500).send('Server error');
    }
  }
);

/**
 * @route   DELETE /api/services/:id
 * @desc    Delete a service
 * @access  Private (Admin only)
 */
router.delete('/:id', [auth, adminAuth], async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }
    
    await service.remove();
    res.json({ msg: 'Service removed' });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Service not found' });
    }
    res.status(500).send('Server error');
  }
});

/**
 * @route   PUT /api/services/:id/feature
 * @desc    Toggle featured status
 * @access  Private (Admin, Staff)
 */
router.put('/:id/feature', [auth, staffAuth], async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }
    
    // Toggle featured status
    service.isFeatured = !service.isFeatured;
    
    await service.save();
    res.json({
      isFeatured: service.isFeatured,
      msg: service.isFeatured ? 'Service is now featured' : 'Service is no longer featured'
    });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Service not found' });
    }
    res.status(500).send('Server error');
  }
});

/**
 * @route   PUT /api/services/:id/status
 * @desc    Update service status
 * @access  Private (Admin, Staff)
 */
router.put('/:id/status', [auth, staffAuth], async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['active', 'inactive', 'pending'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status value' });
    }
    
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }
    
    service.status = status;
    await service.save();
    
    res.json({
      status: service.status,
      msg: `Service status updated to ${status}`
    });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Service not found' });
    }
    res.status(500).send('Server error');
  }
});

/**
 * @route   POST /api/services/:id/rating
 * @desc    Add rating to service
 * @access  Private
 */
router.post(
  '/:id/rating',
  [
    auth,
    [
      check('rating', 'Rating must be between 1 and 5').isInt({ min: 1, max: 5 })
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const service = await Service.findById(req.params.id);
      
      if (!service) {
        return res.status(404).json({ msg: 'Service not found' });
      }
      
      const { rating, comment } = req.body;
      
      // Check if user already rated this service
      const alreadyRated = service.ratings.find(
        r => r.user.toString() === req.user.id
      );
      
      if (alreadyRated) {
        // Update existing rating
        service.ratings.forEach(r => {
          if (r.user.toString() === req.user.id) {
            r.rating = rating;
            r.comment = comment || r.comment;
            r.date = Date.now();
          }
        });
      } else {
        // Add new rating
        service.ratings.unshift({
          user: req.user.id,
          rating,
          comment,
        });
      }
      
      // Calculate new average
      if (service.ratings.length > 0) {
        service.averageRating = 
          service.ratings.reduce((acc, item) => acc + item.rating, 0) / 
          service.ratings.length;
      }
      
      await service.save();
      
      res.json(service.ratings);
    } catch (err) {
      console.error(err);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Service not found' });
      }
      res.status(500).send('Server error');
    }
  }
);

/**
 * @route   GET /api/services/categories/list
 * @desc    Get list of service categories
 * @access  Public
 */
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Service.distinct('category');
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

/**
 * @route   GET /api/services/admin/dashboard
 * @desc    Get service stats for admin dashboard
 * @access  Private (Admin, Staff)
 */
router.get('/admin/dashboard', [auth, staffAuth], async (req, res) => {
  try {
    // Total services
    const totalServices = await Service.countDocuments();
    
    // Active services
    const activeServices = await Service.countDocuments({ status: 'active' });
    
    // Pending services
    const pendingServices = await Service.countDocuments({ status: 'pending' });
    
    // Services by category
    const categoryCounts = await Service.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Services with highest views
    const topViewed = await Service
      .find()
      .sort({ 'metrics.views': -1 })
      .limit(5)
      .select('name metrics.views');
    
    // Services with highest ratings
    const topRated = await Service
      .find({ 'ratings.0': { $exists: true } })
      .sort({ averageRating: -1 })
      .limit(5)
      .select('name averageRating');
    
    res.json({
      totalServices,
      activeServices,
      pendingServices,
      categoryCounts,
      topViewed,
      topRated
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
