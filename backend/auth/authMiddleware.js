// auth/authMiddleware.js
const logger = require('../utils/logger');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    logger.debug('User is authenticated');
    return next();
  }
  logger.warn('User not authenticated, redirecting to /auth/spotify');
  res.status(401).redirect('/auth/spotify'); // Redirect unauthenticated users to login
}

module.exports = {
  ensureAuthenticated,
};
