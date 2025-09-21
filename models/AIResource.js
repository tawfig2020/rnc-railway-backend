const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AIResourceSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['tool', 'course', 'tutorial', 'guide', 'article', 'video', 'other'],
    default: 'tool'
  },
  category: {
    type: String,
    enum: ['education', 'career', 'language', 'entrepreneurship', 'creativity', 'productivity', 'healthcare', 'legal', 'other'],
    default: 'other'
  },
  url: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  skillLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'all'],
    default: 'all'
  },
  isFree: {
    type: Boolean,
    default: true
  },
  pricing: {
    type: String
  },
  tags: [String],
  featuredRank: {
    type: Number,
    default: 0 // 0 = not featured, 1+ = featured rank
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  creator: {
    type: Schema.Types.ObjectId,
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

// Add text index for search functionality
AIResourceSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('AIResource', AIResourceSchema);
