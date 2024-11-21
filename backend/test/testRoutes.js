// test/testRoutes.js
const express = require('express');
const testController = require('./testController');
const { ensureAuthenticated } = require('../auth/authMiddleware');
const config = require('../config/config');
const logger = require('../utils/logger');

const router = express.Router();

// Only define routes if in development mode and auth routes are enabled
if (config.nodeEnv === 'development' && config.enableAuthRoutes) {
  logger.info('Setting up test routes');

  // Route to display environment variables (for testing purposes)
  router.get('/config', testController.getConfig);

  // Protected dashboard route
  router.get('/dashboard', ensureAuthenticated, testController.getDashboard);
} else {
  logger.info('Test routes are not enabled');
}

module.exports = router;
