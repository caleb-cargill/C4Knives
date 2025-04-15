const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');
const { authMiddleware } = require('../middleware/auth');

// @route   POST api/contact
// @desc    Submit a contact message
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Simple validation
    if (!name || !email || !message) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }
    
    const newMessage = new ContactMessage({
      name,
      email,
      message
    });
    
    const savedMessage = await newMessage.save();
    res.json(savedMessage);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/contact/messages
// @desc    Get all contact messages
// @access  Private
router.get('/messages', authMiddleware, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 