const mongoose = require('mongoose');

const SupportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  supportType: {
    type: String,
    enum: ['housing', 'medical', 'legal', 'education', 'employment', 'financial', 'food', 'counseling', 'language', 'other'],
    required: true
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'in-progress', 'completed', 'rejected', 'cancelled'],
    default: 'pending'
  },
  description: {
    type: String,
    required: [true, 'Please describe your support need']
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  documents: [{
    name: String,
    fileUrl: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  updates: [{
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  completionDate: {
    type: Date
  },
  outcome: {
    status: {
      type: String,
      enum: ['successful', 'partial', 'unsuccessful', 'pending', 'referred']
    },
    description: String
  },
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: {
    type: Date
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    date: {
      type: Date
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add the pre-save middleware to update timestamps
SupportSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Set completion date if status changes to completed
  if (this.status === 'completed' && !this.completionDate) {
    this.completionDate = Date.now();
  }
  
  next();
});

module.exports = mongoose.model('Support', SupportSchema);
