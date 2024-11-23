// search/index.js
const searchRoutes = require('./searchRoutes');
const logger = require('../utils/logger');

logger.debug('Initializing search module');

module.exports = {
  searchRoutes,
};
