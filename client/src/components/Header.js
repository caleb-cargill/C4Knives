import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/LogoOlive.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  const isActive = (path) => {
    return location.pathname === path ? 'font-bold text-highlight' : 'text-text hover:text-highlight';
  };

  return (
    <header className="bg-secondary shadow-md">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary" onClick={closeMenu}>
          <img src={logo} alt="C4 Knives Logo" className="h-12 mr-2" />          
        </Link>

        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 rounded-md text-text"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className={`${isActive('/')} transition-colors`}>
            Home
          </Link>
          <Link to="/about" className={`${isActive('/about')} transition-colors`}>
            About
          </Link>
          <Link to="/vault" className={`${isActive('/vault')} transition-colors`}>
            Knife Vault
          </Link>
          <Link to="/contact" className={`${isActive('/contact')} transition-colors`}>
            Contact
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/admin" className={`${isActive('/admin')} transition-colors`}>
                Admin
              </Link>
              <button 
                onClick={handleLogout}
                className="text-text hover:text-highlight transition-colors"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-secondary border-t border-muted py-2">
          <div className="container mx-auto px-4 flex flex-col space-y-3">
            <Link 
              to="/" 
              className={`${isActive('/')} block py-2 transition-colors`}
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`${isActive('/about')} block py-2 transition-colors`}
              onClick={closeMenu}
            >
              About
            </Link>
            <Link 
              to="/vault" 
              className={`${isActive('/vault')} block py-2 transition-colors`}
              onClick={closeMenu}
            >
              Knife Vault
            </Link>
            <Link 
              to="/contact" 
              className={`${isActive('/contact')} block py-2 transition-colors`}
              onClick={closeMenu}
            >
              Contact
            </Link>
            {isAuthenticated ? (
              <>
                <Link 
                  to="/admin" 
                  className={`${isActive('/admin')} block py-2 transition-colors`}
                  onClick={closeMenu}
                >
                  Admin
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-text hover:text-highlight transition-colors text-left block py-2 w-full"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className={`${isActive('/login')} block py-2 transition-colors`}
                onClick={closeMenu}
              >
                Admin Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 