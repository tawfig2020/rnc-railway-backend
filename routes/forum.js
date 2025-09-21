const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const ForumQuestion = require('../models/ForumQuestion');
const User = require('../models/User');

// @route   GET api/forum/questions
// @desc    Get all forum questions
// @access  Public
router.get('/questions', async (req, res) => {
  try {
    const { category, status, search, sort, page = 1, limit = 10 } = req.query;
    
    const query = {};
    
    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    } else {
      // By default, don't show removed questions to regular users
      if (!req.header('x-auth-token')) {
        query.status = { $ne: 'removed' };
      }
    }
    
    // Search in title and content
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
      case 'most_voted':
        // We'll use aggregation for this
        break;
      case 'most_viewed':
        sortOption = { views: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }
    
    // Calculate skip for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let questions;
    let total;
    
    if (sort === 'most_voted') {
      // Aggregate to calculate votes
      questions = await ForumQuestion.aggregate([
        { $match: query },
        { $addFields: { 
          voteCount: { 
            $subtract: [
              { $size: "$votes.up" }, 
              { $size: "$votes.down" }
            ] 
          }
        }},
        { $sort: { voteCount: -1, createdAt: -1 } },
        { $skip: skip },
        { $limit: parseInt(limit) }
      ]);
      
      // Count total matching documents
      total = await ForumQuestion.countDocuments(query);
    } else {
      // Regular query
      questions = await ForumQuestion.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit));
      
      // Count total matching documents
      total = await ForumQuestion.countDocuments(query);
    }
    
    // Calculate total pages
    const totalPages = Math.ceil(total / parseInt(limit));
    
    res.json({
      questions,
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

// @route   GET api/forum/questions/:id
// @desc    Get a single forum question by ID
// @access  Public
router.get('/questions/:id', async (req, res) => {
  try {
    const question = await ForumQuestion.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }
    
    // Increment view count
    question.views += 1;
    await question.save();
    
    res.json(question);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Question not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/forum/questions
// @desc    Create a new forum question
// @access  Private (RNC members only)
router.post('/questions', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    // Check if user is an RNC member
    if (!user.isMember) {
      return res.status(403).json({ msg: 'Only RNC members can post questions' });
    }
    
    const { title, content, category, tags } = req.body;
    
    // Create new question
    const newQuestion = new ForumQuestion({
      title,
      content,
      category,
      tags: tags || [],
      author: req.user.id,
      authorName: user.name,
      authorAvatar: user.avatar
    });
    
    const question = await newQuestion.save();
    res.json(question);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/forum/questions/:id
// @desc    Update a forum question
// @access  Private (Question author only)
router.put('/questions/:id', auth, async (req, res) => {
  try {
    const question = await ForumQuestion.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }
    
    // Check if user is author
    if (question.author.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'User not authorized to edit this question' });
    }
    
    // Update fields
    const { title, content, category, tags } = req.body;
    
    if (title) question.title = title;
    if (content) question.content = content;
    if (category) question.category = category;
    if (tags) question.tags = tags;
    
    question.updatedAt = Date.now();
    
    await question.save();
    res.json(question);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Question not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/forum/questions/:id/status
// @desc    Update a question's status (active, solved, closed, removed)
// @access  Private (Admin, moderator or author)
router.put('/questions/:id/status', auth, async (req, res) => {
  try {
    const question = await ForumQuestion.findById(req.params.id);
    const user = await User.findById(req.user.id).select('-password');
    
    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }
    
    // Check if user is admin, moderator, or question author
    const isAdmin = user.role === 'admin';
    const isModerator = user.role === 'moderator';
    const isAuthor = question.author.toString() === req.user.id;
    
    if (!isAdmin && !isModerator && !isAuthor) {
      return res.status(403).json({ msg: 'Not authorized to change question status' });
    }
    
    // Some status changes are restricted to admins/moderators
    const { status } = req.body;
    if (status === 'removed' && !isAdmin && !isModerator) {
      return res.status(403).json({ msg: 'Only admins and moderators can remove questions' });
    }
    
    question.status = status;
    question.updatedAt = Date.now();
    
    await question.save();
    res.json(question);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Question not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/forum/questions/:id/flag
// @desc    Flag a question as inappropriate
// @access  Private
router.put('/questions/:id/flag', auth, async (req, res) => {
  try {
    const question = await ForumQuestion.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }
    
    const { reason } = req.body;
    
    // Check if user already flagged this question
    const existingFlag = question.flags.find(flag => flag.user.toString() === req.user.id);
    if (existingFlag) {
      return res.status(400).json({ msg: 'Question already flagged by this user' });
    }
    
    question.flags.push({
      user: req.user.id,
      reason: reason || 'Inappropriate content'
    });
    
    await question.save();
    res.json(question);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Question not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/forum/questions/:id/answers
// @desc    Add an answer to a question
// @access  Private (RNC members only)
router.post('/questions/:id/answers', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const question = await ForumQuestion.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }
    
    // Check if user is an RNC member
    if (!user.isMember) {
      return res.status(403).json({ msg: 'Only RNC members can post answers' });
    }
    
    const { content } = req.body;
    
    const newAnswer = {
      content,
      author: req.user.id,
      authorName: user.name,
      authorAvatar: user.avatar
    };
    
    question.answers.unshift(newAnswer);
    question.updatedAt = Date.now();
    
    await question.save();
    res.json(question);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Question not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/forum/admin/stats
// @desc    Get forum admin statistics
// @access  Private (Admin only)
router.get('/admin/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    // Check if user is admin or moderator
    if (user.role !== 'admin' && user.role !== 'moderator') {
      return res.status(403).json({ msg: 'Access denied' });
    }
    
    // Get counts for different question statuses
    const totalQuestions = await ForumQuestion.countDocuments();
    const activeQuestions = await ForumQuestion.countDocuments({ status: 'active' });
    const solvedQuestions = await ForumQuestion.countDocuments({ status: 'solved' });
    const closedQuestions = await ForumQuestion.countDocuments({ status: 'closed' });
    const removedQuestions = await ForumQuestion.countDocuments({ status: 'removed' });
    
    // Get count of flagged questions
    const flaggedQuestions = await ForumQuestion.countDocuments({
      'flags.0': { $exists: true }
    });
    
    res.json({
      totalQuestions,
      activeQuestions,
      solvedQuestions,
      closedQuestions,
      removedQuestions,
      flaggedQuestions
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
