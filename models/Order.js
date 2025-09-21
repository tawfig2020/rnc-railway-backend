const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1']
      },
      price: {
        type: Number,
        required: true
      },
      name: String,
      image: String
    }
  ],
  // Reference to saved address from Address model
  shippingAddressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address'
  },
  // Embedded shipping address for orders (used when Address model reference is not available)
  shippingAddress: {
    fullName: {
      type: String,
      required: true
    },
    addressLine1: {
      type: String,
      required: true
    },
    addressLine2: {
      type: String
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    deliveryInstructions: {
      type: String
    }
  },
  // Reference to saved billing address from Address model
  billingAddressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address'
  },
  // Embedded billing address information
  billingAddress: {
    fullName: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    phone: String
  },
  // Flag to indicate if billing address is same as shipping address
  billingAddressSameAsShipping: {
    type: Boolean,
    default: true
  },
  paymentInfo: {
    id: {
      type: String
    },
    status: {
      type: String
    },
    type: {
      type: String,
      enum: ['credit_card', 'paypal', 'bank_transfer', 'other'],
      required: true
    },
    email: String
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ['processing', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'processing'
  },
  orderNotes: {
    type: String,
    maxlength: [1000, 'Order notes cannot exceed 1000 characters']
  },
  trackingInfo: {
    carrier: {
      type: String
    },
    trackingNumber: {
      type: String
    },
    trackingUrl: {
      type: String
    }
  },
  paidAt: {
    type: Date
  },
  shippedAt: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  refundedAt: {
    type: Date
  },
  paymentDueDate: {
    type: Date
  },
  transactionFee: {
    type: Number,
    default: 0
  },
  platformFee: {
    type: Number,
    default: 0
  },
  vendorPayoutStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  vendorPayoutDate: {
    type: Date
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

// Update timestamps on save
OrderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Update order status with dates
OrderSchema.pre('save', function(next) {
  const currentDate = new Date();
  if (this.isModified('orderStatus')) {
    switch(this.orderStatus) {
      case 'confirmed':
        if (!this.paidAt) this.paidAt = currentDate;
        break;
      case 'shipped':
        this.shippedAt = currentDate;
        break;
      case 'delivered':
        this.deliveredAt = currentDate;
        break;
      case 'cancelled':
        this.cancelledAt = currentDate;
        break;
      case 'refunded':
        this.refundedAt = currentDate;
        break;
    }
  }
  next();
});

module.exports = mongoose.model('Order', OrderSchema);
