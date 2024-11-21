// server.js
const express = require('express');
const session = require('express-session');
const config = require('./config/config');
const { authRoutes } = require('./auth');
const { spotifyRoutes } = require('./spotify');
const { testRoutes } = require('./test');
const passport = require('passport');
const { globalLimiter, errorHandler } = require('./utils');
require('./auth/authService'); // Initialize passport strategies

const app = express();

// Apply global rate limiter
app.use(globalLimiter);

// Configure Express session
app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: config.nodeEnv === 'production', // Set to true in production
      httpOnly: true, // Helps prevent XSS
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Use authentication routes if enabled
if (config.enableAuthRoutes) {
  app.use('/auth', authRoutes);
}

// Use Spotify routes if Spotify integration is enabled
if (config.spotify.enableSpotifyIntegration) {
  app.use('/api/spotify', spotifyRoutes);
}

// Mount testRoutes only in development
if (config.nodeEnv === 'development') {
  app.use('/', testRoutes);
}

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the Snyder App Backend');
});

// Start the server
app.listen(config.port, () => {
  console.log(`Server is running on http://localhost:${config.port}`);
});
