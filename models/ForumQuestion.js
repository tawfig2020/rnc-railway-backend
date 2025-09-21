const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Answer Schema as a nested schema
const AnswerSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  authorName: {
    type: String
  },
  authorAvatar: {
    type: String
  },
  votes: {
    up: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    down: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  isAccepted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Main Question Schema
const ForumQuestionSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  authorName: {
    type: String
  },
  authorAvatar: {
    type: String
  },
  category: {
    type: String,
    required: true,
    enum: ['legal', 'digital', 'life', 'mentorship', 'language', 'other']
  },
  tags: [String],
  votes: {
    up: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    down: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  views: {
    type: Number,
    default: 0
  },
  answers: [AnswerSchema],
  status: {
    type: String,
    enum: ['active', 'solved', 'closed', 'removed'],
    default: 'active'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  savedBy: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  flags: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    reason: String,
    date: { type: Date, default: Date.now }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add virtual field for flag count
ForumQuestionSchema.virtual('flagCount').get(function() {
  return this.flags.length;
});

// Add text index for search functionality
ForumQuestionSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('ForumQuestion', ForumQuestionSchema);
