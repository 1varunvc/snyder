// spotify/index.js
const spotifyRoutes = require('./spotifyRoutes');
const spotifyAPI = require('./spotifyAPI');
const config = require('../config/config');
const logger = require('../utils/logger');

if (config.spotify.enableSpotifyIntegration) {
  logger.info('Spotify integration is enabled');
  module.exports = {
    spotifyRoutes,
    spotifyAPI,
  };
} else {
  logger.info('Spotify integration is disabled');
  // If Spotify integration is not enabled, export an empty object or null
  module.exports = {};
}
