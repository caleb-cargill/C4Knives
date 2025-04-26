import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { spotlightService, productService, testimonialService, metadataService } from '../utils/api';
import Product from '../components/Product';

const HomePage = () => {
  const [spotlight, setSpotlight] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState([]);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalKnives, setTotalKnives] = useState(0);
  const [availableKnives, setAvailableKnives] = useState(0);
  const [knifeCounter, setKnifeCounter] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get spotlight content
        const spotlightRes = await spotlightService.get();
        if (spotlightRes.data) {
          setSpotlight(spotlightRes.data);
        }

        // Get featured products (3 most recent)
        const productsRes = await productService.getAll();
        setFeaturedProducts(productsRes.data.slice(0, 3));
        setTotalKnives(productsRes.data.length);
        setAvailableKnives(productsRes.data.filter(p => p.isCurrentlyAvailable).length);

        // Get knife counter
        const metadata = await metadataService.get();
        setKnifeCounter(metadata.data.knifeCounter);

        // Get testimonials
        const testimonialsRes = await testimonialService.getAll();
        setTestimonials(testimonialsRes.data);
        setFilteredTestimonials(testimonialsRes.data);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-scroll testimonials every 10 seconds
  useEffect(() => {
    if (filteredTestimonials.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prevIndex) => 
        (prevIndex + 1) % filteredTestimonials.length
      );
    }, 10000);
    
    return () => clearInterval(interval);
  }, [filteredTestimonials.length]);

  // Filter testimonials based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTestimonials(testimonials);
      setCurrentTestimonialIndex(0);
      return;
    }
    
    const filtered = testimonials.filter(testimonial => 
      testimonial.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      testimonial.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      testimonial.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredTestimonials(filtered);
    setCurrentTestimonialIndex(0);
  }, [searchQuery, testimonials]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Handle manual navigation
  const goToNextTestimonial = () => {
    if (filteredTestimonials.length <= 1) return;
    setCurrentTestimonialIndex((prevIndex) => 
      (prevIndex + 1) % filteredTestimonials.length
    );
  };

  const goToPrevTestimonial = () => {
    if (filteredTestimonials.length <= 1) return;
    setCurrentTestimonialIndex((prevIndex) => 
      prevIndex === 0 ? filteredTestimonials.length - 1 : prevIndex - 1
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-cover bg-center text-text py-20 bg-no-repeat" style={{ backgroundImage: "url('https://scontent-ord5-2.xx.fbcdn.net/v/t39.30808-6/473804028_1115350350373131_5327880234059863841_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=ujzrOapqUuMQ7kNvwGLLYJY&_nc_oc=AdkLQLeAtisg52dlHcWSLgvy3Xyyp3XEcbQBtJilihkOPz3tDodr0RL7B9rTnP6VnuF_sBcU2Vs9bswPx2O-qprn&_nc_zt=23&_nc_ht=scontent-ord5-2.xx&_nc_gid=RCYi3KCQ2cN8G5vUd56f8g&oh=00_AfGqzxC6D_iaSsMFkZ08NrzdgE_MgjZy5nFuRPUnBxaubg&oe=680E0848')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Custom Handcrafted Knives
            </h1>
            <p className="text-xl mb-2">
              Precision engineered blades for collectors and professionals. 
            </p>
            <p className="text-lg mb-8">
              Sheaths hand-tailored by <a href="https://www.facebook.com/Eaglesgrip" target="_blank" className="font-bold underline hover:text-complement">Eaglesgrip Leatherwork</a>.          
            </p>
            <Link 
              to="/products" 
              className={`w-full bg-primary hover:bg-complement text-white font-bold py-3 px-8 rounded-lg transition-colors ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              View Collection
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Total Knives Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-text">Our Legacy</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <p className="text-5xl font-bold text-primary mb-4">{totalKnives}+</p>
                <p className="text-xl text-muted">Unique Designs Created</p>
              </div>
              <div>
                <p className="text-5xl font-bold text-primary mb-4">{knifeCounter}+</p>
                <p className="text-xl text-muted">Total Knives Crafted</p>
              </div>
              <div>
                <p className="text-5xl font-bold text-primary mb-4">{availableKnives}</p>
                <p className="text-xl text-muted">Blades Available</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Spotlight Section */}
      {spotlight && (
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center text-text">Spotlight</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {spotlight.imageUrl && (
                  <img 
                    src={spotlight.imageUrl} 
                    alt={spotlight.title} 
                    className="rounded-lg shadow-lg object-cover w-full h-96"
                  />
                )}
                {spotlight.videoUrl && (
                  <div className="relative pt-56.25 rounded-lg overflow-hidden shadow-lg">
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
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-2xl font-bold mb-4 text-text">{spotlight.title}</h3>
                <p className="text-muted mb-6">{spotlight.description}</p>
                <div className="flex gap-2">
                  <Link 
                    to={spotlight.videoUrl} 
                    target="_blank"
                    className="bg-olive hover:bg-complement text-text font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    Watch Video
                  </Link>
                  <Link 
                    to={`/products/${spotlight.productId}`} 
                    className="bg-olive hover:bg-complement text-text font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    View Product
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center text-text">Featured Products</h2>
          {error ? (
            <p className="text-center text-danger">{error}</p>
          ) : featuredProducts.length > 0 ? (
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {featuredProducts.map((product) => (
                <Product key={product._id} product={product} />
              ))}
            </motion.div>
          ) : (
            <p className="text-center text-muted">No featured products available.</p>
          )}
          
          <div className="text-center mt-12">
            <Link 
              to="/products" 
              className={`w-full bg-primary hover:bg-complement text-white font-bold py-3 px-8 rounded-lg transition-colors ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center text-text">What Our Customers Say</h2>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search testimonials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-background border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <svg 
                className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          {error ? (
            <p className="text-center text-danger">{error}</p>
          ) : filteredTestimonials.length > 0 ? (
            <div className="max-w-3xl mx-auto">
              {/* Testimonial Carousel */}
              <motion.div 
                key={currentTestimonialIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-background p-8 rounded-lg shadow-lg"
              >
                <div className="flex items-center mb-4">
                  {filteredTestimonials[currentTestimonialIndex].imageUrl && (
                    <img 
                      src={filteredTestimonials[currentTestimonialIndex].imageUrl} 
                      alt={filteredTestimonials[currentTestimonialIndex].name}
                      className="w-16 h-16 rounded-full mr-4 object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-bold text-text text-xl">{filteredTestimonials[currentTestimonialIndex].name}</h3>
                    <p className="text-sm text-muted">{filteredTestimonials[currentTestimonialIndex].role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-6 h-6 ${
                        i < filteredTestimonials[currentTestimonialIndex].rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-muted italic text-lg">"{filteredTestimonials[currentTestimonialIndex].content}"</p>
              </motion.div>
              
              {/* Navigation Controls */}
              <div className="flex justify-between items-center mt-6">
                <button 
                  onClick={goToPrevTestimonial}
                  className="bg-primary hover:bg-complement text-white rounded-full p-2"
                  disabled={filteredTestimonials.length <= 1}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex space-x-2">
                  {filteredTestimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonialIndex(index)}
                      className={`w-3 h-3 rounded-full ${
                        index === currentTestimonialIndex ? 'bg-primary' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                
                <button 
                  onClick={goToNextTestimonial}
                  className="bg-primary hover:bg-complement text-white rounded-full p-2"
                  disabled={filteredTestimonials.length <= 1}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              {/* Testimonial Counter */}
              <p className="text-center mt-4 text-muted">
                {currentTestimonialIndex + 1} of {filteredTestimonials.length} testimonials
              </p>
            </div>
          ) : (
            <p className="text-center text-muted">No testimonials found matching your search.</p>
          )}
        </div>
      </section>

      {/* Custom Quote Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-text">Looking for a Custom Knife?</h2>
            <p className="text-xl text-muted mb-8">
              Have a specific design in mind? Need a knife tailored to your exact requirements? 
              We specialize in creating custom knives that perfectly match your vision and needs.
            </p>
            <Link 
              to="/contact" 
              className="inline-block bg-primary hover:bg-complement text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Request a Custom Quote
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 