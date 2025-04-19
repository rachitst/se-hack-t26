const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const Warehouse = require('../models/Warehouse');

// Get inventory summary
router.get('/inventory-summary', async (req, res) => {
  try {
    const summary = await Inventory.aggregate([
      {
        $group: {
          _id: '$warehouse',
          totalItems: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
          lowStockItems: {
            $sum: {
              $cond: [{ $lt: ['$quantity', '$minimumStock'] }, 1, 0]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'warehouses',
          localField: '_id',
          foreignField: '_id',
          as: 'warehouse'
        }
      },
      {
        $unwind: '$warehouse'
      },
      {
        $project: {
          warehouseName: '$warehouse.name',
          totalItems: 1,
          totalQuantity: 1,
          lowStockItems: 1
        }
      }
    ]);

    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get low stock items
router.get('/low-stock', async (req, res) => {
  try {
    const lowStockItems = await Inventory.find({
      $expr: { $lt: ['$quantity', '$minimumStock'] }
    })
      .populate('warehouse', 'name')
      .populate('product', 'name description');

    res.json(lowStockItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get warehouse utilization
router.get('/warehouse-utilization', async (req, res) => {
  try {
    const utilization = await Warehouse.aggregate([
      {
        $lookup: {
          from: 'inventories',
          localField: '_id',
          foreignField: 'warehouse',
          as: 'inventory'
        }
      },
      {
        $project: {
          name: 1,
          capacity: 1,
          usedSpace: {
            $sum: '$inventory.quantity'
          },
          utilization: {
            $multiply: [
              {
                $divide: [
                  { $sum: '$inventory.quantity' },
                  '$capacity'
                ]
              },
              100
            ]
          }
        }
      }
    ]);

    res.json(utilization);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get inventory movement history
router.get('/movement-history', async (req, res) => {
  try {
    const { startDate, endDate, warehouseId } = req.query;
    const query = {};

    if (startDate && endDate) {
      query.lastUpdated = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (warehouseId) {
      query.warehouse = warehouseId;
    }

    const movements = await Inventory.find(query)
      .populate('warehouse', 'name')
      .populate('product', 'name')
      .sort({ lastUpdated: -1 });

    res.json(movements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 