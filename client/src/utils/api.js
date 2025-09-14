import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
const adminApiRoute = process.env.REACT_APP_ADMIN_API_ROUTE;

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
  getById: (id) => api.get(`/products/${adminApiRoute}/${id}`),
  create: (data) => api.post(`/products/${adminApiRoute}`, data),
  update: (id, data) => api.put(`/products/${adminApiRoute}/${id}`, data),
  delete: (id) => api.delete(`/products/${adminApiRoute}/${id}`),
};

// API services for spotlight
export const spotlightService = {
  get: () => api.get('/spotlight'),
  update: (data) => api.put(`/spotlight/${adminApiRoute}`, data),
};

// API services for contact form
export const contactService = {
  submit: (data) => api.post('/contact', data),
  getMessages: () => api.get(`/contact/${adminApiRoute}/messages`),
};

// API services for authentication
export const authService = {
  login: (credentials) => api.post(`/${adminApiRoute}/login`, credentials),
  getCurrentUser: () => api.get(`/${adminApiRoute}/me`),
  logout: () => {
    localStorage.removeItem('token');
  },
};

// API services for testimonials
export const testimonialService = {
  getAll: () => api.get('/testimonials'),
  create: (data) => api.post(`/testimonials/${adminApiRoute}`, data),
  update: (id, data) => api.put(`/testimonials/${adminApiRoute}/${id}`, data),
  delete: (id) => api.delete(`/testimonials/${adminApiRoute}/${id}`),
};

// Metadata API
export const metadataService = {
  get: () => api.get('/metadata'),
  update: (data) => api.put(`/metadata/${adminApiRoute}`, data)
};

export default api; 