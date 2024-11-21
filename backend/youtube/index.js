// backend/youtube/index.js
const youtubeRoutes = require('./youtubeRoutes');
const logger = require('../utils/logger');

logger.debug('Initializing YouTube module');

module.exports = {
  youtubeRoutes,
};
