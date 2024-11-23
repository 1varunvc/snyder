// auth/authController.js
const logger = require('../utils/logger');

exports.spotifyCallback = (req, res) => {
  if (req.isAuthenticated()) {
    logger.info('Spotify callback successful, user is authenticated');

    // Retrieve the URL to redirect to from the session
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo; // Clear the returnTo value from session

    logger.debug(`Redirecting to: ${redirectUrl}`);
    res.redirect(redirectUrl); // Redirect to the original URL
  } else {
    logger.warn('Spotify callback failed, user is not authenticated');
    res.redirect('/auth/spotify'); // Redirect back to login
  }
};

exports.logout = (req, res, next) => {
  logger.info('User initiating logout');

  // Determine the redirect URL after logout
  const redirectUrl = req.query.returnTo || '/';
  logger.debug(`Redirecting to: ${redirectUrl}`);

  req.logout(function (err) {
    if (err) {
      logger.error('Error during logout:', err);
      return next(err);
    }
    req.session.destroy(() => {
      logger.info('Session destroyed, redirecting to home');
      res.redirect(redirectUrl);
    });
  });
};
