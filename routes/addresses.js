const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Address = require('../models/Address');
const auth = require('../middleware/auth');

// @route   GET /api/addresses
// @desc    Get all addresses for the logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id });
    res.json(addresses);
  } catch (err) {
    console.error('Error fetching addresses:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/addresses/:id
// @desc    Get address by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    
    // Check if address exists
    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }
    
    // Check if address belongs to user
    if (address.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to access this address' });
    }
    
    res.json(address);
  } catch (err) {
    console.error('Error fetching address:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Address not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/addresses
// @desc    Create a new address
// @access  Private
router.post('/', [
  auth,
  [
    check('fullName', 'Full name is required').not().isEmpty(),
    check('addressLine1', 'Address line 1 is required').not().isEmpty(),
    check('city', 'City is required').not().isEmpty(),
    check('state', 'State is required').not().isEmpty(),
    check('postalCode', 'Postal code is required').not().isEmpty(),
    check('country', 'Country is required').not().isEmpty(),
    check('phone', 'Phone number is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const {
      fullName,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      phone,
      deliveryInstructions,
      type,
      isDefault
    } = req.body;
    
    const newAddress = new Address({
      user: req.user.id,
      fullName,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      phone,
      deliveryInstructions,
      type: type || 'shipping',
      isDefault: isDefault || false
    });
    
    const address = await newAddress.save();
    
    res.status(201).json(address);
  } catch (err) {
    console.error('Error creating address:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/addresses/:id
// @desc    Update an address
// @access  Private
router.put('/:id', [
  auth,
  [
    check('fullName', 'Full name is required').not().isEmpty(),
    check('addressLine1', 'Address line 1 is required').not().isEmpty(),
    check('city', 'City is required').not().isEmpty(),
    check('state', 'State is required').not().isEmpty(),
    check('postalCode', 'Postal code is required').not().isEmpty(),
    check('country', 'Country is required').not().isEmpty(),
    check('phone', 'Phone number is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const address = await Address.findById(req.params.id);
    
    // Check if address exists
    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }
    
    // Check if address belongs to user
    if (address.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this address' });
    }
    
    const {
      fullName,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      phone,
      deliveryInstructions,
      type,
      isDefault
    } = req.body;
    
    // Update address fields
    address.fullName = fullName;
    address.addressLine1 = addressLine1;
    address.addressLine2 = addressLine2 || '';
    address.city = city;
    address.state = state;
    address.postalCode = postalCode;
    address.country = country;
    address.phone = phone;
    address.deliveryInstructions = deliveryInstructions || '';
    address.type = type || address.type;
    address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;
    
    const updatedAddress = await address.save();
    
    res.json(updatedAddress);
  } catch (err) {
    console.error('Error updating address:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Address not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/addresses/:id
// @desc    Delete an address
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    
    // Check if address exists
    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }
    
    // Check if address belongs to user
    if (address.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this address' });
    }
    
    await address.remove();
    
    res.json({ message: 'Address removed' });
  } catch (err) {
    console.error('Error deleting address:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Address not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/addresses/:id/default
// @desc    Set an address as default
// @access  Private
router.put('/:id/default', auth, async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    
    // Check if address exists
    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }
    
    // Check if address belongs to user
    if (address.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this address' });
    }
    
    // Set as default
    address.isDefault = true;
    await address.save();
    
    res.json(address);
  } catch (err) {
    console.error('Error setting default address:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Address not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
