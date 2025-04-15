import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productService } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await productService.getById(id);
        setProduct(response.data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. It may have been removed or is unavailable.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.delete(id);
        navigate('/products');
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h1>
          <p className="text-gray-700 mb-6">{error || 'The requested product could not be found.'}</p>
          <Link 
            to="/products" 
            className="bg-secondary hover:bg-gray-800 text-white font-semibold py-2 px-6 rounded-lg transition-colors inline-block"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-secondary rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="grid md:grid-cols-2 gap-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full"
          >
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-8"
          >
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <div className="text-2xl font-bold text-primary mb-6">
              ${product.price.toFixed(2)}
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-muted mb-4 line-clamp-2">{product.description}</p>
            </div>
            
            {product.tags && product.tags.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="bg-complement text-gray-200 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => navigate('/contact', { 
                  state: { 
                    product: product.name,
                    message: `I'm interested in purchasing the ${product.name}. Please provide more information about availability and pricing.`
                  }
                })}
                className="bg-olive hover:bg-complement text-text font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Request
              </button>
              <Link 
                to="/products" 
                className="bg-olive hover:bg-complement text-text font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Back to Products
              </Link>
              
              {isAuthenticated && (
                <div className="flex gap-2">
                  <Link 
                    to={`/admin/products/edit/${product._id}`} 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage; 