// routes/spotifyRoutes.js
const express = require('express');
const spotifyController = require('../controllers/spotifyController');
const rateLimiter = require('../middleware/rateLimiter');

const router = express.Router();

// Apply rate limiting middleware to all routes in this router
router.use(rateLimiter.spotifyLimiter);

// Define routes
router.get('/search', spotifyController.search);

module.exports = router;
