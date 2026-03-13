import api from './api';

export const getCategories = async () => {
  try {
    console.log('API Call: GET /products/categories');
    const response = await api.get('/products/categories');
    console.log(' Raw API response:', response.data);
    

    const categories = response.data.categories || [];
    console.log('Extracted categories:', categories);
    
    if (!Array.isArray(categories)) {
      console.warn(' Categories is not an array:', typeof categories);
      return [];
    }
    
    if (categories.length === 0) {
      console.warn(' No categories returned from API');
    }
    
    return categories;
  } catch (error) {
    console.error(' Failed to fetch categories:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      fullError: error
    });
    return [];
  }
};

export const createProduct = async (productData) => {

  
  if (productData.images && productData.images.length > 0) {
   
    const hasFileUploads = productData.images.some(img => img instanceof File);
    
    if (hasFileUploads) {
      
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price', productData.price);
      formData.append('category', productData.category);
      formData.append('stock', productData.stock);
      formData.append('status', productData.status);
      
    
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

  const response = await api.post('/products', productData);
  return response.data;
};


export const getProducts = async (page = 1, limit = 10, filters = {}) => {
  const response = await api.get('/products', {
    params: { page, limit, ...filters }
  });
  return response.data;
};


export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};


export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};


export const getBrandDashboard = async () => {
  try {
    console.log('Fetching brand dashboard from /products/dashboard');
    const response = await api.get('/products/dashboard');
    console.log('Dashboard fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch dashboard:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      fullError: error
    });
    throw error;
  }
};

export const getBrandProducts = async () => {
  try {
    const response = await api.get('/products/seller/all');
    return response.data.products || [];
  } catch (error) {
    console.error('Failed to fetch brand products:', error);
    return [];
  }
};


export const getSellerProducts = async (page = 1, limit = 10, status = null) => {
  try {
    let url = `/products/seller/all?page=${page}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }
    console.log('Fetching seller products from:', url);
    const response = await api.get(url);
    console.log('Seller products fetched:', response.data);
    return response.data; 
  } catch (error) {
    console.error('Seller products error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      fullError: error
    });
    throw error;
  }
};