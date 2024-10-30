// middleware/authMiddleware.js
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).redirect('/auth/spotify'); // Redirect unauthenticated users to login
}

module.exports = {
  ensureAuthenticated,
};
