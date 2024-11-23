// search/searchRoutes.js
const express = require('express');
const searchController = require('./searchController');
const { searchLimiter } = require('../utils');
const logger = require('../utils/logger');

const router = express.Router();

logger.info('Setting up search routes');

// Apply rate limiting middleware to all routes in this router
router.use((req, res, next) => {
  logger.debug('Applying search rate limiter');
  searchLimiter(req, res, next);
});

// Define the /search endpoint
router.get('/search', searchController.search);

module.exports = router;
