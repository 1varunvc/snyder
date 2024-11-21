// backend/youtube/youtubeService.js
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

exports.searchVideos = async (query) => {
  const maxResults = 10;
  let attempt = 0;
  let success = false;
  let results;

  while (attempt < config.youtube.apiKeys.length && !success) {
    let apiKey = rotateApiKey();

    logger.debug(`Attempting YouTube API request with API Key: ${apiKey}`);

    const params = {
      key: apiKey,
      q: query + ' Official Audio',
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
      logger.info('YouTube API request successful');
    } catch (error) {
      if (error.response && error.response.status === 403) {
        // Log the key that failed and continue to the next key
        logger.warn(
          `YouTube API key ${apiKey} has reached its limit. Attempt ${
            attempt + 1
          }. Rotating key...`
        );

        // Add a delay before retrying to avoid exhausting all keys too quickly
        await delay(1000);
        attempt++;
      } else {
        // If it's not a rate-limit error, throw the error
        logger.error('Error fetching data from YouTube:', error);
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
