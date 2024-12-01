// search/searchService.js
const spotifyAPI = require('../spotify/spotifyAPI');
const youtubeAPI = require('../youtube/youtubeAPI');
const youtubeDataProcessor = require('../youtube/youtubeDataProcessor');
const config = require('../config/config');
const logger = require('../utils/logger');
const cache = require('../utils/cache');
const AppError = require('../utils/AppError');
const { ERROR_DEFINITIONS, ERRORS } = require('../utils/errors');

/**
 * Service to perform unified search across Spotify and YouTube integrations.
 * @param {string} query - The search query.
 * @returns {object} - The search results.
 */
exports.unifiedSearch = async (query) => {
  const cacheKey = `unifiedSearch:${query}`;
  const CACHE_TTL = 2592000; // 30 days, in seconds

  try {
    // Check if data is in cache
    const cachedData = await cache.get(cacheKey);
    if (cachedData) {
      logger.info(`Serving unified search results from cache for query: ${query}`);
      return cachedData;
    }

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
            results.spotify = {
              error: ERROR_DEFINITIONS[ERRORS.SPOTIFY_FETCH].message,
              errorCode: ERRORS.SPOTIFY_FETCH,
            };
          })
      );
    } else {
      logger.info('Spotify integration is disabled, skipping Spotify search');
      results.spotify = {
        error: ERROR_DEFINITIONS[ERRORS.SPOTIFY_DISABLED].message,
        errorCode: ERRORS.SPOTIFY_DISABLED,
      };
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
            results.youtube = {
              error: ERROR_DEFINITIONS[ERRORS.YOUTUBE_FETCH].message,
              errorCode: ERRORS.YOUTUBE_FETCH,
            };
          })
      );
    } else {
      logger.info('YouTube integration is disabled, skipping YouTube search');
      results.youtube = {
        error: ERROR_DEFINITIONS[ERRORS.YOUTUBE_DISABLED].message,
        errorCode: ERRORS.YOUTUBE_DISABLED,
      };
    }

    // If no integrations are enabled, throw an AppError
    if (!config.spotify.enableSpotifyIntegration && !config.youtube.enableYouTubeIntegration) {
      logger.warn('No integrations are enabled, cannot perform search');
      throw new AppError(ERRORS.NO_INTEGRATIONS);
    }

    // Wait for all enabled searches to complete
    await Promise.all(searchPromises);

    logger.debug('Searches completed');

    // Cache the unified search results
    await cache.set(cacheKey, results, CACHE_TTL);

    return results;
  } catch (error) {
    logger.error(`Error in unifiedSearch: ${error}`);
    throw error;
  }
};
