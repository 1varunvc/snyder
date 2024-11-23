// search/searchController.js
const searchService = require('./searchService');
const logger = require('../utils/logger');

exports.search = async (req, res, next) => {
  const query = req.query.q;

  if (!query) {
    logger.warn('Missing required parameter: q in search');
    return res.status(400).json({ error: 'Missing required parameter: q' });
  }

  try {
    logger.debug(`Performing unified search for query: ${query}`);
    const results = await searchService.unifiedSearch(query);
    logger.info('Unified search successful');
    res.json(results);
  } catch (error) {
    logger.error('Error in searchController.search:', error);
    next(error);
  }
};
