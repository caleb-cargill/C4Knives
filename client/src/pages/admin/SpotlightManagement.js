import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { spotlightService } from '../../utils/api';

const SpotlightManagement = () => {
  const navigate = useNavigate();
  const [spotlight, setSpotlight] = useState({
    title: '',
    description: '',
    imageUrl: '',
    videoUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const adminRoute = process.env.REACT_APP_ADMIN_ROUTE;
  
  useEffect(() => {
    const fetchSpotlight = async () => {
      try {
        const res = await spotlightService.get();
        if (res.data) {
          setSpotlight(res.data);
        }
      } catch (err) {
        console.error('Error fetching spotlight:', err);
        setError('Failed to load spotlight data');
      } finally {
        setLoading(false);
      }
    };

    fetchSpotlight();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSpotlight(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await spotlightService.update(spotlight);
      setSuccess('Spotlight updated successfully!');
    } catch (err) {
      console.error('Error updating spotlight:', err);
      setError('Failed to update spotlight');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate(`/${adminRoute}`)}
          className="mr-4 text-muted hover:text-text"
        >
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-3xl font-bold">Manage Spotlight</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6">
          {success}
        </div>
      )}

      <motion.form
        onSubmit={handleSubmit}
        className="bg-secondary rounded-lg shadow-md p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-text mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={spotlight.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-text"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-text mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={spotlight.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-text"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="imageUrl" className="block text-sm font-medium text-text mb-2">
            Image URL
          </label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={spotlight.imageUrl}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-text"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="videoUrl" className="block text-sm font-medium text-text mb-2">
            Video URL (YouTube)
          </label>
          <input
            type="url"
            id="videoUrl"
            name="videoUrl"
            value={spotlight.videoUrl}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-text"
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>

        <div className="mb-6">
          <label htmlFor="productId" className="block text-sm font-medium text-text mb-2">
            Product ID
          </label>
          <input
            type="url"
            id="productId"
            name="productId"
            value={spotlight.productId}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-text"
            placeholder="Product ID"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-primary hover:bg-complement text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      </motion.form>

      {spotlight.imageUrl && (
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h2 className="text-xl font-bold mb-4">Preview</h2>
          <div className="bg-secondary rounded-lg shadow-md p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                {spotlight.imageUrl && (
                  <img 
                    src={spotlight.imageUrl} 
                    alt={spotlight.title} 
                    className="rounded-lg shadow-lg object-cover w-full h-96"
                  />
                )}
                {spotlight.videoUrl && (
                  <div className="relative pt-56.25 rounded-lg overflow-hidden shadow-lg mt-4">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={spotlight.videoUrl}
                      title={spotlight.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">{spotlight.title}</h3>
                <p className="text-muted mb-6">{spotlight.description}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SpotlightManagement; 