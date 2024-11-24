// youtube/youtubeController.js
const youtubeService = require('./youtubeService');
const config = require('../config/config');
const logger = require('../utils/logger');

exports.searchVideos = async (req, res, next) => {
  try {
    // Accept both 'q' and 'query' as query parameters
    const query = req.query.q || req.query.query;

    if (!query) {
      logger.warn('Query parameter is missing in YouTube search');
      return res.status(400).json({ error: 'Query parameter is required.' });
    }

    if (!config.youtube.enableYouTubeIntegration) {
      logger.warn('YouTube integration is disabled, cannot perform search');
      return res.status(403).json({ error: 'YouTube integration is disabled.' });
    }

    logger.debug(`Searching YouTube videos for query: ${query}`);
    const results = await youtubeService.searchVideos(query);
    logger.info('YouTube search successful');
    res.json(results);
  } catch (error) {
    logger.error('Error in youtubeController.searchVideos:', error);
    next(error);
  }
};
