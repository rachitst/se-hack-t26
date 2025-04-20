export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'user' | 'manager' | 'staff';
  warehouse_id?: string;
  createdAt: string;
  updatedAt: string;
}