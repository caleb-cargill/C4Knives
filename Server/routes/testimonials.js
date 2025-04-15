const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
const { authMiddleware } = require('../middleware/auth');

// @route   GET api/testimonials
// @desc    Get all testimonials
// @access  Public
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/testimonials
// @desc    Create a testimonial
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, role, content, rating, imageUrl } = req.body;
    
    const newTestimonial = new Testimonial({
      name,
      role,
      content,
      rating,
      imageUrl
    });
    
    const savedTestimonial = await newTestimonial.save();
    res.json(savedTestimonial);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/testimonials/:id
// @desc    Update a testimonial
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, role, content, rating, imageUrl } = req.body;
    
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ msg: 'Testimonial not found' });
    }
    
    testimonial.name = name;
    testimonial.role = role;
    testimonial.content = content;
    testimonial.rating = rating;
    testimonial.imageUrl = imageUrl;
    
    await testimonial.save();
    res.json(testimonial);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/testimonials/:id
// @desc    Delete a testimonial
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ msg: 'Testimonial not found' });
    }
    
    await testimonial.deleteOne();
    res.json({ msg: 'Testimonial removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 