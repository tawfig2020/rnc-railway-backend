const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['asylum seeker', 'refugee', 'stateless', 'temporary protection', 'other'],
    required: true
  },
  arrivalDate: {
    type: Date
  },
  countryOfOrigin: {
    type: String,
    required: true
  },
  education: [{
    institution: {
      type: String
    },
    degree: {
      type: String
    },
    fieldOfStudy: {
      type: String
    },
    from: {
      type: Date
    },
    to: {
      type: Date
    },
    current: {
      type: Boolean,
      default: false
    },
    description: {
      type: String
    }
  }],
  workExperience: [{
    company: {
      type: String
    },
    position: {
      type: String
    },
    from: {
      type: Date
    },
    to: {
      type: Date
    },
    current: {
      type: Boolean,
      default: false
    },
    description: {
      type: String
    }
  }],
  familyMembers: [{
    name: {
      type: String
    },
    relationship: {
      type: String
    },
    age: {
      type: Number
    },
    status: {
      type: String,
      enum: ['with user', 'separated', 'other country', 'unknown']
    }
  }],
  housingStatus: {
    type: String,
    enum: ['temporary shelter', 'government housing', 'private rental', 'other']
  },
  medicalConditions: [{
    type: String
  }],
  servicesNeeded: [{
    type: String,
    enum: ['housing', 'medical', 'legal', 'education', 'employment', 'language', 'other']
  }],
  currentLocation: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number]
    }
  },
  socialMediaHandles: {
    facebook: {
      type: String
    },
    twitter: {
      type: String
    },
    linkedin: {
      type: String
    },
    instagram: {
      type: String
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

// Create geospatial index for location-based queries
ProfileSchema.index({ currentLocation: '2dsphere' });

// Update the updatedAt field before saving
ProfileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Profile', ProfileSchema);
