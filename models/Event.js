const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add event title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add event description']
  },
  type: {
    type: String,
    enum: ['workshop', 'seminar', 'networking', 'cultural', 'health', 'education', 'other'],
    required: [true, 'Please specify event type']
  },
  startDate: {
    type: Date,
    required: [true, 'Please add event start date and time']
  },
  endDate: {
    type: Date,
    required: [true, 'Please add event end date and time']
  },
  location: {
    type: String,
    enum: ['online', 'in-person', 'hybrid'],
    required: [true, 'Please specify event location type']
  },
  address: {
    streetAddress: String,
    city: String,
    country: String,
    postalCode: String,
    onlineMeetingLink: String
  },
  organizer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  coverImage: {
    type: String,
    default: 'default-event.jpg'
  },
  capacity: {
    type: Number,
    required: [true, 'Please specify event capacity']
  },
  attendees: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['registered', 'attended', 'cancelled'],
      default: 'registered'
    },
    registrationDate: {
      type: Date,
      default: Date.now
    }
  }],
  languages: [{
    type: String,
    required: [true, 'Please specify at least one language']
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for remaining spots
EventSchema.virtual('remainingSpots').get(function() {
  return this.capacity - (this.attendees ? this.attendees.length : 0);
});

// Update event status based on current date
EventSchema.pre('find', function() {
  this.updateEventStatus();
});

EventSchema.pre('findOne', function() {
  this.updateEventStatus();
});

EventSchema.methods.updateEventStatus = function() {
  const now = new Date();
  
  if (this.status === 'cancelled') return;
  
  if (now > this.endDate) {
    this.status = 'completed';
  } else if (now >= this.startDate && now <= this.endDate) {
    this.status = 'ongoing';
  } else {
    this.status = 'upcoming';
  }
};

module.exports = mongoose.model('Event', EventSchema);
