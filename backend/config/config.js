// config/config.js
const dotenv = require('dotenv');
const path = require('path');
const logger = require('../utils/logger');

const NODE_ENV = process.env.NODE_ENV || 'development';

const envFile =
  NODE_ENV === 'production'
    ? path.resolve(__dirname, '../.env.production')
    : NODE_ENV === 'development'
      ? path.resolve(__dirname, '../.env.development')
      : path.resolve(__dirname, '../.env');

const result = dotenv.config({ path: envFile });

if (result.error) {
  logger.error(`Error loading ${envFile}:`, result.error);
  process.exit(1);
} else {
  logger.info(`Configuration loaded from ${envFile}`);
}

logger.debug('ENABLE_SPOTIFY_INTEGRATION:', process.env.ENABLE_SPOTIFY_INTEGRATION);
logger.debug('ENABLE_YOUTUBE_INTEGRATION:', process.env.ENABLE_YOUTUBE_INTEGRATION);
logger.debug('ENABLE_AUTH_ROUTES:', process.env.ENABLE_AUTH_ROUTES);

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: NODE_ENV,
  sessionSecret: process.env.SESSION_SECRET,
  enableAuthRoutes: process.env.ENABLE_AUTH_ROUTES === 'true',
  spotify: {
    clientIds: process.env.SPOTIFY_CLIENT_IDS
      ? process.env.SPOTIFY_CLIENT_IDS.split(',')
      : [],
    clientSecrets: process.env.SPOTIFY_CLIENT_SECRETS
      ? process.env.SPOTIFY_CLIENT_SECRETS.split(',')
      : [],
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    oauthClientId: process.env.SPOTIFY_OAUTH_CLIENT_ID,
    oauthClientSecret: process.env.SPOTIFY_OAUTH_CLIENT_SECRET,
    enableSpotifyIntegration: process.env.ENABLE_SPOTIFY_INTEGRATION === 'true',
  },
  youtube: {
    apiKeys: process.env.YOUTUBE_API_KEYS
      ? process.env.YOUTUBE_API_KEYS.split(',')
      : [],
    enableYouTubeIntegration: process.env.ENABLE_YOUTUBE_INTEGRATION === 'true',
  },
  mongoUri: process.env.MONGODB_URI,
};
