const express = require('express');
const router = express.Router();
const Spotlight = require('../models/Spotlight');
const { authMiddleware } = require('../middleware/auth');

// @route   GET api/spotlight
// @desc    Get current spotlight
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Get latest spotlight
    const spotlight = await Spotlight.findOne().sort({ updatedAt: -1 });
    
    // If no spotlight exists, return empty
    if (!spotlight) {
      return res.json(null);
    }
    
    res.json(spotlight);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/spotlight
// @desc    Update spotlight
// @access  Private
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, imageUrl, videoUrl } = req.body;
    
    // Find current spotlight, or create if doesn't exist
    let spotlight = await Spotlight.findOne().sort({ updatedAt: -1 });
    
    if (spotlight) {
      // Update existing spotlight
      spotlight.title = title;
      spotlight.description = description;
      spotlight.imageUrl = imageUrl;
      spotlight.videoUrl = videoUrl;
      spotlight.updatedAt = Date.now();
    } else {
      // Create new spotlight
      spotlight = new Spotlight({
        title,
        description,
        imageUrl,
        videoUrl
      });
    }
    
    await spotlight.save();
    res.json(spotlight);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 