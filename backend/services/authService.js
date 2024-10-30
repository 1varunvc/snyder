// services/authService.js
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const config = require('../config/config');
const axios = require('axios');

// Serialize and deserialize user instances to and from the session
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
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
    const response = await axios(authOptions);
    const newAccessToken = response.data.access_token;
    const newExpiresIn = Date.now() + response.data.expires_in * 1000;
    return { newAccessToken, newExpiresIn };
  } catch (error) {
    console.error('Failed to refresh access token:', error.response.data);
    throw error;
  }
}

module.exports = {
  refreshSpotifyToken,
};
