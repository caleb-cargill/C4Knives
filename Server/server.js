const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/c4knives', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Import routes
const productRoutes = require('./routes/products');
const spotlightRoutes = require('./routes/spotlight');
const contactRoutes = require('./routes/contact');
const testimonialRoutes = require('./routes/testimonials');
const { router: authRoutes, createInitialAdmin } = require('./routes/auth');
const metadataRoutes = require('./routes/metadata');

// Create initial admin account
createInitialAdmin();

// Define routes
app.use('/api/products', productRoutes);
app.use('/api/spotlight', spotlightRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/admin', authRoutes);
app.use('/api/metadata', metadataRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});