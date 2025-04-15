const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { authMiddleware, JWT_SECRET } = require('../middleware/auth');

// @route   POST api/admin/login
// @desc    Authenticate admin & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Simple validation
    if (!username || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }
    
    // Check for existing admin
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
    // Validate password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
    // Create and sign token
    const payload = {
      id: admin.id
    };
    
    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          admin: {
            id: admin.id,
            username: admin.username
          }
        });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/admin/me
// @desc    Get current admin
// @access  Private
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-passwordHash');
    res.json(admin);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Helper function to create initial admin if needed (to be called on server startup)
const createInitialAdmin = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    
    if (adminCount === 0) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('admin123', salt);
      
      const initialAdmin = new Admin({
        username: 'admin',
        passwordHash
      });
      
      await initialAdmin.save();
      console.log('Initial admin account created');
    }
  } catch (err) {
    console.error('Error creating initial admin:', err);
  }
};

module.exports = { router, createInitialAdmin }; 