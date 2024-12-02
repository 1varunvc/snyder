// utils/index.js
const rateLimiter = require('./rateLimiter');
const errorHandler = require('./errorHandling/errorHandler');
const logger = require('./logger');
const formatter = require('./formatter');
const imageProcessor = require('./imageProcessor');
const regionDetector = require('./regionDetector');
const cache = require('./cache');
const redisClient = require('./redisClient');

logger.debug('Initializing utilities module');

module.exports = {
  ...rateLimiter,
  errorHandler,
  logger,
  formatter,
  imageProcessor,
  regionDetector,
  cache,
  redisClient,
};
