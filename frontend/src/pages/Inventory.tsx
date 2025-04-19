import React, { useState, useEffect } from 'react';
import { Package, AlertCircle, Clock, TrendingUp, Plus, Search, Filter, ChevronDown, Edit2, Trash2 } from 'lucide-react';
import { inventoryApi } from '../services/api';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Dialog from '../components/ui/Dialog';
import { Product } from '../types/product';

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await inventoryApi.getProducts();
        if (response.data) {
          setProducts(response.data);
        } else {
          setError('No products found');
        }
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setError(err.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const totalItems = products.reduce((sum, product) => sum + (product.quantity || 0), 0);
  const totalValue = products.reduce((sum, product) => sum + ((product.price || 0) * (product.quantity || 0)), 0);
  const lowStockCount = products.filter(p => (p.quantity || 0) < (p.minQuantity || 0)).length;
  const expiringCount = products.filter(p => p.expiryDate && new Date(p.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length;

  const filteredProducts = products.filter(product => {
    const matchesSearch = (
      (product.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.sku || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || (
      statusFilter === 'low-stock' ? (product.quantity || 0) < (product.minQuantity || 0) :
      statusFilter === 'in-stock' ? (product.quantity || 0) >= (product.minQuantity || 0) :
      true
    );
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (product: Product) => {
    if (!product.quantity) {
      return <Badge variant="error">Out of Stock</Badge>;
    } else if ((product.quantity || 0) < (product.minQuantity || 0)) {
      return <Badge variant="warning">Low Stock</Badge>;
    } else if (product.expiryDate && new Date(product.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) {
      return <Badge variant="error">Expiring Soon</Badge>;
    } else {
      return <Badge variant="success">In Stock</Badge>;
    }
  };

  const handleAddProduct = async (productData: any) => {
    try {
      const response = await inventoryApi.createProduct(productData);
      if (response.data) {
        setProducts([...products, response.data]);
        setIsAddProductOpen(false);
      } else {
        setError('Failed to add product');
      }
    } catch (err) {
      setError('Failed to add product');
      console.error(err);
    }
  };

  const handleEditProduct = async (id: string, productData: any) => {
    try {
      const response = await inventoryApi.updateProduct(id, productData);
      if (response.data) {
        setProducts(products.map(product => product._id === id ? response.data : product));
        setIsEditProductOpen(false);
      } else {
        setError('Failed to update product');
      }
    } catch (err) {
      setError('Failed to update product');
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await inventoryApi.deleteProduct(id);
      setProducts(products.filter(product => product._id !== id));
      setIsDeleteDialogOpen(false);
    } catch (err) {
      setError('Failed to delete product');
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-red-600 text-center">
        <p className="text-lg font-medium">Error: {error}</p>
        <p className="text-sm mt-2">Please try refreshing the page</p>
      </div>
    </div>
  );

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
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {product.sku || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {product.category || 'Uncategorized'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {product.quantity || 0} {product.unit || 'units'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(product)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsEditProductOpen(true);
                          }}
                          className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit product"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete product"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Product Dialog */}
        <Dialog isOpen={isAddProductOpen} onClose={() => setIsAddProductOpen(false)} title="Add New Product">
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleAddProduct({
              name: formData.get('name'),
              sku: formData.get('sku'),
              category: formData.get('category'),
              price: Number(formData.get('price')),
              quantity: Number(formData.get('quantity')),
              minQuantity: Number(formData.get('minQuantity')),
              unit: formData.get('unit'),
              expiryDate: formData.get('expiryDate')
            });
          }}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
                <input
                  type="text"
                  name="sku"
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter SKU"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter category"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  required
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter price"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  required
                  min="0"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter quantity"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Minimum Quantity</label>
                <input
                  type="number"
                  name="minQuantity"
                  required
                  min="0"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter minimum quantity"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
                <input
                  type="text"
                  name="unit"
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter unit (e.g., pcs, kg, etc.)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date (Optional)</label>
                <input
                  type="date"
                  name="expiryDate"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
        <Dialog isOpen={isEditProductOpen} onClose={() => setIsEditProductOpen(false)} title="Edit Product">
          {selectedProduct && (
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleEditProduct(selectedProduct._id, {
                name: formData.get('name'),
                sku: formData.get('sku'),
                category: formData.get('category'),
                price: Number(formData.get('price')),
                quantity: Number(formData.get('quantity')),
                minQuantity: Number(formData.get('minQuantity')),
                unit: formData.get('unit'),
                expiryDate: formData.get('expiryDate')
              });
            }}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={selectedProduct.name}
                    required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
                  <input
                    type="text"
                    name="sku"
                    defaultValue={selectedProduct.sku}
                    required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    name="category"
                    defaultValue={selectedProduct.category}
                    required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
                  <input
                    type="number"
                    name="price"
                    defaultValue={selectedProduct.price}
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    defaultValue={selectedProduct.quantity}
                    required
                    min="0"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Minimum Quantity</label>
                  <input
                    type="number"
                    name="minQuantity"
                    defaultValue={selectedProduct.minQuantity}
                    required
                    min="0"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
                  <input
                    type="text"
                    name="unit"
                    defaultValue={selectedProduct.unit}
                    required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date (Optional)</label>
                  <input
                    type="date"
                    name="expiryDate"
                    defaultValue={selectedProduct.expiryDate?.split('T')[0]}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditProductOpen(false)}
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
        <Dialog isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} title="Delete Product">
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
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button 
                  variant="error" 
                  onClick={() => handleDeleteProduct(selectedProduct._id)}
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

export default Inventory;