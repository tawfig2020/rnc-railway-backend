const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Vendor = mongoose.model('Vendor');
const User = mongoose.model('User');
const Product = mongoose.model('Product');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadPath = 'uploads/vendors';
    
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

// Define upload fields for vendor
const vendorUpload = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]);

// @route   GET /api/vendors
// @desc    Get all vendors
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      search, category, featured, 
      sort, limit, page, status 
    } = req.query;

    const query = {};
    
    // Add filters if provided
    if (search) {
      query.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.categories = { $in: [category] };
    }
    
    if (featured) {
      query.featured = featured === 'true';
    }
    
    // Only show approved vendors for public requests
    // Allow admins to filter by status
    if (req.user && req.user.role === 'admin' && status) {
      query.approvalStatus = status;
    } else {
      query.approvalStatus = 'approved';
    }
    
    // Filter only active vendors
    query.active = true;
    
    // Pagination
    const currentPage = parseInt(page) || 1;
    const perPage = parseInt(limit) || 12;
    const skip = (currentPage - 1) * perPage;
    
    // Sort options
    let sortOptions = {};
    if (sort) {
      switch (sort) {
        case 'newest':
          sortOptions = { createdAt: -1 };
          break;
        case 'rating':
          sortOptions = { averageRating: -1 };
          break;
        case 'name':
          sortOptions = { businessName: 1 };
          break;
        default:
          sortOptions = { createdAt: -1 };
      }
    } else {
      sortOptions = { featured: -1, averageRating: -1 };
    }
    
    // Count total vendors for pagination
    const totalVendors = await Vendor.countDocuments(query);
    
    // Get vendors
    const vendors = await Vendor.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(perPage)
      .populate('user', 'name email');
    
    res.json({
      success: true,
      data: vendors,
      pagination: {
        total: totalVendors,
        page: currentPage,
        pages: Math.ceil(totalVendors / perPage),
        perPage
      }
    });
  } catch (err) {
    console.error('Error fetching vendors:', err);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      message: err.message 
    });
  }
});

// @route   GET /api/vendors/:id
// @desc    Get vendor by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id)
      .populate('user', 'name email profileImage')
      .populate('ratings.user', 'name profileImage');
    
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    
    // If vendor is not approved, only allow vendor user or admin to view it
    if (vendor.approvalStatus !== 'approved') {
      if (!req.user || (req.user.role !== 'admin' && 
          !req.user._id.equals(vendor.user._id))) {
        return res.status(404).json({ error: 'Vendor not found' });
      }
    }
    
    // Get vendor products
    const products = await Product.find({ 
      vendor: vendor._id,
      status: 'approved'
    }).limit(8);
    
    res.json({
      vendor,
      products
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/vendors
// @desc    Register as a vendor
// @access  Private
router.post('/', auth, vendorUpload, async (req, res) => {
  try {
    // Check if user is already a vendor
    const existingVendor = await Vendor.findOne({ user: req.user.id });
    if (existingVendor) {
      return res.status(400).json({ error: 'User is already registered as a vendor' });
    }
    
    const {
      businessName, description, contactEmail, contactPhone,
      website, categories, storyOfBusiness, address
    } = req.body;
    
    // Process uploaded files
    let logo = 'default-vendor-logo.jpg';
    let coverImage = 'default-vendor-cover.jpg';
    
    if (req.files) {
      if (req.files.logo) {
        logo = req.files.logo[0].path;
      }
      if (req.files.coverImage) {
        coverImage = req.files.coverImage[0].path;
      }
    }
    
    // Process social media links
    let socialMedia = {};
    if (req.body.facebook) socialMedia.facebook = req.body.facebook;
    if (req.body.instagram) socialMedia.instagram = req.body.instagram;
    if (req.body.twitter) socialMedia.twitter = req.body.twitter;
    if (req.body.linkedin) socialMedia.linkedin = req.body.linkedin;
    
    // Process address
    let addressObj = {};
    if (address) {
      try {
        addressObj = JSON.parse(address);
      } catch (e) {
        // If not valid JSON, try to parse from individual fields
        addressObj = {
          street: req.body.street || '',
          city: req.body.city || '',
          state: req.body.state || '',
          country: req.body.country || '',
          postalCode: req.body.postalCode || ''
        };
      }
    }
    
    // Create new vendor
    const vendor = new Vendor({
      user: req.user.id,
      businessName,
      description,
      logo,
      coverImage,
      contactEmail: contactEmail || req.user.email,
      contactPhone,
      website,
      socialMedia,
      categories: categories ? categories.split(',') : ['other'],
      storyOfBusiness,
      address: addressObj,
      approvalStatus: 'pending'
    });
    
    await vendor.save();
    
    // Update user role if not already a vendor or admin
    if (req.user.role !== 'admin') {
      await User.findByIdAndUpdate(req.user.id, { role: 'vendor' });
    }
    
    res.status(201).json({
      message: 'Vendor application submitted successfully. It is now pending approval.',
      vendor
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/vendors/:id
// @desc    Update vendor profile
// @access  Private (Vendor owner or Admin)
router.put('/:id', auth, vendorUpload, async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    
    // Check if user is the vendor owner or admin
    const isVendorOwner = vendor.user.equals(req.user.id);
    
    if (!isVendorOwner && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    const {
      businessName, description, contactEmail, contactPhone,
      website, categories, storyOfBusiness, address
    } = req.body;
    
    // Update fields if provided
    if (businessName) vendor.businessName = businessName;
    if (description) vendor.description = description;
    if (contactEmail) vendor.contactEmail = contactEmail;
    if (contactPhone) vendor.contactPhone = contactPhone;
    if (website) vendor.website = website;
    if (categories) vendor.categories = categories.split(',');
    if (storyOfBusiness) vendor.storyOfBusiness = storyOfBusiness;
    
    // Process address
    if (address) {
      try {
        vendor.address = JSON.parse(address);
      } catch (e) {
        // If not valid JSON, try to parse from individual fields
        vendor.address = {
          street: req.body.street || vendor.address.street,
          city: req.body.city || vendor.address.city,
          state: req.body.state || vendor.address.state,
          country: req.body.country || vendor.address.country,
          postalCode: req.body.postalCode || vendor.address.postalCode
        };
      }
    }
    
    // Process social media links
    if (req.body.facebook) vendor.socialMedia.facebook = req.body.facebook;
    if (req.body.instagram) vendor.socialMedia.instagram = req.body.instagram;
    if (req.body.twitter) vendor.socialMedia.twitter = req.body.twitter;
    if (req.body.linkedin) vendor.socialMedia.linkedin = req.body.linkedin;
    
    // Process uploaded files if any
    if (req.files) {
      if (req.files.logo) {
        // Delete old logo if it's not the default
        if (vendor.logo !== 'default-vendor-logo.jpg') {
          const logoPath = path.join(__dirname, '..', vendor.logo);
          if (fs.existsSync(logoPath)) {
            fs.unlinkSync(logoPath);
          }
        }
        vendor.logo = req.files.logo[0].path;
      }
      
      if (req.files.coverImage) {
        // Delete old cover image if it's not the default
        if (vendor.coverImage !== 'default-vendor-cover.jpg') {
          const coverPath = path.join(__dirname, '..', vendor.coverImage);
          if (fs.existsSync(coverPath)) {
            fs.unlinkSync(coverPath);
          }
        }
        vendor.coverImage = req.files.coverImage[0].path;
      }
    }
    
    // Admin only fields
    if (req.user.role === 'admin') {
      if (req.body.featured !== undefined) {
        vendor.featured = req.body.featured === 'true';
      }
      
      if (req.body.active !== undefined) {
        vendor.active = req.body.active === 'true';
      }
    }
    
    await vendor.save();
    
    res.json({
      message: 'Vendor profile updated successfully',
      vendor
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/vendors/:id/approval
// @desc    Approve/reject vendor application
// @access  Private (Admin only)
router.put('/:id/approval', adminAuth, async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    
    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const vendor = await Vendor.findById(req.params.id);
    
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    
    vendor.approvalStatus = status;
    vendor.approvalDate = new Date();
    vendor.approvedBy = req.user.id;
    
    if (status === 'rejected') {
      vendor.rejectionReason = rejectionReason || 'Application rejected by admin';
    }
    
    await vendor.save();
    
    // In a real application, you would send an email notification to the vendor
    
    res.json({
      message: `Vendor application ${status}`,
      vendor
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/vendors/:id/review
// @desc    Add/update vendor review
// @access  Private
router.post('/:id/review', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    const vendor = await Vendor.findById(req.params.id);
    
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    
    // Check if user already reviewed this vendor
    const existingReview = vendor.ratings.find(
      rating => rating.user.toString() === req.user.id
    );
    
    if (existingReview) {
      // Update existing review
      existingReview.rating = rating;
      existingReview.comment = comment || existingReview.comment;
      existingReview.date = Date.now();
    } else {
      // Add new review
      vendor.ratings.push({
        user: req.user.id,
        rating,
        comment,
        date: Date.now()
      });
    }
    
    await vendor.save();
    
    res.json({
      message: 'Review added successfully',
      ratings: vendor.ratings,
      averageRating: vendor.averageRating
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/vendors/admin/dashboard
// @desc    Get vendor statistics for admin dashboard
// @access  Private (Admin only)
router.get('/admin/dashboard', adminAuth, async (req, res) => {
  try {
    const totalVendors = await Vendor.countDocuments();
    const pendingVendors = await Vendor.countDocuments({ approvalStatus: 'pending' });
    const approvedVendors = await Vendor.countDocuments({ approvalStatus: 'approved' });
    const featuredVendors = await Vendor.countDocuments({ featured: true });
    
    // Recent vendors
    const recentVendors = await Vendor.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email');
    
    // Top rated vendors
    const topRatedVendors = await Vendor.find({ approvalStatus: 'approved' })
      .sort({ averageRating: -1 })
      .limit(5)
      .populate('user', 'name email');
    
    res.json({
      totalVendors,
      pendingVendors,
      approvedVendors,
      featuredVendors,
      recentVendors,
      topRatedVendors
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
