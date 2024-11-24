// youtube/youtubeController.js
const youtubeService = require('./youtubeService');
const config = require('../config/config');
const logger = require('../utils/logger');

exports.searchVideos = async (req, res, next) => {
  try {
    const query = req.query.q || req.query.query;
    const region = req.region || 'US'; // Retrieved from region middleware
    const fetchERating = config.nodeEnv !== 'development'; // Skip fetching eRating in development

    if (!query) {
      logger.warn('Query parameter is missing in YouTube search');
      return res.status(400).json({ error: 'Query parameter is required.' });
    }

    if (!config.youtube.enableYouTubeIntegration) {
      logger.warn('YouTube integration is disabled, cannot perform search');
      return res.status(403).json({ error: 'YouTube integration is disabled.' });
    }

    logger.debug(`Searching YouTube videos for query: ${query}`);
    const results = await youtubeService.searchVideos(query, region, fetchERating);
    logger.info('YouTube search successful');
    res.json({ youtube: results });
  } catch (error) {
    logger.error('Error in youtubeController.searchVideos:', error);
    next(error);
  }
};

/**
 * Controller to fetch additional video details when a user interacts with a search result.
 */
exports.getVideoDetails = async (req, res, next) => {
  try {
    const videoId = req.params.videoId;
    const region = req.region || 'US';

    if (!videoId) {
      logger.warn('Video ID is missing in getVideoDetails');
      return res.status(400).json({ error: 'Video ID is required.' });
    }

    logger.debug(`Fetching details for video ID: ${videoId}`);
    const details = await youtubeService.fetchVideoDetails([videoId], true);
    const videoDetails = details[videoId];

    if (!videoDetails) {
      logger.warn('No details found for the provided video ID');
      return res.status(404).json({ error: 'Video not found.' });
    }

    // Format counts based on region
    videoDetails.viewCount = formatter.formatCount(videoDetails.viewCount, region);
    videoDetails.likeCount = formatter.formatCount(videoDetails.likeCount, region);
    videoDetails.dislikeCount = formatter.formatCount(videoDetails.dislikeCount, region);

    logger.info('Video details fetched successfully');
    res.json(videoDetails);
  } catch (error) {
    logger.error('Error in youtubeController.getVideoDetails:', error);
    next(error);
  }
};
