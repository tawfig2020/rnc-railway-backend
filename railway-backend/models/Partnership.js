const mongoose = require('mongoose');

const PartnershipSchema = new mongoose.Schema({
  // Company Information
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  industry: {
    type: String,
    required: true,
    enum: [
      'Technology',
      'Healthcare',
      'Manufacturing',
      'Retail & Hospitality',
      'Financial Services',
      'Education',
      'Construction',
      'Professional Services',
      'Non-profit',
      'Transportation & Logistics',
      'Agriculture',
      'Media & Entertainment',
      'Energy & Utilities',
      'Other'
    ]
  },
  companySize: {
    type: String,
    required: true,
    enum: [
      'Micro (1-9 employees)',
      'Small (10-49 employees)',
      'Medium (50-249 employees)',
      'Large (250+ employees)'
    ]
  },
  companyWebsite: {
    type: String,
    trim: true
  },
  yearsInOperation: {
    type: Number,
    min: 0
  },
  companyDescription: {
    type: String,
    trim: true
  },

  // Contact Information
  contactName: {
    type: String,
    required: true,
    trim: true
  },
  contactTitle: {
    type: String,
    trim: true
  },
  contactEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  contactPhone: {
    type: String,
    trim: true
  },
  preferredContact: {
    type: String,
    enum: ['email', 'phone'],
    default: 'email'
  },

  // Hiring Interests
  positionTypes: [{
    type: String,
    enum: [
      'Full-time',
      'Part-time',
      'Contract',
      'Temporary',
      'Internship',
      'Apprenticeship'
    ]
  }],
  potentialOpenings: {
    type: String,
    trim: true
  },
  workArrangements: {
    onsite: { type: Boolean, default: false },
    hybrid: { type: Boolean, default: false },
    remote: { type: Boolean, default: false }
  },
  skillsNeeded: [{
    type: String,
    enum: [
      'Administrative & Clerical',
      'Customer Service',
      'Technology & IT',
      'Healthcare',
      'Manufacturing & Production',
      'Sales & Marketing',
      'Food Service',
      'Education & Training',
      'Skilled Trades',
      'Languages & Translation',
      'Creative & Design',
      'Finance & Accounting',
      'Management',
      'Other'
    ]
  }],
  languageRequirements: [String],

  // Diversity & Inclusion
  hasDiversityPolicy: {
    type: Boolean,
    default: null
  },
  diversityPolicyDetails: {
    type: String,
    trim: true
  },
  previousRefugeeHiring: {
    type: Boolean,
    default: null
  },
  previousExperience: {
    type: String,
    trim: true
  },
  supportSystems: {
    type: String,
    trim: true
  },

  // Partnership Expectations
  partnershipGoals: {
    type: String,
    trim: true
  },
  hiringTimeline: {
    type: String,
    trim: true
  },
  supportNeeded: {
    type: String,
    trim: true
  },
  mentorshipOpportunities: {
    type: Boolean,
    default: false
  },
  additionalInfo: {
    type: String,
    trim: true
  },

  // Application Status
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected', 'on_hold'],
    default: 'pending'
  },
  reviewNotes: {
    type: String,
    trim: true
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,

  // Metadata
  submittedAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update lastUpdated on save
PartnershipSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

// Index for efficient queries
PartnershipSchema.index({ status: 1, submittedAt: -1 });
PartnershipSchema.index({ companyName: 1 });
PartnershipSchema.index({ contactEmail: 1 });

module.exports = mongoose.model('Partnership', PartnershipSchema);
