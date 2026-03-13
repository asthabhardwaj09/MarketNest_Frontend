import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getProducts, getCategories } from '../services/productService';
import toast from 'react-hot-toast';

const CustomerPage = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: 0,
    maxPrice: 10000,
  });

  const [showMobileFilter, setShowMobileFilter] = useState(false);



  useEffect(() => {
    if (!authLoading && user?.role !== 'Customer') {
      navigate('/');
    }
  }, [authLoading, user, navigate]);



  useEffect(() => {
    const fetchCats = async () => {
      try {
        console.log('Fetching categories...');
        const cats = await getCategories();
        console.log('Categories fetched:', cats);
        setCategories(cats || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      }
    };
    fetchCats();
  }, []);


  useEffect(() => {
    if (user?.role === 'Customer') {
      fetchProducts();
    }
  }, [user, page, filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('Fetching products with filters:', filters);
      const data = await getProducts(page, 12, filters);
      console.log('Products response:', {
        productsCount: data.products?.length || 0,
        total: data.pagination?.total || 0,
        filters
      });
      setProducts(data.products || []);
      setTotalProducts(data.pagination?.total || 0);
    } catch (error) {
      console.error('Error fetching products:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        filters
      });
      toast.error(`Error: ${error.response?.data?.message || error.message || 'Failed to load products'}`);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };


  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setFilters({ ...filters, search: searchTerm });
    setPage(1);
  };

  const handleCategoryChange = (category) => {
    setFilters({ ...filters, category });
    setPage(1);
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseInt(value) || 0;
    setFilters({ ...filters, [name]: numValue });
    setPage(1);
  };



  const addToCart = (product) => {
    const existingItem = cart.find((item) => item._id === product._id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    toast.success(' Added to cart!');
  };

  const toggleWishlist = (product) => {
    const isWishlisted = wishlist.find((item) => item._id === product._id);
    if (isWishlisted) {
      setWishlist(wishlist.filter((item) => item._id !== product._id));
      toast.success('Removed from wishlist');
    } else {
      setWishlist([...wishlist, product]);
      toast.success('Added to wishlist!');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-lg text-neutral-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (user?.role !== 'Customer') {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50">

      <div className="bg-white border-b border-neutral-200 py-6 sticky top-16 z-40">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Marketplace</h1>
              <p className="text-neutral-600">Browse latest fashion collections</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowMobileFilter(!showMobileFilter)}
                className="md:hidden btn btn-secondary"
              >
                Filters
              </button>
              <button className="btn btn-primary relative">
                Cart ({cart.length})
              </button>
              <button className="btn btn-secondary relative">
                Wishlist ({wishlist.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">

          <div
            className={`w-64 ${showMobileFilter ? 'block' : 'hidden'
              } md:block`}
          >
            <div className="card-elevated sticky top-32 space-y-6">
              <h3 className="text-lg font-bold text-neutral-900">Filters</h3>
              <div>
                <label className="block font-medium text-neutral-800 mb-2">Search Products</label>
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={filters.search}
                  onChange={handleSearchChange}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-800 mb-3">Category</label>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryChange('')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all ${filters.category === ''
                        ? 'bg-primary-100 text-primary-700 font-medium'
                        : 'hover:bg-neutral-100'
                      }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => handleCategoryChange(cat._id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all ${filters.category === cat._id
                          ? 'bg-primary-100 text-primary-700 font-medium'
                          : 'hover:bg-neutral-100'
                        }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-800 mb-3">Price Range</label>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm text-neutral-600">Min: ${filters.minPrice}</label>
                    <input
                      type="range"
                      name="minPrice"
                      min="0"
                      max="10000"
                      step="100"
                      value={filters.minPrice}
                      onChange={handlePriceChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-neutral-600">Max: ${filters.maxPrice}</label>
                    <input
                      type="range"
                      name="maxPrice"
                      min="0"
                      max="10000"
                      step="100"
                      value={filters.maxPrice}
                      onChange={handlePriceChange}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setFilters({
                    search: '',
                    category: '',
                    minPrice: 0,
                    maxPrice: 10000,
                  });
                  setPage(1);
                }}
                className="btn btn-secondary w-full"
              >
                Clear Filters
              </button>
            </div>
          </div>

          <div className="flex-1">
            {products.length === 0 ? (
              <div className="card-elevated text-center py-12">
                <div className="text-5xl mb-4">📭</div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">No products found</h3>
                <p className="text-neutral-600">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <p className="text-neutral-600 mb-6">
                  Showing {(page - 1) * 12 + 1}-{Math.min(page * 12, totalProducts)} of{' '}
                  {totalProducts} products
                </p>

                <div className="grid-auto mb-8">
                  {products.map((product) => (
                    <div key={product._id} className="product-card">
                      <div className="product-image">
                        <img
                          src={product.images?.[0] || 'https://via.placeholder.com/300?text=No+Image'}
                          alt={product.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/300?text=Image+Error';
                          }}
                        />
                        {product.discount && (
                          <span className="product-badge">{product.discount}% OFF</span>
                        )}
                      </div>
                      <div className="product-content">
                        <p className="product-brand">{product.category?.name || 'Uncategorized'}</p>
                        <h3 className="product-name">{product.name}</h3>
                        <div className="product-price">
                          <span className="product-price-current">${product.price}</span>
                          {product.originalPrice && (
                            <>
                              <span className="product-price-original">${product.originalPrice}</span>
                              <span className="product-discount">Save 20%</span>
                            </>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => addToCart(product)}
                            className="btn btn-primary flex-1"
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={() => toggleWishlist(product)}
                            className={`btn ${wishlist.find((item) => item._id === product._id)
                                ? 'btn-primary'
                                : 'btn-secondary'
                              }`}
                          >

                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>


                <div className="pagination">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="pagination-btn"
                  >
                    ← Previous
                  </button>
                  <span className="px-4 py-2 text-neutral-700">
                    Page {page}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page * 12 >= totalProducts}
                    className="pagination-btn"
                  >
                    Next →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;
