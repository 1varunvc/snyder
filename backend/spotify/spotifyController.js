// spotify/spotifyController.js
const spotifyAPI = require('./spotifyAPI');
const config = require('../config/config');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

exports.search = async (req, res, next) => {
  if (!config.spotify.enableSpotifyIntegration) {
    // This check is redundant because the route won't be defined/reached if Spotify integration is disabled.
    // However, it is kept here for clarity.
    logger.warn('Spotify integration is disabled. Cannot perform search.');
    return next(new AppError('Spotify integration is disabled.', 403));
  }

  const query = req.query.q;
  const type = req.query.type || 'track';

  if (!query) {
    logger.warn('Missing required parameter: q');
    return next(new AppError('Missing required parameter: q', 400));
  }

  try {
    logger.debug(`Searching Spotify for query: ${query}, type: ${type}`);
    const data = await spotifyAPI.search(query, type);
    logger.info('Spotify search successful');
    res.json(data);
  } catch (error) {
    logger.error(`Error in spotifyController.search: ${error}`);
    next(error);
  }
};
