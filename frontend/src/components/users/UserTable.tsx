import React, { useState } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from '../ui/Table';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { User } from '../../types/user';
import { Search, Plus, Edit, Trash2, MoreVertical } from 'lucide-react';

interface UserTableProps {
  users: User[];
}

const UserTable: React.FC<UserTableProps> = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="primary">Admin</Badge>;
      case 'manager':
        return <Badge variant="info">Manager</Badge>;
      case 'staff':
        return <Badge variant="default">Staff</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'inactive':
        return <Badge variant="error">Inactive</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative max-w-md w-full">
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 w-full border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus size={16} />}
        >
          Add User
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>User</TableHeaderCell>
              <TableHeaderCell>Role</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Warehouse Access</TableHeaderCell>
              <TableHeaderCell>Last Login</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      {user.avatar ? (
                        <img
                          className="h-10 w-10 rounded-full"
                          src={user.avatar}
                          alt={`${user.name}'s avatar`}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                          {user.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-neutral-900">{user.name}</div>
                      <div className="text-sm text-neutral-500">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell>
                  {user.warehouseAccess.length > 0 ? (
                    user.warehouseAccess.length === 5 ? (
                      <span>All Warehouses</span>
                    ) : (
                      <span>{user.warehouseAccess.length} Warehouses</span>
                    )
                  ) : (
                    <span className="text-neutral-400">None</span>
                  )}
                </TableCell>
                <TableCell>
                  {user.lastLogin ? (
                    new Date(user.lastLogin).toLocaleString()
                  ) : (
                    <span className="text-neutral-400">Never</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-neutral-500 hover:text-primary-600 rounded-md hover:bg-neutral-100">
                      <Edit size={16} />
                    </button>
                    <button className="p-1 text-neutral-500 hover:text-error-600 rounded-md hover:bg-neutral-100">
                      <Trash2 size={16} />
                    </button>
                    <button className="p-1 text-neutral-500 hover:text-neutral-700 rounded-md hover:bg-neutral-100">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserTable;