// middleware/regionMiddleware.js
const logger = require('../utils/logger');

module.exports = (req, res, next) => {
  // Try to get region from request headers
  const region = req.headers['x-region'] || req.headers['x-locale'];

  if (region) {
    req.region = region.toUpperCase();
    logger.debug(`Region detected from headers: ${req.region}`);
  } else {
    // Default region if not provided
    req.region = 'US';
    logger.debug('No region provided, defaulting to US');
  }

  next();
};
