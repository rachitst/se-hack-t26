const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const Product = require('../models/Product');
const { body, validationResult } = require('express-validator');

// Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single product
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create product
router.post('/products', [
  body('name').notEmpty().trim(),
  body('sku').notEmpty().trim(),
  body('category').notEmpty().trim(),
  body('price').isNumeric().isFloat({ min: 0 }),
  body('unit').notEmpty().trim(),
  body('minQuantity').isNumeric().isInt({ min: 0 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update product
router.put('/products/:id', [
  body('name').optional().trim(),
  body('sku').optional().trim(),
  body('category').optional().trim(),
  body('price').optional().isNumeric().isFloat({ min: 0 }),
  body('unit').optional().trim(),
  body('minQuantity').optional().isNumeric().isInt({ min: 0 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    Object.assign(product, req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await product.remove();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all inventory items
router.get('/', async (req, res) => {
  try {
    const inventory = await Inventory.find()
      .populate('warehouse', 'name location')
      .populate('product', 'name sku category price');
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get inventory by warehouse
router.get('/warehouse/:warehouseId', async (req, res) => {
  try {
    const inventory = await Inventory.find({ warehouse: req.params.warehouseId })
      .populate('product', 'name sku category price')
      .populate('warehouse', 'name location');
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single inventory item
router.get('/:id', async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id)
      .populate('warehouse', 'name location')
      .populate('product', 'name sku category price');
    if (!inventory) return res.status(404).json({ message: 'Inventory item not found' });
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const inventory = new Inventory(req.body);
    await inventory.save();
    res.status(201).json(inventory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update inventory item
router.put('/:id', async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id);
    if (!inventory) return res.status(404).json({ message: 'Inventory item not found' });

    Object.assign(inventory, req.body);
    inventory.lastUpdated = new Date();
    await inventory.save();
    res.json(inventory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update inventory quantity
router.patch('/:id/quantity', [
  body('quantity').isNumeric()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const inventory = await Inventory.findById(req.params.id);
    if (!inventory) return res.status(404).json({ message: 'Inventory item not found' });

    inventory.quantity = req.body.quantity;
    inventory.lastUpdated = new Date();
    await inventory.save();
    res.json(inventory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete inventory item
router.delete('/:id', async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id);
    if (!inventory) return res.status(404).json({ message: 'Inventory item not found' });

    await inventory.remove();
    res.json({ message: 'Inventory item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 