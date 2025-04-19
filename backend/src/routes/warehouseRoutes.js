const express = require('express');
const router = express.Router();
const Warehouse = require('../models/Warehouse');
const { body, validationResult } = require('express-validator');

// Get all warehouses
router.get('/', async (req, res) => {
  try {
    const warehouses = await Warehouse.find().populate('manager', 'username email');
    res.json(warehouses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single warehouse
router.get('/:id', async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id).populate('manager', 'username email');
    if (!warehouse) return res.status(404).json({ message: 'Warehouse not found' });
    res.json(warehouse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create warehouse
router.post('/', [
  body('name').notEmpty(),
  body('capacity').isNumeric(),
  body('location.address').notEmpty(),
  body('location.city').notEmpty(),
  body('location.country').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const warehouse = new Warehouse(req.body);
    await warehouse.save();
    res.status(201).json(warehouse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update warehouse
router.put('/:id', async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) return res.status(404).json({ message: 'Warehouse not found' });

    Object.assign(warehouse, req.body);
    warehouse.updatedAt = new Date();
    await warehouse.save();
    res.json(warehouse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete warehouse
router.delete('/:id', async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) return res.status(404).json({ message: 'Warehouse not found' });

    await warehouse.remove();
    res.json({ message: 'Warehouse deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 