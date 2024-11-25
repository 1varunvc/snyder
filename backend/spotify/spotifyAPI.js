// spotify/spotifyAPI.js
const axios = require('axios');
const clientCredentials = require('./spotifyClientCredentials');
const config = require('../config/config');
const logger = require('../utils/logger');

if (config.spotify.enableSpotifyIntegration) {
  async function fetchSpotifyData(endpoint, params = {}) {
    const accessToken = await clientCredentials.getAccessToken();
    const options = {
      method: 'get',
      url: `https://api.spotify.com/v1/${endpoint}`,
      headers: { Authorization: 'Bearer ' + accessToken },
      params: params,
    };

    try {
      logger.debug(`Fetching data from Spotify endpoint: ${endpoint}`);
      const response = await axios(options);
      logger.info(`Data fetched successfully from Spotify endpoint: ${endpoint}`);
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
