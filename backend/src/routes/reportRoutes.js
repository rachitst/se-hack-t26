const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const Warehouse = require('../models/Warehouse');
const User = require('../models/User');
const Product = require('../models/Product');
const { io } = require('../index');

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

// Get dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalProducts,
      lowStockProducts,
      totalWarehouses,
      activeWarehouses,
      recentActivity
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: 'active' }),
      Product.countDocuments(),
      Product.countDocuments({ quantity: { $lte: 10 } }),
      Warehouse.countDocuments(),
      Warehouse.countDocuments({ status: 'active' }),
      // Get recent activity (last 5 activities)
      Product.find()
        .sort({ updatedAt: -1 })
        .limit(5)
        .select('name quantity updatedAt warehouse')
        .populate('warehouse', 'name')
    ]);

    const stats = {
      users: {
        total: totalUsers,
        active: activeUsers
      },
      products: {
        total: totalProducts,
        lowStock: lowStockProducts
      },
      warehouses: {
        total: totalWarehouses,
        active: activeWarehouses
      },
      recentActivity: recentActivity.map(activity => ({
        _id: activity._id,
        name: activity.name,
        quantity: activity.quantity,
        updatedAt: activity.updatedAt,
        warehouse: {
          name: activity.warehouse?.name || 'Unknown Warehouse'
        }
      }))
    };

    res.json(stats);
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get stock movements for chart
router.get('/stock-movements', async (req, res) => {
  try {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const movements = await Product.aggregate([
      {
        $match: {
          updatedAt: { $gte: last30Days }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
            type: "$status"
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.date": 1 }
      }
    ]);

    // Format the data for the chart
    const formattedMovements = movements.map(movement => ({
      _id: {
        date: movement._id.date,
        type: movement._id.type
      },
      count: movement.count
    }));

    res.json(formattedMovements);
  } catch (err) {
    console.error('Stock movements error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 