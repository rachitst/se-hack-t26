import React from 'react';
import { AlertCircle } from 'lucide-react';

interface Alert {
  _id: string;
  name: string;
  quantity: number;
  updatedAt: string;
  warehouse: {
    name: string;
  };
}

interface AlertsPanelProps {
  alerts: Alert[];
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Low Stock Alerts</h3>
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="text-center py-4 text-slate-500">
            No low stock alerts at the moment
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert._id}
              className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg"
            >
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {alert.name} is running low
                </p>
                <p className="text-xs text-slate-500">
                  Current stock: {alert.quantity} units
                </p>
                <p className="text-xs text-slate-500">
                  Warehouse: {alert.warehouse.name}
                </p>
                <p className="text-xs text-slate-500">
                  Last updated: {new Date(alert.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertsPanel;