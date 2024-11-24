// youtube/youtubeRoutes.js
const express = require('express');
const router = express.Router();
const youtubeController = require('./youtubeController');
const { youtubeLimiter } = require('../utils');
const config = require('../config/config');
const logger = require('../utils/logger');
const regionMiddleware = require('../middleware/regionMiddleware');

logger.info('Setting up YouTube routes');

// Middleware to check if YouTube integration is enabled
function checkYouTubeIntegration(req, res, next) {
  if (!config.youtube.enableYouTubeIntegration) {
    return res.status(403).json({ error: 'YouTube integration is disabled' });
  }
  next();
}

// Apply the middleware
router.use(checkYouTubeIntegration);

// Apply region detection middleware
router.use(regionMiddleware);

// Define routes
router.get('/search', youtubeLimiter, youtubeController.searchVideos);
router.get('/details/:videoId', youtubeLimiter, youtubeController.getVideoDetails);

module.exports = router;
