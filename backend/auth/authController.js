// auth/authController.js
const logger = require('../utils/logger');

exports.spotifyCallback = (req, res) => {
  if (req.isAuthenticated()) {
    logger.info('Spotify callback successful, user is authenticated');
    res.redirect('/'); // Redirect to home or any other appropriate route
  } else {
    logger.warn('Spotify callback failed, user is not authenticated');
    res.redirect('/auth/spotify'); // Redirect back to login
  }
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
