const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a course title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  level: {
    type: String,
    enum: ['beginner', 'Beginner', 'intermediate', 'Intermediate', 'advanced', 'Advanced'], // Added capitalized versions
    default: 'beginner'
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'language', 'Language',
      'professional', 'Professional',
      'academic', 'Academic',
      'vocational', 'Vocational',
      'life-skills', 'Life Skills',
      'technology', 'Technology',
      'education', 'Education',
      'health', 'Health',
      'business', 'Business',
      'arts', 'Arts',
      'other', 'Other'
    ] // Added more categories and capitalized versions
  },
  instructor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Please add the course duration']
  },
  lessons: [{
    title: {
      type: String,
      required: [true, 'Please add a lesson title']
    },
    content: {
      type: String,
      required: [true, 'Please add lesson content']
    },
    resources: [{
      title: String,
      type: {
        type: String,
        enum: ['video', 'document', 'link', 'quiz']
      },
      url: String
    }],
    duration: Number // in minutes
  }],
  coverImage: {
    type: String,
    default: 'default-course.jpg'
  },
  language: {
    type: String,
    required: [true, 'Please specify the course language'],
    default: 'English'
  },
  enrolledUsers: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  ratings: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    review: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    min: 0,
    max: 5
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  // Additional fields for admin management
  instructorName: {
    type: String
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  schedule: {
    type: String
  },
  location: {
    type: String
  },
  capacity: {
    type: Number
  },
  enrolled: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['upcoming', 'Upcoming', 'active', 'Active', 'completed', 'Completed', 'cancelled', 'Cancelled'], // Added capitalized versions
    default: 'upcoming'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Calculate average rating when ratings are modified
CourseSchema.pre('save', function(next) {
  if (this.ratings && this.ratings.length > 0) {
    this.averageRating = this.ratings.reduce((acc, item) => item.rating + acc, 0) / this.ratings.length;
  } else {
    this.averageRating = 0;
  }
  next();
});

module.exports = mongoose.model('Course', CourseSchema);
