require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT;
const adminRoute = process.env.ADMIN_API_ROUTE;

console.log('Allowed Origin:', process.env.FRONT_URI);

// Middleware
app.use(cors({
  origin: process.env.FRONT_URI,
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
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
const { router: authRoutes } = require('./routes/auth');
const metadataRoutes = require('./routes/metadata');

// Define routes
app.use('/api/products', productRoutes);
app.use('/api/spotlight', spotlightRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use(`/api/${adminRoute}`, authRoutes);
app.use('/api/metadata', metadataRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});