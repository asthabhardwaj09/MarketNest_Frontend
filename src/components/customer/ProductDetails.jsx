import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../../services/productService';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await getProductById(id);
      setProduct(data);
      setMainImage(data.images[0]);
    } catch (error) {
      toast.error('Product not found');
      navigate('/marketplace');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"> Loading...</div>;
  if (!product) return <div className="text-center py-12">Product not found</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <button
        onClick={() => navigate('/marketplace')}
        className="text-blue-600 hover:underline mb-6"
      >
        ← Back to Marketplace
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="card mb-4">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`View ${index + 1}`}
                  onClick={() => setMainImage(image)}
                  className="h-20 w-20 object-cover rounded cursor-pointer hover:opacity-75 border-2 border-transparent hover:border-blue-600"
                />
              ))}
            </div>
          )}
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-2">{product.name}</h1>

          <div className="flex items-center gap-4 mb-4">
            <span className={`px-4 py-1 rounded-full font-semibold ${product.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
              {product.status === 'published' ? '✓ In Stock' : 'Out of Stock'}
            </span>
            <span className="text-gray-600">Category: {product.category}</span>
          </div>

          <p className="text-gray-600 mb-4">{product.description}</p>


          <div className="card mb-6 bg-blue-50">
            <p className="text-gray-600">Price</p>
            <p className="text-4xl font-bold text-blue-600 mb-3">${product.price}</p>
            <p className="text-gray-600">Available Stock: <span className="font-bold">{product.stock}</span></p>
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2">Quantity:</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                −
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 px-3 py-2 border rounded text-center"
                min="1"
                max={product.stock}
              />
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              disabled={product.stock === 0}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Cart ({quantity})
            </button>
            <button className="btn-secondary flex-1">
              Save for Later
            </button>
          </div>


          <div className="card mt-8">
            <h3 className="font-bold text-lg mb-3">Product Information</h3>
            <ul className="space-y-2 text-gray-600">
              <li><strong>Category:</strong> {product.category}</li>
              <li><strong>Stock:</strong> {product.stock} units available</li>
              <li><strong>Status:</strong> {product.status}</li>
              <li><strong>Added:</strong> {new Date(product.createdAt).toLocaleDateString()}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;