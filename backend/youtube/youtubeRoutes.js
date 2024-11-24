// youtube/youtubeRoutes.js
const express = require('express');
const router = express.Router();
const youtubeController = require('./youtubeController');
const { youtubeLimiter } = require('../utils');
const config = require('../config/config');
const logger = require('../utils/logger');

logger.info('Setting up YouTube routes');

// Middleware to check if in development mode
function checkDevelopmentMode(req, res, next) {
  if (config.nodeEnv !== 'development') {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
}

// Apply the middleware
router.use(checkDevelopmentMode);

router.get('/search', youtubeLimiter, youtubeController.searchVideos);

module.exports = router;
