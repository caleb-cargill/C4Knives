const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  sequenceId: {
    type: Number,
    required: false,
    default: 0
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: false,
    default: 0
  },
  isCurrentlyAvailable: {
    type: Boolean,
    required: false,
    default: false
  },
  imageUrl: {
    type: String,
    required: true
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema); 