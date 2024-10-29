// spotifyRoutes.js
const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const { ensureAuthenticated, refreshSpotifyToken } = require('./auth'); // Adjust the path if necessary

const router = express.Router();

// Rate limiter middleware (e.g., max 100 requests per 15 minutes per IP)
const spotifyDataLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests, please try again later.',
  },
});

// Utility function to check token expiration
function isTokenExpired(expiresIn) {
  return Date.now() > expiresIn;
}

// Function to fetch user data from Spotify
async function getSpotifyData(accessToken) {
  const options = {
    method: 'get',
    url: 'https://api.spotify.com/v1/me',
    headers: { Authorization: 'Bearer ' + accessToken },
  };

  const response = await axios(options);
  return response.data;
}

// Route to fetch Spotify data
router.get(
  '/api/spotify-data',
  ensureAuthenticated,
  spotifyDataLimiter, // Apply rate limiting to this route
  async (req, res) => {
    try {
      // Check if token has expired
      if (isTokenExpired(req.user.expiresIn)) {
        // Refresh the access token
        const { newAccessToken, newExpiresIn } = await refreshSpotifyToken(
          req.user.refreshToken
        );

        // Update the user's access token and expiration time
        req.user.accessToken = newAccessToken;
        req.user.expiresIn = newExpiresIn;
        req.session.passport.user = req.user; // Update the session
      }

      // Token is valid, proceed to make the API call
      const spotifyData = await getSpotifyData(req.user.accessToken);
      res.json(spotifyData);
    } catch (error) {
      console.error('Error fetching Spotify data:', error);
      res.status(500).json({ error: 'Failed to fetch Spotify data' });
    }
  }
);

module.exports = router;
