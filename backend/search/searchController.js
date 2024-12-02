// search/searchController.js
const searchService = require('./searchService');
const logger = require('../utils/logger');
const AppError = require('../utils/errorHandling/AppError');
const { ERRORS } = require('../utils/errorHandling/errors');

/**
 * Controller to handle search requests.
 */
exports.search = async (req, res, next) => {
  const query = req.query.q;

  if (!query) {
    logger.warn('Missing required parameter: q in search');
    // Use AppError with predefined error code
    return next(new AppError(ERRORS.MISSING_QUERY));
  }

  try {
    logger.debug(`Performing unified search for query: ${query}`);
    const results = await searchService.unifiedSearch(query);
    // Explicitly set the status code
    res.status(200).json(results);
    logger.info('Unified search completed; could be successful or unsuccessful');
  } catch (error) {
    logger.error(`Error in searchController.search: ${error}`);
    // If the error is already an instance of AppError, pass it directly
    if (error instanceof AppError) {
      return next(error);
    }
    // For unexpected errors, wrap them in AppError with a generic unknown error code
    next(new AppError(ERRORS.UNKNOWN));
  }
};
