// youtube/youtubeClient.js
const config = require('../config/config');
const logger = require('../utils/logger');

// Index to keep track of the current key
let apiKeyIndex = 0;
const apiKeys = config.youtube.apiKeys;

/**
 * Function to get the next API key in a round-robin manner.
 * This function rotates the key to ensure balanced usage.
 */
function rotateApiKey() {
  // Get the current key based on the index
  const apiKey = apiKeys[apiKeyIndex];
  logger.debug(`Rotating YouTube API key. Current index: ${apiKeyIndex}`);
  // Increment the index for the next key, looping back if needed
  apiKeyIndex = (apiKeyIndex + 1) % apiKeys.length;
  return apiKey;
}

module.exports = {
  rotateApiKey,
};
