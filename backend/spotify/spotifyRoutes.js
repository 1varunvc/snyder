// spotify/spotifyRoutes.js
const express = require('express');
const spotifyController = require('./spotifyController');
const { spotifyLimiter } = require('../utils');

const router = express.Router();

// Apply rate limiting middleware to all routes in this router
router.use(spotifyLimiter);

// Define routes
router.get('/search', spotifyController.search);

module.exports = router;
