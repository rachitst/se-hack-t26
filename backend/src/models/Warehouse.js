const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    address: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  capacity: {
    type: Number,
    required: true
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  contactInfo: {
    phone: String,
    email: String
  },
  operatingHours: {
    open: String,
    close: String
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

module.exports = mongoose.model('Warehouse', warehouseSchema); 