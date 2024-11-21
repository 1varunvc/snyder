// backend/youtube/youtubeClient.js
const config = require('../config/config');

let apiKeyIndex = 0;
let apiKeys = config.youtube.apiKeys;

function rotateApiKey() {
  apiKeyIndex = (apiKeyIndex + 1) % apiKeys.length;
  return apiKeys[apiKeyIndex];
}

module.exports = {
  rotateApiKey,
};
