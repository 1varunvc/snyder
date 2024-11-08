// spotify/spotifyService.js
const axios = require('axios');
const clientCredentials = require('./spotifyClientCredentials');

async function fetchSpotifyData(endpoint, params = {}) {
  const accessToken = await clientCredentials.getAccessToken();
  const options = {
    method: 'get',
    url: `https://api.spotify.com/v1/${endpoint}`,
    headers: { Authorization: 'Bearer ' + accessToken },
    params: params,
  };

  try {
    const response = await axios(options);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      // Rate limit exceeded, switch to next client
      console.warn('Rate limit exceeded, switching to next client');
      clientCredentials.handleRateLimit();
      // Retry the request
      return fetchSpotifyData(endpoint, params);
    } else {
      throw error;
    }
  }
}

exports.search = (query, type) => {
  return fetchSpotifyData('search', { q: query, type: type, limit: 10 });
};
