// spotifyRoutes.js
const express = require('express');
const request = require('request'); // Consider using axios or node-fetch for better promise support
const { ensureAuthenticated, refreshSpotifyToken } = require('./auth'); // Adjust the path if necessary

const router = express.Router();

// Utility function to check token expiration
function isTokenExpired(expiresIn) {
  return Date.now() > expiresIn;
}

// Function to fetch user data from Spotify
const axios = require('axios');

function getSpotifyData(accessToken, res) {
  const options = {
    method: 'get',
    url: 'https://api.spotify.com/v1/me',
    headers: { Authorization: 'Bearer ' + accessToken },
  };

  axios(options)
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      res.status(error.response.status).json({ error: error.response.data });
    });
}

// Route to fetch Spotify data
router.get('/api/spotify-data', ensureAuthenticated, (req, res) => {
  // Check if token has expired
  if (isTokenExpired(req.user.expiresIn)) {
    // Refresh the access token
    refreshSpotifyToken(req.user.refreshToken, (err, newAccessToken, newExpiresIn) => {
      if (err) {
        return res.status(500).json({ error: 'Could not refresh access token' });
      }
      // Update the user's access token and expiration time
      req.user.accessToken = newAccessToken;
      req.user.expiresIn = newExpiresIn;
      req.session.passport.user = req.user; // Update the session
      // Proceed to make the API call
      getSpotifyData(req.user.accessToken, res);
    });
  } else {
    // Token is valid, proceed to make the API call
    getSpotifyData(req.user.accessToken, res);
  }
});

module.exports = router;
