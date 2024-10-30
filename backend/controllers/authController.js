// controllers/authController.js
exports.spotifyCallback = (req, res) => {
  // Successful authentication
  res.redirect('/dashboard');
};

exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy(() => {
      res.redirect('/');
    });
  });
};
