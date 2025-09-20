const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const AIResource = require('../models/AIResource');
const User = require('../models/User');

// @route   GET api/ai/resources
// @desc    Get all AI resources
// @access  Public
router.get('/resources', async (req, res) => {
  try {
    const { category, type, skillLevel, isFree, search, sort, page = 1, limit = 12 } = req.query;
    
    const query = {};
    
    // Apply filters
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (type && type !== 'all') {
      query.type = type;
    }
    
    if (skillLevel && skillLevel !== 'all') {
      query.skillLevel = skillLevel;
    }
    
    if (isFree === 'true') {
      query.isFree = true;
    } else if (isFree === 'false') {
      query.isFree = false;
    }
    
    // Search in title, description and tags
    if (search) {
      query.$text = { $search: search };
    }
    
    // Sort options
    let sortOption = {};
    switch (sort) {
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'most_popular':
        sortOption = { views: -1 };
        break;
      case 'most_liked':
        // We'll handle this with aggregation
        break;
      case 'featured':
        sortOption = { featuredRank: -1, createdAt: -1 };
        break;
      default:
        sortOption = { featuredRank: -1, createdAt: -1 }; // Default to featured first, then newest
    }
    
    // Calculate skip for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let resources;
    let total;
    
    if (sort === 'most_liked') {
      // Aggregate to sort by number of likes
      resources = await AIResource.aggregate([
        { $match: query },
        { $addFields: { likeCount: { $size: "$likes" } }},
        { $sort: { likeCount: -1, createdAt: -1 } },
        { $skip: skip },
        { $limit: parseInt(limit) }
      ]);
      
      total = await AIResource.countDocuments(query);
    } else {
      resources = await AIResource.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit));
      
      total = await AIResource.countDocuments(query);
    }
    
    // Calculate total pages
    const totalPages = Math.ceil(total / parseInt(limit));
    
    res.json({
      resources,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/ai/resources/:id
// @desc    Get a single AI resource by ID
// @access  Public
router.get('/resources/:id', async (req, res) => {
  try {
    const resource = await AIResource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ msg: 'Resource not found' });
    }
    
    // Increment view count
    resource.views += 1;
    await resource.save();
    
    res.json(resource);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Resource not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/ai/resources
// @desc    Create a new AI resource
// @access  Private (Admin only)
router.post('/resources', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    // Check if user is an admin
    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Only admins can create AI resources' });
    }
    
    const { 
      title, description, type, category, url, imageUrl,
      skillLevel, isFree, pricing, tags
    } = req.body;
    
    // Create new resource
    const newResource = new AIResource({
      title,
      description,
      type,
      category,
      url,
      imageUrl,
      skillLevel,
      isFree: isFree === undefined ? true : isFree,
      pricing,
      tags: tags || [],
      creator: req.user.id
    });
    
    const resource = await newResource.save();
    res.json(resource);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/ai/resources/:id
// @desc    Update an AI resource
// @access  Private (Admin only)
router.put('/resources/:id', auth, async (req, res) => {
  try {
    const resource = await AIResource.findById(req.params.id);
    const user = await User.findById(req.user.id).select('-password');
    
    if (!resource) {
      return res.status(404).json({ msg: 'Resource not found' });
    }
    
    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Only admins can update AI resources' });
    }
    
    // Update fields
    const {
      title, description, type, category, url, imageUrl,
      skillLevel, isFree, pricing, tags, featuredRank
    } = req.body;
    
    if (title) resource.title = title;
    if (description) resource.description = description;
    if (type) resource.type = type;
    if (category) resource.category = category;
    if (url) resource.url = url;
    if (imageUrl !== undefined) resource.imageUrl = imageUrl;
    if (skillLevel) resource.skillLevel = skillLevel;
    if (isFree !== undefined) resource.isFree = isFree;
    if (pricing !== undefined) resource.pricing = pricing;
    if (tags) resource.tags = tags;
    if (featuredRank !== undefined) resource.featuredRank = featuredRank;
    
    resource.updatedAt = Date.now();
    
    await resource.save();
    res.json(resource);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Resource not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/ai/resources/:id
// @desc    Delete an AI resource
// @access  Private (Admin only)
router.delete('/resources/:id', auth, async (req, res) => {
  try {
    const resource = await AIResource.findById(req.params.id);
    const user = await User.findById(req.user.id).select('-password');
    
    if (!resource) {
      return res.status(404).json({ msg: 'Resource not found' });
    }
    
    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Only admins can delete AI resources' });
    }
    
    await resource.remove();
    
    res.json({ msg: 'Resource removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Resource not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/ai/resources/:id/like
// @desc    Like an AI resource
// @access  Private
router.put('/resources/:id/like', auth, async (req, res) => {
  try {
    const resource = await AIResource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ msg: 'Resource not found' });
    }
    
    // Check if the resource has already been liked by this user
    if (resource.likes.some(like => like.toString() === req.user.id)) {
      // Unlike if already liked
      resource.likes = resource.likes.filter(like => like.toString() !== req.user.id);
    } else {
      // Add like
      resource.likes.unshift(req.user.id);
    }
    
    await resource.save();
    
    res.json(resource.likes);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Resource not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/ai/categories
// @desc    Get all AI resource categories with counts
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await AIResource.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/ai/types
// @desc    Get all AI resource types with counts
// @access  Public
router.get('/types', async (req, res) => {
  try {
    const types = await AIResource.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json(types);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
