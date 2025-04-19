export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AlertCategory = 'stock' | 'expiry' | 'security' | 'system' | 'performance';

export interface Alert {
  id: string;
  title: string;
  message: string;
  category: AlertCategory;
  severity: AlertSeverity;
  warehouse: string;
  product?: string;
  timestamp: string;
  read: boolean;
  actionRequired: boolean;
}