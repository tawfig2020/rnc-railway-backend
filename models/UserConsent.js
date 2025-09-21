const mongoose = require('mongoose');

const UserConsentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  consents: {
    // Essential cookies and functionality
    essential: {
      given: {
        type: Boolean,
        default: true // Always true as these are required
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    },
    // Analytics and performance tracking
    analytics: {
      given: {
        type: Boolean,
        default: false
      },
      timestamp: {
        type: Date
      }
    },
    // Marketing and promotional communications
    marketing: {
      given: {
        type: Boolean,
        default: false
      },
      timestamp: {
        type: Date
      }
    },
    // Data processing for service improvement
    dataProcessing: {
      given: {
        type: Boolean,
        default: false
      },
      timestamp: {
        type: Date
      }
    },
    // Third-party integrations
    thirdParty: {
      given: {
        type: Boolean,
        default: false
      },
      timestamp: {
        type: Date
      }
    }
  },
  privacyPolicyVersion: {
    type: String,
    required: true,
    default: '1.0'
  },
  consentMethod: {
    type: String,
    enum: ['registration', 'explicit_consent', 'settings_update', 'cookie_banner'],
    required: true
  },
  withdrawalHistory: [{
    consentType: {
      type: String,
      enum: ['analytics', 'marketing', 'dataProcessing', 'thirdParty']
    },
    action: {
      type: String,
      enum: ['granted', 'withdrawn']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    ipAddress: String,
    userAgent: String
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Update lastUpdated on save
UserConsentSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

// Method to update consent
UserConsentSchema.methods.updateConsent = function(consentType, granted, ipAddress, userAgent) {
  if (this.consents[consentType]) {
    // Record the change in history
    this.withdrawalHistory.push({
      consentType,
      action: granted ? 'granted' : 'withdrawn',
      timestamp: new Date(),
      ipAddress,
      userAgent
    });
    
    // Update the consent
    this.consents[consentType].given = granted;
    this.consents[consentType].timestamp = new Date();
  }
};

// Method to check if consent is given for a specific type
UserConsentSchema.methods.hasConsent = function(consentType) {
  return this.consents[consentType] && this.consents[consentType].given;
};

// Static method to get user consent
UserConsentSchema.statics.getUserConsent = async function(userId) {
  return await this.findOne({ userId }).populate('userId', 'name email');
};

module.exports = mongoose.model('UserConsent', UserConsentSchema);
