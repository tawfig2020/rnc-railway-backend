const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a service name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  shortDescription: {
    type: String,
    required: [true, 'Please add a short description'],
    maxlength: [200, 'Short description cannot be more than 200 characters']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['legal', 'education', 'health', 'employment', 'housing', 'counseling', 'language', 'cultural', 'other']
  },
  image: {
    type: String,
    default: 'default-service.jpg'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'pending'
  },
  eligibilityCriteria: {
    type: String,
    maxlength: [1000, 'Eligibility criteria cannot be more than 1000 characters']
  },
  applicationProcess: {
    type: String,
    maxlength: [1000, 'Application process cannot be more than 1000 characters']
  },
  provider: {
    name: {
      type: String,
      required: [true, 'Please add a provider name']
    },
    organization: {
      type: String
    },
    contact: {
      email: String,
      phone: String,
      website: String
    }
  },
  location: {
    address: {
      type: String
    },
    city: {
      type: String
    },
    state: {
      type: String
    },
    country: {
      type: String
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        index: '2dsphere'
      }
    },
    isRemote: {
      type: Boolean,
      default: false
    }
  },
  schedule: {
    availability: {
      type: String
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    }
  },
  capacity: {
    type: Number,
    min: [0, 'Capacity cannot be negative']
  },
  cost: {
    type: String,
    default: 'Free'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  languages: [{
    type: String
  }],
  requiredDocuments: [{
    type: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: {
      type: String,
      maxlength: [500, 'Comment cannot be more than 500 characters']
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  metrics: {
    views: {
      type: Number,
      default: 0
    },
    applications: {
      type: Number,
      default: 0
    },
    completions: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Calculate average rating before saving
ServiceSchema.pre('save', function(next) {
  if (this.ratings && this.ratings.length > 0) {
    this.averageRating = this.ratings.reduce((acc, item) => acc + item.rating, 0) / this.ratings.length;
  }
  next();
});

// Index for search
ServiceSchema.index({ 
  name: 'text', 
  description: 'text', 
  category: 'text', 
  'provider.name': 'text',
  'provider.organization': 'text'
});

module.exports = mongoose.model('Service', ServiceSchema);
