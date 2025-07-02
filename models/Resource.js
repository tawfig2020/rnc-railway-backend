const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a resource title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  category: {
    type: String,
    enum: ['health', 'education', 'legal', 'housing', 'employment', 'community', 'financial', 'food', 'other'],
    required: [true, 'Please specify resource category']
  },
  type: {
    type: String,
    enum: ['article', 'video', 'pdf', 'link', 'contact', 'service'],
    required: [true, 'Please specify resource type']
  },
  contentUrl: {
    type: String
  },
  fileUpload: {
    type: String
  },
  organization: {
    type: String,
    required: [true, 'Please add the providing organization']
  },
  contactInfo: {
    name: String,
    email: String,
    phone: String,
    website: String
  },
  address: {
    streetAddress: String,
    city: String,
    country: String,
    postalCode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  languages: [{
    type: String,
    required: [true, 'Please specify at least one language']
  }],
  tags: [{
    type: String
  }],
  addedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  verifiedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  ratings: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Calculate average rating when ratings are modified
ResourceSchema.pre('save', function(next) {
  if (this.isModified('ratings')) {
    if (this.ratings && this.ratings.length > 0) {
      this.averageRating = this.ratings.reduce((acc, item) => item.rating + acc, 0) / this.ratings.length;
    } else {
      this.averageRating = 0;
    }
  }
  
  if (this.isModified('description') || this.isModified('contentUrl') || this.isModified('fileUpload')) {
    this.lastUpdated = Date.now();
  }
  
  next();
});

// Index for search functionality
ResourceSchema.index({ title: 'text', description: 'text', tags: 'text', organization: 'text' });

module.exports = mongoose.model('Resource', ResourceSchema);
