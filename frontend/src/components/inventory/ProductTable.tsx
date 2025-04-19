import React, { useState } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from '../ui/Table';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Product } from '../../types/product';
import { Search, Filter, ChevronDown, Plus, Edit, Trash2 } from 'lucide-react';

interface ProductTableProps {
  products: Product[];
}

const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Product>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in-stock':
        return <Badge variant="success">In Stock</Badge>;
      case 'low-stock':
        return <Badge variant="warning">Low Stock</Badge>;
      case 'out-of-stock':
        return <Badge variant="error">Out of Stock</Badge>;
      case 'expiring':
        return <Badge variant="error">Expiring Soon</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const sortedProducts = [...products]
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

  const handleSort = (field: keyof Product) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative max-w-md w-full">
          <input
            type="text"
            placeholder="Search products..."
            className="pl-10 pr-4 py-2 w-full border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            leftIcon={<Filter size={16} />}
            rightIcon={<ChevronDown size={16} />}
          >
            Filter
          </Button>
          <Button
            variant="primary"
            leftIcon={<Plus size={16} />}
          >
            Add Product
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell 
                className="cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Product
                  {sortField === 'name' && (
                    <ChevronDown 
                      size={16} 
                      className={`ml-1 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} 
                    />
                  )}
                </div>
              </TableHeaderCell>
              <TableHeaderCell>SKU</TableHeaderCell>
              <TableHeaderCell>Category</TableHeaderCell>
              <TableHeaderCell 
                className="cursor-pointer"
                onClick={() => handleSort('quantity')}
              >
                <div className="flex items-center">
                  Quantity
                  {sortField === 'quantity' && (
                    <ChevronDown 
                      size={16} 
                      className={`ml-1 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} 
                    />
                  )}
                </div>
              </TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Location</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="font-medium">{product.name}</div>
                </TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>{getStatusBadge(product.status)}</TableCell>
                <TableCell>
                  <div className="text-sm">{product.warehouse}</div>
                  <div className="text-xs text-neutral-500">{product.location}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-neutral-500 hover:text-primary-600 rounded-md hover:bg-neutral-100">
                      <Edit size={16} />
                    </button>
                    <button className="p-1 text-neutral-500 hover:text-error-600 rounded-md hover:bg-neutral-100">
                      <Trash2 size={16} />
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

export default ProductTable;