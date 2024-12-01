// search/searchController.js
const searchService = require('./searchService');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

exports.search = async (req, res, next) => {
  const query = req.query.q;

  if (!query) {
    logger.warn('Missing required parameter: q in search');
    // Use AppError to pass error to error-handling middleware
    return next(new AppError('Missing required parameter: q', 400));
  }

  try {
    logger.debug(`Performing unified search for query: ${query}`);
    const results = await searchService.unifiedSearch(query);
    // TODO: Add a check to know if the search was successful or not.
    logger.info('Unified search completed; could be successful or unsuccessful');
    res.json(results);
  } catch (error) {
    logger.error(`Error in searchController.search: ${error}`);
    // Handle the case where no integrations are enabled
    if (error.message === 'No integrations are enabled for search') {
      return next(new AppError(error.message, 503));
    } else {
      next(error);
    }
  }
};
