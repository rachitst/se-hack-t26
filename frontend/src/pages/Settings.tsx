import React, { useState } from 'react';
import Card, { CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Save, Building, Bell, Shield, Package, Tag } from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('company');
  
  const tabs = [
    { id: 'company', name: 'Company Profile', icon: <Building size={16} /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell size={16} /> },
    { id: 'security', name: 'Security', icon: <Shield size={16} /> },
    { id: 'inventory', name: 'Inventory', icon: <Package size={16} /> },
    { id: 'categories', name: 'Categories', icon: <Tag size={16} /> },
  ];
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-800">Company Settings</h1>
        <p className="text-neutral-500 mt-1">Manage your organization settings and preferences</p>
      </div>
      
      <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-64 p-4 md:p-6 border-b md:border-b-0 md:border-r border-neutral-200 shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <span className="mr-3">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="flex-1 p-6">
            {activeTab === 'company' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium">Company Profile</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Your Company Name"
                      defaultValue="Global Logistics Inc."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Industry
                      </label>
                      <select className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                        <option>Manufacturing</option>
                        <option>Retail</option>
                        <option>Healthcare</option>
                        <option>Technology</option>
                        <option>Food & Beverage</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Company Size
                      </label>
                      <select className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                        <option>1-10 employees</option>
                        <option>11-50 employees</option>
                        <option selected>51-200 employees</option>
                        <option>201-500 employees</option>
                        <option>500+ employees</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Company Address
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Street Address"
                      defaultValue="123 Business Avenue"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="City"
                        defaultValue="Chicago"
                      />
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="State/Province"
                        defaultValue="IL"
                      />
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Zip/Postal Code"
                        defaultValue="60601"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Company Logo
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-neutral-200 rounded-md flex items-center justify-center">
                        <Building size={24} className="text-neutral-400" />
                      </div>
                      <Button variant="outline" size="sm">
                        Upload Logo
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-neutral-200 pt-4 flex justify-end">
                  <Button
                    variant="primary"
                    leftIcon={<Save size={16} />}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium">Notification Settings</h2>
                
                <div className="space-y-4">
                  <div className="border border-neutral-200 rounded-md divide-y divide-neutral-200">
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium">Low Stock Alerts</h3>
                        <p className="text-xs text-neutral-500 mt-1">
                          Receive alerts when products fall below minimum stock levels
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                    
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium">Expiry Alerts</h3>
                        <p className="text-xs text-neutral-500 mt-1">
                          Receive alerts when products are approaching expiry dates
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                    
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium">User Activity</h3>
                        <p className="text-xs text-neutral-500 mt-1">
                          Receive notifications about important user activities
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                    
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium">System Maintenance</h3>
                        <p className="text-xs text-neutral-500 mt-1">
                          Receive notifications about system maintenance and updates
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-neutral-200 rounded-md">
                    <h3 className="text-sm font-medium mb-2">Notification Delivery Methods</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          id="email"
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="email" className="ml-2 block text-sm text-neutral-700">
                          Email
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="sms"
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                        />
                        <label htmlFor="sms" className="ml-2 block text-sm text-neutral-700">
                          SMS
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="app"
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="app" className="ml-2 block text-sm text-neutral-700">
                          In-App Notifications
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-neutral-200 pt-4 flex justify-end">
                  <Button
                    variant="primary"
                    leftIcon={<Save size={16} />}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
            
            {(activeTab !== 'company' && activeTab !== 'notifications') && (
              <div className="flex items-center justify-center h-60">
                <div className="text-center">
                  <h2 className="text-lg font-medium text-neutral-700">
                    {tabs.find(tab => tab.id === activeTab)?.name} Settings
                  </h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    This section is under development
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;