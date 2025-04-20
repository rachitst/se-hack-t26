const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const Product = require('../models/Product');
const { body, validationResult } = require('express-validator');
const StockMovement = require('../models/StockMovement');
const { io } = require('../index');

// Helper function for consistent response format
const sendResponse = (res, data, success = true, message = '') => {
  res.status(200).json({
    success,
    data,
    message
  });
};

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    sendResponse(res, products);
  } catch (err) {
    sendResponse(res, null, false, err.message);
  }
});

// Get single product
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return sendResponse(res, null, false, 'Product not found');
    }
    sendResponse(res, product);
  } catch (err) {
    sendResponse(res, null, false, err.message);
  }
});

// Create new product
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    const newProduct = await product.save();
    io.emit('inventory:created', newProduct);
    sendResponse(res, newProduct, true, 'Product created successfully');
  } catch (err) {
    sendResponse(res, null, false, err.message);
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return sendResponse(res, null, false, 'Product not found');
    }
    io.emit('inventory:updated', updatedProduct);
    sendResponse(res, updatedProduct, true, 'Product updated successfully');
  } catch (err) {
    sendResponse(res, null, false, err.message);
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return sendResponse(res, null, false, 'Product not found');
    }
    io.emit('inventory:deleted', { _id: req.params.id });
    sendResponse(res, null, true, 'Product deleted successfully');
  } catch (err) {
    sendResponse(res, null, false, err.message);
  }
});

// Get all inventory items
router.get('/', async (req, res) => {
  try {
    const inventory = await Inventory.find()
      .populate('warehouse', 'name location')
      .populate('product', 'name sku category price');
    sendResponse(res, inventory);
  } catch (err) {
    sendResponse(res, null, false, err.message);
  }
});

// Get inventory by warehouse
router.get('/warehouse/:warehouseId', async (req, res) => {
  try {
    const inventory = await Inventory.find({ warehouse: req.params.warehouseId })
      .populate('product', 'name sku category price')
      .populate('warehouse', 'name location');
    sendResponse(res, inventory);
  } catch (err) {
    sendResponse(res, null, false, err.message);
  }
});

// Get single inventory item
router.get('/:id', async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id)
      .populate('warehouse', 'name location')
      .populate('product', 'name sku category price');
    if (!inventory) {
      return sendResponse(res, null, false, 'Inventory item not found');
    }
    sendResponse(res, inventory);
  } catch (err) {
    sendResponse(res, null, false, err.message);
  }
});

// Create inventory item
router.post('/', [
  body('warehouse').notEmpty(),
  body('product').notEmpty(),
  body('quantity').isNumeric(),
  body('location.aisle').notEmpty(),
  body('location.shelf').notEmpty(),
  body('location.bin').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendResponse(res, null, false, errors.array()[0].msg);
  }

  try {
    const inventory = new Inventory(req.body);
    await inventory.save();
    sendResponse(res, inventory, true, 'Inventory item created successfully');
  } catch (err) {
    sendResponse(res, null, false, err.message);
  }
});

// Update inventory item
router.put('/:id', async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id);
    if (!inventory) {
      return sendResponse(res, null, false, 'Inventory item not found');
    }

    Object.assign(inventory, req.body);
    inventory.lastUpdated = new Date();
    await inventory.save();
    sendResponse(res, inventory, true, 'Inventory item updated successfully');
  } catch (err) {
    sendResponse(res, null, false, err.message);
  }
});

// Update inventory quantity
router.patch('/:id/quantity', [
  body('quantity').isNumeric()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendResponse(res, null, false, errors.array()[0].msg);
  }

  try {
    const inventory = await Inventory.findById(req.params.id);
    if (!inventory) {
      return sendResponse(res, null, false, 'Inventory item not found');
    }

    inventory.quantity = req.body.quantity;
    inventory.lastUpdated = new Date();
    await inventory.save();
    sendResponse(res, inventory, true, 'Quantity updated successfully');
  } catch (err) {
    sendResponse(res, null, false, err.message);
  }
});

// Delete inventory item
router.delete('/:id', async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id);
    if (!inventory) {
      return sendResponse(res, null, false, 'Inventory item not found');
    }

    await inventory.remove();
    sendResponse(res, null, true, 'Inventory item deleted successfully');
  } catch (err) {
    sendResponse(res, null, false, err.message);
  }
});

// Create a stock transfer
router.post('/transfers', async (req, res) => {
  try {
    const { fromWarehouse, toWarehouse, productName, quantity, description } = req.body;

    // Create stock movement record
    const stockMovement = new StockMovement({
      productName,
      type: 'transfer',
      quantity,
      fromWarehouse,
      toWarehouse,
      description
    });

    await stockMovement.save();

    // Emit socket event
    io.emit('stock:movement', {
      _id: stockMovement._id,
      productName,
      type: 'transfer',
      quantity,
      fromWarehouse,
      toWarehouse,
      createdAt: stockMovement.createdAt
    });

    sendResponse(res, stockMovement, true, 'Stock transfer created successfully');
  } catch (error) {
    sendResponse(res, null, false, error.message);
  }
});

module.exports = router; 