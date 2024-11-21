// backend/youtube/youtubeRoutes.js
const express = require('express');
const router = express.Router();
const youtubeController = require('./youtubeController');
const { youtubeLimiter } = require('../utils');
const logger = require('../utils/logger');

logger.info('Setting up YouTube routes');

router.get('/search', youtubeLimiter, youtubeController.searchVideos);

module.exports = router;
