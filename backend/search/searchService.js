// search/searchService.js
const spotifyService = require('../spotify/spotifyService');
const youtubeService = require('../youtube/youtubeService');
const logger = require('../utils/logger');

exports.unifiedSearch = async (query) => {
  try {
    logger.debug(`Starting unified search for query: ${query}`);

    // Initiate both searches in parallel
    const [spotifyData, youtubeData] = await Promise.all([
      spotifyService.search(query),
      youtubeService.searchVideos(query),
    ]);

    logger.debug('Both Spotify and YouTube searches completed');

    // Process and combine the results
    const combinedResults = {
      spotify: spotifyData,
      youtube: youtubeData,
    };

    logger.debug('Combined search results prepared');

    return combinedResults;
  } catch (error) {
    logger.error('Error in unifiedSearch:', error);
    throw error;
  }
};
