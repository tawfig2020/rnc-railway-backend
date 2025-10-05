const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // Not required to allow for anonymous donations
  },
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    // Optional as donation might not be tied to a specific campaign
  },
  amount: {
    type: Number,
    required: [true, 'Please add a donation amount'],
    min: [1, 'Amount must be at least 1']
  },
  currency: {
    type: String,
    required: [true, 'Please specify the currency'],
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'paypal', 'bank_transfer', 'crypto', 'other'],
    required: [true, 'Please specify payment method']
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  donorName: {
    type: String,
    // Optional for anonymous donors or when user is specified
  },
  donorEmail: {
    type: String,
    // Optional for anonymous donors or when user is specified
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  donorPhone: {
    type: String,
    // Optional
  },
  donorAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  message: {
    type: String,
    maxlength: [500, 'Message cannot be more than 500 characters']
  },
  taxDeductible: {
    type: Boolean,
    default: true
  },
  receiptSent: {
    type: Boolean,
    default: false
  },
  receiptDetails: {
    sentDate: Date,
    receiptNumber: String,
    receiptUrl: String
  },
  paymentDetails: {
    transactionId: String,
    paymentProcessor: String,
    processingFee: Number,
    netAmount: Number,
    cardLast4: String,
    payerEmail: String
  },
  frequency: {
    type: String,
    enum: ['one-time', 'monthly', 'quarterly', 'annually'],
    default: 'one-time'
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  subscriptionId: {
    type: String,
    // For recurring donations
  },
  cancelledAt: {
    type: Date,
    // For cancelled recurring donations
  },
  // Fields for organization tracking
  tags: [{
    type: String
  }],
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  },
  thankyouSent: {
    type: Boolean,
    default: false
  },
  thankyouSentAt: {
    type: Date
  },
  followUpNeeded: {
    type: Boolean,
    default: false
  },
  followUpDate: {
    type: Date
  },
  // Audit fields
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
});

// Update timestamps on save
DonationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Set completion date if status changed to completed
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  
  next();
});

module.exports = mongoose.model('Donation', DonationSchema);
