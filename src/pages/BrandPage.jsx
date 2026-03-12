import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getBrandDashboard, deleteProduct, getSellerProducts } from '../services/productService';
import toast from 'react-hot-toast';

const BrandPage = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    archived: 0,
    draft: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState(null); // null = all, 'published', 'draft', 'archived'

  // ═══════════════════════════════════════════════
  // CHECK AUTHORIZATION
  // ═══════════════════════════════════════════════

  useEffect(() => {
    if (!authLoading && user?.role !== 'Brand') {
      navigate('/');
    }
  }, [authLoading, user, navigate]);

  // ═══════════════════════════════════════════════
  // FETCH BRAND DASHBOARD (Stats) on Mount
  // ═══════════════════════════════════════════════

  useEffect(() => {
    if (user?.role === 'Brand') {
      fetchBrandDashboard();
    }
  }, [user]);

  // ═══════════════════════════════════════════════
  // FETCH ALL SELLER PRODUCTS when products tab opens
  // ═══════════════════════════════════════════════

  useEffect(() => {
    if (activeTab === 'products') {
      fetchSellerProducts();
    }
  }, [activeTab, page, statusFilter]);

  const fetchBrandDashboard = async () => {
    try {
      setLoading(true);
      console.log('🔄 Starting dashboard fetch...');
      const data = await getBrandDashboard();
      
      console.log('📊 Dashboard data received:', data);
      // Backend returns { summary: {...}, recentProducts: [...] }
      if (!data.summary) {
        console.warn('⚠️ No summary in dashboard response');
        setStats({
          total: 0,
          published: 0,
          archived: 0,
          draft: 0
        });
      } else {
        setStats(data.summary);
      }
      console.log('✅ Dashboard stats set:', data.summary);
    } catch (error) {
      console.error('❌ Dashboard fetch error:', error);
      toast.error(`Dashboard error: ${error.response?.data?.message || error.message || 'Failed to load dashboard'}`);
      // Set default stats on error
      setStats({
        total: 0,
        published: 0,
        archived: 0,
        draft: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSellerProducts = async () => {
    try {
      setLoading(true);
      console.log(`🔄 Fetching seller products - Page: ${page}, Status: ${statusFilter}`);
      const data = await getSellerProducts(page, 10, statusFilter);
      
      console.log('📦 Seller products response:', data);
      setProducts(data.products || []);
      setTotalProducts(data.pagination?.total || 0);
      setTotalPages(data.pagination?.totalPages || 0);
      
      console.log('✅ Seller products fetched:', {
        count: data.products?.length || 0,
        total: data.pagination?.total || 0,
        page,
        totalPages: data.pagination?.totalPages || 0
      });
    } catch (error) {
      console.error('❌ Seller products fetch error:', error);
      toast.error(`Products error: ${error.response?.data?.message || error.message || 'Failed to load products'}`);
      setProducts([]);
      setTotalProducts(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════
  // HANDLE DELETE PRODUCT
  // ═══════════════════════════════════════════════

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await deleteProduct(productId);
      toast.success('Product archived successfully');
      // Refresh both dashboard and products list
      fetchBrandDashboard();
      fetchSellerProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  };

  if (authLoading || (loading && activeTab === 'overview')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-lg text-neutral-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (user?.role !== 'Brand') {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 py-8">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-neutral-900">
                👋 Welcome, {user?.name}!
              </h1>
              <p className="text-neutral-600 mt-2">Manage your fashion brand and products</p>
            </div>
            <button
              onClick={() => navigate('/brand/create-product')}
              className="btn btn-primary"
            >
              ➕ Add New Product
            </button>
          </div>

          {/* Statistics */}
          <div className="grid-4">
            <div className="card bg-blue-50 border-l-4 border-blue-500">
              <p className="text-neutral-600 text-sm font-medium mb-1">Total Products</p>
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            </div>

            <div className="card bg-green-50 border-l-4 border-green-500">
              <p className="text-neutral-600 text-sm font-medium mb-1">Published</p>
              <p className="text-3xl font-bold text-green-600">{stats.published}</p>
            </div>

            <div className="card bg-yellow-50 border-l-4 border-yellow-500">
              <p className="text-neutral-600 text-sm font-medium mb-1">Draft</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.draft}</p>
            </div>

            <div className="card bg-red-50 border-l-4 border-red-500">
              <p className="text-neutral-600 text-sm font-medium mb-1">Archived</p>
              <p className="text-3xl font-bold text-red-600">{stats.archived}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-neutral-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-4 font-medium transition-all border-b-2 ${
              activeTab === 'overview'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => {
              setActiveTab('products');
              setPage(1); // Reset to page 1 when opening products tab
            }}
            className={`pb-3 px-4 font-medium transition-all border-b-2 ${
              activeTab === 'products'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            📦 Products ({stats.total})
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="card-elevated">
              <h2 className="text-xl font-bold mb-6">🚀 Quick Actions</h2>
              <div className="grid-2 md:grid-4">
                <button
                  onClick={() => navigate('/brand/create-product')}
                  className="card hover:shadow-lg text-center py-6 cursor-pointer transition-all"
                >
                  <div className="text-4xl mb-3">➕</div>
                  <p className="font-semibold text-neutral-900">Add Product</p>
                  <p className="text-sm text-neutral-600">Create new listing</p>
                </button>

                <button
                  onClick={() => setActiveTab('products')}
                  className="card hover:shadow-lg text-center py-6 cursor-pointer transition-all"
                >
                  <div className="text-4xl mb-3">📈</div>
                  <p className="font-semibold text-neutral-900">View Products</p>
                  <p className="text-sm text-neutral-600">Manage inventory</p>
                </button>

                <button className="card hover:shadow-lg text-center py-6 cursor-pointer transition-all">
                  <div className="text-4xl mb-3">📊</div>
                  <p className="font-semibold text-neutral-900">Analytics</p>
                  <p className="text-sm text-neutral-600">View statistics</p>
                </button>

                <button className="card hover:shadow-lg text-center py-6 cursor-pointer transition-all">
                  <div className="text-4xl mb-3">⚙️</div>
                  <p className="font-semibold text-neutral-900">Settings</p>
                  <p className="text-sm text-neutral-600">Brand preferences</p>
                </button>
              </div>
            </div>

            {/* Tips */}
            <div className="card-elevated bg-blue-50 border-l-4 border-blue-500">
              <h3 className="text-lg font-bold text-blue-900 mb-4">💡 Pro Tips</h3>
              <ul className="space-y-2 text-blue-800">
                <li>✅ Upload high-quality product images for better visibility</li>
                <li>✅ Keep product descriptions detailed and accurate</li>
                <li>✅ Update pricing regularly to stay competitive</li>
                <li>✅ Monitor your published products for better sales</li>
              </ul>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            {/* Status Filter Buttons */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => {
                  setStatusFilter(null);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded font-medium transition-all ${
                  statusFilter === null
                    ? 'bg-primary-600 text-white'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:border-primary-600'
                }`}
              >
                📋 All ({stats.total})
              </button>
              <button
                onClick={() => {
                  setStatusFilter('published');
                  setPage(1);
                }}
                className={`px-4 py-2 rounded font-medium transition-all ${
                  statusFilter === 'published'
                    ? 'bg-green-600 text-white'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:border-green-600'
                }`}
              >
                ✅ Published ({stats.published})
              </button>
              <button
                onClick={() => {
                  setStatusFilter('draft');
                  setPage(1);
                }}
                className={`px-4 py-2 rounded font-medium transition-all ${
                  statusFilter === 'draft'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:border-yellow-600'
                }`}
              >
                📝 Draft ({stats.draft})
              </button>
              <button
                onClick={() => {
                  setStatusFilter('archived');
                  setPage(1);
                }}
                className={`px-4 py-2 rounded font-medium transition-all ${
                  statusFilter === 'archived'
                    ? 'bg-red-600 text-white'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:border-red-600'
                }`}
              >
                🗂️ Archived ({stats.archived})
              </button>
            </div>

            {loading ? (
              <div className="card-elevated text-center py-12">
                <div className="text-4xl mb-4 animate-spin">⏳</div>
                <p className="text-neutral-600">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="card-elevated text-center py-12">
                <div className="text-5xl mb-4">📦</div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">No products found</h3>
                <p className="text-neutral-600 mb-6">
                  {statusFilter ? `No ${statusFilter} products` : 'Start by creating your first product'}
                </p>
                <button
                  onClick={() => navigate('/brand/create-product')}
                  className="btn btn-primary"
                >
                  ➕ Create Your First Product
                </button>
              </div>
            ) : (
              <div>
                <div className="card-elevated overflow-x-auto">
                  <table>
                    <thead>
                      <tr>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product._id}>
                          <td className="font-medium">{product.name}</td>
                          <td>{product.category?.name || 'N/A'}</td>
                          <td className="font-semibold">${product.price}</td>
                          <td>{product.stock} units</td>
                          <td>
                            <span
                              className={`badge ${
                                product.status === 'published'
                                  ? 'badge-success'
                                  : product.status === 'draft'
                                  ? 'badge-warning'
                                  : 'badge-error'
                              }`}
                            >
                              {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                            </span>
                          </td>
                          <td>
                            <div className="flex gap-2">
                              <button
                                onClick={() => navigate(`/brand/edit/${product._id}`)}
                                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product._id)}
                                className="text-error hover:text-red-700 font-medium text-sm"
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-8">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      className="px-6 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 font-medium"
                    >
                      ← Previous
                    </button>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`px-3 py-1 rounded font-medium transition-all ${
                            page === pageNum
                              ? 'bg-primary-600 text-white'
                              : 'border border-neutral-200 hover:border-primary-600'
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}
                    </div>
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                      className="px-6 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 font-medium"
                    >
                      Next →
                    </button>
                  </div>
                )}
                <p className="text-center text-neutral-600 mt-4 text-sm">
                  Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, totalProducts)} of {totalProducts} products
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandPage;
