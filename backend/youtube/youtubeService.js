// backend/youtube/youtubeService.js
const axios = require('axios');
const config = require('../config/config');
const { rotateApiKey } = require('./youtubeClient');
const logger = require('../utils/logger');

exports.searchVideos = async (query) => {
  let apiKey = rotateApiKey();
  const maxResults = 10; // You can adjust this number

  const params = {
    key: apiKey,
    q: query,
    part: 'snippet',
    type: 'video',
    maxResults,
  };

  try {
    const response = await axios.get(
      'https://www.googleapis.com/youtube/v3/search',
      { params }
    );
    logger.warn(`API key ${apiKey} has reached its limit. Rotating key...`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 403) {
      // Rate limit reached, rotate API key and retry
      apiKey = rotateApiKey();
      params.key = apiKey;
      const retryResponse = await axios.get(
        'https://www.googleapis.com/youtube/v3/search',
        { params }
      );
      return retryResponse.data;
    } else {
      throw error;
    }
  }
};
