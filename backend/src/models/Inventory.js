const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true
  },
  location: {
    aisle: String,
    shelf: String,
    bin: String
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  minimumStock: {
    type: Number,
    default: 0
  },
  maximumStock: {
    type: Number
  },
  status: {
    type: String,
    enum: ['in-stock', 'low-stock', 'out-of-stock'],
    default: 'in-stock'
  }
});

module.exports = mongoose.model('Inventory', inventorySchema); 