// auth.js
const express = require('express');
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const axios = require('axios');

const router = express.Router();

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
      clientID: process.env.SPOTIFY_OAUTH_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_OAUTH_CLIENT_SECRET,
      callbackURL: process.env.SPOTIFY_REDIRECT_URI,
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

// Authentication route for Spotify
router.get(
  '/auth/spotify',
  passport.authenticate('spotify', {
    scope: ['user-read-email'],
    showDialog: true,
  })
);

// Callback route
router.get(
  '/auth/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication
    res.redirect('/');
  }
);

// Logout route
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/spotify'); // Redirect unauthenticated users to login
}

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
          process.env.SPOTIFY_OAUTH_CLIENT_ID + ':' + process.env.SPOTIFY_OAUTH_CLIENT_SECRET
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

// Export both the router and utility functions
module.exports = { router, ensureAuthenticated, refreshSpotifyToken };
