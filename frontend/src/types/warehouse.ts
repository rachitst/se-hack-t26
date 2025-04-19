export interface Warehouse {
  _id: string;
  name: string;
  location: string;
  manager_id: string | null;
  industry_id: string;
  created_at: Date;
  updated_at: Date;
}