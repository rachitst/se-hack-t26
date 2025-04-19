import React from 'react';
import Card, { CardHeader, CardContent } from '../ui/Card';
import Badge from '../ui/Badge';
import { AlertCircle, ChevronRight, Package, Clock, Shield, Server, Activity } from 'lucide-react';
import { alerts } from '../../data/mockAlerts';

const AlertsPanel: React.FC = () => {
  const getBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'stock':
        return <Package size={16} className="text-indigo-600" />;
      case 'expiry':
        return <Clock size={16} className="text-amber-600" />;
      case 'security':
        return <Shield size={16} className="text-red-600" />;
      case 'system':
        return <Server size={16} className="text-neutral-600" />;
      case 'performance':
        return <Activity size={16} className="text-emerald-600" />;
      default:
        return <AlertCircle size={16} className="text-neutral-600" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'stock':
        return 'Inventory';
      case 'expiry':
        return 'Expiration';
      case 'security':
        return 'Security';
      case 'system':
        return 'System';
      case 'performance':
        return 'Performance';
      default:
        return category;
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium">Active Alerts</h2>
          <p className="text-sm text-neutral-500">Recent system notifications</p>
        </div>
        <span className="text-sm text-indigo-600 cursor-pointer flex items-center hover:underline">
          View all <ChevronRight size={16} />
        </span>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-neutral-200/50">
          {alerts.slice(0, 4).map((alert) => (
            <div key={alert.id} className="p-4 hover:bg-neutral-50 transition-colors">
              <div className="flex items-start">
                <div className="p-2 rounded-lg bg-neutral-100 mr-3">
                  {getCategoryIcon(alert.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium text-neutral-800 truncate">
                      {alert.title}
                    </p>
                    <Badge variant={getBadgeVariant(alert.severity)}>
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-neutral-500 truncate">
                    {alert.message}
                  </p>
                  <div className="mt-2 flex items-center">
                    <Badge variant="default" className="mr-2">
                      {getCategoryLabel(alert.category)}
                    </Badge>
                    <span className="text-xs text-neutral-400">
                      {new Date(alert.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsPanel;