import React from 'react';
import { Calendar, Package, User, Truck, AlertTriangle } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../ui/Card';

interface ActivityItem {
  id: string;
  type: 'inventory' | 'user' | 'warehouse' | 'alert';
  message: string;
  timestamp: string;
  user: string;
}

const activities: ActivityItem[] = [
  {
    id: '1',
    type: 'inventory',
    message: 'Added 25 units of Premium Ergonomic Chair to North Distribution Center',
    timestamp: '2025-03-15T10:30:00Z',
    user: 'Emily Johnson',
  },
  {
    id: '2',
    type: 'user',
    message: 'Created new user account for Lisa Brown',
    timestamp: '2025-03-14T09:30:00Z',
    user: 'John Smith',
  },
  {
    id: '3',
    type: 'warehouse',
    message: 'Updated capacity settings for West Coast Facility',
    timestamp: '2025-03-14T16:45:00Z',
    user: 'Michael Chen',
  },
  {
    id: '4',
    type: 'alert',
    message: 'Acknowledged low stock alert for Premium Wireless Mouse',
    timestamp: '2025-03-15T08:35:00Z',
    user: 'David Kim',
  },
  {
    id: '5',
    type: 'inventory',
    message: 'Transferred 10 units of Ultra HD Monitor 27" to Southeast Regional Hub',
    timestamp: '2025-03-14T11:20:00Z',
    user: 'Sarah Williams',
  },
];

const ActivityFeed: React.FC = () => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'inventory':
        return <Package size={16} className="text-primary-500" />;
      case 'user':
        return <User size={16} className="text-secondary-500" />;
      case 'warehouse':
        return <Truck size={16} className="text-accent-500" />;
      case 'alert':
        return <AlertTriangle size={16} className="text-warning-500" />;
      default:
        return <Calendar size={16} className="text-neutral-500" />;
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <h2 className="text-lg font-medium">Recent Activity</h2>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flow-root">
          <ul className="-mb-8">
            {activities.map((activity, activityIdx) => (
              <li key={activity.id}>
                <div className="relative pb-8">
                  {activityIdx !== activities.length - 1 ? (
                    <span
                      className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-neutral-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex items-start space-x-3">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center ring-8 ring-white">
                        {getActivityIcon(activity.type)}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 py-1.5">
                      <div className="text-sm text-neutral-500">
                        <span className="font-medium text-neutral-900">{activity.user}</span>{' '}
                        {activity.message}
                        <div className="mt-1">
                          <span className="text-xs text-neutral-400">
                            {new Date(activity.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;