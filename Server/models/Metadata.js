const mongoose = require('mongoose');

const metadataSchema = new mongoose.Schema({
  knifeCounter: {
    type: Number,
    required: true,
    default: 0
  },
  email: {
    type: String,
    required: true,
    default: ''
  },
  phone: {
    type: String,
    required: true,
    default: ''
  },
  address: {  
    type: String,
    required: true,
    default: ''
  },
  instagram: {
    type: String, 
    required: true,
    default: ''
  },
  facebook: {
    type: String,
    required: true,
    default: '' 
  },
  youtube: {
    type: String,
    required: true,
    default: ''
  }
});

module.exports = mongoose.model('Metadata', metadataSchema); 