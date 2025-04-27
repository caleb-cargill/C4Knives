import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { contactService } from '../utils/api';
import { useLocation } from 'react-router-dom';
import { metadataService } from '../utils/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';

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
  const [metadata, setMetadata] = useState(null);

  // Use state parameter to pre-populate message if product is specified
  useEffect(() => {
    if (location.state && location.state.product && location.state.message) {
      setFormData(prev => ({
        ...prev,
        message: location.state.message
      }));
    }
  }, [location.state]);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        console.log('Fetching metadata...');
        const response = await metadataService.get();
        console.log('Metadata response:', response);
        setMetadata(response.data);
      } catch (err) {
        console.error('Error fetching metadata:', err);
        setErrors('Failed to load contact information');
      }
    };
    fetchMetadata();
  }, []);

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
        <h1 className="text-3xl font-bold mb-2 text-center text-text">Contact</h1>
        <p className="text-muted mb-8 text-center">
          Have questions about my knives or want to place a custom order? Reach out to me here. 
          At this point in time, knife-making is not a full-time business. However, I'd love to 
          hear from you and will do my best to get back to you promptly!
        </p>
        
        {submitted ? (
          <motion.div 
            className="bg-olive bg-opacity-20 border border-olive text-text rounded-lg p-6 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold mb-2">Message Sent!</h2>
            <p className="mb-4">Thank you for contacting me. I'll respond to your inquiry as soon as possible.</p>
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
                  placeholder="e.g., John Smith"
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
                  placeholder="e.g., johnsmith@gmail.com"
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
                  placeholder="Please let me know how I can help you..."
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
        
        <div className="mt-12 bg-secondary rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold mb-6 text-text">Other Ways to Reach Out</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-background rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faEnvelope} className="h-8 w-8 text-highlight" />     
              </div>
              <h3 className="text-lg font-semibold mb-2 text-text">Email</h3>
              <p className="text-muted">{metadata?.email || 'info@c4knives.com'}</p>
            </div>  
            <div className="text-center">
              <div className="bg-background rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faFacebook} className="h-8 w-8 text-highlight" />                
              </div>
              <h3 className="text-lg font-semibold mb-2 text-text">Facebook</h3>
              <a href={metadata?.facebook} target='_blank' className="text-muted hover:text-highlight transition-colors">C4 Knives</a>
            </div>  
            <div className="text-center">
              <div className="bg-background rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faInstagram} className="h-8 w-8 text-highlight" />                
              </div>
              <h3 className="text-lg font-semibold mb-2 text-text">Instagram</h3>
              <a href={metadata?.instagram} target='_blank' className="text-muted hover:text-highlight transition-colors">c4.knives</a>
            </div>                       
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactPage;