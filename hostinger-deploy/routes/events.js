const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');

const Event = mongoose.model('Event');

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    let query = {};
    
    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    // Filter by event type
    if (req.query.type) {
      query.type = req.query.type;
    }
    
    // Filter by location type
    if (req.query.location) {
      query.location = req.query.location;
    }
    
    // Search by title/description
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Filter by language
    if (req.query.language) {
      query.languages = { $in: [new RegExp(req.query.language, 'i')] };
    }
    
    // Get upcoming events
    if (req.query.upcoming === 'true') {
      query.startDate = { $gte: new Date() };
    }
    
    const events = await Event.find(query)
      .populate('organizer', 'name profileImage')
      .sort({ startDate: 1 })
      .skip(startIndex)
      .limit(limit);

    const total = await Event.countDocuments(query);

    res.json({ 
      success: true,
      count: events.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      },
      data: events
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/events/:id
// @desc    Get event by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name profileImage bio')
      .populate('attendees.user', 'name profileImage');

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    res.json({ success: true, data: event });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/events
// @desc    Create an event
// @access  Private (Will require auth middleware)
router.post(
  '/',
  [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('type', 'Event type is required').not().isEmpty(),
    check('startDate', 'Start date is required').not().isEmpty(),
    check('endDate', 'End date is required').not().isEmpty(),
    check('location', 'Location type is required').not().isEmpty(),
    check('capacity', 'Capacity is required').isNumeric(),
    check('languages', 'At least one language is required').isArray({ min: 1 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // This will be replaced with actual auth middleware
      // For now, we'll use a placeholder organizer ID
      const organizer = '60d0fe4f5311236168a109ca'; // This should come from auth middleware

      const { 
        title, description, type, startDate, endDate, location,
        address, capacity, languages, coverImage, isFeatured 
      } = req.body;

      // Validate that endDate is after startDate
      if (new Date(endDate) <= new Date(startDate)) {
        return res.status(400).json({ msg: 'End date must be after start date' });
      }

      const newEvent = new Event({
        title,
        description,
        type,
        startDate,
        endDate,
        location,
        address,
        organizer,
        capacity,
        languages,
        coverImage,
        isFeatured: isFeatured || false
      });

      const event = await newEvent.save();

      res.json({ success: true, data: event });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT /api/events/:id
// @desc    Update an event
// @access  Private (Will require auth middleware)
router.put('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    // Check if user is event organizer
    // This will be implemented with auth middleware
    // For now we'll bypass this check

    const updateFields = {};
    const allowedFields = [
      'title', 'description', 'type', 'startDate', 'endDate', 
      'location', 'address', 'capacity', 'languages', 
      'coverImage', 'isFeatured', 'status'
    ];

    // Only update fields that are explicitly provided
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    // If updating dates, validate that endDate is after startDate
    if (updateFields.startDate && updateFields.endDate) {
      if (new Date(updateFields.endDate) <= new Date(updateFields.startDate)) {
        return res.status(400).json({ msg: 'End date must be after start date' });
      }
    } else if (updateFields.startDate && !updateFields.endDate) {
      if (new Date(updateFields.startDate) >= new Date(event.endDate)) {
        return res.status(400).json({ msg: 'Start date must be before end date' });
      }
    } else if (!updateFields.startDate && updateFields.endDate) {
      if (new Date(event.startDate) >= new Date(updateFields.endDate)) {
        return res.status(400).json({ msg: 'End date must be after start date' });
      }
    }

    // Update the event with the new data
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    res.json({ success: true, data: updatedEvent });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete an event
// @access  Private (Will require auth middleware)
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    // Check if user is event organizer
    // This will be implemented with auth middleware
    // For now we'll bypass this check

    await event.remove();

    res.json({ success: true, msg: 'Event removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/events/:id/register
// @desc    Register for an event
// @access  Private (Will require auth middleware)
router.post('/:id/register', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    // This will be replaced with actual auth middleware
    // For now, we'll use a placeholder user ID
    const userId = '60d0fe4f5311236168a109cb'; // This should come from auth middleware

    // Check if event is full
    if (event.attendees.length >= event.capacity) {
      return res.status(400).json({ msg: 'Event is at full capacity' });
    }

    // Check if user is already registered
    if (event.attendees.some(attendee => attendee.user.toString() === userId)) {
      return res.status(400).json({ msg: 'Already registered for this event' });
    }

    // Check if event is in the past
    if (new Date(event.startDate) < new Date()) {
      return res.status(400).json({ msg: 'Cannot register for past events' });
    }

    event.attendees.push({
      user: userId,
      status: 'registered',
      registrationDate: Date.now()
    });

    await event.save();

    res.json({ success: true, data: event.attendees });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/events/:id/cancel-registration
// @desc    Cancel event registration
// @access  Private (Will require auth middleware)
router.put('/:id/cancel-registration', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    // This will be replaced with actual auth middleware
    // For now, we'll use a placeholder user ID
    const userId = '60d0fe4f5311236168a109cb'; // This should come from auth middleware

    // Find user's registration
    const attendeeIndex = event.attendees.findIndex(
      attendee => attendee.user.toString() === userId
    );

    if (attendeeIndex === -1) {
      return res.status(400).json({ msg: 'Not registered for this event' });
    }

    // Remove user from attendees
    event.attendees.splice(attendeeIndex, 1);

    await event.save();

    res.json({ success: true, data: event.attendees });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
