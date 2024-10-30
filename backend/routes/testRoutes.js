// routes/testRoutes.js
const express = require('express');
const testController = require('../controllers/testController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const config = require('../config/config');

const router = express.Router();

// Only define routes if in development mode and auth routes are enabled
if (config.nodeEnv === 'development' && config.spotify.enableAuthRoutes) {
  // Route to display environment variables (for testing purposes)
  router.get('/config', testController.getConfig);

  // Protected dashboard route
  router.get('/dashboard', ensureAuthenticated, testController.getDashboard);
}

module.exports = router;
