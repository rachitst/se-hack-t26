export interface Product {
  _id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  quantity: number;
  minQuantity: number;
  unit: string;
  warehouse: string;
  status: 'active' | 'inactive' | 'low_stock';
  description?: string;
  expiryDate?: string;
  createdAt?: string;
  updatedAt?: string;
}