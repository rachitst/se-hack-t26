import React from 'react';
import { Table, TableRow, TableHead, TableBody, TableCell, TableHeaderCell } from '../ui/Table';
import { Product } from '../../types/product';

interface ProductTableProps {
  products: Product[];
  onProductClick?: (product: Product) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onProductClick }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Category</TableHeaderCell>
          <TableHeaderCell>Quantity</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {products.map((product) => (
          <TableRow 
            key={product._id}
            onClick={() => onProductClick?.(product)}
          >
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell>{product.quantity}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                product.quantity < product.min_quantity 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {product.quantity < product.min_quantity ? 'Low Stock' : 'In Stock'}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProductTable; 