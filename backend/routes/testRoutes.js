// routes/testRoutes.js
const express = require('express');
const testController = require('../controllers/testController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

const router = express.Router();

// Only define routes if in development mode
if (process.env.NODE_ENV === 'development') {
  // Route to display environment variables (for testing purposes)
  router.get('/config', testController.getConfig);

  // Protected dashboard route
  router.get('/dashboard', ensureAuthenticated, testController.getDashboard);
}

module.exports = router;
