// auth/authRoutes.js
const express = require('express');
const passport = require('passport');
const authController = require('./authController');
const config = require('../config/config');
const logger = require('../utils/logger');

const router = express.Router();

// Only add authentication routes if they are enabled in the config
if (config.enableAuthRoutes) {
  logger.info('Authentication routes are enabled');

  // Authentication route for Spotify
  router.get(
    '/spotify',
    (req, res, next) => {
      logger.debug('Initiating Spotify authentication');
      next();
    },
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
} else {
  logger.info('Authentication routes are disabled');
}

module.exports = router;
