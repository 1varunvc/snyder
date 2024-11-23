// test/testController.js
const config = require('../config/config');
const logger = require('../utils/logger');

exports.getConfig = (req, res) => {
  logger.debug('Fetching configuration for test');
  res.json({
    port: config.port,
    spotifyClientIds: config.spotify.clientIds.length,
    youtubeApiKeysCount: config.youtube.apiKeys.length,
    nodeEnv: config.nodeEnv,
    // Do NOT include sensitive variables like SPOTIFY_CLIENT_SECRETS or SESSION_SECRET
  });
};

exports.getDashboard = (req, res) => {
  logger.debug('Accessing dashboard');
  res.json({
    message: 'Welcome to your dashboard',
    user: req.user, // Access the logged-in user's info here
  });
};
