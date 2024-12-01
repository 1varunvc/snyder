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
    return next(new AppError('Spotify integration is disabled.', 403, 'ERR-SPOTIFY_DISABLED'));
  }

  const query = req.query.q;
  const type = req.query.type || 'track';

  if (!query) {
    logger.warn('Missing required parameter: q');
    return next(new AppError('Missing required parameter: q', 400, 'ERR-SPOTIFY_MISSING_QUERY'));
  }

  try {
    logger.debug(`Searching Spotify for query: ${query}, type: ${type}`);
    const data = await spotifyAPI.search(query, type);
    logger.info('Spotify search successful');
    res.status(200).json(data);
  } catch (error) {
    logger.error(`Error in spotifyController.search: ${error}`);
    // If the error is an instance of AppError, pass it directly
    if (error instanceof require('../utils/AppError')) {
      return next(error);
    }
    // For other errors, wrap them in an AppError
    next(new AppError('Failed to fetch Spotify data.', 500, 'ERR-SPOTIFY_FETCH_FAILED'));
  }
};
