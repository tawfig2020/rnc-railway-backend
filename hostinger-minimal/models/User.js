const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name can not be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  role: {
    type: String,
    enum: ['refugee', 'volunteer', 'staff', 'admin'],
    default: 'refugee'
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  profileImage: {
    type: String,
    default: 'default-avatar.jpg'
  },
  location: {
    type: String,
    required: [true, 'Please add your current location']
  },
  languages: [{
    type: String
  }],
  bio: {
    type: String,
    maxlength: [500, 'Bio can not be more than 500 characters']
  },
  skills: [{
    type: String
  }],
  interests: [{
    type: String
  }],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerificationToken: String,
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  // Privacy and consent related fields
  privacySettings: {
    profileVisibility: {
      type: String,
      enum: ['public', 'members_only', 'private'],
      default: 'members_only'
    },
    dataRetention: {
      type: Boolean,
      default: true
    },
    communicationPreferences: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      },
      newsletter: {
        type: Boolean,
        default: false
      }
    }
  },
  dataProcessingAgreement: {
    accepted: {
      type: Boolean,
      default: false
    },
    acceptedAt: Date,
    version: {
      type: String,
      default: '1.0'
    }
  },
  lastPrivacyPolicyAccepted: {
    version: String,
    acceptedAt: Date
  },
  accountDeletionRequest: {
    requested: {
      type: Boolean,
      default: false
    },
    requestedAt: Date,
    scheduledDeletionDate: Date,
    reason: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return (access token with shorter expiration)
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { 
      id: this._id,
      role: this.role,
      email: this.email
    }, 
    config.jwtSecret, 
    {
      expiresIn: config.jwtExpire
    }
  );
};

// Generate refresh token
UserSchema.methods.getRefreshToken = function() {
  return jwt.sign(
    { id: this._id },
    config.jwtRefreshSecret,
    { expiresIn: config.jwtRefreshExpire }
  );
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
