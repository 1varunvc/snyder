// youtube/youtubeAPI.js
const axios = require('axios');
const config = require('../config/config');
const { rotateApiKey } = require('./youtubeClient');
const logger = require('../utils/logger');

/**
 * Utility function to create a delay in milliseconds.
 * @param {number} ms - The number of milliseconds to delay.
 * @returns {Promise} A promise that resolves after the specified delay.
 */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Exponential backoff delay function.
 * @param {number} attempt - The current attempt number.
 * @returns {number} The delay in milliseconds.
 */
function getBackoffDelay(attempt) {
  return Math.pow(2, attempt) * 1000;
}

if (config.youtube.enableYouTubeIntegration) {
  exports.searchVideos = async (query) => {
    const maxResults = 30;
    let attempt = 0;
    let success = false;
    let results;

    while (attempt < config.youtube.apiKeys.length && !success) {
      const apiKey = rotateApiKey();

      logger.debug(`Attempting YouTube API request with API Key: ${apiKey}`);

      const params = {
        key: apiKey,
        q: query,
        part: 'snippet',
        type: 'video',
        videoCategoryId: '10', // Music category
        videoEmbeddable: true,
        maxResults,
      };

      try {
        const response = await axios.get(
          'https://www.googleapis.com/youtube/v3/search',
          { params }
        );
        results = response.data;
        success = true; // If the request is successful, exit the loop
        logger.info('YouTube API search request successful');
      } catch (error) {
        if (error.response && error.response.status === 403) {
          // Log the key that failed and continue to the next key
          logger.warn(
            `YouTube API key ${apiKey} has reached its limit. Attempt ${
              attempt + 1
            }. Rotating key...`
          );

          const backoffDelay = getBackoffDelay(attempt);
          logger.debug(`Waiting for ${backoffDelay} ms before next attempt`);
          await delay(backoffDelay);

          attempt++;
        } else {
          // If it's not a rate-limit error, throw the error
          logger.error(`Error fetching data from YouTube: ${error}`);
          error.apiKey = apiKey; // Attach the API key to the error for debugging
          throw error;
        }
      }
    }

    if (!success) {
      logger.error('All YouTube API keys have reached their limit');
      throw new Error('All API keys have reached their limit.');
    }

    return results;
  };

  exports.getVideoDetails = async (videoId) => {
    let attempt = 0;
    let success = false;
    let results;

    while (attempt < config.youtube.apiKeys.length && !success) {
      const apiKey = rotateApiKey();

      logger.debug(`Attempting YouTube API video details request with API Key: ${apiKey}`);

      const params = {
        key: apiKey,
        id: videoId,
        part: 'snippet,contentDetails',
      };

      try {
        const response = await axios.get(
          'https://www.googleapis.com/youtube/v3/videos',
          { params }
        );
        results = response.data;
        success = true; // If the request is successful, exit the loop
        logger.info('YouTube API video details request successful');
      } catch (error) {
        if (error.response && error.response.status === 403) {
          // Rate limit error, rotate API key
          logger.warn(
            `YouTube API key ${apiKey} has reached its limit. Attempt ${
              attempt + 1
            }. Rotating key...`
          );

          const backoffDelay = getBackoffDelay(attempt);
          logger.debug(`Waiting for ${backoffDelay} ms before next attempt`);
          await delay(backoffDelay);

          attempt++;
        } else {
          // If it's not a rate-limit error, throw the error
          logger.error(`Error fetching video details from YouTube: ${error}`);
          error.apiKey = apiKey; // Attach the API key to the error for debugging
          throw error;
        }
      }
    }

    if (!success) {
      logger.error('All YouTube API keys have reached their limit');
      throw new Error('All YouTube API keys have reached their limit.');
    }

    return results;
  };

  exports.getVideoStatistics = async (videoId) => {
    try {
      logger.debug(
        `Fetching video statistics from Return YouTube Dislike API for video ID: ${videoId}`
      );
      const response = await axios.get(
        `https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`
      );
      return response.data;
    } catch (error) {
      logger.error(`Error fetching data from Return YouTube Dislike API: ${error}`);
      throw error;
    }
  };
} else {
  // Export functions that return a rejected Promise
  exports.searchVideos = () => {
    logger.warn('YouTube integration is disabled. Cannot perform search.');
    return Promise.reject(new Error('YouTube integration is disabled.'));
  };

  exports.getVideoDetails = () => {
    logger.warn('YouTube integration is disabled. Cannot fetch video details.');
    return Promise.reject(new Error('YouTube integration is disabled.'));
  };

  exports.getVideoStatistics = () => {
    logger.warn('YouTube integration is disabled. Cannot fetch video statistics.');
    return Promise.reject(new Error('YouTube integration is disabled.'));
  };
}
