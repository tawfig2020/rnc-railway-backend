const mongoose = require('mongoose');

const PartnerSchema = new mongoose.Schema({
  // Basic Information
  organizationName: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true
  },
  partnerType: {
    type: String,
    enum: ['ngo', 'employer', 'educational', 'government', 'corporate', 'other'],
    required: [true, 'Partner type is required']
  },
  
  // Contact Information
  contactPerson: {
    name: {
      type: String,
      required: true
    },
    position: String,
    email: {
      type: String,
      required: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
    },
    phone: {
      type: String,
      required: true
    }
  },
  
  // Organization Details
  registrationNumber: String,
  website: String,
  country: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  address: String,
  
  // Partnership Details
  partnershipType: {
    type: String,
    enum: ['employment', 'collaboration', 'resource-sharing', 'training', 'funding', 'other'],
    required: true
  },
  description: {
    type: String,
    required: [true, 'Partnership description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  areasOfInterest: [{
    type: String
  }],
  
  // Resources/Services Offered
  offeredServices: [{
    serviceType: {
      type: String,
      enum: ['job-placement', 'training', 'mentorship', 'funding', 'resources', 'collaboration', 'other']
    },
    description: String,
    capacity: String // e.g., "10 positions", "5 training slots"
  }],
  
  // Job/Opportunity Postings (for employers)
  opportunities: [{
    title: String,
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship', 'volunteer', 'remote']
    },
    description: String,
    requirements: [String],
    skills: [String],
    location: String,
    salary: String,
    positions: Number,
    deadline: Date,
    status: {
      type: String,
      enum: ['active', 'filled', 'closed'],
      default: 'active'
    },
    postedDate: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Matching & Nominations
  nominations: [{
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    opportunityId: String,
    nominatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    nominatedDate: Date,
    status: {
      type: String,
      enum: ['nominated', 'accepted', 'rejected', 'interview', 'hired'],
      default: 'nominated'
    },
    notes: String
  }],
  
  // Application Status
  applicationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  approvedDate: Date,
  rejectedDate: Date,
  rejectionReason: String,
  
  // Partnership Agreement
  agreementSigned: {
    type: Boolean,
    default: false
  },
  agreementDate: Date,
  agreementDocument: String, // File path
  
  // Activity Tracking
  lastActive: Date,
  totalNominations: {
    type: Number,
    default: 0
  },
  successfulPlacements: {
    type: Number,
    default: 0
  },
  
  // Admin Notes
  adminNotes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedDate: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Login Credentials (for partner dashboard access)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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

// Update the updatedAt timestamp before saving
PartnerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to add opportunity
PartnerSchema.methods.addOpportunity = function(opportunityData) {
  this.opportunities.push(opportunityData);
  return this.save();
};

// Method to nominate member
PartnerSchema.methods.nominateMember = function(nominationData) {
  this.nominations.push(nominationData);
  this.totalNominations += 1;
  return this.save();
};

// Method to update nomination status
PartnerSchema.methods.updateNominationStatus = function(nominationId, status) {
  const nomination = this.nominations.id(nominationId);
  if (nomination) {
    nomination.status = status;
    if (status === 'hired') {
      this.successfulPlacements += 1;
    }
  }
  return this.save();
};

module.exports = mongoose.model('Partner', PartnerSchema);
