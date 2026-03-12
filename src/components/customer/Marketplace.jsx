import React, { useState, useEffect } from 'react';
import { getProducts } from '../../services/productService';
import SearchBar from './SearchBar';
import FilterSidebar from './FilterSidebar';
import toast from 'react-hot-toast';

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

  useEffect(() => {
    fetchProducts();
  }, [page, filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts(page, 12, filters);
      setProducts(data.products);
      setTotalProducts(data.total);
    } catch (error) {
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
          <div className="flex justify-center items-center h-96">Loading...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No products found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {products.map(product => (
                <div key={product._id} className="card hover:shadow-lg cursor-pointer transition">
                  <img 
                    src={product.images[0] || 'https://via.placeholder.com/200'} 
                    alt={product.name}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                  <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{product.category}</p>
                  <p className="text-2xl font-bold text-blue-600">${product.price}</p>
                  <button className="btn-primary w-full mt-3">View Details</button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2">
              <button 
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">Page {page}</span>
              <button 
                disabled={page * 12 >= totalProducts}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Marketplace;