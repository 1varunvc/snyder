// controllers/authController.js
exports.spotifyCallback = (req, res) => {
  // Successful authentication
  res.redirect('/');
};

exports.logout = (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
};
