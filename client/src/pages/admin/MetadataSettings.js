import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { metadataService } from '../../utils/api';

const MetadataSettings = () => {
  const [metadata, setMetadata] = useState({
    email: '',
    phone: '',
    address: '',
    instagram: '',
    facebook: '',
    youtube: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [touched, setTouched] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await metadataService.get();
        setMetadata(response.data);
      } catch (err) {
        setError('Failed to load site settings');
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  const validateField = (name, value) => {
    if (!value || !value.toString().trim()) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }
    if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Please enter a valid email address';
    }
    if (name === 'phone' && !/^[\d\s\-\+\(\)]{10,}$/.test(value)) {
      return 'Please enter a valid phone number';
    }
    if ((name === 'instagram' || name === 'facebook' || name === 'youtube') && value && !value.startsWith('http')) {
      return 'Please enter a valid URL starting with http:// or https://';
    }
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMetadata(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (touched[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setValidationErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate all fields
    const newValidationErrors = {};
    Object.keys(metadata).forEach(key => {
      newValidationErrors[key] = validateField(key, metadata[key]);
    });
    setValidationErrors(newValidationErrors);

    // Check if there are any errors
    if (Object.values(newValidationErrors).some(error => error)) {
      setError('Please fix the validation errors before submitting');
      return;
    }

    try {
      await metadataService.update(metadata);
      setSuccess('Settings updated successfully');
    } catch (err) {
      setError('Failed to update settings');
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-8">Site Settings</h1>

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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-secondary rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-muted mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={metadata.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-text ${
                    validationErrors.email ? 'border-red-500' : ''
                  }`}
                  placeholder="contact@example.com"
                />
                {validationErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-muted mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={metadata.phone}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-text ${
                    validationErrors.phone ? 'border-red-500' : ''
                  }`}
                  placeholder="(555) 123-4567"
                />
                {validationErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
                )}
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-muted mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={metadata.address}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-text ${
                    validationErrors.address ? 'border-red-500' : ''
                  }`}
                  placeholder="123 Main St, City, State ZIP"
                />
                {validationErrors.address && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.address}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-secondary rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Social Media Links</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="instagram" className="block text-sm font-medium text-muted mb-1">
                  Instagram URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  id="instagram"
                  name="instagram"
                  value={metadata.instagram}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-text ${
                    validationErrors.instagram ? 'border-red-500' : ''
                  }`}
                  placeholder="https://instagram.com/yourusername"
                />
                {validationErrors.instagram && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.instagram}</p>
                )}
              </div>

              <div>
                <label htmlFor="facebook" className="block text-sm font-medium text-muted mb-1">
                  Facebook URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  id="facebook"
                  name="facebook"
                  value={metadata.facebook}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-text ${
                    validationErrors.facebook ? 'border-red-500' : ''
                  }`}
                  placeholder="https://facebook.com/yourusername"
                />
                {validationErrors.facebook && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.facebook}</p>
                )}
              </div>

              <div>
                <label htmlFor="youtube" className="block text-sm font-medium text-muted mb-1">
                  YouTube URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  id="youtube"
                  name="youtube"
                  value={metadata.youtube}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-text ${
                    validationErrors.youtube ? 'border-red-500' : ''
                  }`}
                  placeholder="https://youtube.com/yourusername"
                />
                {validationErrors.youtube && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.youtube}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-primary hover:bg-complement text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default MetadataSettings; 