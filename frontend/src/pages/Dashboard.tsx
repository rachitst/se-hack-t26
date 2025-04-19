import React from 'react';
import StatCard from '../components/ui/StatCard';
import AlertsPanel from '../components/dashboard/AlertsPanel';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import PerformanceChart from '../components/dashboard/PerformanceChart';
import { Warehouse, Package, Users, AlertCircle, Plus, ArrowRight, BarChart3, Activity } from 'lucide-react';
import { warehouses, products, users, alerts, activity_logs, stock_movements } from '../data/data';

const Dashboard: React.FC = () => {
  // Calculate summary statistics
  const totalWarehouses = warehouses.length;
  const activeWarehouses = warehouses.filter(w => w.manager_id !== null).length;
  
  const totalProducts = products.reduce((sum, product) => sum + product.price, 0);
  const lowStockProducts = alerts.filter(a => a.alert_type === 'LOW_STOCK' && a.status === 'ACTIVE').length;
  
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.role === 'manager' || u.role === 'admin').length;
  
  const criticalAlerts = alerts.filter(a => a.status === 'ACTIVE').length;

  // Calculate recent stock movements
  const recentMovements = stock_movements
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const quickActions = [
    { name: 'Add Product', icon: <Plus size={20} />, color: 'bg-primary-50 text-primary-600' },
    { name: 'Create Transfer', icon: <ArrowRight size={20} />, color: 'bg-secondary-50 text-secondary-600' },
    { name: 'Add User', icon: <Users size={20} />, color: 'bg-accent-50 text-accent-600' },
    { name: 'Generate Report', icon: <BarChart3 size={20} />, color: 'bg-success-50 text-success-600' },
  ];
  
  return (
    <div className="space-y-8 animate-fade-in p-6 bg-slate-50">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center space-x-2 text-slate-500">
          <Activity size={16} />
          <span className="text-sm">Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Warehouses"
          value={`${activeWarehouses}/${totalWarehouses}`}
          icon={<Warehouse size={20} />}
          change={8}
          changeLabel="from last month"
        />
        
        <StatCard
          title="Total Products"
          value={totalProducts.toLocaleString()}
          icon={<Package size={20} />}
          change={12}
          changeLabel="from last month"
        />
        
        <StatCard
          title="Active Users"
          value={`${activeUsers}/${totalUsers}`}
          icon={<Users size={20} />}
          change={5}
          changeLabel="from last month"
        />
        
        <StatCard
          title="Active Alerts"
          value={criticalAlerts}
          icon={<AlertCircle size={20} />}
          change={-3}
          changeLabel="from last month"
        />
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PerformanceChart data={recentMovements} />
        </div>
        <div className="space-y-6">
          <AlertsPanel alerts={alerts.filter(a => a.status === 'ACTIVE')} />
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className={`flex items-center justify-center p-4 rounded-lg ${action.color} hover:opacity-90 transition-all duration-300`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    {action.icon}
                    <span className="text-sm font-medium">{action.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
            <ActivityFeed activities={activity_logs.slice(0, 5)} />
          </div>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Database</span>
              <span className="text-success-600 font-medium">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">API Services</span>
              <span className="text-success-600 font-medium">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Storage</span>
              <span className="text-warning-600 font-medium">75% Used</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Backup</span>
              <span className="text-success-600 font-medium">Last: 2h ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;