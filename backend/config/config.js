// config/config.js
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  sessionSecret: process.env.SESSION_SECRET,
  spotify: {
    clientIds: process.env.SPOTIFY_CLIENT_IDS.split(','),
    clientSecrets: process.env.SPOTIFY_CLIENT_SECRETS.split(','),
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    oauthClientId: process.env.SPOTIFY_OAUTH_CLIENT_ID,
    oauthClientSecret: process.env.SPOTIFY_OAUTH_CLIENT_SECRET,
  },
  youtubeApiKeys: process.env.YOUTUBE_API_KEYS.split(','),
  mongoUri: process.env.MONGODB_URI,
};
