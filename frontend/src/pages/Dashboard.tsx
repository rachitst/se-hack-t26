import React, { useState, useEffect, useMemo } from 'react';
import { 
  Warehouse, Package, Users, AlertCircle, Plus, ArrowRight, 
  BarChart3, Activity, RefreshCw, TrendingUp, DollarSign, 
  ShoppingCart, Box, Truck, Clock, Calendar, Filter
} from 'lucide-react';
import { reportApi, userApi, inventoryApi } from '../services/api';
import { socketService } from '../services/socket';
import Button from '../components/ui/Button';
import StatCard from '../components/ui/StatCard';
import AlertsPanel from '../components/dashboard/AlertsPanel';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import PerformanceChart from '../components/dashboard/PerformanceChart';
import SalesChart from '../components/dashboard/SalesChart';
import WarehouseChart from '../components/dashboard/WarehouseChart';
import InventoryChart from '../components/dashboard/InventoryChart';
import { Dialog } from '@headlessui/react';

interface DashboardStats {
  users: {
    total: number;
    active: number;
  };
  products: {
    total: number;
    lowStock: number;
  };
  warehouses: {
    total: number;
    active: number;
  };
  recentActivity: Array<{
    _id: string;
    name: string;
    quantity: number;
    updatedAt: string;
    warehouse: {
      name: string;
    };
  }>;
  sales: {
    total: number;
    byWarehouse: Array<{
      warehouse: string;
      amount: number;
    }>;
    byCategory: Array<{
      category: string;
      amount: number;
    }>;
  };
  inventory: {
    totalValue: number;
    byCategory: Array<{
      category: string;
      count: number;
    }>;
  };
}

interface StockMovement {
  _id: {
    date: string;
    type: string;
  };
  count: number;
}

interface DashboardProps {
  onRouteChange?: (route: string) => void;
}

interface FormData {
  name: string;
  email?: string;
  role?: string;
  quantity?: number;
  price?: number;
  category?: string;
  fromWarehouse?: string;
  toWarehouse?: string;
  description?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ onRouteChange }) => {
  const [stats, setStats] = useState<DashboardStats>({
    users: { total: 0, active: 0 },
    products: { total: 0, lowStock: 0 },
    warehouses: { total: 0, active: 0 },
    recentActivity: [],
    sales: { total: 0, byWarehouse: [], byCategory: [] },
    inventory: { totalValue: 0, byCategory: [] }
  });
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [salesFilter, setSalesFilter] = useState<'all' | 'warehouse' | 'category'>('all');
  const [warehouseFilter, setWarehouseFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    role: 'user',
    quantity: 0,
    price: 0,
    category: '',
    fromWarehouse: '',
    toWarehouse: '',
    description: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchDashboardData();
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Setup socket listeners
    const setupListeners = () => {
      console.log('Setting up Socket.IO listeners...');

      const handleProductUpdate = () => {
        console.log('Product updated, refreshing dashboard...');
        fetchDashboardData();
      };

      const handleUserUpdate = () => {
        console.log('User updated, refreshing dashboard...');
        fetchDashboardData();
      };

      const handleWarehouseUpdate = () => {
        console.log('Warehouse updated, refreshing dashboard...');
        fetchDashboardData();
      };

      const handleStockMovement = () => {
        console.log('Stock movement detected, refreshing dashboard...');
        fetchDashboardData();
      };

      // Subscribe to events
      socketService.subscribe('product:update', handleProductUpdate);
      socketService.subscribe('product:create', handleProductUpdate);
      socketService.subscribe('product:delete', handleProductUpdate);
      socketService.subscribe('user:update', handleUserUpdate);
      socketService.subscribe('user:create', handleUserUpdate);
      socketService.subscribe('user:delete', handleUserUpdate);
      socketService.subscribe('warehouse:update', handleWarehouseUpdate);
      socketService.subscribe('warehouse:create', handleWarehouseUpdate);
      socketService.subscribe('warehouse:delete', handleWarehouseUpdate);
      socketService.subscribe('stock:movement', handleStockMovement);

      // Return cleanup function
      return () => {
        console.log('Cleaning up Socket.IO listeners...');
        socketService.unsubscribe('product:update', handleProductUpdate);
        socketService.unsubscribe('product:create', handleProductUpdate);
        socketService.unsubscribe('product:delete', handleProductUpdate);
        socketService.unsubscribe('user:update', handleUserUpdate);
        socketService.unsubscribe('user:create', handleUserUpdate);
        socketService.unsubscribe('user:delete', handleUserUpdate);
        socketService.unsubscribe('warehouse:update', handleWarehouseUpdate);
        socketService.unsubscribe('warehouse:create', handleWarehouseUpdate);
        socketService.unsubscribe('warehouse:delete', handleWarehouseUpdate);
        socketService.unsubscribe('stock:movement', handleStockMovement);
      };
    };

    const cleanup = setupListeners();
    return cleanup;
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsResponse, movementsResponse] = await Promise.all([
        reportApi.getDashboardStats(),
        reportApi.getStockMovements()
      ]);
      
      if (statsResponse?.data) {
        const newStats = {
          users: {
            total: statsResponse.data.users?.total || 0,
            active: statsResponse.data.users?.active || 0
          },
          products: {
            total: statsResponse.data.products?.total || 0,
            lowStock: statsResponse.data.products?.lowStock || 0
          },
          warehouses: {
            total: statsResponse.data.warehouses?.total || 0,
            active: statsResponse.data.warehouses?.active || 0
          },
          recentActivity: Array.isArray(statsResponse.data.recentActivity) 
            ? statsResponse.data.recentActivity 
            : [],
          sales: {
            total: statsResponse.data.sales?.total || 0,
            byWarehouse: Array.isArray(statsResponse.data.sales?.byWarehouse)
              ? statsResponse.data.sales.byWarehouse
              : [],
            byCategory: Array.isArray(statsResponse.data.sales?.byCategory)
              ? statsResponse.data.sales.byCategory
              : []
          },
          inventory: {
            totalValue: statsResponse.data.inventory?.totalValue || 0,
            byCategory: Array.isArray(statsResponse.data.inventory?.byCategory)
              ? statsResponse.data.inventory.byCategory
              : []
          }
        };
        setStats(newStats);
      }
      
      if (Array.isArray(movementsResponse?.data)) {
        setStockMovements(movementsResponse.data);
      }
      
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError('Failed to fetch dashboard data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    setSelectedAction(action);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedAction(null);
  };

  const handleDialogConfirm = () => {
    if (selectedAction) {
      switch (selectedAction) {
        case 'Add Product':
          onRouteChange('inventory/add');
          break;
        case 'Create Transfer':
          onRouteChange('transfers/new');
          break;
        case 'Add User':
          onRouteChange('users/add');
          break;
        case 'Generate Report':
          onRouteChange('reports');
          break;
      }
    }
    handleDialogClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      switch (selectedAction) {
        case 'Add User':
          await userApi.register({
            username: formData.name,
            email: formData.email || '',
            role: formData.role || 'user',
            password: 'default123' // In a real app, you'd want to handle this differently
          });
          break;
        case 'Add Product':
          await inventoryApi.createProduct({
            name: formData.name,
            quantity: formData.quantity || 0,
            price: formData.price || 0,
            category: formData.category || '',
            description: formData.description || ''
          });
          break;
        case 'Create Transfer':
          await inventoryApi.createTransfer({
            fromWarehouse: formData.fromWarehouse || '',
            toWarehouse: formData.toWarehouse || '',
            productName: formData.name,
            quantity: formData.quantity || 0,
            description: formData.description || ''
          });
          break;
      }
      handleDialogClose();
      fetchDashboardData(); // Refresh the dashboard data
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const renderForm = () => {
    switch (selectedAction) {
      case 'Add User':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
              </select>
            </div>
          </form>
        );
      case 'Add Product':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </form>
        );
      case 'Create Transfer':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">From Warehouse</label>
              <select
                name="fromWarehouse"
                value={formData.fromWarehouse}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                <option value="">Select Warehouse</option>
                {stats.warehouses.total > 0 && Array.from({ length: stats.warehouses.total }, (_, i) => (
                  <option key={i} value={`Warehouse ${i + 1}`}>Warehouse {i + 1}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">To Warehouse</label>
              <select
                name="toWarehouse"
                value={formData.toWarehouse}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                <option value="">Select Warehouse</option>
                {stats.warehouses.total > 0 && Array.from({ length: stats.warehouses.total }, (_, i) => (
                  <option key={i} value={`Warehouse ${i + 1}`}>Warehouse {i + 1}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </form>
        );
      default:
        return null;
    }
  };

  const filteredSalesData = useMemo(() => {
    if (salesFilter === 'all') {
      return stats.sales.byWarehouse;
    }
    if (salesFilter === 'warehouse' && warehouseFilter !== 'all') {
      return stats.sales.byWarehouse.filter(item => item.warehouse === warehouseFilter);
    }
    return stats.sales.byWarehouse;
  }, [stats.sales.byWarehouse, salesFilter, warehouseFilter]);

  const filteredWarehouseData = useMemo(() => {
    if (warehouseFilter === 'all') {
      return stats.sales.byWarehouse;
    }
    return stats.sales.byWarehouse.filter(item => item.warehouse === warehouseFilter);
  }, [stats.sales.byWarehouse, warehouseFilter]);

  const quickActions = [
    { 
      name: 'Add Product', 
      icon: <Plus size={20} />, 
      color: 'bg-primary-50 text-primary-600',
      onClick: () => handleQuickAction('Add Product')
    },
    { 
      name: 'Create Transfer', 
      icon: <ArrowRight size={20} />, 
      color: 'bg-secondary-50 text-secondary-600',
      onClick: () => handleQuickAction('Create Transfer')
    },
    { 
      name: 'Add User', 
      icon: <Users size={20} />, 
      color: 'bg-accent-50 text-accent-600',
      onClick: () => handleQuickAction('Add User')
    },
    { 
      name: 'Generate Report', 
      icon: <BarChart3 size={20} />, 
      color: 'bg-success-50 text-success-600',
      onClick: () => handleQuickAction('Generate Report')
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-red-600 text-center max-w-md">
          <p className="text-lg font-medium mb-4">Error: {error}</p>
          <Button
            variant="primary"
            onClick={fetchDashboardData}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-gray-600 text-center max-w-md">
          <p className="text-lg font-medium mb-4">No data available</p>
          <Button
            variant="primary"
            onClick={fetchDashboardData}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Refresh
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <div className="space-y-6 p-6 bg-slate-50">
      {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center space-x-2 text-slate-500">
          <Activity size={16} />
              <span className="text-sm">Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={timeRange === 'day' ? 'primary' : 'outline'}
                onClick={() => setTimeRange('day')}
                size="sm"
              >
                Day
              </Button>
              <Button
                variant={timeRange === 'week' ? 'primary' : 'outline'}
                onClick={() => setTimeRange('week')}
                size="sm"
              >
                Week
              </Button>
              <Button
                variant={timeRange === 'month' ? 'primary' : 'outline'}
                onClick={() => setTimeRange('month')}
                size="sm"
              >
                Month
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={fetchDashboardData}
              className="flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Refresh
            </Button>
        </div>
      </div>

      {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Sales"
            value={`$${stats.sales.total.toLocaleString()}`}
            icon={<DollarSign size={20} />}
            change={12}
            changeLabel="from last period"
          />
        <StatCard
          title="Active Warehouses"
            value={`${stats.warehouses.active}/${stats.warehouses.total}`}
          icon={<Warehouse size={20} />}
          change={8}
            changeLabel="from last period"
        />
        <StatCard
          title="Total Products"
            value={stats.products.total}
          icon={<Package size={20} />}
          change={12}
            changeLabel="from last period"
        />
        <StatCard
            title="Low Stock Items"
            value={stats.products.lowStock}
          icon={<AlertCircle size={20} />}
          change={-3}
            changeLabel="from last period"
        />
      </div>
      
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Sales Performance</h3>
              <div className="flex items-center space-x-2">
                <select
                  value={salesFilter}
                  onChange={(e) => setSalesFilter(e.target.value as 'all' | 'warehouse' | 'category')}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="all">All Sales</option>
                  <option value="warehouse">By Warehouse</option>
                  <option value="category">By Category</option>
                </select>
                {salesFilter === 'warehouse' && (
                  <select
                    value={warehouseFilter}
                    onChange={(e) => setWarehouseFilter(e.target.value)}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="all">All Warehouses</option>
                    {stats.sales.byWarehouse.map((item) => (
                      <option key={item.warehouse} value={item.warehouse}>
                        {item.warehouse}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            <div className="h-[300px]">
              <SalesChart data={filteredSalesData} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Warehouse Distribution</h3>
              <div className="flex items-center space-x-2">
                <select
                  value={warehouseFilter}
                  onChange={(e) => setWarehouseFilter(e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="all">All Warehouses</option>
                  {stats.sales.byWarehouse.map((item) => (
                    <option key={item.warehouse} value={item.warehouse}>
                      {item.warehouse}
                    </option>
                  ))}
                </select>
                <Button variant="outline" size="sm">
                  <Calendar size={16} className="mr-2" />
                  {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}
                </Button>
              </div>
            </div>
            <div className="h-[300px]">
              <WarehouseChart 
                data={filteredWarehouseData.map(item => ({
                  name: item.warehouse || 'Unknown',
                  value: item.amount || 0
                }))} 
              />
            </div>
          </div>
        </div>

        {/* Inventory and Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Inventory Overview</h3>
              <div className="h-[300px]">
                <InventoryChart data={stats.inventory.byCategory} />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                    onClick={action.onClick}
                    className={`flex items-center justify-center p-4 rounded-lg ${action.color} hover:opacity-90 transition-all duration-300 cursor-pointer`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    {action.icon}
                    <span className="text-sm font-medium">{action.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
              <ActivityFeed 
                activities={stats.recentActivity.map(activity => ({
                  id: activity._id || '',
                  type: 'product',
                  action: 'updated',
                  description: `${activity.name || 'Unknown'} stock updated to ${activity.quantity || 0} units in ${activity.warehouse?.name || 'Unknown Warehouse'}`,
                  timestamp: activity.updatedAt || new Date().toISOString()
                }))} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md w-full rounded-lg bg-white p-6">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
              {selectedAction}
            </Dialog.Title>
            {selectedAction === 'Generate Report' ? (
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  Redirecting to reports page...
                </p>
                <div className="mt-6 flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={handleDialogClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      handleDialogClose();
                      onRouteChange('reports');
                    }}
                  >
                    Go to Reports
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {renderForm()}
                <div className="mt-6 flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={handleDialogClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </div>
              </>
            )}
          </Dialog.Panel>
    </div>
      </Dialog>
    </>
  );
};

export default Dashboard;