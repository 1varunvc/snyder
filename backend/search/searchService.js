// search/searchService.js
const spotifyAPI = require('../spotify/spotifyAPI');
const youtubeAPI = require('../youtube/youtubeAPI');
const youtubeDataProcessor = require('../youtube/youtubeDataProcessor');
const config = require('../config/config');
const logger = require('../utils/logger');

exports.unifiedSearch = async (query) => {
  try {
    logger.debug(`Starting unified search for query: ${query}`);

    const results = {
      spotify: null, // Initialize to null
      youtube: null, // Initialize to null
    };

    const searchPromises = [];

    // Check if Spotify integration is enabled
    if (config.spotify.enableSpotifyIntegration) {
      logger.debug('Spotify integration is enabled, adding Spotify search');
      searchPromises.push(
        spotifyAPI
          .search(query)
          .then((data) => {
            results.spotify = data;
          })
          .catch((error) => {
            logger.error(`Error in Spotify search: ${error}`);
            results.spotify = { error: 'Failed to fetch Spotify data' };
          })
      );
    } else {
      logger.info('Spotify integration is disabled, skipping Spotify search');
      results.spotify = { error: 'Spotify integration is disabled' };
    }

    // Check if YouTube integration is enabled
    if (config.youtube.enableYouTubeIntegration) {
      logger.debug('YouTube integration is enabled, adding YouTube search');
      searchPromises.push(
        youtubeAPI
          .searchVideos(query)
          .then((apiResults) => {
            const processedResults = youtubeDataProcessor.processSearchResults(apiResults);
            results.youtube = processedResults.youtube;
          })
          .catch((error) => {
            logger.error(`Error in YouTube search: ${error}`);
            results.youtube = { error: 'Failed to fetch YouTube data' };
          })
      );
    } else {
      logger.info('YouTube integration is disabled, skipping YouTube search');
      results.youtube = { error: 'YouTube integration is disabled' };
    }

    // If no integrations are enabled, throw an error
    if (searchPromises.length === 0) {
      logger.warn('No integrations are enabled, cannot perform search');
      // noinspection ExceptionCaughtLocallyJS
      throw new Error('No integrations are enabled for search');
    }

    // Wait for all enabled searches to complete
    await Promise.all(searchPromises);

    logger.debug('Searches completed');

    return results;
  } catch (error) {
    logger.error(`Error in unifiedSearch: ${error}`);
    throw error;
  }
};
