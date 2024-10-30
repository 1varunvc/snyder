// server.js
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const spotifyRoutes = require('./spotifyRoutes'); // Spotify routes using Client Credentials Flow
const { router: authRoutes, ensureAuthenticated } = require('./auth'); // OAuth routes for future use

const app = express();

// Global rate limiter (e.g., max 1000 requests per 15 minutes per IP)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: {
    error: 'Too many requests, please try again later.',
  },
});

// Apply the global rate limiter to all requests
app.use(globalLimiter);

// Configure Express session
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Ensure SESSION_SECRET is set in .env
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      httpOnly: true, // Helps prevent XSS
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// Initialize Passport for OAuth (for future use)
const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

// Use authentication routes (if needed)
app.use(authRoutes);

// Use Spotify data routes
app.use(spotifyRoutes);

// Define other routes
app.get('/', (req, res) => {
  res.send('Welcome to the Snyder App Backend');
});

// For testing purposes only
if (process.env.NODE_ENV === 'development') {
  // The /config route to display environment variables
  app.get('/config', (req, res) => {
    res.json({
      port: process.env.PORT,
      spotifyClientId: process.env.SPOTIFY_OAUTH_CLIENT_ID,
      youtubeApiKeys: process.env.YOUTUBE_API_KEYS
      // Do NOT include sensitive variables like SPOTIFY_CLIENT_SECRET or SESSION_SECRET
    });
  });

  // Protected route - only accessible if the user is logged in
  app.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.json({
      message: 'Welcome to your dashboard',
      user: req.user, // Access the logged-in user's info here
    });
  });
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
