// utils/index.js
const rateLimiter = require('./rateLimiter');
const errorHandler = require('./errorHandler');
const logger = require('./logger');

module.exports = {
  ...rateLimiter,
  errorHandler,
  logger,
};
