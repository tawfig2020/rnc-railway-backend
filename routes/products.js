const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const Vendor = mongoose.model('Vendor');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadPath = 'uploads/products';
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)){
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// @route   GET /api/products
// @desc    Get all products (with optional filtering)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      search, category, vendor, featured, 
      minPrice, maxPrice, sort, limit, page 
    } = req.query;

    const query = {};
    
    // Add filters if provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // Handle category filter - support both slug and ObjectId
    if (category) {
      // Check if it's a valid ObjectId
      if (mongoose.Types.ObjectId.isValid(category) && category.length === 24) {
        query.category = category;
      } else {
        // It's a slug, find the category first
        const Category = mongoose.model('Category');
        const categoryDoc = await Category.findOne({ slug: category });
        if (categoryDoc) {
          query.category = categoryDoc._id;
        } else {
          // Category not found, return empty results
          return res.json({
            success: true,
            data: [],
            pagination: {
              total: 0,
              page: currentPage,
              pages: 0,
              perPage
            }
          });
        }
      }
    }
    
    if (vendor) query.vendor = vendor;
    if (featured) query.featured = featured === 'true';
    
    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    // Only show approved products unless admin request
    if (!req.user || req.user.role !== 'admin') {
      query.status = 'approved';
    }
    
    // Pagination
    const currentPage = parseInt(page) || 1;
    const perPage = parseInt(limit) || 12;
    const skip = (currentPage - 1) * perPage;
    
    // Sort options
    let sortOptions = {};
    if (sort) {
      switch (sort) {
        case 'price-low':
          sortOptions = { price: 1 };
          break;
        case 'price-high':
          sortOptions = { price: -1 };
          break;
        case 'newest':
          sortOptions = { createdAt: -1 };
          break;
        case 'rating':
          sortOptions = { averageRating: -1 };
          break;
        default:
          sortOptions = { createdAt: -1 };
      }
    } else {
      sortOptions = { createdAt: -1 };
    }
    
    // Count total products for pagination
    const totalProducts = await Product.countDocuments(query);
    
    // Get products
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(perPage)
      .populate('vendor', 'businessName logo averageRating');
    
    res.json({
      success: true,
      data: products,
      pagination: {
        total: totalProducts,
        page: currentPage,
        pages: Math.ceil(totalProducts / perPage),
        perPage
      }
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      message: err.message 
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('vendor', 'businessName logo description averageRating')
      .populate('ratings.user', 'name profileImage');
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // If product is not approved, only allow vendor or admin to view it
    if (product.status !== 'approved') {
      if (!req.user || (req.user.role !== 'admin' && 
          !req.user._id.equals(product.vendor.user))) {
        return res.status(404).json({ error: 'Product not found' });
      }
    }
    
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/products
// @desc    Create a new product
// @access  Private (Vendor or Admin)
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    // Check if user is a vendor
    const vendor = await Vendor.findOne({ user: req.user.id });
    if (!vendor && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only vendors can create products' });
    }
    
    const {
      name, description, price, category, tags,
      stock, discountPrice, status
    } = req.body;
    
    // Process uploaded images
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        images.push(file.path);
      });
    }
    
    // Create product
    const product = new Product({
      name,
      description,
      price,
      discountPrice: discountPrice || 0,
      images: images.length > 0 ? images : ['default-product-image.jpg'],
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      stock,
      vendor: vendor ? vendor._id : null,
      status: req.user.role === 'admin' ? (status || 'approved') : 'pending'
    });
    
    await product.save();
    
    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private (Vendor owner or Admin)
router.put('/:id', auth, upload.array('images', 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Check if user is the vendor owner or admin
    const vendor = await Vendor.findOne({ user: req.user.id });
    const isVendorOwner = vendor && vendor._id.equals(product.vendor);
    
    if (!isVendorOwner && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    const {
      name, description, price, category, tags,
      stock, discountPrice, status, featured
    } = req.body;
    
    // Update fields if provided
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;
    if (discountPrice) product.discountPrice = discountPrice;
    if (stock) product.stock = stock;
    if (tags) product.tags = tags.split(',').map(tag => tag.trim());
    
    // Only admin can update these fields
    if (req.user.role === 'admin') {
      if (status) product.status = status;
      if (featured !== undefined) product.featured = featured === 'true';
    }
    
    // Process uploaded images if any
    if (req.files && req.files.length > 0) {
      const images = [];
      req.files.forEach(file => {
        images.push(file.path);
      });
      product.images = images;
    }
    
    await product.save();
    
    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private (Vendor owner or Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Check if user is the vendor owner or admin
    const vendor = await Vendor.findOne({ user: req.user.id });
    const isVendorOwner = vendor && vendor._id.equals(product.vendor);
    
    if (!isVendorOwner && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    // Delete product images from storage
    product.images.forEach(image => {
      if (image !== 'default-product-image.jpg') {
        const imagePath = path.join(__dirname, '..', image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    });
    
    await Product.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/products/:id/review
// @desc    Add/update product review
// @access  Private
router.post('/:id/review', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Check if user already reviewed this product
    const existingReview = product.ratings.find(
      rating => rating.user.toString() === req.user.id
    );
    
    if (existingReview) {
      // Update existing review
      existingReview.rating = rating;
      existingReview.comment = comment || existingReview.comment;
      existingReview.date = Date.now();
    } else {
      // Add new review
      product.ratings.push({
        user: req.user.id,
        rating,
        comment,
        date: Date.now()
      });
    }
    
    await product.save();
    
    res.json({
      message: 'Review added successfully',
      ratings: product.ratings,
      averageRating: product.averageRating
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/products/admin/dashboard
// @desc    Get product statistics for admin dashboard
// @access  Private (Admin only)
router.get('/admin/dashboard', adminAuth, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const pendingProducts = await Product.countDocuments({ status: 'pending' });
    const featuredProducts = await Product.countDocuments({ featured: true });
    const lowStockProducts = await Product.countDocuments({ stock: { $lt: 10 } });
    
    // Products by category
    const categoryCounts = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Recent products
    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('vendor', 'businessName');
    
    res.json({
      totalProducts,
      pendingProducts,
      featuredProducts,
      lowStockProducts,
      categoryCounts,
      recentProducts
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/products/:id/featured
// @desc    Toggle product featured status
// @access  Private (Admin only)
router.put('/:id/featured', [auth, adminAuth], async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Toggle featured status
    product.featured = !product.featured;
    await product.save();
    
    res.json({
      message: `Product ${product.featured ? 'marked as featured' : 'removed from featured'}`,
      _id: product._id,
      featured: product.featured
    });
  } catch (err) {
    console.error('Error toggling featured status:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/products/:id/status
// @desc    Update product status (approve/reject)
// @access  Private (Admin only)
router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    
    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    product.status = status;
    
    if (status === 'rejected' && rejectionReason) {
      // In a real app, you would send notification to vendor with rejection reason
      console.log(`Product ${product._id} rejected: ${rejectionReason}`);
    }
    
    await product.save();
    
    res.json({
      message: `Product ${status} successfully`,
      product
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
