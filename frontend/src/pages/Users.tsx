import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, ChevronDown, MoreVertical, Edit2, Trash2, UserPlus, Shield, X, UserCog, UserCheck } from 'lucide-react';
import { userApi, warehouseApi } from '../services/api';
import Button from '../components/ui/Button';
import Dialog from '../components/ui/Dialog';
import { User } from '../types/user';
import Badge from '../components/ui/Badge';

const UsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [warehouseFilter, setWarehouseFilter] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [usersResponse, warehousesResponse] = await Promise.all([
          userApi.getUsers(),
          warehouseApi.getWarehouses()
        ]);
        setUsers(usersResponse.data);
        setWarehouses(warehousesResponse.data);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredUsers = users.filter(user => {
    if (!user) return false;
    
    const matchesSearch = (
      (user.username?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesWarehouse = warehouseFilter === 'all' || user.warehouse_id === warehouseFilter;
    
    return matchesSearch && matchesRole && matchesWarehouse;
  });

  const handleAddUser = async (userData: any) => {
    try {
      const response = await userApi.register(userData);
      setUsers([...users, response.data.user]);
      setIsAddUserOpen(false);
    } catch (err) {
      setError('Failed to add user');
      console.error(err);
    }
  };

  const handleEditUser = async (id: string, userData: any) => {
    try {
      const response = await userApi.updateUser(id, userData);
      setUsers(users.map(user => user._id === id ? response.data : user));
      setIsEditUserOpen(false);
    } catch (err) {
      setError('Failed to update user');
      console.error(err);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await userApi.deleteUser(id);
      setUsers(users.filter(user => user._id !== id));
      setIsDeleteDialogOpen(false);
    } catch (err) {
      setError('Failed to delete user');
      console.error(err);
    }
  };

  const getWarehouseName = (warehouseId: string | null) => {
    if (!warehouseId) return 'Unassigned';
    const warehouse = warehouses.find(w => w._id === warehouseId);
    return warehouse ? warehouse.name : 'Unknown Warehouse';
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'manager':
        return 'primary';
      case 'staff':
        return 'success';
      default:
        return 'default';
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-red-600 text-center">
        <p className="text-lg font-medium">Error: {error}</p>
        <p className="text-sm mt-2">Please try refreshing the page</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">User Management</h1>
            <p className="text-slate-500 mt-2">Manage and monitor user access and permissions</p>
          </div>
          
          <Button 
            variant="primary" 
            leftIcon={<UserPlus size={18} />}
            onClick={() => setIsAddUserOpen(true)}
            className="w-full lg:w-auto bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
          >
            Add New User
          </Button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Users</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">{users.length}</p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl">
                <UserPlus className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Managers</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">
                  {users.filter(user => user.role === 'manager').length}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <UserCog className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Staff</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">
                  {users.filter(user => user.role === 'staff').length}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <UserCheck className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Search and Filter Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  className="pl-12 pr-4 py-3 w-full border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm"
              >
                <option value="all">All Roles</option>
                <option value="manager">Manager</option>
                <option value="staff">Staff</option>
              </select>
              
              <select
                value={warehouseFilter}
                onChange={(e) => setWarehouseFilter(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm"
              >
                <option value="all">All Warehouses</option>
                {warehouses.map(warehouse => (
                  <option key={warehouse._id} value={warehouse._id}>
                    {warehouse.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Warehouse</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
                            <span className="text-indigo-600 font-semibold">
                              {user.username?.charAt(0) || ''}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-slate-800">{user.username || ''}</div>
                          <div className="text-sm text-slate-500">{user.email || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getRoleBadgeVariant(user.role || '')}>
                        {user.role || ''}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {getWarehouseName(user.warehouse_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setIsEditUserOpen(true);
                          }}
                          className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit user"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete user"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add User Dialog */}
        <Dialog isOpen={isAddUserOpen} onClose={() => setIsAddUserOpen(false)} title="Add New User">
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleAddUser({
              username: formData.get('username'),
              email: formData.get('email'),
              password: formData.get('password'),
              role: formData.get('role'),
              warehouse_id: formData.get('warehouse')
            });
          }}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select 
                  name="role" 
                  required 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select a role</option>
                  <option value="manager">Manager</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Warehouse</label>
                <select 
                  name="warehouse" 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Unassigned</option>
                  {warehouses.map(warehouse => (
                    <option key={warehouse._id} value={warehouse._id}>{warehouse.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary"
                  className="px-6 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
                >
                  Add User
                </Button>
              </div>
            </div>
          </form>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog isOpen={isEditUserOpen} onClose={() => setIsEditUserOpen(false)} title="Edit User">
          {selectedUser && (
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleEditUser(selectedUser._id, {
                username: formData.get('username'),
                email: formData.get('email'),
                role: formData.get('role'),
                warehouse_id: formData.get('warehouse')
              });
            }}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                  <input
                    type="text"
                    name="username"
                    defaultValue={selectedUser.username}
                    required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={selectedUser.email}
                    required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                  <select 
                    name="role" 
                    defaultValue={selectedUser.role} 
                    required 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="manager">Manager</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Warehouse</label>
                  <select 
                    name="warehouse" 
                    defaultValue={selectedUser?.warehouse_id || ''} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Unassigned</option>
                    {warehouses.map(warehouse => (
                      <option key={warehouse._id} value={warehouse._id}>{warehouse.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditUserOpen(false)}
                    className="px-6"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="primary"
                    className="px-6 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </form>
          )}
        </Dialog>

        {/* Delete User Dialog */}
        <Dialog isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} title="Delete User">
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-800">Delete User</h3>
                <p className="mt-2 text-slate-600">
                  Are you sure you want to delete <span className="font-medium">{selectedUser.username}</span>? 
                  This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button 
                  variant="error" 
                  onClick={() => handleDeleteUser(selectedUser._id)}
                  className="px-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </Dialog>
      </div>
    </div>
  );
};

export default UsersPage;