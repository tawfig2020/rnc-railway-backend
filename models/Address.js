const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['shipping', 'billing'],
    default: 'shipping'
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required']
  },
  addressLine1: {
    type: String,
    required: [true, 'Address line 1 is required']
  },
  addressLine2: {
    type: String
  },
  city: {
    type: String,
    required: [true, 'City is required']
  },
  state: {
    type: String,
    required: [true, 'State/province is required']
  },
  postalCode: {
    type: String,
    required: [true, 'Postal/ZIP code is required']
  },
  country: {
    type: String,
    required: [true, 'Country is required']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  deliveryInstructions: {
    type: String
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

// Set only one default address per type per user
AddressSchema.pre('save', async function(next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { user: this.user, type: this.type, _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    );
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Address', AddressSchema);
