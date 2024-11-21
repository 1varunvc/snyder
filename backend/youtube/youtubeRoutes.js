// backend/youtube/youtubeRoutes.js
const express = require('express');
const router = express.Router();
const youtubeController = require('./youtubeController');
const { youtubeLimiter } = require('../utils');

router.get('/search', youtubeLimiter, youtubeController.searchVideos);

module.exports = router;
