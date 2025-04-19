import { User } from './user';
import { Industry } from './industry';
import { Warehouse } from './warehouse';

declare module '../data/data' {
  export const users: User[];
  export const industries: Industry[];
  export const warehouses: Warehouse[];
}

export const users: Array<{
  _id: string;
  name: string;
  email: string;
  role: string;
  password: string;
  industry_id: string;
  warehouse_id?: string;
  created_at: Date;
  updated_at: Date;
}>; 