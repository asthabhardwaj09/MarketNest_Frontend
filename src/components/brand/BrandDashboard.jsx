import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getBrandProducts } from '../../services/productService';
import toast from 'react-hot-toast';

const BrandDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    archived: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getBrandProducts();
      setProducts(data);
      
      // Calculate stats
      setStats({
        total: data.length,
        published: data.filter(p => p.status === 'published').length,
        archived: data.filter(p => p.status === 'archived').length
      });
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter(p => p._id !== productId));
    toast.success('Product deleted');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Welcome, {user?.name}! 👋</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-blue-50 border-l-4 border-blue-600">
          <p className="text-gray-600">Total Products</p>
          <p className="text-4xl font-bold text-blue-600">{stats.total}</p>
        </div>

        <div className="card bg-green-50 border-l-4 border-green-600">
          <p className="text-gray-600">Published</p>
          <p className="text-4xl font-bold text-green-600">{stats.published}</p>
        </div>

        <div className="card bg-red-50 border-l-4 border-red-600">
          <p className="text-gray-600">Archived</p>
          <p className="text-4xl font-bold text-red-600">{stats.archived}</p>
        </div>
      </div>

      {/* Action Button */}
      <button className="btn-primary mb-6">+ Add New Product</button>

      {/* Products List */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Your Products</h2>
        {products.length === 0 ? (
          <p className="text-gray-500">No products yet. Create your first product!</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Product Name</th>
                <th className="text-left py-2">Price</th>
                <th className="text-left py-2">Stock</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="py-3">{product.name}</td>
                  <td className="py-3">${product.price}</td>
                  <td className="py-3">{product.stock}</td>
                  <td className="py-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      product.status === 'published' ? 'bg-green-100 text-green-800' :
                      product.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 space-x-2">
                    <button 
                      onClick={() => navigate(`/brand/edit/${product._id}`)}
                      className="text-blue-600 hover:underline"
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product._id)}
                      className="text-red-600 hover:underline"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BrandDashboard;