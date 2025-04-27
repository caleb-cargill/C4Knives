import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { metadataService } from '../utils/api';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [metadata, setMetadata] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        console.log('Fetching metadata...');
        const response = await metadataService.get();
        console.log('Metadata response:', response);
        setMetadata(response.data);
      } catch (err) {
        console.error('Error fetching metadata:', err);
        setError('Failed to load contact information');
      }
    };
    fetchMetadata();
  }, []);

  return (
    <footer className="bg-secondary text-text py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          <div className="lg:w-1/3">
            <h3 className="text-xl font-bold mb-4 text-primary">C4 Knives</h3>
            <p className="text-muted mb-4">
              Premium handcrafted knives made with the finest materials. 
              Each knife is a unique piece of functional art.
            </p>
            <p className="text-muted">
              &copy; {currentYear} C4 Knives. All rights reserved.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:w-2/3">
            <div>
              <h4 className="text-lg font-semibold mb-3 text-highlight">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-muted hover:text-highlight transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-muted hover:text-highlight transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/vault" className="text-muted hover:text-highlight transition-colors">
                    Vault
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-muted hover:text-highlight transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-3 text-highlight">Contact</h4>
              <ul className="space-y-2">
                <li className="text-muted">
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                  {metadata?.email || 'info@c4knives.com'}
                </li>
                <li className="text-muted">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                  {metadata?.address || 'Salt Lake City, UT'}
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3 text-highlight">Socials</h4>
              <ul className="space-y-2">
                <li>
                  <a href={metadata?.facebook || 'https://facebook.com'} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-highlight transition-colors">
                    <FontAwesomeIcon icon={faFacebook} className="mr-2" />
                    Facebook
                  </a>
                </li>
                <li>
                  <a href={metadata?.instagram || 'https://instagram.com'} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-highlight transition-colors">
                    <FontAwesomeIcon icon={faInstagram} className="mr-2" />
                    Instagram
                  </a>
                </li>
                <li>
                  <a href={metadata?.youtube || 'https://youtube.com'} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-highlight transition-colors">
                    <FontAwesomeIcon icon={faYoutube} className="mr-2" />
                    YouTube
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 