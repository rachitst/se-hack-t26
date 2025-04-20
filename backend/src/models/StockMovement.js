const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['transfer', 'in', 'out'],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  fromWarehouse: {
    type: String,
    required: function() {
      return this.type === 'transfer';
    }
  },
  toWarehouse: {
    type: String,
    required: function() {
      return this.type === 'transfer';
    }
  },
  description: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('StockMovement', stockMovementSchema); 