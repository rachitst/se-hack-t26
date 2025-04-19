import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API response:', {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('API error:', {
      status: error.response?.status,
      message: error.message,
      response: error.response?.data,
    });
    return Promise.reject(error);
  }
);

// User API calls
export const userApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/users/login', credentials),
  register: (userData: any) =>
    api.post('/users/register', userData),
  getUsers: () => api.get('/users'),
  getUser: (id: string) => api.get(`/users/${id}`),
  updateUser: (id: string, userData: any) =>
    api.put(`/users/${id}`, userData),
  deleteUser: (id: string) => api.delete(`/users/${id}`),
};

// Warehouse API calls
export const warehouseApi = {
  getWarehouses: () => api.get('/warehouses'),
  getWarehouse: (id: string) => api.get(`/warehouses/${id}`),
  createWarehouse: (warehouseData: any) =>
    api.post('/warehouses', warehouseData),
  updateWarehouse: (id: string, warehouseData: any) =>
    api.put(`/warehouses/${id}`, warehouseData),
  deleteWarehouse: (id: string) => api.delete(`/warehouses/${id}`),
};

// Inventory API calls
export const inventoryApi = {
  // Product endpoints
  getProducts: () => api.get('/inventory/products'),
  getProduct: (id: string) => api.get(`/inventory/products/${id}`),
  createProduct: (data: any) => api.post('/inventory/products', data),
  updateProduct: (id: string, data: any) => api.put(`/inventory/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/inventory/products/${id}`),

  // Inventory endpoints
  getInventory: () => api.get('/inventory'),
  getInventoryByWarehouse: (warehouseId: string) =>
    api.get(`/inventory/warehouse/${warehouseId}`),
  getInventoryItem: (id: string) => api.get(`/inventory/${id}`),
  createInventoryItem: (itemData: any) =>
    api.post('/inventory', itemData),
  updateInventoryItem: (id: string, itemData: any) =>
    api.put(`/inventory/${id}`, itemData),
  updateQuantity: (id: string, quantity: number) =>
    api.patch(`/inventory/${id}/quantity`, { quantity }),
  deleteInventoryItem: (id: string) => api.delete(`/inventory/${id}`),
};

// Report API calls
export const reportApi = {
  getInventorySummary: () => api.get('/reports/inventory-summary'),
  getLowStockItems: () => api.get('/reports/low-stock'),
  getWarehouseUtilization: () => api.get('/reports/warehouse-utilization'),
  getMovementHistory: (params: { startDate?: string; endDate?: string; warehouseId?: string }) =>
    api.get('/reports/movement-history', { params }),
};

// Settings API calls
export const settingsApi = {
  getSettings: () => api.get('/settings'),
  updateSettings: (settings: any) => api.put('/settings', settings),
  getSetting: (key: string) => api.get(`/settings/${key}`),
  updateSetting: (key: string, value: any) =>
    api.put(`/settings/${key}`, { value }),
};

export default api; 