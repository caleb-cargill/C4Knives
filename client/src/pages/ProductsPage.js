import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productService } from '../utils/api';
import Product from '../components/Product';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productService.getAll();
        setProducts(response.data);
        setFilteredProducts(response.data);

        // Extract all unique tags from products
        const allTags = response.data.reduce((acc, product) => {
          if (product.tags && Array.isArray(product.tags)) {
            product.tags.forEach(tag => {
              if (!acc.includes(tag)) {
                acc.push(tag);
              }
            });
          }
          return acc;
        }, []);
        
        setTags(allTags);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter products based on search term and selected tag
    const filtered = products.filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTag = selectedTag === '' || 
        (product.tags && product.tags.includes(selectedTag));
      
      return matchesSearch && matchesTag;
    });
    
    setFilteredProducts(filtered);
  }, [searchTerm, selectedTag, products]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTagFilter = (tag) => {
    setSelectedTag(tag === selectedTag ? '' : tag);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Knife Collection</h1>
      
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search bar */}
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border rounded-lg bg-secondary focus:outline-none focus:ring-2 focus:ring-primary text-text"
            />
            <svg
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        {/* Tags filter */}
        {tags.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagFilter(tag)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedTag === tag 
                      ? 'bg-primary text-white' 
                      : 'bg-complement text-gray-200 hover:bg-gray-600'
                  } transition-colors`}
                >
                  {tag}
                </button>
              ))}
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag('')}
                  className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      
      {error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : filteredProducts.length > 0 ? (
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredProducts.map((product) => (
            <Product product={product} />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No products found matching your criteria.</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedTag('');
            }}
            className="text-primary hover:text-red-800 font-medium"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage; 