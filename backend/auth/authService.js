// auth/authService.js
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const config = require('../config/config');
const axios = require('axios');
const logger = require('../utils/logger');

// Serialize and deserialize user instances to and from the session
passport.serializeUser((user, done) => {
  logger.debug(`Serializing user: ${user.spotifyId}`);
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  logger.debug(`Deserializing user: ${obj.spotifyId}`);
  done(null, obj);
});

// Configure the Spotify strategy for use by Passport (OAuth)
passport.use(
  new SpotifyStrategy(
    {
      clientID: config.spotify.oauthClientId,
      clientSecret: config.spotify.oauthClientSecret,
      callbackURL: config.spotify.redirectUri,
    },
    (accessToken, refreshToken, expires_in, profile, done) => {
      logger.info(`Spotify OAuth successful for user: ${profile.id}`);
      const user = {
        spotifyId: profile.id,
        displayName: profile.displayName,
        photos: profile.photos,
        accessToken: accessToken,
        refreshToken: refreshToken,
        expiresIn: Date.now() + expires_in * 1000, // Convert expires_in to timestamp
      };
      return done(null, user);
    }
  )
);

// Function to refresh the Spotify access token (OAuth)
async function refreshSpotifyToken(refreshToken) {
  const authOptions = {
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    params: {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    },
    headers: {
      Authorization:
        'Basic ' +
        Buffer.from(
          config.spotify.oauthClientId + ':' + config.spotify.oauthClientSecret
        ).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  try {
    logger.debug('Attempting to refresh Spotify access token');
    const response = await axios(authOptions);
    const newAccessToken = response.data.access_token;
    const newExpiresIn = Date.now() + response.data.expires_in * 1000;
    logger.info('Spotify access token refreshed successfully');
    return { newAccessToken, newExpiresIn };
  } catch (error) {
    logger.error(`Failed to refresh Spotify access token: ${error.response.data}`);
    throw error;
  }
}

module.exports = {
  refreshSpotifyToken,
};
