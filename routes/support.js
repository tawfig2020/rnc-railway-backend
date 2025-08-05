const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Support = require('../models/Support');
const User = require('../models/User');

// @route   GET api/support
// @desc    Get all support requests (staff/admin)
// @access  Private/Staff
router.get('/', async (req, res) => {
  try {
    const supportRequests = await Support.find()
      .populate('user', ['name', 'email', 'role'])
      .populate('assignedTo', ['name', 'email', 'role'])
      .sort({ requestDate: -1 });
    
    res.json(supportRequests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/support/me
// @desc    Get current user's support requests
// @access  Private
router.get('/me', async (req, res) => {
  try {
    const supportRequests = await Support.find({ 
      user: req.user.id 
    })
    .populate('assignedTo', ['name', 'email'])
    .sort({ requestDate: -1 });
    
    res.json(supportRequests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/support/assigned
// @desc    Get support requests assigned to current user
// @access  Private/Staff
router.get('/assigned', async (req, res) => {
  try {
    const supportRequests = await Support.find({ 
      assignedTo: req.user.id 
    })
    .populate('user', ['name', 'email'])
    .sort({ requestDate: -1 });
    
    res.json(supportRequests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/support/:id
// @desc    Get support request by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const supportRequest = await Support.findById(req.params.id)
      .populate('user', ['name', 'email'])
      .populate('assignedTo', ['name', 'email', 'role'])
      .populate('updates.updatedBy', ['name', 'role']);
    
    if (!supportRequest) {
      return res.status(404).json({ msg: 'Support request not found' });
    }

    // Check if the user is authorized to view this request
    // Only the request owner, admin, or assigned staff can view it
    if (
      supportRequest.user._id.toString() !== req.user.id && 
      supportRequest.assignedTo?._id.toString() !== req.user.id &&
      req.user.role !== 'admin' && 
      req.user.role !== 'staff'
    ) {
      return res.status(401).json({ msg: 'Not authorized to view this support request' });
    }

    res.json(supportRequest);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Support request not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/support
// @desc    Create a support request
// @access  Private
router.post('/', [
  check('supportType', 'Support type is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    supportType,
    description,
    urgency,
    documents
  } = req.body;

  try {
    // Create and save the support request
    const newSupportRequest = new Support({
      user: req.user.id,
      supportType,
      description,
      urgency: urgency || 'medium',
      documents: documents || []
    });

    const supportRequest = await newSupportRequest.save();
    res.json(supportRequest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/support/:id
// @desc    Update support request status
// @access  Private/Staff
router.put('/:id', async (req, res) => {
  const {
    status,
    assignedTo,
    note,
    outcome,
    followUpRequired,
    followUpDate
  } = req.body;

  try {
    let supportRequest = await Support.findById(req.params.id);
    
    if (!supportRequest) {
      return res.status(404).json({ msg: 'Support request not found' });
    }

    // Only staff, admin, or the assigned person can update the request
    if (
      req.user.role !== 'admin' && 
      req.user.role !== 'staff' &&
      supportRequest.assignedTo?.toString() !== req.user.id
    ) {
      return res.status(401).json({ msg: 'Not authorized to update this support request' });
    }

    // Update fields
    if (status) supportRequest.status = status;
    if (assignedTo) supportRequest.assignedTo = assignedTo;
    if (outcome) supportRequest.outcome = outcome;
    
    if (followUpRequired !== undefined) {
      supportRequest.followUpRequired = followUpRequired;
      if (followUpRequired && followUpDate) {
        supportRequest.followUpDate = followUpDate;
      }
    }

    // Add update note if provided
    if (note) {
      supportRequest.updates.unshift({
        note,
        updatedBy: req.user.id,
        date: Date.now()
      });
    }

    // Set completion date if status is completed
    if (status === 'completed' && !supportRequest.completionDate) {
      supportRequest.completionDate = Date.now();
    }

    await supportRequest.save();
    
    // Populate important fields before returning
    supportRequest = await Support.findById(req.params.id)
      .populate('user', ['name', 'email'])
      .populate('assignedTo', ['name', 'email'])
      .populate('updates.updatedBy', ['name', 'role']);

    res.json(supportRequest);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Support request not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/support/:id/feedback
// @desc    Add feedback to a support request
// @access  Private
router.post('/:id/feedback', [
  check('rating', 'Rating is required').isInt({ min: 1, max: 5 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rating, comment } = req.body;

  try {
    const supportRequest = await Support.findById(req.params.id);
    
    if (!supportRequest) {
      return res.status(404).json({ msg: 'Support request not found' });
    }

    // Only the user who created the request can provide feedback
    if (supportRequest.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized to add feedback to this request' });
    }

    // Add feedback
    supportRequest.feedback = {
      rating,
      comment: comment || '',
      date: Date.now()
    };

    await supportRequest.save();
    res.json(supportRequest);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Support request not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/support/:id
// @desc    Delete a support request
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
  try {
    const supportRequest = await Support.findById(req.params.id);
    
    if (!supportRequest) {
      return res.status(404).json({ msg: 'Support request not found' });
    }

    // Check if the user is authorized to delete this request
    if (
      supportRequest.user.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({ msg: 'User not authorized to delete this request' });
    }

    await supportRequest.remove();
    res.json({ msg: 'Support request removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Support request not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
