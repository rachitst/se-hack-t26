import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../types/product';

interface InventoryState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: InventoryState = {
  products: [],
  loading: false,
  error: null,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.loading = false;
      state.error = null;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
      state.error = null;
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(p => p._id === action.payload._id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
      state.error = null;
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(p => p._id !== action.payload);
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  setLoading,
  setError,
} = inventorySlice.actions;

export default inventorySlice.reducer; 