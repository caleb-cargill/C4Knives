import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import EditProductPage from './pages/admin/EditProductPage';
import AddProductPage from './pages/admin/AddProductPage';
import MessagesPage from './pages/admin/MessagesPage';
import SpotlightManagement from './pages/admin/SpotlightManagement';
import TestimonialsAdmin from './pages/admin/TestimonialsAdmin';
import MetadataSettings from './pages/admin/MetadataSettings';

// CSS
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              
              {/* Admin Routes - Protected */}
              <Route element={<PrivateRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<AdminProductsPage />} />
                <Route path="/admin/products/edit/:id" element={<EditProductPage />} />
                <Route path="/admin/products/new" element={<AddProductPage />} />
                <Route path="/admin/messages" element={<MessagesPage />} />
                <Route path="/admin/spotlight" element={<SpotlightManagement />} />
                <Route path="/admin/testimonials" element={<TestimonialsAdmin />} />
                <Route path="/admin/metadata" element={<MetadataSettings />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
