const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const staffAuth = require('../middleware/staffAuth');

// Use the Service model (renamed to Program in terminology only)
const Program = mongoose.model('Service');

/**
 * @route   GET /api/programs
 * @desc    Get all programs with filtering options
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
        case 'name':
          sortOptions = { name: 1 };
          break;
        default:
          sortOptions = { createdAt: -1 };
      }
    } else {
      sortOptions = { createdAt: -1 };
    }
    
    // Execute query
    const programs = await Program.find(query)
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip(skip)
      .select('-__v');
    
    // Get total count for pagination
    const total = await Program.countDocuments(query);
    
    res.json({
      success: true,
      count: programs.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: programs
    });
  } catch (err) {
    console.error('Error fetching programs:', err.message);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching programs',
      error: err.message 
    });
  }
});

/**
 * @route   GET /api/programs/:id
 * @desc    Get single program by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const program = await Program.findById(req.params.id).select('-__v');
    
    if (!program) {
      return res.status(404).json({ 
        success: false,
        message: 'Program not found' 
      });
    }
    
    res.json({
      success: true,
      data: program
    });
  } catch (err) {
    console.error('Error fetching program:', err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Program not found' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching program',
      error: err.message 
    });
  }
});

/**
 * @route   POST /api/programs
 * @desc    Create a new program
 * @access  Private (Admin/Staff)
 */
router.post(
  '/',
  [
    auth,
    staffAuth,
    [
      check('name', 'Program name is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('shortDescription', 'Short description is required').not().isEmpty(),
      check('category', 'Category is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    try {
      const newProgram = new Program(req.body);
      const program = await newProgram.save();
      
      res.status(201).json({
        success: true,
        data: program
      });
    } catch (err) {
      console.error('Error creating program:', err.message);
      res.status(500).json({ 
        success: false,
        message: 'Server error while creating program',
        error: err.message 
      });
    }
  }
);

/**
 * @route   PUT /api/programs/:id
 * @desc    Update a program
 * @access  Private (Admin/Staff)
 */
router.put('/:id', [auth, staffAuth], async (req, res) => {
  try {
    let program = await Program.findById(req.params.id);
    
    if (!program) {
      return res.status(404).json({ 
        success: false,
        message: 'Program not found' 
      });
    }
    
    program = await Program.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: program
    });
  } catch (err) {
    console.error('Error updating program:', err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Program not found' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error while updating program',
      error: err.message 
    });
  }
});

/**
 * @route   DELETE /api/programs/:id
 * @desc    Delete a program
 * @access  Private (Admin only)
 */
router.delete('/:id', [auth, adminAuth], async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    
    if (!program) {
      return res.status(404).json({ 
        success: false,
        message: 'Program not found' 
      });
    }
    
    await program.remove();
    
    res.json({ 
      success: true,
      message: 'Program deleted successfully' 
    });
  } catch (err) {
    console.error('Error deleting program:', err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Program not found' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error while deleting program',
      error: err.message 
    });
  }
});

/**
 * @route   GET /api/programs/category/:category
 * @desc    Get programs by category
 * @access  Public
 */
router.get('/category/:category', async (req, res) => {
  try {
    const programs = await Program.find({ 
      category: req.params.category,
      status: 'active'
    }).select('-__v');
    
    res.json({
      success: true,
      count: programs.length,
      data: programs
    });
  } catch (err) {
    console.error('Error fetching programs by category:', err.message);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching programs',
      error: err.message 
    });
  }
});

/**
 * @route   GET /api/programs/featured
 * @desc    Get featured programs
 * @access  Public
 */
router.get('/featured/list', async (req, res) => {
  try {
    const programs = await Program.find({ 
      isFeatured: true,
      status: 'active'
    })
    .limit(6)
    .select('-__v');
    
    res.json({
      success: true,
      count: programs.length,
      data: programs
    });
  } catch (err) {
    console.error('Error fetching featured programs:', err.message);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching featured programs',
      error: err.message 
    });
  }
});

module.exports = router;
