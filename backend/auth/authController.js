// auth/authController.js
const logger = require('../utils/logger');

exports.spotifyCallback = (req, res) => {
  logger.info('Spotify callback successful, redirecting to /dashboard');
  // Successful authentication
  res.redirect('/dashboard');
};

exports.logout = (req, res, next) => {
  logger.info('User initiating logout');
  req.logout(function (err) {
    if (err) {
      logger.error('Error during logout:', err);
      return next(err);
    }
    req.session.destroy(() => {
      logger.info('Session destroyed, redirecting to /');
      res.redirect('/');
    });
  });
};
