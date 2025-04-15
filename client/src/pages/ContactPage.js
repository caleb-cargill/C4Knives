import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { contactService } from '../utils/api';
import { useLocation } from 'react-router-dom';

const ContactPage = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Use state parameter to pre-populate message if product is specified
  useEffect(() => {
    if (location.state && location.state.product && location.state.message) {
      setFormData(prev => ({
        ...prev,
        message: location.state.message
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setSubmitError(null);
    
    try {
      await contactService.submit(formData);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        message: ''
      });
    } catch (err) {
      console.error('Error submitting contact form:', err);
      setSubmitError('Failed to send your message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div 
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2 text-center text-text">Contact Us</h1>
        <p className="text-muted mb-8 text-center">
          Have questions about our knives or want to place a custom order? Reach out to us here.
        </p>
        
        {submitted ? (
          <motion.div 
            className="bg-olive bg-opacity-20 border border-olive text-text rounded-lg p-6 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold mb-2">Message Sent!</h2>
            <p className="mb-4">Thank you for contacting us. We'll respond to your inquiry as soon as possible.</p>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-primary hover:bg-highlight hover:text-background text-text font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Send Another Message
            </button>
          </motion.div>
        ) : (
          <div className="bg-secondary rounded-lg shadow-md p-8">
            {submitError && (
              <div className="bg-danger bg-opacity-20 border border-danger text-text rounded-lg p-4 mb-6">
                {submitError}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="name" className="block text-text font-medium mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-text ${
                    errors.name ? 'border-danger' : 'border-muted'
                  }`}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-danger text-sm mt-1">{errors.name}</p>
                )}
              </div>
              
              <div className="mb-6">
                <label htmlFor="email" className="block text-text font-medium mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-text ${
                    errors.email ? 'border-danger' : 'border-muted'
                  }`}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-danger text-sm mt-1">{errors.email}</p>
                )}
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-text font-medium mb-2">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className={`w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-text ${
                    errors.message ? 'border-danger' : 'border-muted'
                  }`}
                  placeholder="Please let us know how we can help you..."
                ></textarea>
                {errors.message && (
                  <p className="text-danger text-sm mt-1">{errors.message}</p>
                )}
              </div>
              
              <div className="text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-primary hover:bg-complement text-white font-bold py-3 px-8 rounded-lg transition-colors ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        )}
        
        <div className="mt-12 bg-secondary rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6 text-text">Other Ways to Reach Us</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-background rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-highlight" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-text">Email</h3>
              <p className="text-muted">info@c4knives.com</p>
            </div>
            
            <div className="text-center">
              <div className="bg-background rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-highlight" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-text">Phone</h3>
              <p className="text-muted">(555) 123-4567</p>
            </div>
            
            <div className="text-center">
              <div className="bg-background rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-highlight" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-text">Location</h3>
              <p className="text-muted">Salt Lake City, UT</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactPage;