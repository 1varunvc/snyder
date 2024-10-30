// test/testController.js
const config = require('../config/config');

exports.getConfig = (req, res) => {
  res.json({
    port: config.port,
    spotifyClientIds: config.spotify.clientIds,
    youtubeApiKeys: config.youtubeApiKeys,
    // Do NOT include sensitive variables like SPOTIFY_CLIENT_SECRETS or SESSION_SECRET
  });
};

exports.getDashboard = (req, res) => {
  res.json({
    message: 'Welcome to your dashboard',
    user: req.user, // Access the logged-in user's info here
  });
};
