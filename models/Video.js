const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  link: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Music', 'Education', 'Coding', 'Entertainment', 'News', 'Other']
  }
}, {
  timestamps: true
});

// Validate YouTube URL
videoSchema.path('link').validate((value) => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  return youtubeRegex.test(value);
}, 'Please enter a valid YouTube URL');

module.exports = mongoose.model('Video', videoSchema); 