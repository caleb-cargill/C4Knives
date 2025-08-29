import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API services for products
export const productService = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// API services for spotlight
export const spotlightService = {
  get: () => api.get('/spotlight'),
  update: (data) => api.put('/spotlight', data),
};

// API services for contact form
export const contactService = {
  submit: (data) => api.post('/contact', data),
  getMessages: () => api.get('/contact/messages'),
};

// API services for authentication
export const authService = {
  login: (credentials) => api.post('/admin/login', credentials),
  getCurrentUser: () => api.get('/admin/me'),
  logout: () => {
    localStorage.removeItem('token');
  },
};

// API services for testimonials
export const testimonialService = {
  getAll: () => api.get('/testimonials'),
  create: (data) => api.post('/testimonials', data),
  update: (id, data) => api.put(`/testimonials/${id}`, data),
  delete: (id) => api.delete(`/testimonials/${id}`),
};

// Metadata API
export const metadataService = {
  get: () => api.get('/metadata'),
  update: (data) => api.put('/metadata', data)
};

export default api; 