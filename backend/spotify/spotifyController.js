// spotify/spotifyController.js
const spotifyAPI = require('./spotifyAPI');
const config = require('../config/config');
const logger = require('../utils/logger');

exports.search = async (req, res) => {
  if (!config.spotify.enableSpotifyIntegration) {
    // This check is redundant because the route won't be defined/reached if Spotify integration is disabled.
    // However, it is kept here for clarity.
    logger.warn('Spotify integration is disabled. Cannot perform search.');
    return res.status(403).json({ error: 'Spotify integration is disabled.' });
  }

  const query = req.query.q;
  const type = req.query.type || 'track';

  if (!query) {
    logger.warn('Missing required parameter: q');
    return res.status(400).json({ error: 'Missing required parameter: q' });
  }

  try {
    logger.debug(`Searching Spotify for query: ${query}, type: ${type}`);
    const data = await spotifyAPI.search(query, type);
    logger.info('Spotify search successful');
    res.json(data);
  } catch (error) {
    logger.error('Error in spotifyController.search:', error);
    res.status(500).json({ error: 'Failed to fetch Spotify data' });
  }
};
