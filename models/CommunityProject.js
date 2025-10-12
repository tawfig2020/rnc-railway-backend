const mongoose = require('mongoose');

const CommunityProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a project title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: [
      'Social Enterprise', 
      'Local Initiative', 
      'Cultural Project', 
      'Education',
      'Education Program', // Added for frontend compatibility
      'Health', 
      'Health & Wellness', // Added for frontend compatibility
      'Environment', 
      'Technology',
      'Arts & Culture',
      'Other'
    ]
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [5000, 'Description cannot be more than 5000 characters']
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
    maxlength: [200, 'Location cannot be more than 200 characters']
  },
  participants: {
    type: Number,
    default: 0,
    min: [0, 'Participants cannot be negative']
  },
  progress: {
    type: Number,
    default: 0,
    min: [0, 'Progress cannot be less than 0'],
    max: [100, 'Progress cannot be more than 100']
  },
  fundingGoal: {
    type: Number,
    default: 0,
    min: [0, 'Funding goal must be a positive number']
  },
  fundingCurrent: {
    type: Number,
    default: 0,
    min: [0, 'Current funding cannot be negative']
  },
  tags: [{
    type: String,
    trim: true
  }],
  founder: {
    name: {
      type: String,
      required: [true, 'Please add founder name']
    },
    avatar: {
      type: String,
      default: 'https://randomuser.me/api/portraits/lego/1.jpg'
    },
    role: {
      type: String,
      default: 'Project Founder'
    }
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'Active', 'completed', 'paused', 'archived'], // Added 'Active' for frontend compatibility
    default: 'active'
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: [true, 'Comment text is required'],
      maxlength: [1000, 'Comment cannot be more than 1000 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

// Virtual for like count
CommunityProjectSchema.virtual('likeCount').get(function() {
  return this.likes ? this.likes.length : 0;
});

// Virtual for bookmark count
CommunityProjectSchema.virtual('bookmarkCount').get(function() {
  return this.bookmarks ? this.bookmarks.length : 0;
});

// Virtual for comment count
CommunityProjectSchema.virtual('commentCount').get(function() {
  return this.comments ? this.comments.length : 0;
});

// Virtual for funding percentage
CommunityProjectSchema.virtual('fundingPercentage').get(function() {
  if (this.fundingGoal === 0) return 0;
  return Math.round((this.fundingCurrent / this.fundingGoal) * 100);
});

// Update timestamp on save
CommunityProjectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Ensure virtuals are included in JSON
CommunityProjectSchema.set('toJSON', { virtuals: true });
CommunityProjectSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('CommunityProject', CommunityProjectSchema);
