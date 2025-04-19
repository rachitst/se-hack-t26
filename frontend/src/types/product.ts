export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  warehouse: string;
  location: string;
  minStock: number;
  maxStock: number;
  unitCost: number;
  totalValue: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'expiring';
  expiryDate?: string;
  lastReceived: string;
  supplier: string;
}