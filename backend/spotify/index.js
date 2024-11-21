// spotify/index.js
const spotifyRoutes = require('./spotifyRoutes');
const spotifyService = require('./spotifyService');
const config = require('../config/config');

if (config.spotify.enableSpotifyIntegration) {
  module.exports = {
    spotifyRoutes,
    spotifyService,
  };
} else {
// If Spotify integration is not enabled, export an empty object or null
  module.exports = {};
}