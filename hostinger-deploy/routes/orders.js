const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = mongoose.model('Order');
const Product = mongoose.model('Product');
const Vendor = mongoose.model('Vendor');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      items,
      shippingAddressId,
      shippingAddress,
      billingAddressId,
      billingAddress,
      billingAddressSameAsShipping,
      paymentMethod,
      paymentInfo,
      taxPrice,
      shippingPrice,
      totalPrice,
      orderNotes
    } = req.body;
    
    // Validate items array
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items in order' });
    }
    
    // Validate required fields
    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }
    
    // Validate shipping address - either shippingAddressId or complete shippingAddress required
    if (!shippingAddressId && !shippingAddress) {
      return res.status(400).json({ error: 'Please provide shipping address information' });
    }
    
    // If shipping address is provided directly (not by ID), validate required fields
    if (!shippingAddressId && shippingAddress) {
      const requiredShippingFields = ['fullName', 'addressLine1', 'city', 'state', 'postalCode', 'country', 'phone'];
      for (const field of requiredShippingFields) {
        if (!shippingAddress[field]) {
          return res.status(400).json({ error: `Please provide shipping ${field}` });
        }
      }
    }
    
    // If billing address is provided and not same as shipping, validate it
    if (!billingAddressSameAsShipping && !billingAddressId && billingAddress) {
      const requiredBillingFields = ['fullName', 'addressLine1', 'city', 'state', 'postalCode', 'country'];
      for (const field of requiredBillingFields) {
        if (!billingAddress[field]) {
          return res.status(400).json({ error: `Please provide billing ${field}` });
        }
      }
    }
    
    // Prepare order items with fresh data from database
    const orderItems = [];
    let calculatedTotal = 0;
    
    for (const item of items) {
      const product = await Product.findById(item.productId).populate('vendor');
      
      if (!product) {
        return res.status(404).json({ error: `Product not found: ${item.productId}` });
      }
      
      // Check if product is in stock
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for ${product.name}. Available: ${product.stock}` 
        });
      }
      
      // Calculate price (use discountPrice if available)
      const price = product.discountPrice > 0 ? product.discountPrice : product.price;
      const itemTotal = price * item.quantity;
      calculatedTotal += itemTotal;
      
      orderItems.push({
        product: product._id,
        vendor: product.vendor._id,
        quantity: item.quantity,
        price: price,
        name: product.name,
        image: product.images[0]
      });
      
      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }
    
    // Validate payment info based on method
    if (paymentMethod === 'credit_card' && 
        (!paymentInfo || !paymentInfo.id || !paymentInfo.status)) {
      return res.status(400).json({ error: 'Invalid payment information' });
    }
    
    // Create order with address data
    const orderData = {
      user: req.user.id,
      items: orderItems,
      paymentInfo: {
        ...paymentInfo,
        type: paymentMethod
      },
      taxPrice: taxPrice || 0,
      shippingPrice: shippingPrice || 0,
      totalPrice: totalPrice || calculatedTotal,
      orderNotes
    };
    
    // Add shipping address info (prefer ID reference if provided)
    if (shippingAddressId) {
      orderData.shippingAddressId = shippingAddressId;
    } else if (shippingAddress) {
      orderData.shippingAddress = shippingAddress;
    }
    
    // Handle billing address
    orderData.billingAddressSameAsShipping = billingAddressSameAsShipping === false ? false : true;
    
    if (!orderData.billingAddressSameAsShipping) {
      // Add separate billing address
      if (billingAddressId) {
        orderData.billingAddressId = billingAddressId;
      } else if (billingAddress) {
        orderData.billingAddress = billingAddress;
      }
    }
    
    const order = new Order(orderData);
    
    // Set payment date if payment is already complete
    if (paymentInfo && paymentInfo.status === 'completed') {
      order.paidAt = Date.now();
      order.orderStatus = 'confirmed';
    }
    
    const savedOrder = await order.save();
    
    res.status(201).json({
      message: 'Order placed successfully',
      order: savedOrder
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/orders
// @desc    Get logged in user orders
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name images price')
      .populate('items.vendor', 'businessName')
      .populate('shippingAddressId')
      .populate('billingAddressId');
    
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name images price discountPrice')
      .populate('items.vendor', 'businessName logo')
      .populate('shippingAddressId')
      .populate('billingAddressId');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Check if user is the order owner, admin, or the vendor of an item in the order
    const isOrderOwner = order.user._id.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    let isVendorOfItem = false;
    if (!isOrderOwner && !isAdmin) {
      const vendor = await Vendor.findOne({ user: req.user.id });
      
      if (vendor) {
        isVendorOfItem = order.items.some(item => 
          item.vendor._id.toString() === vendor._id.toString()
        );
      }
    }
    
    if (!isOrderOwner && !isAdmin && !isVendorOfItem) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private (Admin or Vendor)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status, trackingInfo } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Please provide status' });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Check permission
    const isAdmin = req.user.role === 'admin';
    
    let isVendorOfItem = false;
    if (!isAdmin) {
      const vendor = await Vendor.findOne({ user: req.user.id });
      
      if (vendor) {
        isVendorOfItem = order.items.some(item => 
          item.vendor.toString() === vendor._id.toString()
        );
      }
    }
    
    if (!isAdmin && !isVendorOfItem) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    // Restrict certain status changes based on role
    if (!isAdmin && (status === 'refunded')) {
      return res.status(403).json({ error: 'Only admin can set this status' });
    }
    
    // Update order status
    order.orderStatus = status;
    
    // Update tracking information if provided
    if (trackingInfo) {
      order.trackingInfo = {
        ...order.trackingInfo,
        ...trackingInfo
      };
    }
    
    await order.save();
    
    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/orders/vendor/me
// @desc    Get logged in vendor's orders
// @access  Private (Vendor)
router.get('/vendor/me', auth, async (req, res) => {
  try {
    // Check if user is a vendor
    const vendor = await Vendor.findOne({ user: req.user.id });
    
    if (!vendor) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    const { status, startDate, endDate, limit, page } = req.query;
    
    // Build query
    const query = { 'items.vendor': vendor._id };
    
    if (status) {
      query.orderStatus = status;
    }
    
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    // Pagination
    const currentPage = parseInt(page) || 1;
    const perPage = parseInt(limit) || 20;
    const skip = (currentPage - 1) * perPage;
    
    // Count total orders
    const totalOrders = await Order.countDocuments(query);
    
    // Get orders
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage)
      .populate('user', 'name email')
      .populate('items.product', 'name images');
    
    res.json({
      orders,
      pagination: {
        total: totalOrders,
        page: currentPage,
        pages: Math.ceil(totalOrders / perPage),
        perPage
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/orders/admin/all
// @desc    Get all orders (admin)
// @access  Private (Admin only)
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const { 
      status, vendor, user, startDate, endDate, 
      minTotal, maxTotal, sort, limit, page 
    } = req.query;
    
    // Build query
    const query = {};
    
    if (status) {
      query.orderStatus = status;
    }
    
    if (vendor) {
      query['items.vendor'] = vendor;
    }
    
    if (user) {
      query.user = user;
    }
    
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    if (minTotal || maxTotal) {
      query.totalPrice = {};
      if (minTotal) query.totalPrice.$gte = parseFloat(minTotal);
      if (maxTotal) query.totalPrice.$lte = parseFloat(maxTotal);
    }
    
    // Pagination
    const currentPage = parseInt(page) || 1;
    const perPage = parseInt(limit) || 20;
    const skip = (currentPage - 1) * perPage;
    
    // Sort options
    let sortOptions = {};
    if (sort) {
      switch (sort) {
        case 'total-high':
          sortOptions = { totalPrice: -1 };
          break;
        case 'total-low':
          sortOptions = { totalPrice: 1 };
          break;
        case 'oldest':
          sortOptions = { createdAt: 1 };
          break;
        default:
          sortOptions = { createdAt: -1 };
      }
    } else {
      sortOptions = { createdAt: -1 };
    }
    
    // Count total orders
    const totalOrders = await Order.countDocuments(query);
    
    // Get orders
    const orders = await Order.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(perPage)
      .populate('user', 'name email')
      .populate('items.product', 'name images')
      .populate('items.vendor', 'businessName');
    
    res.json({
      orders,
      pagination: {
        total: totalOrders,
        page: currentPage,
        pages: Math.ceil(totalOrders / perPage),
        perPage
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/orders/admin/dashboard
// @desc    Get order statistics for admin dashboard
// @access  Private (Admin only)
router.get('/admin/dashboard', adminAuth, async (req, res) => {
  try {
    // Total orders
    const totalOrders = await Order.countDocuments();
    
    // Orders by status
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
    ]);
    
    // Total sales (only from completed orders)
    const salesData = await Order.aggregate([
      { 
        $match: { 
          orderStatus: { $in: ['confirmed', 'shipped', 'delivered'] } 
        } 
      },
      { 
        $group: { 
          _id: null, 
          totalSales: { $sum: '$totalPrice' }, 
          count: { $sum: 1 } 
        } 
      }
    ]);
    
    const totalSales = salesData.length > 0 ? salesData[0].totalSales : 0;
    const completedOrders = salesData.length > 0 ? salesData[0].count : 0;
    
    // Recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name')
      .populate('items.vendor', 'businessName');
    
    // Orders by day (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const ordersByDay = await Order.aggregate([
      { 
        $match: { 
          createdAt: { $gte: sevenDaysAgo }
        } 
      },
      {
        $group: {
          _id: { 
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } 
          },
          count: { $sum: 1 },
          sales: { $sum: '$totalPrice' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      totalOrders,
      ordersByStatus,
      totalSales,
      completedOrders,
      recentOrders,
      ordersByDay
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/orders/:id/payout
// @desc    Mark vendor payout as complete
// @access  Private (Admin only)
router.put('/:id/payout', adminAuth, async (req, res) => {
  try {
    const { vendorPayoutStatus } = req.body;
    
    if (!vendorPayoutStatus || !['pending', 'processing', 'completed', 'failed'].includes(vendorPayoutStatus)) {
      return res.status(400).json({ error: 'Invalid payout status' });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    order.vendorPayoutStatus = vendorPayoutStatus;
    
    if (vendorPayoutStatus === 'completed') {
      order.vendorPayoutDate = Date.now();
    }
    
    await order.save();
    
    res.json({
      message: 'Vendor payout status updated',
      order
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
