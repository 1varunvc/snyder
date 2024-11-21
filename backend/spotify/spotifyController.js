// spotify/spotifyController.js
const spotifyService = require('./spotifyService');
const config = require('../config/config');

exports.search = async (req, res) => {
  if (!config.spotify.enableSpotifyIntegration) {
    // This check is redundant because the route won't be defined/reached if Spotify integration is disabled.
    // However, it is kept here for clarity.
    return res.status(403).json({ error: 'Spotify integration is disabled.' });
  }

  const query = req.query.q;
  const type = req.query.type || 'track';

  if (!query) {
    return res.status(400).json({ error: 'Missing required parameter: q' });
  }

  try {
    const data = await spotifyService.search(query, type);
    res.json(data);
  } catch (error) {
    console.error('Error in spotifyController.search:', error);
    res.status(500).json({ error: 'Failed to fetch Spotify data' });
  }
};
