// config/config.js
const dotenv = require('dotenv');
const logger = require('../utils/logger');

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : process.env.NODE_ENV === 'development' ? '.env.development' : '.env';

dotenv.config({ path: envFile });

logger.info(`Configuration loaded from ${envFile}`);

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV,
  sessionSecret: process.env.SESSION_SECRET,
  enableAuthRoutes: process.env.ENABLE_AUTH_ROUTES === 'true',
  spotify: {
    clientIds: process.env.SPOTIFY_CLIENT_IDS ? process.env.SPOTIFY_CLIENT_IDS.split(',') : [],
    clientSecrets: process.env.SPOTIFY_CLIENT_SECRETS ? process.env.SPOTIFY_CLIENT_SECRETS.split(',') : [],
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    oauthClientId: process.env.SPOTIFY_OAUTH_CLIENT_ID,
    oauthClientSecret: process.env.SPOTIFY_OAUTH_CLIENT_SECRET,
    enableSpotifyIntegration: process.env.ENABLE_SPOTIFY_INTEGRATION === 'true',
  },
  youtube: {
    apiKeys: process.env.YOUTUBE_API_KEYS ? process.env.YOUTUBE_API_KEYS.split(',') : [],
    enableYouTubeIntegration: process.env.ENABLE_YOUTUBE_INTEGRATION === 'true',
  },
  mongoUri: process.env.MONGODB_URI,
};
