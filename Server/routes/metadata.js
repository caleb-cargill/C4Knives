const express = require('express');
const router = express.Router();
const Metadata = require('../models/Metadata');
const { authMiddleware } = require('../middleware/auth');

// Get all metadata
router.get('/', async (req, res) => {
  try {
    let metadata = await Metadata.findOne();
    if (!metadata) {
      metadata = await Metadata.create({
        knifeCounter: 0,
        email: '',
        phone: '',
        address: '',
        instagram: '',
        facebook: '',
        youtube: ''
      });
    }
    res.json(metadata);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update metadata (admin only)
router.put('/', authMiddleware, async (req, res) => {
  try {
    let metadata = await Metadata.findOne();
    if (!metadata) {
      metadata = await Metadata.create(req.body);
    } else {
      // Update only the fields that are provided in the request
      Object.keys(req.body).forEach(key => {
        if (metadata.schema.paths[key]) {
          metadata[key] = req.body[key];
        }
      });
      await metadata.save();
    }
    res.json(metadata);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 