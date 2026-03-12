import api from './api';

// ═══════════════════════════════════════════════
// CATEGORIES: Get All Categories
// GET /api/products/categories
// ═══════════════════════════════════════════════
export const getCategories = async () => {
  try {
    console.log('🔄 API Call: GET /products/categories');
    const response = await api.get('/products/categories');
    console.log('📦 Raw API response:', response.data);
    
    // The response should be: { categories: [...] }
    const categories = response.data.categories || [];
    console.log('✅ Extracted categories:', categories);
    
    if (!Array.isArray(categories)) {
      console.warn('⚠️ Categories is not an array:', typeof categories);
      return [];
    }
    
    if (categories.length === 0) {
      console.warn('⚠️ No categories returned from API');
    }
    
    return categories;
  } catch (error) {
    console.error('❌ Failed to fetch categories:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      fullError: error
    });
    return [];
  }
};

// ═══════════════════════════════════════════════
// BRAND: Create Product with Images
// POST /api/products
// ═══════════════════════════════════════════════
export const createProduct = async (productData) => {
  // If product has images, we need to send FormData
  // If just URLs, send as JSON
  
  if (productData.images && productData.images.length > 0) {
    // Check if any images are File objects (from upload) vs URLs
    const hasFileUploads = productData.images.some(img => img instanceof File);
    
    if (hasFileUploads) {
      // Use FormData for file uploads
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price', productData.price);
      formData.append('category', productData.category);
      formData.append('stock', productData.stock);
      formData.append('status', productData.status);
      
      // Add file objects
      productData.images.forEach((img, idx) => {
        if (img instanceof File) {
          formData.append('images', img);
        }
      });
      
      const response = await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    }
  }
  
  // Send as JSON (works for URLs)
  const response = await api.post('/products', productData);
  return response.data;
};

// ═══════════════════════════════════════════════
// CUSTOMER: Get All Published Products (Browse)
// GET /api/products?search=&category=&page=&limit=
// ═══════════════════════════════════════════════
export const getProducts = async (page = 1, limit = 10, filters = {}) => {
  const response = await api.get('/products', {
    params: { page, limit, ...filters }
  });
  return response.data;
};

// ═══════════════════════════════════════════════
// CUSTOMER: Get Single Product Detail
// GET /api/products/:id
// ═══════════════════════════════════════════════
export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// ═══════════════════════════════════════════════
// BRAND: Update Own Product
// PUT /api/products/:id
// ═══════════════════════════════════════════════
export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

// ═══════════════════════════════════════════════
// BRAND: Delete Own Product (Soft Delete)
// DELETE /api/products/:id
// ═══════════════════════════════════════════════
export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

// ═══════════════════════════════════════════════
// BRAND: Get Dashboard Summary
// GET /api/products/dashboard
// (Gets total, published, draft, archived counts + recent products)
// ═══════════════════════════════════════════════
export const getBrandDashboard = async () => {
  try {
    console.log('📊 Fetching brand dashboard from /products/dashboard');
    const response = await api.get('/products/dashboard');
    console.log('✅ Dashboard fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch dashboard:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      fullError: error
    });
    throw error;
  }
};

// ═══════════════════════════════════════════════
// BRAND: Get All Own Products (for BrandPage)
// Fetch from dashboard and extract summary
// ═══════════════════════════════════════════════
export const getBrandProducts = async () => {
  try {
    const response = await api.get('/products/seller/all');
    return response.data.products || [];
  } catch (error) {
    console.error('Failed to fetch brand products:', error);
    return [];
  }
};

// ═══════════════════════════════════════════════
// BRAND: Get ALL Own Products with Pagination
// GET /api/products/seller/all?page=1&limit=10&status=published
// (Gets all products for the brand with pagination)
// ═══════════════════════════════════════════════
export const getSellerProducts = async (page = 1, limit = 10, status = null) => {
  try {
    let url = `/products/seller/all?page=${page}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }
    console.log('🔍 Fetching seller products from:', url);
    const response = await api.get(url);
    console.log('✅ Seller products fetched:', response.data);
    return response.data; // { products, pagination }
  } catch (error) {
    console.error('❌ Seller products error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      fullError: error
    });
    throw error;
  }
};