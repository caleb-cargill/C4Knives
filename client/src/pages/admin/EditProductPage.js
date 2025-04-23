import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productService } from '../../utils/api';

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    tags: [],
    isCurrentlyAvailable: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await productService.getById(id);
        setProduct(response.data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagAdd = () => {
    if (newTag.trim() && !product.tags.includes(newTag.trim())) {
      setProduct(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setProduct(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await productService.update(id, product);
      navigate('/admin/products');
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Failed to update product. Please try again.');
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

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
          {error}
        </div>
        <button
          onClick={() => navigate('/admin/products')}
          className="bg-secondary hover:bg-gray-800 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-secondary rounded-lg shadow-md p-8 max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-8">Edit Product</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Product Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={product.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-text"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-text"
              required
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-2">
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={product.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-text"
              required
            />
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium mb-2">
              Image URL
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={product.imageUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-text"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="flex-grow px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-text"
                placeholder="Add a tag"
              />
              <button
                type="button"
                onClick={handleTagAdd}
                className="bg-primary hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-complement text-gray-200 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag)}
                    className="ml-2 text-gray-300 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Is Currently Available
            </label>
            <div className="p-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isCurrentlyAvailable"
                    checked={product.isCurrentlyAvailable}
                    onChange={handleChange}
                    className="w-3 h-3 px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-text"
                  />
                  <span>{product.isCurrentlyAvailable ? 'Available' : 'Unavailable'}</span>
                </label>
              </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-primary hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="bg-secondary hover:bg-gray-800 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditProductPage; 