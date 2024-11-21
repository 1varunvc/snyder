// test/index.js
const testRoutes = require('./testRoutes');
const logger = require('../utils/logger');

logger.debug('Initializing test module');

module.exports = {
  testRoutes,
};
