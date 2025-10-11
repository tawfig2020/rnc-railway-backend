const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const CommunityProject = mongoose.model('CommunityProject');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// @route   GET /api/community-projects
// @desc    Get all active community projects (with optional filtering)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      search, 
      status = 'active',
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    // Build query
    const query = {};
    
    // Filter by status (default to active for public)
    if (status) {
      query.status = status;
    }
    
    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Search in title and description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = order === 'desc' ? -1 : 1;

    // Execute query
    const projects = await CommunityProject.find(query)
      .populate('createdBy', 'name email')
      .populate('comments.user', 'name avatar')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await CommunityProject.countDocuments(query);

    res.json({
      success: true,
      count: projects.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: projects
    });
  } catch (error) {
    console.error('Error fetching community projects:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching projects',
      message: error.message
    });
  }
});

// @route   GET /api/community-projects/:id
// @desc    Get single community project by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const project = await CommunityProject.findById(req.params.id)
      .populate('createdBy', 'name email avatar')
      .populate('comments.user', 'name avatar');

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    
    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error while fetching project',
      message: error.message
    });
  }
});

// @route   POST /api/community-projects
// @desc    Create a new community project
// @access  Private (authenticated users)
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      image,
      location,
      fundingGoal,
      tags,
      founder
    } = req.body;

    // Validation
    if (!title || !category || !description || !location) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields: title, category, description, location'
      });
    }

    // Create project
    const project = new CommunityProject({
      title: title.trim(),
      category,
      description: description.trim(),
      image: image || undefined,
      location: location.trim(),
      fundingGoal: fundingGoal || 0,
      tags: tags || [],
      founder: {
        name: founder?.name || req.user.name,
        avatar: founder?.avatar || req.user.avatar || undefined,
        role: founder?.role || 'Project Founder'
      },
      createdBy: req.user.id
    });

    await project.save();

    // Populate user data before sending response
    await project.populate('createdBy', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    console.error('Error creating project:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error while creating project',
      message: error.message
    });
  }
});

// @route   PUT /api/community-projects/:id
// @desc    Update a community project
// @access  Private (owner or admin)
router.put('/:id', auth, async (req, res) => {
  try {
    let project = await CommunityProject.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Check ownership (user must be creator or admin)
    if (project.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this project'
      });
    }

    // Update fields
    const updateFields = [
      'title', 'category', 'description', 'image', 'location',
      'participants', 'progress', 'fundingGoal', 'fundingCurrent',
      'tags', 'founder', 'status'
    ];

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    await project.save();
    await project.populate('createdBy', 'name email avatar');

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });
  } catch (error) {
    console.error('Error updating project:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error while updating project',
      message: error.message
    });
  }
});

// @route   DELETE /api/community-projects/:id
// @desc    Delete a community project
// @access  Private (owner or admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await CommunityProject.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Check ownership
    if (project.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this project'
      });
    }

    await project.deleteOne();

    res.json({
      success: true,
      message: 'Project deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error while deleting project',
      message: error.message
    });
  }
});

// @route   POST /api/community-projects/:id/like
// @desc    Toggle like on a project
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const project = await CommunityProject.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Check if user already liked
    const likeIndex = project.likes.indexOf(req.user.id);

    if (likeIndex > -1) {
      // Unlike
      project.likes.splice(likeIndex, 1);
    } else {
      // Like
      project.likes.push(req.user.id);
    }

    await project.save();

    res.json({
      success: true,
      message: likeIndex > -1 ? 'Project unliked' : 'Project liked',
      data: {
        likes: project.likes.length,
        isLiked: likeIndex === -1
      }
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while toggling like',
      message: error.message
    });
  }
});

// @route   POST /api/community-projects/:id/bookmark
// @desc    Toggle bookmark on a project
// @access  Private
router.post('/:id/bookmark', auth, async (req, res) => {
  try {
    const project = await CommunityProject.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Check if user already bookmarked
    const bookmarkIndex = project.bookmarks.indexOf(req.user.id);

    if (bookmarkIndex > -1) {
      // Remove bookmark
      project.bookmarks.splice(bookmarkIndex, 1);
    } else {
      // Add bookmark
      project.bookmarks.push(req.user.id);
    }

    await project.save();

    res.json({
      success: true,
      message: bookmarkIndex > -1 ? 'Bookmark removed' : 'Project bookmarked',
      data: {
        bookmarks: project.bookmarks.length,
        isBookmarked: bookmarkIndex === -1
      }
    });
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while toggling bookmark',
      message: error.message
    });
  }
});

// @route   POST /api/community-projects/:id/comment
// @desc    Add a comment to a project
// @access  Private
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Comment text is required'
      });
    }

    const project = await CommunityProject.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Add comment
    project.comments.push({
      user: req.user.id,
      text: text.trim(),
      createdAt: new Date()
    });

    await project.save();
    await project.populate('comments.user', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: project.comments[project.comments.length - 1]
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while adding comment',
      message: error.message
    });
  }
});

// @route   DELETE /api/community-projects/:id/comment/:commentId
// @desc    Delete a comment from a project
// @access  Private (comment owner or admin)
router.delete('/:id/comment/:commentId', auth, async (req, res) => {
  try {
    const project = await CommunityProject.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Find comment
    const comment = project.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }

    // Check ownership
    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this comment'
      });
    }

    // Remove comment
    comment.deleteOne();
    await project.save();

    res.json({
      success: true,
      message: 'Comment deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting comment',
      message: error.message
    });
  }
});

// @route   GET /api/community-projects/admin/all
// @desc    Get all projects including drafts (admin only)
// @access  Private (admin)
router.get('/admin/all', [auth, adminAuth], async (req, res) => {
  try {
    const projects = await CommunityProject.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error('Error fetching all projects:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching projects',
      message: error.message
    });
  }
});

module.exports = router;
