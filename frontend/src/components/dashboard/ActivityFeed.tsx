import React from 'react';
import { Activity, User, Package, Warehouse, Clock } from 'lucide-react';

interface ActivityData {
  id: string;
  type: 'user' | 'product' | 'warehouse';
  action: 'created' | 'updated' | 'deleted';
  description: string;
  timestamp: string;
}

interface ActivityFeedProps {
  activities: ActivityData[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <User className="w-5 h-5" />;
      case 'product':
        return <Package className="w-5 h-5" />;
      case 'warehouse':
        return <Warehouse className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'user':
        return 'text-blue-500';
      case 'product':
        return 'text-green-500';
      case 'warehouse':
        return 'text-purple-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className={`flex-shrink-0 ${getColor(activity.type)}`}>
              {getIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {activity.description}
              </p>
              <div className="flex items-center mt-1 text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                <span>{new Date(activity.timestamp).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;