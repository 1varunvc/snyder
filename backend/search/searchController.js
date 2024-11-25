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
    logger.error(`Error in searchController.search: ${error}`);
    // Handle the case where no integrations are enabled
    if (error.message === 'No integrations are enabled for search') {
      res.status(503).json({ error: 'No integrations are enabled for search' });
    } else {
      next(error);
    }
  }
};
