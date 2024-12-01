// spotify/spotifyAPI.js
const axios = require('axios');
const clientCredentials = require('./spotifyClientCredentials');
const config = require('../config/config');
const logger = require('../utils/logger');
const cache = require('../utils/cache');

if (config.spotify.enableSpotifyIntegration) {
  const CACHE_TTL = 2592000; // 30 days, in seconds

  async function fetchSpotifyData(endpoint, params = {}) {
    const cacheKey = `spotify:${endpoint}:${JSON.stringify(params)}`;
    try {
      // Check if data is in cache
      const cachedData = await cache.get(cacheKey);
      if (cachedData) {
        logger.info(`Serving Spotify data from cache for key: ${cacheKey}`);
        return cachedData;
      }

      // Data not in cache, fetch from Spotify API
      const accessToken = await clientCredentials.getAccessToken();
      const options = {
        method: 'get',
        url: `https://api.spotify.com/v1/${endpoint}`,
        headers: { Authorization: 'Bearer ' + accessToken },
        params: params,
      };

      logger.debug(`Fetching data from Spotify endpoint: ${endpoint}`);
      const response = await axios(options);
      logger.info(`Data fetched successfully from Spotify endpoint: ${endpoint}`);

      // Cache the data
      await cache.set(cacheKey, response.data, CACHE_TTL);

      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 429) {
        // Rate limit exceeded, switch to next client
        logger.warn('Spotify rate limit exceeded, switching to next client');
        clientCredentials.handleRateLimit();
        // Retry the request
        return fetchSpotifyData(endpoint, params);
      } else {
        logger.error(`Error fetching data from Spotify: ${error}`);
        throw error;
      }
    }
  }

  exports.search = (query, type = 'track') => {
    logger.debug(`Initiating Spotify search for query: ${query}`);
    return fetchSpotifyData('search', { q: query, type: type, limit: 10 });
  };
} else {
  // Export a search function that returns a rejected Promise
  exports.search = () => {
    logger.warn('Spotify integration is disabled. Cannot perform search.');
    return Promise.reject(new Error('Spotify integration is disabled.'));
  };
}
