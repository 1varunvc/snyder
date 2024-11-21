// spotify/spotifyRoutes.js
const express = require('express');
const spotifyController = require('./spotifyController');
const { spotifyLimiter } = require('../utils');
const config = require('../config/config');

const router = express.Router();

if (config.spotify.enableSpotifyIntegration) {
  // Apply rate limiting middleware to all routes in this router
  router.use(spotifyLimiter);

  // Define routes
  router.get('/search', spotifyController.search);

  module.exports = router;
} else {
  // Export an empty object when Spotify integration is disabled
  module.exports = {};
}
