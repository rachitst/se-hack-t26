import React, { useState, useEffect } from 'react';
import { Package, AlertCircle, Clock, TrendingUp, Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { RootState, AppDispatch } from '../store/store';
import { 
  setProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  setLoading, 
  setError 
} from '../store/inventorySlice';
import { inventoryApi, warehouseApi } from '../services/api';
import { socketService } from '../services/socket';
import { Product } from '../types/product';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Dialog from '../components/ui/Dialog';
import { Table, TableBody, TableCell, TableHead, TableRow } from '../components/ui/Table';
import { IconButton } from '../components/ui/IconButton';
import ErrorBoundary from '../components/ErrorBoundary';

interface NewProductForm {
  name: string;
  price: string;
  quantity: string;
  minQuantity: string;
  category: string;
  description: string;
  sku: string;
  unit: string;
  warehouse: string;
  status: string;
}

const InventoryContent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const inventoryState = useSelector((state: RootState) => state.inventory);
  const products = Array.isArray(inventoryState.products) ? inventoryState.products : [];
  const { loading, error } = inventoryState;
  
  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<NewProductForm>({
    name: '',
    price: '',
    quantity: '',
    minQuantity: '',
    category: '',
    description: '',
    sku: '',
    unit: '',
    warehouse: '',
    status: ''
  });
  const [warehouses, setWarehouses] = useState<any[]>([]);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        dispatch(setLoading(true));
        const [productsResponse, warehousesResponse] = await Promise.all([
          inventoryApi.getProducts(),
          warehouseApi.getWarehouses()
        ]);
        
        if (productsResponse.data.success) {
          dispatch(setProducts(productsResponse.data.data || []));
        } else {
          dispatch(setError(productsResponse.data.message));
          toast.error(productsResponse.data.message);
        }

        if (warehousesResponse.data.success) {
          setWarehouses(warehousesResponse.data.data || []);
        }
      } catch (err) {
        const errorMessage = 'Failed to fetch initial data';
        dispatch(setError(errorMessage));
        toast.error(errorMessage);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchInitialData();
  }, [dispatch]);

  // Fetch products function
  const fetchProducts = async () => {
    try {
      const response = await inventoryApi.getProducts();
      if (response.data.success) {
        dispatch(setProducts(response.data.data || []));
      } else {
        dispatch(setError(response.data.message));
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      dispatch(setError('Failed to fetch products'));
      toast.error('Failed to fetch products');
    }
  };

  // Socket event handlers
  useEffect(() => {
    const handleProductCreate = async (newProduct: Product) => {
      try {
        await fetchProducts(); // Fetch latest data
        toast.success('New product added');
      } catch (err) {
        console.error('Error handling product create:', err);
      }
    };

    const handleProductUpdate = async (updatedProduct: Product) => {
      try {
        await fetchProducts(); // Fetch latest data
        toast.success('Product updated');
      } catch (err) {
        console.error('Error handling product update:', err);
      }
    };

    const handleProductDelete = async (deletedProduct: { _id: string }) => {
      try {
        await fetchProducts(); // Fetch latest data
        toast.success('Product deleted');
      } catch (err) {
        console.error('Error handling product delete:', err);
      }
    };

    const handleInventoryUpdate = async () => {
      try {
        await fetchProducts(); // Fetch latest data
        toast.success('Inventory updated');
      } catch (err) {
        console.error('Error handling inventory update:', err);
      }
    };

    // Subscribe to socket events
    socketService.subscribe('inventory:created', handleProductCreate);
    socketService.subscribe('inventory:updated', handleProductUpdate);
    socketService.subscribe('inventory:deleted', handleProductDelete);
    socketService.subscribe('inventory:updated', handleInventoryUpdate);

    // Initial fetch
    fetchProducts();

    // Set up periodic refresh
    const refreshInterval = setInterval(fetchProducts, 30000); // Refresh every 30 seconds

    return () => {
      // Cleanup socket subscriptions
      socketService.unsubscribe('inventory:created', handleProductCreate);
      socketService.unsubscribe('inventory:updated', handleProductUpdate);
      socketService.unsubscribe('inventory:deleted', handleProductDelete);
      socketService.unsubscribe('inventory:updated', handleInventoryUpdate);
      // Clear interval
      clearInterval(refreshInterval);
    };
  }, [dispatch]);

  // Calculate statistics with safe array operations
  const calculateStats = () => {
    try {
      return {
        totalItems: products.reduce((sum, product) => sum + (product?.quantity || 0), 0),
        totalValue: products.reduce((sum, product) => sum + ((product?.price || 0) * (product?.quantity || 0)), 0),
        lowStockCount: products.filter(p => (p?.quantity || 0) < (p?.minQuantity || 0)).length,
        expiringCount: products.filter(p => 
          p?.expiryDate && new Date(p.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        ).length
      };
    } catch (err) {
      console.error('Error calculating stats:', err);
      return {
        totalItems: 0,
        totalValue: 0,
        lowStockCount: 0,
        expiringCount: 0
      };
    }
  };

  const { totalItems, totalValue, lowStockCount, expiringCount } = calculateStats();

  // Filter products with safe array operations
  const getFilteredProducts = () => {
    try {
      return products.filter((product) => {
        if (!product) return false;
        const matchesSearch = (
          (product.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.sku || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
        const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
      });
    } catch (err) {
      console.error('Error filtering products:', err);
      return [];
    }
  };

  const filteredProducts = getFilteredProducts();

  // Product status badge
  const getStatusBadge = (product: Product) => {
    if (!product.quantity) {
      return <Badge variant="error">Out of Stock</Badge>;
    } else if ((product.quantity || 0) < (product.minQuantity || 0)) {
      return <Badge variant="warning">Low Stock</Badge>;
    } else if (product.expiryDate && new Date(product.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) {
      return <Badge variant="error">Expiring Soon</Badge>;
    }
    return <Badge variant="success">In Stock</Badge>;
  };

  // Handlers
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.quantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const productData = {
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        quantity: parseInt(newProduct.quantity),
        minQuantity: newProduct.minQuantity ? parseInt(newProduct.minQuantity) : undefined,
        category: newProduct.category,
        description: newProduct.description,
        sku: newProduct.sku,
        unit: newProduct.unit,
        warehouse: newProduct.warehouse,
        status: newProduct.status
      };

      const response = await inventoryApi.createProduct(productData);
      if (response.data) {
        dispatch(addProduct(response.data));
        socketService.emit('inventory:create', response.data);
        setIsAddProductOpen(false);
        setNewProduct({
          name: '',
          price: '',
          quantity: '',
          minQuantity: '',
          category: '',
          description: '',
          sku: '',
          unit: '',
          warehouse: '',
          status: ''
        });
        toast.success('Product added successfully');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
    }
  };

  const handleEditProduct = async () => {
    if (!selectedProduct) return;
    try {
      const response = await inventoryApi.updateProduct(selectedProduct._id, selectedProduct);
      if (response.data) {
        dispatch(updateProduct(response.data));
        socketService.emit('inventory:update', response.data);
        setIsEditProductOpen(false);
        setSelectedProduct(null);
        toast.success('Product updated successfully');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  const handleDeleteProduct = async (productToDelete: Product) => {
    if (!productToDelete) return;
    try {
      const response = await inventoryApi.deleteProduct(productToDelete._id);
      if (response.data) {
        dispatch(deleteProduct(productToDelete._id));
        socketService.emit('inventory:delete', { _id: productToDelete._id });
        setIsDeleteDialogOpen(false);
        setSelectedProduct(null);
        toast.success('Product deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const loadDemoData = () => {
    const defaultWarehouse = warehouses.length > 0 ? warehouses[0]._id : '';
    setNewProduct({
      name: 'Sample Product',
      sku: 'DEMO-' + Math.floor(Math.random() * 10000),
      category: 'Electronics',
      price: '99.99',
      quantity: '50',
      minQuantity: '10',
      unit: 'pcs',
      warehouse: defaultWarehouse,
      status: 'active',
      description: 'This is a sample product description',
    });
  };

  // Loading and error states
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-center">
          <p className="text-lg font-medium">Error: {error}</p>
          <p className="text-sm mt-2">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Inventory Management</h1>
            <p className="text-slate-500 mt-2">Monitor and manage your inventory across all warehouses</p>
          </div>
          <Button 
            variant="primary" 
            leftIcon={<Plus size={18} />}
            onClick={() => setIsAddProductOpen(true)}
            className="w-full lg:w-auto bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
          >
            Add New Product
          </Button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Items</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">{totalItems}</p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl">
                <Package className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Value</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">
                  ${totalValue.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Low Stock Items</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">{lowStockCount}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl">
                <AlertCircle className="w-8 h-8 text-amber-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Expiring Soon</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">{expiringCount}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-xl">
                <Clock className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products by name or SKU..."
                  className="pl-12 pr-4 py-3 w-full border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm"
              >
                <option value="all">All Categories</option>
                {Array.from(new Set(products.map(p => p.category))).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm"
              >
                <option value="all">All Status</option>
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
                            <span className="text-indigo-600 font-semibold">
                              {product.name?.charAt(0) || '?'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-slate-800">{product.name || 'Unnamed Product'}</div>
                          <div className="text-sm text-slate-500">
                            ${(product.price || 0).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.sku || 'N/A'}</TableCell>
                    <TableCell>{product.category || 'Uncategorized'}</TableCell>
                    <TableCell>{product.quantity || 0} {product.unit || 'units'}</TableCell>
                    <TableCell>{getStatusBadge(product)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <IconButton
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsEditProductOpen(true);
                          }}
                          title="Edit product"
                        >
                          <Edit2 size={18} />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsDeleteDialogOpen(true);
                          }}
                          title="Delete product"
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Add Product Dialog */}
        <Dialog 
          isOpen={isAddProductOpen} 
          onClose={() => {
            setIsAddProductOpen(false);
            setNewProduct({
              name: '',
              price: '',
              quantity: '',
              minQuantity: '',
              category: '',
              description: '',
              sku: '',
              unit: '',
              warehouse: '',
              status: ''
            });
          }}
          title="Add New Product"
        >
          <form onSubmit={(e) => {
            e.preventDefault();
            handleAddProduct();
          }}>
            <div className="space-y-6">
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={loadDemoData}
                  className="text-sm"
                >
                  Load Demo Data
                </Button>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                <input
                  type="number"
                  required
                  min="0"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={newProduct.quantity}
                  onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary"
                  className="px-6 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
                >
                  Add Product
                </Button>
              </div>
            </div>
          </form>
        </Dialog>

        {/* Edit Product Dialog */}
        <Dialog 
          isOpen={isEditProductOpen} 
          onClose={() => {
            setIsEditProductOpen(false);
            setSelectedProduct(null);
          }}
          title="Edit Product"
        >
          {selectedProduct && (
            <form onSubmit={(e) => {
              e.preventDefault();
              handleEditProduct();
            }}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={selectedProduct.name}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={selectedProduct.price}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, price: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={selectedProduct.quantity}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, quantity: parseInt(e.target.value) })}
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditProductOpen(false);
                      setSelectedProduct(null);
                    }}
                    className="px-6"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="primary"
                    className="px-6 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </form>
          )}
        </Dialog>

        {/* Delete Product Dialog */}
        <Dialog 
          isOpen={isDeleteDialogOpen} 
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setSelectedProduct(null);
          }}
          title="Delete Product"
        >
          {selectedProduct && (
            <div className="space-y-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-800">Delete Product</h3>
                <p className="mt-2 text-slate-600">
                  Are you sure you want to delete <span className="font-medium">{selectedProduct.name}</span>? 
                  This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsDeleteDialogOpen(false);
                    setSelectedProduct(null);
                  }}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button 
                  variant="error" 
                  onClick={() => handleDeleteProduct(selectedProduct)}
                  className="px-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </Dialog>
      </div>
    </div>
  );
};

const Inventory: React.FC = () => {
  return (
    <ErrorBoundary>
      <InventoryContent />
    </ErrorBoundary>
  );
};

export default Inventory;
