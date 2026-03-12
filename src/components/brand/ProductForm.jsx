import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct, updateProduct } from '../../services/productService';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ProductForm = ({ productData = null, mode = 'create' }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState(productData?.images || []);
  const [imageMode, setImageMode] = useState('upload'); // 'upload' or 'url'
  const [urlInput, setUrlInput] = useState('');

  // Redirect if not a Brand user
  useEffect(() => {
    if (user && user.role !== 'Brand') {
      navigate('/');
    }
  }, [user, navigate]);
  
  const [formData, setFormData] = useState({
    name: productData?.name || '',
    description: productData?.description || '',
    price: productData?.price || '',
    category: productData?.category || 'Men',
    stock: productData?.stock || '',
    status: productData?.status || 'draft'
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);

    try {
      for (let file of files) {
        const formDataCopy = new FormData();
        formDataCopy.append('file', file);
        formDataCopy.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: 'POST', body: formDataCopy }
        );

        const data = await response.json();
        setImages([...images, data.secure_url]);
        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    toast.success('Image removed');
  };

  const addImageFromUrl = () => {
    if (!urlInput.trim()) {
      return toast.error('Please enter an image URL');
    }

    // Basic URL validation
    try {
      new URL(urlInput);
    } catch {
      return toast.error('Invalid URL format');
    }

    setImages([...images, urlInput.trim()]);
    setUrlInput('');
    toast.success('Image URL added successfully');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      return toast.error('Please upload at least one image');
    }

    const productPayload = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      images
    };

    setLoading(true);

    try {
      if (mode === 'create') {
        await createProduct(productPayload);
        toast.success('Product created successfully');
      } else {
        await updateProduct(productData._id, productPayload);
        toast.success('Product updated successfully');
      }
      navigate('/brand/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50" style={{ paddingTop: '100px', paddingBottom: '2rem', position: 'relative', zIndex: 1 }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">
            {mode === 'create' ? '➕ Create New Product' : '✏️ Edit Product'}
          </h1>
          <p className="text-neutral-600 text-lg">
            {mode === 'create' 
              ? 'Add a new product to your store' 
              : 'Update your product details'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-neutral-200">
          <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block font-semibold text-neutral-900 mb-2">Product Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., Summer Cotton T-Shirt"
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold text-neutral-900 mb-2">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your product in detail..."
            rows="5"
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
            required
          ></textarea>
        </div>

        {/* Price & Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-neutral-900 mb-2">Price ($) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-900 mb-2">Stock Quantity *</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              placeholder="0"
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
              required
            />
          </div>
        </div>

        {/* Category & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-neutral-900 mb-2">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-neutral-900 mb-2">Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block font-semibold mb-3">Product Images *</label>
          
          {/* Mode Toggle */}
          <div className="flex gap-2 mb-4 border rounded-lg p-1 bg-neutral-50">
            <button
              type="button"
              onClick={() => setImageMode('upload')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition ${
                imageMode === 'upload'
                  ? 'bg-blue-600 text-white'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              📸 Upload Files
            </button>
            <button
              type="button"
              onClick={() => setImageMode('url')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition ${
                imageMode === 'url'
                  ? 'bg-blue-600 text-white'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              🔗 Add URL
            </button>
          </div>

          {/* File Upload Mode */}
          {imageMode === 'upload' && (
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="imageInput"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
              <label htmlFor="imageInput" className="cursor-pointer">
                <p className="text-blue-600 font-semibold">
                  {uploading ? '⏳ Uploading to Cloudinary...' : '📸 Click to upload images'}
                </p>
                <p className="text-gray-500 text-sm">or drag and drop (uploads to Cloudinary)</p>
              </label>
            </div>
          )}

          {/* URL Input Mode */}
          {imageMode === 'url' && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="e.g., https://images.unsplash.com/photo-..."
                  onKeyPress={(e) => e.key === 'Enter' && addImageFromUrl()}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-600"
                />
                <button
                  type="button"
                  onClick={addImageFromUrl}
                  className="btn-primary px-6"
                >
                  ➕ Add
                </button>
              </div>
              <p className="text-sm text-neutral-600">
                💡 Tip: Copy image URL from Unsplash, Pinterest, or any image hosting service and paste here
              </p>
            </div>
          )}

          {/* Uploaded Images Preview */}
          {images.length > 0 && (
            <div className="mt-4">
              <p className="font-semibold mb-3">Added Images ({images.length})</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => (e.target.src = 'https://via.placeholder.com/128')}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-6 border-t border-neutral-200">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary flex-1"
          >
            {loading ? '⏳ Saving...' : mode === 'create' ? '➕ Create Product' : '✏️ Update Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/brand/dashboard')}
            className="btn btn-secondary flex-1"
          >
            Cancel
          </button>
        </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;