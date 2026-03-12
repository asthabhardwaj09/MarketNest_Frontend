import api from './api';

export const createProduct = async (productData) => {
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

export const getBrandProducts = async () => {
  const response = await api.get('/products/brand/my-products');
  return response.data;
};