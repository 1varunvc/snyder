// auth/authRoutes.js
const express = require('express');
const passport = require('passport');
const authController = require('./authController');
const config = require('../config/config');

const router = express.Router();

// Only add authentication routes if they are enabled in the config
if (config.spotify.enableAuthRoutes) {
  // Authentication route for Spotify
  router.get(
    '/spotify',
    passport.authenticate('spotify', {
      scope: ['user-read-email'],
      showDialog: true,
    })
  );

  // Callback route
  router.get(
    '/spotify/callback',
    passport.authenticate('spotify', { failureRedirect: '/auth/spotify' }),
    authController.spotifyCallback
  );

  // Logout route
  router.get('/logout', authController.logout);
}

module.exports = router;
