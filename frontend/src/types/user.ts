export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  warehouse_id: string | null;
  createdAt: string;
  updatedAt: string;
}