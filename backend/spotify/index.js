// spotify/index.js
const spotifyRoutes = require('./spotifyRoutes');
const spotifyService = require('./spotifyService');
const config = require('../config/config');
const logger = require('../utils/logger');

if (config.spotify.enableSpotifyIntegration) {
  logger.info('Spotify integration is enabled');
  module.exports = {
    spotifyRoutes,
    spotifyService,
  };
} else {
  logger.info('Spotify integration is disabled');
  // If Spotify integration is not enabled, export an empty object or null
  module.exports = {};
}
