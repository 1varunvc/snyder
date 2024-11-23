// server.js
const express = require('express');
const session = require('express-session');
const config = require('./config/config');
const { authRoutes } = require('./auth');
const { spotifyRoutes } = require('./spotify');
const { youtubeRoutes } = require('./youtube');
const { searchRoutes } = require('./search'); // Added this line
const { testRoutes } = require('./test');
const passport = require('passport');
const { globalLimiter, errorHandler, logger } = require('./utils');
require('./auth/authService'); // Initialize passport strategies

const app = express();

logger.info('Starting the Express server');

// Apply global rate limiter
app.use((req, res, next) => {
  logger.debug('Applying global rate limiter');
  globalLimiter(req, res, next);
});

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

logger.debug('Express session configured');

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

logger.debug('Passport initialized');

// Use authentication routes if enabled
if (config.enableAuthRoutes) {
  logger.info('Authentication routes are enabled');
  app.use('/auth', authRoutes);
}

// Use Spotify routes if Spotify integration is enabled
if (config.spotify.enableSpotifyIntegration) {
  logger.info('Spotify integration is enabled');
  app.use('/api/spotify', spotifyRoutes);
}

// Use YouTube routes if YouTube integration is enabled
if (config.youtube.enableYouTubeIntegration) {
  logger.info('YouTube integration is enabled');
  app.use('/api/youtube', youtubeRoutes);
}

// Use search routes
logger.info('Setting up search routes');
app.use('/api', searchRoutes); // Added this line

// Mount testRoutes only in development
if (config.nodeEnv === 'development') {
  logger.info('Node environment is development, mounting test routes');
  app.use('/', testRoutes);
}

// Default route
app.get('/', (req, res) => {
  logger.debug('Received request on default route');
  res.send('Welcome to Snyder: An upcoming music platform.');
});

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(config.port, () => {
  logger.info(`Server is running on http://localhost:${config.port}`);
});
