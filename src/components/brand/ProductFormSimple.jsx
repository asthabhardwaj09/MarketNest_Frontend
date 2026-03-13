import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { createProduct, getCategories } from '../../services/productService';
import toast from 'react-hot-toast';

const ProductFormSimple = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [imageMode, setImageMode] = useState('upload'); // 'upload' or 'url'
  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    status: 'published'
  });

  useEffect(() => {
    const fetchCats = async () => {
      try {
        console.log('Fetching categories from backend...');
        const catsData = await getCategories();
        console.log('Categories received:', catsData);


        let catsArray = Array.isArray(catsData) ? catsData : catsData?.categories || [];

        console.log('Setting categories state:', catsArray);
        setCategories(catsArray);


        if (catsArray.length > 0) {
          console.log('Auto-selecting first category:', catsArray[0]._id);
          setSelectedCategoryId(catsArray[0]._id);
        } else {
          console.warn('No categories available!');
          toast.error('No categories found. Please seed categories first.');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    if (user && user.role !== 'Brand') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

        if (!response.ok) throw new Error('Upload failed');

        const data = await response.json();
        setImages(prev => [...prev, data.secure_url]);
        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      toast.error('Image upload failed - check Cloudinary config');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };
  const addImageFromUrl = () => {
    if (!urlInput.trim()) {
      return toast.error('Please enter an image URL');
    }

    try {
      new URL(urlInput);
    } catch {
      return toast.error('Invalid URL format');
    }

    setImages(prev => [...prev, urlInput.trim()]);
    setUrlInput('');
    toast.success('Image URL added successfully');
  };
  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    toast.success('Image removed');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price || !formData.stock) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!selectedCategoryId) {
      toast.error('Please select a category');
      return;
    }

    if (images.length === 0) {
      toast.error('Please add at least one product image');
      return;
    }

    setUploading(true);

    try {
      const productPayload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: selectedCategoryId,
        status: formData.status,
        images: images
      };

      const response = await createProduct(productPayload);

      toast.success('Product created successfully!');
      console.log('Product created:', response);
      setTimeout(() => {
        navigate('/brand/dashboard');
      }, 1000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create product';
      toast.error(`${errorMessage}`);
      console.error('Product creation error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      paddingTop: '100px',
      paddingBottom: '40px'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#1a1a1a',
            marginBottom: '10px'
          }}>
            Create New Product
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#666' }}>
            Add a new product to your store
          </p>
        </div>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          padding: '40px',
          border: '1px solid #e0e0e0'
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#1a1a1a' }}>
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Summer Cotton T-Shirt"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#1a1a1a' }}>
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your product in detail..."
                rows="5"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#1a1a1a' }}>
                  Price ($) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#1a1a1a' }}>
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#1a1a1a' }}>
                  Category * {categories.length === 0 && <span style={{ color: '#dc2626' }}>Loading...</span>}
                </label>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => {
                    console.log('Category selected:', e.target.value);
                    setSelectedCategoryId(e.target.value);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: categories.length === 0 ? '2px solid #fca5a5' : '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                    backgroundColor: categories.length === 0 ? '#fee2e2' : 'white'
                  }}
                  disabled={categories.length === 0}
                >
                  <option value="">
                    {categories.length === 0
                      ? 'Loading categories...'
                      : '-- Select Category --'}
                  </option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {categories.length === 0 && (
                  <p style={{ fontSize: '0.85rem', color: '#dc2626', marginTop: '6px' }}>
                    Categories not loaded. Try refreshing the page.
                  </p>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#1a1a1a' }}>
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="published">Published (Visible to Customers)</option>
                  <option value="draft">Draft (Hidden from Customers)</option>
                </select>
                <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '6px' }}>
                  Tip: Select "Published" to make your product visible in the marketplace
                </p>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '12px', color: '#1a1a1a' }}>
                Product Images *
              </label>

              <div style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '15px',
                border: '1px solid #d4d4d8',
                borderRadius: '8px',
                padding: '4px',
                backgroundColor: '#f5f5f5'
              }}>
                <button
                  type="button"
                  onClick={() => setImageMode('upload')}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    backgroundColor: imageMode === 'upload' ? '#6366f1' : 'transparent',
                    color: imageMode === 'upload' ? 'white' : '#666',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    if (imageMode !== 'upload') e.target.style.backgroundColor = '#f0f0f0';
                  }}
                  onMouseLeave={(e) => {
                    if (imageMode !== 'upload') e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  Upload Files
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('url')}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    backgroundColor: imageMode === 'url' ? '#6366f1' : 'transparent',
                    color: imageMode === 'url' ? 'white' : '#666',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    if (imageMode !== 'url') e.target.style.backgroundColor = '#f0f0f0';
                  }}
                  onMouseLeave={(e) => {
                    if (imageMode !== 'url') e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  Add URL
                </button>
              </div>
              {imageMode === 'upload' && (
                <div>
                  <input
                    type="file"
                    id="imageInput"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    style={{ display: 'none' }}
                  />
                  <label
                    htmlFor="imageInput"
                    style={{
                      display: 'block',
                      border: '2px dashed #3b82f6',
                      borderRadius: '8px',
                      padding: '40px 20px',
                      textAlign: 'center',
                      backgroundColor: '#f0f4ff',
                      cursor: uploading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s',
                      opacity: uploading ? 0.6 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (!uploading) e.currentTarget.style.backgroundColor = '#e0e7ff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f0f4ff';
                    }}
                  >
                    <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#3b82f6', marginBottom: '8px' }}>
                      {uploading ? 'Uploading...' : 'Click to upload images or drag & drop'}
                    </p>
                    <p style={{ fontSize: '0.9rem', color: '#666' }}>
                      PNG, JPG, GIF up to 10MB (uploads to Cloudinary)
                    </p>
                  </label>
                </div>
              )}
              {imageMode === 'url' && (
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="e.g., https://images.unsplash.com/photo-..."
                    onKeyPress={(e) => e.key === 'Enter' && addImageFromUrl()}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                  <button
                    type="button"
                    onClick={addImageFromUrl}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
                  >
                    Add
                  </button>
                </div>
              )}
              {imageMode === 'url' && (
                <div style={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  padding: '10px 12px',
                  fontSize: '0.9rem',
                  color: '#666',
                  marginBottom: '15px'
                }}>
                  <strong>Unsplash Images:</strong> Visit unsplash.com, right-click any image → Copy Link, then paste here
                </div>
              )}
              {images.length > 0 && (
                <div>
                  <p style={{ fontWeight: '600', marginBottom: '12px', color: '#1a1a1a' }}>
                    Added Images ({images.length})
                  </p>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                    gap: '12px'
                  }}>
                    {images.map((image, index) => (
                      <div
                        key={index}
                        style={{
                          position: 'relative',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          backgroundColor: '#f5f5f5',
                          aspectRatio: '1',
                          group: 'image-preview'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.querySelector('.delete-btn').style.opacity = '1';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.querySelector('.delete-btn').style.opacity = '0';
                        }}
                      >
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          onError={(e) => (e.target.src = 'https://via.placeholder.com/120?text=Error')}
                        />
                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() => removeImage(index)}
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            width: '28px',
                            height: '28px',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.1rem',
                            opacity: 0,
                            transition: 'opacity 0.2s'
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '20px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: '14px',
                  backgroundColor: '#6366f1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#4f46e5'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#6366f1'}
              >
                Create Product
              </button>
              <button
                type="button"
                onClick={() => navigate('/brand/dashboard')}
                style={{
                  flex: 1,
                  padding: '14px',
                  backgroundColor: 'white',
                  color: '#3f3f46',
                  border: '1.5px solid #d4d4d8',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f4f4f5'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
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

export default ProductFormSimple;
