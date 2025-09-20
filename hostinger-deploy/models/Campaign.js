const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title for the campaign'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [5000, 'Description cannot be more than 5000 characters']
  },
  summary: {
    type: String,
    required: [true, 'Please add a summary'],
    maxlength: [300, 'Summary cannot be more than 300 characters']
  },
  coverImage: {
    type: String,
    required: [true, 'Please add a cover image']
  },
  images: [{
    type: String
  }],
  videos: [{
    type: String
  }],
  goal: {
    type: Number,
    required: [true, 'Please add a fundraising goal'],
    min: [100, 'Goal amount should be at least 100']
  },
  currency: {
    type: String,
    default: 'USD'
  },
  raised: {
    type: Number,
    default: 0
  },
  donorsCount: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'education', 
      'healthcare', 
      'emergency_relief', 
      'community_development',
      'legal_assistance',
      'family_support',
      'housing',
      'food_security',
      'mental_health',
      'employment',
      'other'
    ]
  },
  tags: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'completed', 'cancelled'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  priority: {
    type: Number,
    default: 0 // Higher number = higher priority
  },
  startDate: {
    type: Date,
    required: [true, 'Please add a start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please add an end date']
  },
  allowDonationsAfterEnd: {
    type: Boolean,
    default: true
  },
  minimumDonation: {
    type: Number,
    default: 5
  },
  suggestedDonations: [{
    amount: Number,
    description: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organizationName: {
    type: String,
    required: [true, 'Please add the organization name']
  },
  organizationLogo: {
    type: String
  },
  organizationDescription: {
    type: String,
    maxlength: [1000, 'Organization description cannot be more than 1000 characters']
  },
  contactEmail: {
    type: String,
    required: [true, 'Please add a contact email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  contactPhone: {
    type: String
  },
  beneficiaries: {
    type: String,
    required: [true, 'Please describe the beneficiaries']
  },
  impactMetrics: [{
    metric: String,
    value: mongoose.Schema.Types.Mixed,
    description: String
  }],
  updates: [{
    title: String,
    content: String,
    date: {
      type: Date,
      default: Date.now
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  testimonials: [{
    quote: String,
    name: String,
    position: String,
    image: String
  }],
  faqs: [{
    question: String,
    answer: String
  }],
  allowComments: {
    type: Boolean,
    default: true
  },
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String, // For non-registered users
    comment: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    isApproved: {
      type: Boolean,
      default: false
    }
  }],
  socialSharing: {
    enabled: {
      type: Boolean,
      default: true
    },
    platforms: {
      facebook: Boolean,
      twitter: Boolean,
      linkedin: Boolean,
      email: Boolean
    },
    customMessage: String
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

// Create slug from title
CampaignSchema.pre('save', function(next) {
  if ((this.isNew || this.isModified('title')) && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  
  this.updatedAt = Date.now();
  next();
});

// Calculate percentage funded
CampaignSchema.virtual('percentageFunded').get(function() {
  return Math.min(Math.round((this.raised / this.goal) * 100), 100);
});

// Check if campaign is expired
CampaignSchema.virtual('isExpired').get(function() {
  return new Date() > this.endDate;
});

// Days remaining
CampaignSchema.virtual('daysRemaining').get(function() {
  const now = new Date();
  const end = new Date(this.endDate);
  
  if (now > end) return 0;
  
  const diffTime = Math.abs(end - now);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

module.exports = mongoose.model('Campaign', CampaignSchema);
