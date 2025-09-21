const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');

const BlogPost = mongoose.model('BlogPost');

// @route   GET /api/blogs
// @desc    Get all blog posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    const search = req.query.search 
      ? { 
          $or: [
            { title: { $regex: req.query.search, $options: 'i' } },
            { content: { $regex: req.query.search, $options: 'i' } },
            { tags: { $in: [new RegExp(req.query.search, 'i')] } }
          ] 
        } 
      : {};
    
    const tag = req.query.tag ? { tags: { $in: [new RegExp(req.query.tag, 'i')] } } : {};
    
    const posts = await BlogPost.find({ ...search, ...tag, status: 'published' })
      .populate('author', 'name profileImage')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const total = await BlogPost.countDocuments({ ...search, ...tag, status: 'published' });

    res.json({ 
      success: true,
      count: posts.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      },
      data: posts
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/blogs/:id
// @desc    Get blog post by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id)
      .populate('author', 'name profileImage bio')
      .populate('comments.user', 'name profileImage');

    if (!post) {
      return res.status(404).json({ msg: 'Blog post not found' });
    }

    // Increment view count logic could be added here

    res.json({ success: true, data: post });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Blog post not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/blogs
// @desc    Create a blog post
// @access  Private (Will require auth middleware)
router.post(
  '/',
  [
    check('title', 'Title is required').not().isEmpty(),
    check('content', 'Content is required').not().isEmpty(),
    check('excerpt', 'Excerpt is required').not().isEmpty(),
    check('tags', 'At least one tag is required').isArray({ min: 1 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // This will be replaced with actual auth middleware
      // For now, we'll use a placeholder author ID
      const author = '60d0fe4f5311236168a109cb'; // This should come from auth middleware

      const { title, content, excerpt, featuredImage, tags, status, readTime } = req.body;

      const newPost = new BlogPost({
        title,
        content,
        excerpt,
        featuredImage,
        author,
        tags,
        status: status || 'published',
        readTime: readTime || Math.ceil(content.split(' ').length / 200)
      });

      const post = await newPost.save();

      res.json({ success: true, data: post });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT /api/blogs/:id
// @desc    Update a blog post
// @access  Private (Will require auth middleware)
router.put('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Blog post not found' });
    }

    // Check if user is post author
    // This will be implemented with auth middleware
    // For now we'll bypass this check

    const { title, content, excerpt, featuredImage, tags, status, readTime } = req.body;

    if (title) post.title = title;
    if (content) post.content = content;
    if (excerpt) post.excerpt = excerpt;
    if (featuredImage) post.featuredImage = featuredImage;
    if (tags) post.tags = tags;
    if (status) post.status = status;
    if (readTime) post.readTime = readTime;

    await post.save();

    res.json({ success: true, data: post });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Blog post not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/blogs/:id
// @desc    Delete a blog post
// @access  Private (Will require auth middleware)
router.delete('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Blog post not found' });
    }

    // Check if user is post author
    // This will be implemented with auth middleware
    // For now we'll bypass this check

    await post.remove();

    res.json({ success: true, msg: 'Blog post removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Blog post not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/blogs/:id/comment
// @desc    Add comment to a blog post
// @access  Private (Will require auth middleware)
router.post(
  '/:id/comment',
  [check('text', 'Comment text is required').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const post = await BlogPost.findById(req.params.id);

      if (!post) {
        return res.status(404).json({ msg: 'Blog post not found' });
      }

      // This will be replaced with actual auth middleware
      // For now, we'll use a placeholder user ID
      const user = '60d0fe4f5311236168a109cb'; // This should come from auth middleware

      const newComment = {
        text: req.body.text,
        user
      };

      post.comments.unshift(newComment);

      await post.save();

      res.json({ success: true, data: post.comments });
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Blog post not found' });
      }
      res.status(500).send('Server Error');
    }
  }
);

// @route   POST /api/blogs/:id/like
// @desc    Like a blog post
// @access  Private (Will require auth middleware)
router.post('/:id/like', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Blog post not found' });
    }

    // This will be replaced with actual auth middleware
    // For now, we'll use a placeholder user ID
    const user = '60d0fe4f5311236168a109cb'; // This should come from auth middleware

    // Check if the post has already been liked by this user
    if (post.likes.some(like => like.toString() === user)) {
      return res.status(400).json({ msg: 'Blog post already liked' });
    }

    post.likes.unshift(user);

    await post.save();

    res.json({ success: true, data: post.likes });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Blog post not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
