const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');

const Course = mongoose.model('Course');

// @route   GET /api/courses
// @desc    Get all courses
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    let query = { isPublished: true };
    
    // Search functionality
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Category filter
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Level filter
    if (req.query.level) {
      query.level = req.query.level;
    }

    // Language filter
    if (req.query.language) {
      query.language = { $regex: req.query.language, $options: 'i' };
    }
    
    const courses = await Course.find(query)
      .populate('instructor', 'name profileImage')
      .select('-lessons.content') // Exclude lesson content for better performance
      .sort({ isFeatured: -1, averageRating: -1, createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const total = await Course.countDocuments(query);

    res.json({ 
      success: true,
      count: courses.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      },
      data: courses
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/courses/:id
// @desc    Get course by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name profileImage bio')
      .populate('ratings.user', 'name profileImage');

    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    res.json({ success: true, data: course });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Course not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/courses
// @desc    Create a course
// @access  Private (Will require auth middleware)
router.post(
  '/',
  [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
    check('level', 'Level is required').not().isEmpty(),
    check('language', 'Language is required').not().isEmpty(),
    check('duration', 'Duration is required').isNumeric()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // This will be replaced with actual auth middleware
      // For now, we'll use a placeholder instructor ID
      const instructor = '60d0fe4f5311236168a109cd'; // This should come from auth middleware

      const { 
        title, description, category, level, duration, coverImage, 
        language, lessons, isPublished, isFeatured 
      } = req.body;

      const newCourse = new Course({
        title,
        description,
        category,
        level,
        instructor,
        duration,
        coverImage,
        language,
        lessons: lessons || [],
        isPublished: isPublished !== undefined ? isPublished : false,
        isFeatured: isFeatured !== undefined ? isFeatured : false
      });

      const course = await newCourse.save();

      res.json({ success: true, data: course });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT /api/courses/:id
// @desc    Update a course
// @access  Private (Will require auth middleware)
router.put('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    // Check if user is course instructor
    // This will be implemented with auth middleware
    // For now we'll bypass this check

    const updateFields = {};
    const allowedFields = [
      'title', 'description', 'category', 'level', 'duration', 
      'coverImage', 'language', 'lessons', 'isPublished', 'isFeatured'
    ];

    // Only update fields that are explicitly provided
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    // Update the course with the new data
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    res.json({ success: true, data: updatedCourse });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Course not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/courses/:id
// @desc    Delete a course
// @access  Private (Will require auth middleware)
router.delete('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    // Check if user is course instructor
    // This will be implemented with auth middleware
    // For now we'll bypass this check

    await course.remove();

    res.json({ success: true, msg: 'Course removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Course not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/courses/:id/enroll
// @desc    Enroll in a course
// @access  Private (Will require auth middleware)
router.post('/:id/enroll', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    // This will be replaced with actual auth middleware
    // For now, we'll use a placeholder user ID
    const userId = '60d0fe4f5311236168a109cb'; // This should come from auth middleware

    // Check if already enrolled
    if (course.enrolledUsers.includes(userId)) {
      return res.status(400).json({ msg: 'Already enrolled in this course' });
    }

    course.enrolledUsers.push(userId);
    await course.save();

    res.json({ success: true, data: course.enrolledUsers });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Course not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/courses/:id/rate
// @desc    Rate a course
// @access  Private (Will require auth middleware)
router.post(
  '/:id/rate',
  [
    check('rating', 'Rating must be between 1 and 5').isInt({ min: 1, max: 5 }),
    check('review', 'Review is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const course = await Course.findById(req.params.id);

      if (!course) {
        return res.status(404).json({ msg: 'Course not found' });
      }

      // This will be replaced with actual auth middleware
      // For now, we'll use a placeholder user ID
      const userId = '60d0fe4f5311236168a109cb'; // This should come from auth middleware

      // Check if user already rated
      const existingRatingIndex = course.ratings.findIndex(
        rating => rating.user.toString() === userId
      );

      if (existingRatingIndex !== -1) {
        // Update existing rating
        course.ratings[existingRatingIndex].rating = req.body.rating;
        course.ratings[existingRatingIndex].review = req.body.review;
        course.ratings[existingRatingIndex].date = Date.now();
      } else {
        // Add new rating
        course.ratings.push({
          user: userId,
          rating: req.body.rating,
          review: req.body.review
        });
      }

      // Recalculate average rating
      if (course.ratings.length > 0) {
        course.averageRating = 
          course.ratings.reduce((sum, item) => sum + item.rating, 0) / 
          course.ratings.length;
      }

      await course.save();

      res.json({ success: true, data: course.ratings });
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Course not found' });
      }
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
