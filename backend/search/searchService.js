// search/searchService.js
const spotifyService = require('../spotify/spotifyService');
const youtubeService = require('../youtube/youtubeService');
const config = require('../config/config');
const logger = require('../utils/logger');

exports.unifiedSearch = async (query, region) => {
  try {
    logger.debug(`Starting unified search for query: ${query}`);

    const results = {};

    const searchPromises = [];

    // YouTube Search
    if (config.youtube.enableYouTubeIntegration) {
      logger.debug('YouTube integration is enabled, adding YouTube search');
      searchPromises.push(
        youtubeService
          .searchVideos(query, region)
          .then((data) => {
            results.youtube = data;
          })
          .catch((error) => {
            logger.error('Error in YouTube search:', error);
            results.youtube = { error: 'Failed to fetch YouTube data' };
          })
      );
    } else {
      logger.info('YouTube integration is disabled, skipping YouTube search');
      results.youtube = { error: 'YouTube integration is disabled' };
    }

    // Spotify Search (Placeholder for future integration)
    if (config.spotify.enableSpotifyIntegration) {
      logger.debug('Spotify integration is enabled, adding Spotify search');
      searchPromises.push(
        spotifyService
          .search(query)
          .then((data) => {
            results.spotify = data;
          })
          .catch((error) => {
            logger.error('Error in Spotify search:', error);
            results.spotify = { error: 'Failed to fetch Spotify data' };
          })
      );
    } else {
      logger.info('Spotify integration is disabled, skipping Spotify search');
      results.spotify = { error: 'Spotify integration is disabled' };
    }

    if (searchPromises.length === 0) {
      logger.warn('No integrations are enabled, cannot perform search');
      throw new Error('No integrations are enabled for search');
    }

    await Promise.all(searchPromises);

    logger.debug('Searches completed');

    return results;
  } catch (error) {
    logger.error('Error in unifiedSearch:', error);
    throw error;
  }
};
