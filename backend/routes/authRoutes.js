// routes/authRoutes.js
const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');

const router = express.Router();

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

module.exports = router;
