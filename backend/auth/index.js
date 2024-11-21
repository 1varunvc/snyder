// auth/index.js
const authRoutes = require('./authRoutes');
const authMiddleware = require('./authMiddleware');
const logger = require('../utils/logger');

logger.debug('Initializing authentication module');

module.exports = {
  authRoutes,
  authMiddleware,
};
