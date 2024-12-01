// youtube/youtubeController.js
const youtubeAPI = require('./youtubeAPI');
const youtubeDataProcessor = require('./youtubeDataProcessor');
const config = require('../config/config');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

exports.searchVideos = async (req, res, next) => {
  try {
    // Accept both 'q' and 'query' as query parameters
    const query = req.query.q || req.query.query;

    if (!query) {
      logger.warn('Query parameter is missing in YouTube search');
      return next(new AppError('Query parameter is required.', 400));
    }

    if (!config.youtube.enableYouTubeIntegration) {
      logger.warn('YouTube integration is disabled, cannot perform search');
      return next(new AppError('YouTube integration is disabled.', 403));
    }

    logger.debug(`Searching YouTube videos for query: ${query}`);
    const apiResults = await youtubeAPI.searchVideos(query);

    // Process the data
    const processedResults = youtubeDataProcessor.processSearchResults(apiResults);

    logger.info('YouTube search successful');
    res.json(processedResults);
  } catch (error) {
    logger.error(`Error in youtubeController.searchVideos: ${error}`);
    next(error);
  }
};

exports.getVideoDetails = async (req, res, next) => {
  try {
    const videoId = req.params.videoId;

    if (!videoId) {
      logger.warn('videoId parameter is missing in getVideoDetails');
      return next(new AppError('videoId parameter is required.', 400));
    }

    if (!config.youtube.enableYouTubeIntegration) {
      logger.warn('YouTube integration is disabled, cannot fetch video details');
      return next(new AppError('YouTube integration is disabled.', 403));
    }

    logger.debug(`Fetching details for YouTube video ID: ${videoId}`);

    const [videoDetailsApiResult, videoStatsApiResult] = await Promise.all([
      youtubeAPI.getVideoDetails(videoId),
      youtubeAPI.getVideoStatistics(videoId),
    ]);

    // Process the data
    const videoDetails = youtubeDataProcessor.processVideoDetails(videoDetailsApiResult);
    const videoStats = youtubeDataProcessor.processVideoStatistics(videoStatsApiResult, req.region);

    const combinedData = { ...videoDetails, ...videoStats };

    logger.info('YouTube video details fetched successfully');
    res.json(combinedData);
  } catch (error) {
    logger.error(`Error in youtubeController.getVideoDetails: ${error}`);
    next(error);
  }
};
