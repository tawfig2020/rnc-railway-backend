const mongoose = require('mongoose');

const HealthRecordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  medicalHistory: {
    type: String
  },
  allergies: [{
    type: String
  }],
  currentMedications: [{
    name: {
      type: String
    },
    dosage: {
      type: String
    },
    frequency: {
      type: String
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    }
  }],
  immunizations: [{
    name: {
      type: String
    },
    date: {
      type: Date
    },
    boosterDue: {
      type: Date
    }
  }],
  chronicConditions: [{
    condition: {
      type: String
    },
    diagnosedDate: {
      type: Date
    },
    treatmentPlan: {
      type: String
    }
  }],
  mentalHealthStatus: {
    hasBeenAssessed: {
      type: Boolean,
      default: false
    },
    needs: {
      type: String
    },
    currentSupport: {
      type: String
    }
  },
  primaryCareProvider: {
    name: {
      type: String
    },
    contact: {
      type: String
    },
    facility: {
      type: String
    }
  },
  emergencyContact: {
    name: {
      type: String
    },
    relationship: {
      type: String
    },
    phone: {
      type: String
    }
  },
  accessibility: {
    hasSpecialNeeds: {
      type: Boolean,
      default: false
    },
    mobilityRequirements: {
      type: String
    },
    communicationRequirements: {
      type: String
    }
  },
  nutritionalNeeds: {
    type: String
  },
  lastCheckupDate: {
    type: Date
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  // Enable strict privacy controls for sensitive health data
  strict: true,
  // Add collection-level access control hint
  collation: {
    locale: 'en',
    strength: 2
  }
});

// Update timestamps before saving
HealthRecordSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('HealthRecord', HealthRecordSchema);
