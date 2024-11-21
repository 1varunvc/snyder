// spotify/spotifyRoutes.js
const express = require('express');
const spotifyController = require('./spotifyController');
const { spotifyLimiter } = require('../utils');
const config = require('../config/config');
const logger = require('../utils/logger');

const router = express.Router();

if (config.spotify.enableSpotifyIntegration) {
  logger.info('Setting up Spotify routes');

  // Apply rate limiting middleware to all routes in this router
  router.use((req, res, next) => {
    logger.debug('Applying Spotify rate limiter');
    spotifyLimiter(req, res, next);
  });

  // Define routes
  router.get('/search', spotifyController.search);

  module.exports = router;
} else {
  logger.info('Spotify integration is disabled, not setting up routes');
  // Export an empty object when Spotify integration is disabled
  module.exports = {};
}
