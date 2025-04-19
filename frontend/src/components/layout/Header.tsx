import React, { useState } from 'react';
import { Bell, Search, User, ChevronDown, Activity } from 'lucide-react';
import { alerts } from '../../data/mockAlerts';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const unreadAlerts = alerts.filter(alert => !alert.read);
  
  return (
    <header className="bg-white border-b border-neutral-200/50 h-16 px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-neutral-800">{title}</h1>
        <div className="flex items-center space-x-2 text-sm text-neutral-500">
          <Activity size={16} className="text-indigo-500" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-64 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
          />
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        </div>
        
        <div className="relative">
          <button 
            className="p-2 rounded-lg hover:bg-neutral-100 relative transition-colors"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} className="text-neutral-500" />
            {unreadAlerts.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadAlerts.length}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-10 border border-neutral-200 max-h-[80vh] overflow-y-auto animate-fade-in">
              <div className="p-3 border-b border-neutral-200">
                <h3 className="font-medium">Notifications</h3>
              </div>
              <div className="divide-y divide-neutral-200">
                {alerts.slice(0, 5).map((alert) => (
                  <div key={alert.id} className={`p-3 hover:bg-neutral-50 ${!alert.read ? 'bg-indigo-50' : ''}`}>
                    <div className="flex items-start">
                      <div className={`w-2 h-2 rounded-full mt-1.5 mr-2 ${
                        alert.severity === 'critical' ? 'bg-red-500' :
                        alert.severity === 'high' ? 'bg-amber-500' :
                        alert.severity === 'medium' ? 'bg-yellow-500' :
                        'bg-neutral-400'
                      }`} />
                      <div>
                        <p className="text-sm font-medium">{alert.title}</p>
                        <p className="text-xs text-neutral-500 mt-1">{alert.message}</p>
                        <p className="text-xs text-neutral-400 mt-1">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="p-2 text-center">
                  <button className="text-sm text-indigo-600 hover:underline">
                    View all notifications
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="relative">
          <button 
            className="flex items-center space-x-2 p-1 rounded-lg hover:bg-neutral-100 transition-colors"
            onClick={() => setShowProfile(!showProfile)}
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
              <User size={16} className="text-indigo-600" />
            </div>
            <span className="hidden md:inline text-sm font-medium">John Smith</span>
            <ChevronDown size={16} className="text-neutral-400" />
          </button>
          
          {showProfile && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-neutral-200 animate-fade-in">
              <div className="py-1">
                <a href="#" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">Your Profile</a>
                <a href="#" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">Account Settings</a>
                <hr className="my-1 border-neutral-200" />
                <a href="#" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">Sign out</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;