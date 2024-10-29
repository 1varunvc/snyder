// auth.js
const express = require('express');
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const request = require('request'); // Consider using a modern HTTP client like axios or node-fetch

const router = express.Router();

// Serialize and deserialize user instances to and from the session
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Configure the Spotify strategy for use by Passport
passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
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
    scope: ['user-read-email', 'user-read-private'],
    showDialog: true,
  })
);

// Callback route
router.get(
  '/auth/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication
    res.redirect('/dashboard');
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
  res.redirect('/login'); // Redirect unauthenticated users to login
}

// Function to refresh the Spotify access token
const axios = require('axios');

function refreshSpotifyToken(refreshToken, callback) {
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
          process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
        ).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  axios(authOptions)
    .then((response) => {
      const newAccessToken = response.data.access_token;
      const newExpiresIn = Date.now() + response.data.expires_in * 1000;
      callback(null, newAccessToken, newExpiresIn);
    })
    .catch((error) => {
      console.error('Failed to refresh access token:', error.response.data);
      callback(error, null, null);
    });
}

// Export both the router and utility functions
module.exports = { router, ensureAuthenticated, refreshSpotifyToken };
