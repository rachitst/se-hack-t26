import React, { useState } from 'react';
import {
  Package,
  Truck,
  Users,
  MapPin,
  Edit,
  Trash2,
  Activity,
  Clock,
  BarChart2,
  Settings,
  UserPlus,
  X,
  Check,
  AlertTriangle,
  Building2,
  Edit2,
} from 'lucide-react';
import { Warehouse as WarehouseType } from '../../types/warehouse';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Dialog from '../ui/Dialog';
import { users } from '../../data/data';

interface WarehouseCardProps {
  warehouse: WarehouseType;
  onEdit: (warehouse: WarehouseType) => void;
  onDelete: (id: string) => void;
}

interface PerformanceData {
  name: string;
  value: number;
}

interface Settings {
  capacityThreshold: number;
  efficiencyThreshold: number;
  accuracyThreshold: number;
}

const mockPerformanceData: PerformanceData[] = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 700 },
];

const WarehouseCard: React.FC<WarehouseCardProps> = ({ warehouse, onEdit, onDelete }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState<string | null>(warehouse.manager_id);
  const [settings, setSettings] = useState<Settings>({
    capacityThreshold: 80,
    efficiencyThreshold: 75,
    accuracyThreshold: 95
  });

  const handleEdit = () => {
    setIsDialogOpen(false);
    setIsEditDialogOpen(true);
  };

  const handleDelete = () => {
    setIsDialogOpen(false);
    setIsDeleteDialogOpen(true);
  };

  const handleSettings = () => {
    setIsDialogOpen(false);
    setIsSettingsDialogOpen(true);
  };

  const handleSaveSettings = () => {
    // Here you would typically make an API call to save the settings
    setIsSettingsDialogOpen(false);
  };

  const handleAssignManager = (managerId: string) => {
    setSelectedManager(managerId);
    // Here you would typically make an API call to assign the manager
    setIsEditDialogOpen(false);
  };

  const handleSettingsChange = (key: keyof Settings, value: number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const getManagerName = (managerId: string | null) => {
    if (!managerId) return 'Unassigned';
    const manager = users.find(user => user._id === managerId);
    return manager ? manager.name : 'Unassigned';
  };
  
  return (
    <>
      {/* Main Card */}
      <div
        className="group bg-white border rounded-2xl shadow-sm hover:shadow-md transition-all p-5 h-full flex flex-col"
        onClick={() => setIsDialogOpen(true)}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start gap-3">
            <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">
              <Building2 size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-lg text-gray-900">{warehouse.name}</h2>
              <p className="text-sm text-gray-500 flex items-center">
                <MapPin size={14} className="mr-1" />
                {warehouse.location}
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <button
              className="p-1.5 hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 rounded-md"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit();
              }}
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-md"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-3 mt-auto">
          {[
            { 
              icon: <Building2 size={18} />, 
              label: 'Industry', 
              value: warehouse.industry_id 
            },
            { 
              icon: <Users size={18} />, 
              label: 'Manager', 
              value: getManagerName(warehouse.manager_id) 
            },
            { 
              icon: <Clock size={18} />, 
              label: 'Created', 
              value: new Date(warehouse.created_at).toLocaleDateString() 
            }
          ].map((metric, idx) => (
            <div
              key={idx}
              className="bg-gray-50 rounded-xl text-center py-3 px-2 flex flex-col items-center h-full"
            >
              <div className="text-indigo-600 mb-1">{metric.icon}</div>
              <div className="text-sm font-medium text-gray-900 truncate w-full">{metric.value}</div>
              <div className="text-xs text-gray-500">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Dialog */}
      <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} title={warehouse.name}>
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit()}
              className="flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100"
            >
              <UserPlus size={16} />
              <span>Assign Manager</span>
            </button>
            <button
              onClick={() => handleSettings()}
              className="flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100"
            >
              <Settings size={16} />
              <span>Settings</span>
            </button>
          </div>
          
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <DetailBox label="Location" value={warehouse.location} />
            <DetailBox label="Manager" value={getManagerName(warehouse.manager_id)} />
            <DetailBox label="Industry" value={warehouse.industry_id} />
            <DetailBox label="Created" value={new Date(warehouse.created_at).toLocaleDateString()} />
          </div>

          {/* Performance Charts */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-600">Performance Overview</h4>
            <div className="flex justify-center">
              <div className="w-full max-w-2xl">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mockPerformanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          }}
                        />
                        <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                      </BarChart>
            </ResponsiveContainer>
          </div>
            </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog isOpen={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} title="Assign Manager">
        <div className="space-y-4">
          <p className="text-gray-600">Select a manager to assign to this warehouse:</p>
          <div className="space-y-2">
            {users
              .filter(user => user.role === 'manager')
              .map((manager) => (
                <div
                  key={manager._id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedManager === manager._id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => handleAssignManager(manager._id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{manager.name}</p>
                      <p className="text-sm text-gray-500">{manager.email}</p>
                    </div>
                    {selectedManager === manager._id && (
                      <Check className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog isOpen={isSettingsDialogOpen} onClose={() => setIsSettingsDialogOpen(false)} title="Warehouse Settings">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Capacity Threshold</label>
            <input
              type="number"
              value={settings.capacityThreshold}
              onChange={e => handleSettingsChange('capacityThreshold', Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Efficiency Threshold</label>
            <input
              type="number"
              value={settings.efficiencyThreshold}
              onChange={e => handleSettingsChange('efficiencyThreshold', Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Accuracy Threshold</label>
            <input
              type="number"
              value={settings.accuracyThreshold}
              onChange={e => handleSettingsChange('accuracyThreshold', Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} title="Delete Warehouse">
        <div className="space-y-4">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <p className="text-center text-gray-600">
            Are you sure you want to delete this warehouse? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setIsDeleteDialogOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onDelete(warehouse._id);
                setIsDeleteDialogOpen(false);
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

// Simple info display
const DetailBox = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-gray-50 p-4 rounded-xl">
    <h4 className="text-sm text-gray-600 mb-1">{label}</h4>
    <p className="text-sm font-medium text-gray-900">{value}</p>
  </div>
);

export default WarehouseCard;
