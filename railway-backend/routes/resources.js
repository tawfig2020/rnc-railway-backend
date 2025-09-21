const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');

const Resource = mongoose.model('Resource');

// @route   GET /api/resources
// @desc    Get all resources
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    let query = { isVerified: true };
    
    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Filter by type
    if (req.query.type) {
      query.type = req.query.type;
    }
    
    // Search functionality
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { organization: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } }
      ];
    }
    
    // Filter by language
    if (req.query.language) {
      query.languages = { $in: [new RegExp(req.query.language, 'i')] };
    }
    
    // Filter by tag
    if (req.query.tag) {
      query.tags = { $in: [new RegExp(req.query.tag, 'i')] };
    }
    
    const resources = await Resource.find(query)
      .populate('addedBy', 'name profileImage')
      .sort({ isFeatured: -1, averageRating: -1, createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const total = await Resource.countDocuments(query);

    res.json({ 
      success: true,
      count: resources.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      },
      data: resources
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/resources/:id
// @desc    Get resource by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('addedBy', 'name profileImage')
      .populate('verifiedBy', 'name')
      .populate('ratings.user', 'name profileImage');

    if (!resource) {
      return res.status(404).json({ msg: 'Resource not found' });
    }

    res.json({ success: true, data: resource });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Resource not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/resources
// @desc    Create a resource
// @access  Private (Will require auth middleware)
router.post(
  '/',
  [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
    check('type', 'Resource type is required').not().isEmpty(),
    check('organization', 'Organization is required').not().isEmpty(),
    check('languages', 'At least one language is required').isArray({ min: 1 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // This will be replaced with actual auth middleware
      // For now, we'll use a placeholder user ID
      const userId = '60d0fe4f5311236168a109ca'; // This should come from auth middleware

      const { 
        title, description, category, type, contentUrl, fileUpload,
        organization, contactInfo, address, languages, tags
      } = req.body;

      const newResource = new Resource({
        title,
        description,
        category,
        type,
        contentUrl,
        fileUpload,
        organization,
        contactInfo,
        address,
        languages,
        tags: tags || [],
        addedBy: userId,
        // Admin users can auto-verify resources they add
        isVerified: false // This would be true for admin users
      });

      const resource = await newResource.save();

      res.json({ success: true, data: resource });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT /api/resources/:id
// @desc    Update a resource
// @access  Private (Will require auth middleware)
router.put('/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ msg: 'Resource not found' });
    }

    // Check if user is the one who added the resource
    // This will be implemented with auth middleware
    // For now we'll bypass this check

    const updateFields = {};
    const allowedFields = [
      'title', 'description', 'category', 'type', 'contentUrl', 
      'fileUpload', 'organization', 'contactInfo', 'address', 
      'languages', 'tags', 'isVerified', 'isFeatured'
    ];

    // Only update fields that are explicitly provided
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    // If verifying, add verifiedBy field
    if (updateFields.isVerified === true && !resource.isVerified) {
      // This will be replaced with actual auth middleware
      const verifierId = '60d0fe4f5311236168a109ca'; // This should come from auth middleware
      updateFields.verifiedBy = verifierId;
    }

    // Update the resource with the new data
    const updatedResource = await Resource.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    res.json({ success: true, data: updatedResource });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Resource not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/resources/:id
// @desc    Delete a resource
// @access  Private (Will require auth middleware)
router.delete('/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ msg: 'Resource not found' });
    }

    // Check if user is the one who added the resource or is an admin
    // This will be implemented with auth middleware
    // For now we'll bypass this check

    await resource.remove();

    res.json({ success: true, msg: 'Resource removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Resource not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/resources/:id/rate
// @desc    Rate a resource
// @access  Private (Will require auth middleware)
router.post(
  '/:id/rate',
  [
    check('rating', 'Rating must be between 1 and 5').isInt({ min: 1, max: 5 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const resource = await Resource.findById(req.params.id);

      if (!resource) {
        return res.status(404).json({ msg: 'Resource not found' });
      }

      // This will be replaced with actual auth middleware
      // For now, we'll use a placeholder user ID
      const userId = '60d0fe4f5311236168a109cb'; // This should come from auth middleware

      // Check if user has already rated
      const ratingIndex = resource.ratings.findIndex(
        rating => rating.user.toString() === userId
      );

      if (ratingIndex !== -1) {
        // Update existing rating
        resource.ratings[ratingIndex].rating = req.body.rating;
        resource.ratings[ratingIndex].comment = req.body.comment || resource.ratings[ratingIndex].comment;
        resource.ratings[ratingIndex].date = Date.now();
      } else {
        // Add new rating
        resource.ratings.push({
          user: userId,
          rating: req.body.rating,
          comment: req.body.comment || '',
          date: Date.now()
        });
      }

      // Recalculate average rating
      resource.averageRating = 
        resource.ratings.reduce((sum, item) => sum + item.rating, 0) / 
        resource.ratings.length;

      await resource.save();

      res.json({ success: true, data: resource.ratings });
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Resource not found' });
      }
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
