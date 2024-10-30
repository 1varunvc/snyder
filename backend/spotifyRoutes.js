// spotifyRoutes.js
const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const { getAccessToken, handleRateLimit } = require('./spotifyClientCredentials'); // Import the client credentials module

const router = express.Router();

// Rate limiter middleware (e.g., max 100 requests per 30 seconds per IP)
const spotifyDataLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests, please try again later.',
  },
});

// Function to fetch data from Spotify API
async function fetchSpotifyData(endpoint, params = {}) {
  const accessToken = await getAccessToken();
  const options = {
    method: 'get',
    url: `https://api.spotify.com/v1/${endpoint}`,
    headers: { Authorization: 'Bearer ' + accessToken },
    params: params,
  };

  try {
    const response = await axios(options);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      // Rate limit exceeded, switch to next client
      console.warn('Rate limit exceeded, switching to next client');
      handleRateLimit();
      // Retry the request
      return fetchSpotifyData(endpoint, params);
    } else {
      throw error;
    }
  }
}

// Route to search Spotify
router.get('/api/spotify-search', spotifyDataLimiter, async (req, res) => {
  const query = req.query.q;
  const type = req.query.type || 'track';

  if (!query) {
    return res.status(400).json({ error: 'Missing required parameter: q' });
  }

  try {
    const data = await fetchSpotifyData('search', { q: query, type: type, limit: 10 });
    res.json(data);
  } catch (error) {
    console.error('Error fetching Spotify data:', error);
    res.status(500).json({ error: 'Failed to fetch Spotify data' });
  }
});

module.exports = router;
