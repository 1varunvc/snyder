// config/config.js
const dotenv = require('dotenv');

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : (process.env.NODE_ENV === 'development' ? '.env.development' : '.env');
dotenv.config({ path: envFile });

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV,
  sessionSecret: process.env.SESSION_SECRET,
  enableAuthRoutes: process.env.ENABLE_AUTH_ROUTES === 'true',
  spotify: {
    clientIds: process.env.SPOTIFY_CLIENT_IDS.split(','),
    clientSecrets: process.env.SPOTIFY_CLIENT_SECRETS.split(','),
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    oauthClientId: process.env.SPOTIFY_OAUTH_CLIENT_ID,
    oauthClientSecret: process.env.SPOTIFY_OAUTH_CLIENT_SECRET,
    enableSpotifyIntegration: process.env.ENABLE_SPOTIFY_INTEGRATION === 'true'
  },
  youtubeApiKeys: process.env.YOUTUBE_API_KEYS.split(','),
  mongoUri: process.env.MONGODB_URI,
};
