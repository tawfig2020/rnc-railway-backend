const mongoose = require('mongoose');

const DiscountSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please add a discount code'],
    trim: true,
    uppercase: true,
    unique: true,
    maxlength: [15, 'Discount code cannot be more than 15 characters']
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  discountType: {
    type: String,
    required: [true, 'Please specify discount type'],
    enum: ['percentage', 'fixed', 'shipping'],
    default: 'percentage'
  },
  value: {
    type: Number,
    required: [true, 'Please add a discount value'],
    min: [0, 'Discount value cannot be negative']
  },
  minPurchase: {
    type: Number,
    default: 0,
    min: [0, 'Minimum purchase amount cannot be negative']
  },
  maxDiscount: {
    type: Number,
    default: null
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: [true, 'Please specify an end date']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  usageLimit: {
    type: Number,
    default: null
  },
  usageCount: {
    type: Number,
    default: 0
  },
  perUserLimit: {
    type: Number,
    default: null
  },
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  applicableCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  excludedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Check if discount is valid and active
DiscountSchema.methods.isValid = function() {
  const now = new Date();
  return (
    this.isActive &&
    now >= this.startDate &&
    now <= this.endDate &&
    (this.usageLimit === null || this.usageCount < this.usageLimit)
  );
};

// Calculate discount amount
DiscountSchema.methods.calculateDiscount = function(subtotal) {
  if (!this.isValid()) {
    return 0;
  }

  let discountAmount = 0;

  switch (this.discountType) {
    case 'percentage':
      discountAmount = subtotal * (this.value / 100);
      break;
    case 'fixed':
      discountAmount = this.value;
      break;
    case 'shipping':
      // Shipping discount would be applied separately
      discountAmount = 0;
      break;
    default:
      discountAmount = 0;
  }

  // Apply minimum purchase requirement
  if (subtotal < this.minPurchase) {
    return 0;
  }

  // Apply maximum discount cap if set
  if (this.maxDiscount !== null && discountAmount > this.maxDiscount) {
    discountAmount = this.maxDiscount;
  }

  // Never allow discount to exceed subtotal
  if (discountAmount > subtotal) {
    discountAmount = subtotal;
  }

  return discountAmount;
};

module.exports = mongoose.model('Discount', DiscountSchema);
