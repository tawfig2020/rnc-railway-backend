const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const Discount = require('../models/Discount');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const staffAuth = require('../middleware/staffAuth');

// @route    GET api/discounts
// @desc     Get all discounts with pagination and filtering
// @access   Private (Admin/Staff only)
router.get('/', [auth, staffAuth], async (req, res) => {
  try {
    const {
      isActive,
      code,
      discountType,
      sort = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10,
      search
    } = req.query;

    // Build query
    const query = {};
    
    // Filter by active status
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    // Filter by discount type
    if (discountType) {
      query.discountType = discountType;
    }
    
    // Filter by code
    if (code) {
      query.code = new RegExp(code, 'i');
    }
    
    // Search
    if (search) {
      query.$or = [
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination setup
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;
    
    // Execute query with sorting and pagination
    const discounts = await Discount.find(query)
      .sort({ [sort]: order === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(limitNumber)
      .populate('createdBy', 'name email')
      .lean();
    
    // Get total count for pagination info
    const total = await Discount.countDocuments(query);
    
    // Add validity status to each discount
    const now = new Date();
    const discountsWithStatus = discounts.map(discount => {
      const isValid = 
        discount.isActive && 
        now >= discount.startDate && 
        now <= discount.endDate && 
        (discount.usageLimit === null || discount.usageCount < discount.usageLimit);
      
      return {
        ...discount,
        isValid
      };
    });
    
    res.json({
      discounts: discountsWithStatus,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(total / limitNumber)
      }
    });
  } catch (err) {
    console.error('Error getting discounts:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/discounts/active
// @desc     Get active discounts for public display
// @access   Public
router.get('/active', async (req, res) => {
  try {
    const now = new Date();
    
    const discounts = await Discount.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    }).select('code description discountType value minPurchase endDate');
    
    // Filter out discounts that have reached their usage limit
    const validDiscounts = discounts.filter(discount => 
      discount.usageLimit === null || discount.usageCount < discount.usageLimit
    );
    
    res.json(validDiscounts);
  } catch (err) {
    console.error('Error getting active discounts:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/discounts/:id
// @desc     Get discount by ID
// @access   Private (Admin/Staff only)
router.get('/:id', [auth, staffAuth], async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('applicableProducts', 'name price')
      .populate('applicableCategories', 'name')
      .populate('excludedProducts', 'name price');
    
    if (!discount) {
      return res.status(404).json({ msg: 'Discount not found' });
    }
    
    res.json(discount);
  } catch (err) {
    console.error('Error getting discount:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Discount not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route    POST api/discounts
// @desc     Create a discount
// @access   Private (Admin only)
router.post('/', [
  auth,
  adminAuth,
  [
    check('code', 'Discount code is required').not().isEmpty(),
    check('code', 'Code cannot exceed 15 characters').isLength({ max: 15 }),
    check('discountType', 'Please select a valid discount type').isIn(['percentage', 'fixed', 'shipping']),
    check('value', 'Discount value is required').isNumeric(),
    check('endDate', 'End date is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if code already exists
    const existingDiscount = await Discount.findOne({ code: req.body.code.toUpperCase() });
    if (existingDiscount) {
      return res.status(400).json({ msg: 'Discount code already exists' });
    }

    const {
      code,
      description,
      discountType,
      value,
      minPurchase,
      maxDiscount,
      startDate,
      endDate,
      isActive,
      usageLimit,
      perUserLimit,
      applicableProducts,
      applicableCategories,
      excludedProducts
    } = req.body;

    // Create new discount
    const newDiscount = new Discount({
      code: code.toUpperCase(),
      description,
      discountType,
      value,
      minPurchase: minPurchase || 0,
      maxDiscount,
      startDate: startDate || Date.now(),
      endDate,
      isActive: isActive !== undefined ? isActive : true,
      usageLimit,
      usageCount: 0,
      perUserLimit,
      applicableProducts,
      applicableCategories,
      excludedProducts,
      createdBy: req.user.id
    });

    const discount = await newDiscount.save();
    res.json(discount);
  } catch (err) {
    console.error('Error creating discount:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/discounts/:id
// @desc     Update a discount
// @access   Private (Admin only)
router.put('/:id', [
  auth,
  adminAuth,
  [
    check('code', 'Code cannot exceed 15 characters').optional().isLength({ max: 15 }),
    check('discountType', 'Please select a valid discount type').optional().isIn(['percentage', 'fixed', 'shipping']),
    check('value', 'Discount value must be a number').optional().isNumeric()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let discount = await Discount.findById(req.params.id);
    
    if (!discount) {
      return res.status(404).json({ msg: 'Discount not found' });
    }
    
    // Check if updating code and it already exists
    if (req.body.code && req.body.code.toUpperCase() !== discount.code) {
      const existingDiscount = await Discount.findOne({ code: req.body.code.toUpperCase() });
      if (existingDiscount) {
        return res.status(400).json({ msg: 'Discount code already exists' });
      }
    }
    
    const {
      code,
      description,
      discountType,
      value,
      minPurchase,
      maxDiscount,
      startDate,
      endDate,
      isActive,
      usageLimit,
      perUserLimit,
      applicableProducts,
      applicableCategories,
      excludedProducts
    } = req.body;
    
    // Update fields
    if (code) discount.code = code.toUpperCase();
    if (description !== undefined) discount.description = description;
    if (discountType) discount.discountType = discountType;
    if (value !== undefined) discount.value = value;
    if (minPurchase !== undefined) discount.minPurchase = minPurchase;
    if (maxDiscount !== undefined) discount.maxDiscount = maxDiscount;
    if (startDate) discount.startDate = startDate;
    if (endDate) discount.endDate = endDate;
    if (isActive !== undefined) discount.isActive = isActive;
    if (usageLimit !== undefined) discount.usageLimit = usageLimit;
    if (perUserLimit !== undefined) discount.perUserLimit = perUserLimit;
    if (applicableProducts) discount.applicableProducts = applicableProducts;
    if (applicableCategories) discount.applicableCategories = applicableCategories;
    if (excludedProducts) discount.excludedProducts = excludedProducts;
    
    await discount.save();
    
    res.json(discount);
  } catch (err) {
    console.error('Error updating discount:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Discount not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/discounts/:id
// @desc     Delete a discount
// @access   Private (Admin only)
router.delete('/:id', [auth, adminAuth], async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id);
    
    if (!discount) {
      return res.status(404).json({ msg: 'Discount not found' });
    }
    
    await discount.remove();
    
    res.json({ msg: 'Discount removed' });
  } catch (err) {
    console.error('Error deleting discount:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Discount not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/discounts/:id/status
// @desc     Toggle discount active status
// @access   Private (Admin/Staff only)
router.put('/:id/status', [auth, staffAuth], async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id);
    
    if (!discount) {
      return res.status(404).json({ msg: 'Discount not found' });
    }
    
    discount.isActive = !discount.isActive;
    
    await discount.save();
    
    res.json({
      _id: discount._id,
      isActive: discount.isActive
    });
  } catch (err) {
    console.error('Error updating discount status:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Discount not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route    POST api/discounts/validate
// @desc     Validate a discount code
// @access   Public
router.post('/validate', [
  check('code', 'Discount code is required').not().isEmpty(),
  check('subtotal', 'Subtotal is required').isNumeric()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { code, subtotal, products } = req.body;
    
    const discount = await Discount.findOne({ code: code.toUpperCase() });
    
    if (!discount) {
      return res.status(404).json({ msg: 'Invalid discount code' });
    }
    
    const now = new Date();
    
    // Check if discount is valid
    if (!discount.isActive) {
      return res.status(400).json({ msg: 'Discount is not active' });
    }
    
    if (now < discount.startDate) {
      return res.status(400).json({ msg: 'Discount is not active yet' });
    }
    
    if (now > discount.endDate) {
      return res.status(400).json({ msg: 'Discount has expired' });
    }
    
    if (discount.usageLimit !== null && discount.usageCount >= discount.usageLimit) {
      return res.status(400).json({ msg: 'Discount usage limit reached' });
    }
    
    if (subtotal < discount.minPurchase) {
      return res.status(400).json({ 
        msg: `Minimum purchase of $${discount.minPurchase.toFixed(2)} required`,
        minPurchase: discount.minPurchase
      });
    }
    
    // Calculate discount amount
    let discountAmount = discount.calculateDiscount(subtotal);
    
    // Check product and category restrictions if products are provided
    if (products && products.length > 0 && 
        (discount.applicableProducts.length > 0 || discount.applicableCategories.length > 0)) {
      
      // If specific products or categories are set, validate the cart products
      const validProductIds = new Set();
      
      // Add all applicable products
      discount.applicableProducts.forEach(id => validProductIds.add(id.toString()));
      
      // If applicable categories are specified, get all products in those categories
      if (discount.applicableCategories.length > 0) {
        const categoryProducts = await Product.find({
          category: { $in: discount.applicableCategories }
        }).select('_id');
        
        categoryProducts.forEach(product => validProductIds.add(product._id.toString()));
      }
      
      // Remove excluded products
      discount.excludedProducts.forEach(id => validProductIds.delete(id.toString()));
      
      // If no specific products/categories are set, all products are valid
      const hasRestrictions = discount.applicableProducts.length > 0 || discount.applicableCategories.length > 0;
      
      if (hasRestrictions) {
        // Check if any products in cart are valid for this discount
        const validProducts = products.filter(product => validProductIds.has(product.id));
        
        if (validProducts.length === 0) {
          return res.status(400).json({ 
            msg: 'No eligible products for this discount code'
          });
        }
        
        // Calculate discount only on eligible products
        if (discount.discountType === 'percentage') {
          const eligibleSubtotal = validProducts.reduce(
            (sum, product) => sum + (product.price * product.quantity), 
            0
          );
          discountAmount = discount.calculateDiscount(eligibleSubtotal);
        }
      }
    }
    
    res.json({
      isValid: true,
      discount: {
        code: discount.code,
        discountType: discount.discountType,
        value: discount.value,
        discountAmount
      }
    });
  } catch (err) {
    console.error('Error validating discount:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/discounts/:id/apply
// @desc     Increment usage count when discount is applied
// @access   Private (verification required)
router.put('/:id/apply', auth, async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id);
    
    if (!discount) {
      return res.status(404).json({ msg: 'Discount not found' });
    }
    
    // Increment usage count
    discount.usageCount += 1;
    
    // If usage limit is reached, possibly set inactive
    if (discount.usageLimit !== null && discount.usageCount >= discount.usageLimit) {
      discount.isActive = false;
    }
    
    await discount.save();
    
    res.json({
      _id: discount._id,
      usageCount: discount.usageCount,
      isActive: discount.isActive
    });
  } catch (err) {
    console.error('Error applying discount:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Discount not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
