import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../../services/productService';
import SearchBar from './SearchBar';
import FilterSidebar from './FilterSidebar';
import toast from 'react-hot-toast';

const FALLBACK_IMG = 'https://placehold.co/400x300?text=No+Image';

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: 0,
    maxPrice: 10000
  });
  const [totalProducts, setTotalProducts] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [page, filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts(page, 12, filters);
      setProducts(data.products || []);
      setTotalProducts(data.pagination?.total || 0);
      console.log('✅ Products fetched:', data);
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    setFilters({ ...filters, search: searchTerm });
    setPage(1);
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
    setPage(1);
  };

  return (
    <div className="flex gap-6 p-6 max-w-7xl mx-auto">
      <FilterSidebar onFilterChange={handleFilterChange} />

      <div className="flex-1">
        <SearchBar onSearch={handleSearch} />

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="animate-spin text-4xl mb-4">⏳</div>
              <p>Loading products...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">📭 No products found</p>
            <p className="text-gray-400">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {products.map(product => (
                <div
                  key={product._id}
                  className="card hover:shadow-lg cursor-pointer transition"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  {/* Product Image */}
                  <div className="relative w-full h-48 bg-gray-100 rounded mb-3 overflow-hidden">
                    <img
                      src={product.images?.[0] || FALLBACK_IMG}   
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;                   // ✅ Prevent infinite loop
                        e.target.src = FALLBACK_IMG;
                      }}
                    />
                  </div>

                  {/* Product Info */}
                  <h3 className="font-bold text-lg mb-1 truncate">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    📂 {product.category?.name || product.category || 'Uncategorized'}
                  </p>
                  <p className="text-2xl font-bold text-blue-600 mb-3">₹{product.price}</p>

                  {/* Stock Info */}
                  {product.stock > 0 ? (
                    <p className="text-green-600 text-sm mb-3">✅ In Stock ({product.stock})</p>
                  ) : (
                    <p className="text-red-600 text-sm mb-3">❌ Out of Stock</p>
                  )}

                  <button className="btn-primary w-full">👁️ View Details</button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-4 py-8">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-6 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                ← Previous
              </button>
              <span className="px-6 py-2 flex items-center font-semibold">
                Page {page}
              </span>
              <button
                disabled={page * 12 >= totalProducts}
                onClick={() => setPage(page + 1)}
                className="px-6 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
