// spotify/spotifyClientCredentials.js
const axios = require('axios');
const config = require('../config/config');

if (config.spotify.enableSpotifyIntegration) {
  const clientIds = config.spotify.clientIds;
  const clientSecrets = config.spotify.clientSecrets;

  // Array to hold tokens for each client
  let tokens = [];
  let currentClientIndex = 0;

  // Function to get a new token for a specific client
  async function getNewToken(clientId, clientSecret) {
    const authOptions = {
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      params: {
        grant_type: 'client_credentials',
      },
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(clientId + ':' + clientSecret).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    try {
      const response = await axios(authOptions);
      const accessToken = response.data.access_token;
      const expiresIn = Date.now() + response.data.expires_in * 1000;
      return { accessToken, expiresIn };
    } catch (error) {
      console.error(
        'Failed to get access token:',
        error.response ? error.response.data : error
      );
      throw error;
    }
  }

  // Initialize tokens for all clients
  async function initializeTokens() {
    tokens = await Promise.all(
      clientIds.map(async (clientId, index) => {
        const clientSecret = clientSecrets[index];
        const tokenData = await getNewToken(clientId, clientSecret);
        return {
          clientId,
          clientSecret,
          accessToken: tokenData.accessToken,
          expiresIn: tokenData.expiresIn,
        };
      })
    );
  }

  // Function to get the next available access token
  async function getAccessToken() {
    let tokenData = tokens[currentClientIndex];

    // Check if token has expired or is about to expire
    if (Date.now() >= tokenData.expiresIn - 1000) {
      // Token expired, get a new one
      try {
        const newTokenData = await getNewToken(
          tokenData.clientId,
          tokenData.clientSecret
        );
        tokenData.accessToken = newTokenData.accessToken;
        tokenData.expiresIn = newTokenData.expiresIn;
      } catch (error) {
        console.error('Failed to refresh token:', error);
        // Move to next client
        currentClientIndex = (currentClientIndex + 1) % tokens.length;
        return getAccessToken();
      }
    }

    return tokenData.accessToken;
  }

  // Handle rate limit by switching to next client
  function handleRateLimit() {
    currentClientIndex = (currentClientIndex + 1) % tokens.length;
  }

  // Initialize tokens at startup
  initializeTokens().catch((error) => {
    console.error('Failed to initialize tokens:', error);
  });

  module.exports = {
    getAccessToken,
    handleRateLimit,
  };
} else {
  // Export empty functions or throw errors if integration is disabled
  module.exports = {
    getAccessToken: () => {
      throw new Error('Spotify integration is disabled.');
    },
    handleRateLimit: () => {
      throw new Error('Spotify integration is disabled.');
    },
  };
}
