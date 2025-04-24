const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const mongoose = require('mongoose');

// GET all videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    console.error('Error getting videos:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST a new video
router.post('/', async (req, res) => {
  const video = new Video({
    title: req.body.title,
    link: req.body.link,
    category: req.body.category
  });

  try {
    const newVideo = await video.save();
    res.status(201).json(newVideo);
  } catch (error) {
    console.error('Error creating video:', error);
    res.status(400).json({ message: error.message });
  }
});

// DELETE a video
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Attempting to delete video with ID: ${id}`);
  
  try {
    // Validate if the id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error('Invalid ObjectId format:', id);
      return res.status(400).json({ message: 'Invalid video ID format' });
    }
    
    const video = await Video.findById(id);
    if (!video) {
      console.error('Video not found with ID:', id);
      return res.status(404).json({ message: 'Video not found' });
    }
    
    console.log('Found video to delete:', video.title);
    const deletedVideo = await Video.findByIdAndDelete(id);
    console.log('Deleted video successfully:', deletedVideo._id);
    
    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE video route:', error);
    res.status(500).json({ message: error.message });
  }
});

// Route for debugging
router.get('/test', async (req, res) => {
  try {
    // Get collection name from the model
    const collectionName = Video.collection.name;
    
    // Get all collections in the database
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    // Check the model structure
    const modelInfo = {
      modelName: Video.modelName,
      collectionName: collectionName,
      schema: Object.keys(Video.schema.paths),
      dbCollections: collectionNames
    };
    
    res.json(modelInfo);
  } catch (error) {
    console.error('Test route error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 