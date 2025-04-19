import React, { useState, useEffect } from 'react';
import Button from '../components/ui/Button';
import WarehouseCard from '../components/warehouse/WarehouseCard';
import { Plus, Search, Filter, ChevronDown, Grid, List, Building2 } from 'lucide-react';
import { warehouseApi } from '../services/api';
import { Warehouse } from '../types/warehouse';
import Dialog from '../components/ui/Dialog';

const Warehouses: React.FC = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddWarehouseOpen, setIsAddWarehouseOpen] = useState(false);
  const [isEditWarehouseOpen, setIsEditWarehouseOpen] = useState(false);
  const [isDeleteWarehouseOpen, setIsDeleteWarehouseOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await warehouseApi.getWarehouses();
        setWarehouses(response.data);
      } catch (err) {
        setError('Failed to fetch warehouses');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouses();
  }, []);

  const filteredWarehouses = warehouses.filter(
    (warehouse: Warehouse) => 
      warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddWarehouse = async (warehouseData: any) => {
    try {
      const response = await warehouseApi.createWarehouse(warehouseData);
      setWarehouses([...warehouses, response.data]);
      setIsAddWarehouseOpen(false);
    } catch (err) {
      setError('Failed to add warehouse');
      console.error(err);
    }
  };

  const handleEditWarehouse = async (id: string, warehouseData: any) => {
    try {
      const response = await warehouseApi.updateWarehouse(id, warehouseData);
      setWarehouses(warehouses.map(warehouse => 
        warehouse._id === id ? response.data : warehouse
      ));
      setIsEditWarehouseOpen(false);
    } catch (err) {
      setError('Failed to update warehouse');
      console.error(err);
    }
  };

  const handleDeleteWarehouse = async (id: string) => {
    try {
      await warehouseApi.deleteWarehouse(id);
      setWarehouses(warehouses.filter(warehouse => warehouse._id !== id));
      setIsDeleteWarehouseOpen(false);
    } catch (err) {
      setError('Failed to delete warehouse');
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Warehouse Management</h1>
          <p className="text-slate-500 mt-1">Manage and monitor all your warehouse facilities</p>
        </div>
        
        <Button 
          variant="primary" 
          leftIcon={<Plus size={16} />}
          onClick={() => setIsAddWarehouseOpen(true)}
          className="w-full lg:w-auto"
        >
          Add Warehouse
        </Button>
      </div>
      
      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search warehouses..."
              className="pl-10 pr-4 py-2.5 w-full border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            leftIcon={<Filter size={16} />}
            rightIcon={<ChevronDown size={16} />}
            className="flex-1 md:flex-none"
          >
            Filter
          </Button>
          
          <div className="flex rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
            <button
              className={`p-2.5 transition-colors ${
                view === 'grid'
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
              onClick={() => setView('grid')}
            >
              <Grid size={20} />
            </button>
            <button
              className={`p-2.5 transition-colors ${
                view === 'list'
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
              onClick={() => setView('list')}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Warehouse Cards Grid */}
      <div className={`
        grid gap-6
        ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}
      `}>
        {filteredWarehouses.map((warehouse: Warehouse) => (
          <WarehouseCard 
            key={warehouse._id} 
            warehouse={warehouse}
            onEdit={() => {
              setSelectedWarehouse(warehouse);
              setIsEditWarehouseOpen(true);
            }}
            onDelete={() => {
              setSelectedWarehouse(warehouse);
              setIsDeleteWarehouseOpen(true);
            }}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredWarehouses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-4 rounded-full bg-slate-50 mb-4">
            <Building2 size={24} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-1">No warehouses found</h3>
          <p className="text-slate-500 max-w-md">
            {searchTerm 
              ? 'No warehouses match your search criteria. Try adjusting your search.'
              : 'Get started by adding your first warehouse.'}
          </p>
          {!searchTerm && (
            <Button 
              variant="primary" 
              leftIcon={<Plus size={16} />}
              className="mt-4"
              onClick={() => setIsAddWarehouseOpen(true)}
            >
              Add Warehouse
            </Button>
          )}
        </div>
      )}

      {/* Add Warehouse Dialog */}
      <Dialog isOpen={isAddWarehouseOpen} onClose={() => setIsAddWarehouseOpen(false)} title="Add New Warehouse">
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          handleAddWarehouse({
            name: formData.get('name'),
            location: {
              address: formData.get('address'),
              city: formData.get('city'),
              state: formData.get('state'),
              country: formData.get('country'),
              zipCode: formData.get('zipCode')
            },
            capacity: Number(formData.get('capacity')),
            contactInfo: {
              phone: formData.get('phone'),
              email: formData.get('contactEmail')
            },
            operatingHours: {
              open: formData.get('openTime'),
              close: formData.get('closeTime')
            }
          });
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Name</label>
              <input
                type="text"
                name="name"
                required
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Address</label>
              <input
                type="text"
                name="address"
                required
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">City</label>
                <input
                  type="text"
                  name="city"
                  required
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">State</label>
                <input
                  type="text"
                  name="state"
                  required
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Country</label>
                <input
                  type="text"
                  name="country"
                  required
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">ZIP Code</label>
                <input
                  type="text"
                  name="zipCode"
                  required
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Capacity</label>
              <input
                type="number"
                name="capacity"
                required
                min="0"
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Opening Time</label>
                <input
                  type="time"
                  name="openTime"
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Closing Time</label>
                <input
                  type="time"
                  name="closeTime"
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsAddWarehouseOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Add Warehouse
              </Button>
            </div>
          </div>
        </form>
      </Dialog>

      {/* Edit Warehouse Dialog */}
      <Dialog isOpen={isEditWarehouseOpen} onClose={() => setIsEditWarehouseOpen(false)} title="Edit Warehouse">
        {selectedWarehouse && (
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleEditWarehouse(selectedWarehouse._id, {
              name: formData.get('name'),
              location: {
                address: formData.get('address'),
                city: formData.get('city'),
                state: formData.get('state'),
                country: formData.get('country'),
                zipCode: formData.get('zipCode')
              },
              capacity: Number(formData.get('capacity')),
              contactInfo: {
                phone: formData.get('phone'),
                email: formData.get('contactEmail')
              },
              operatingHours: {
                open: formData.get('openTime'),
                close: formData.get('closeTime')
              }
            });
          }}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={selectedWarehouse.name}
                  required
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Address</label>
                <input
                  type="text"
                  name="address"
                  defaultValue={selectedWarehouse.location.address}
                  required
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">City</label>
                  <input
                    type="text"
                    name="city"
                    defaultValue={selectedWarehouse.location.city}
                    required
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">State</label>
                  <input
                    type="text"
                    name="state"
                    defaultValue={selectedWarehouse.location.state}
                    required
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Country</label>
                  <input
                    type="text"
                    name="country"
                    defaultValue={selectedWarehouse.location.country}
                    required
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    defaultValue={selectedWarehouse.location.zipCode}
                    required
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  defaultValue={selectedWarehouse.capacity}
                  required
                  min="0"
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={selectedWarehouse.contactInfo?.phone}
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Email</label>
                  <input
                    type="email"
                    name="contactEmail"
                    defaultValue={selectedWarehouse.contactInfo?.email}
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Opening Time</label>
                  <input
                    type="time"
                    name="openTime"
                    defaultValue={selectedWarehouse.operatingHours?.open}
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Closing Time</label>
                  <input
                    type="time"
                    name="closeTime"
                    defaultValue={selectedWarehouse.operatingHours?.close}
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsEditWarehouseOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        )}
      </Dialog>

      {/* Delete Warehouse Dialog */}
      <Dialog isOpen={isDeleteWarehouseOpen} onClose={() => setIsDeleteWarehouseOpen(false)} title="Delete Warehouse">
        {selectedWarehouse && (
          <div className="space-y-4">
            <p>Are you sure you want to delete warehouse {selectedWarehouse.name}?</p>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsDeleteWarehouseOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => handleDeleteWarehouse(selectedWarehouse._id)}>
                Delete
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default Warehouses;