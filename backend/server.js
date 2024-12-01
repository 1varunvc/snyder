// server.js
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/config');
const { authRoutes } = require('./auth');
const { spotifyRoutes } = require('./spotify');
const { youtubeRoutes } = require('./youtube');
const { searchRoutes } = require('./search');
const { testRoutes } = require('./test');
const { globalLimiter, errorHandler, logger } = require('./utils');
const redisClient = require('./utils/redisClient'); // Ensure redisClient is imported

require('./auth/authService'); // Initialize passport strategies

const app = express();

logger.info('Starting the Express server');

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

// Conditionally mount Spotify and YouTube routes only in development
if (config.nodeEnv === 'development') {
  if (config.spotify.enableSpotifyIntegration) {
    logger.info('Spotify integration is enabled in development');
    app.use('/api/spotify', spotifyRoutes);
  }

  if (config.youtube.enableYouTubeIntegration) {
    logger.info('YouTube integration is enabled in development');
    app.use('/api/youtube', youtubeRoutes);
  }
}

// Use search routes
logger.info('Setting up search routes');
app.use('/api', searchRoutes);

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

// Start the server only after Redis is connected
(async () => {
  try {
    // No need to connect here since redisClient.js already handles it
    // Just ensure the Redis client is connected
    if (!redisClient.isOpen) {
      logger.warn('Redis client is not connected yet.');
      await redisClient.connect(); // Optional: depends on your redisClient.js implementation
    }
    logger.info('Redis client connected. Starting server...');
    app.listen(config.port, () => {
      logger.info(`Server is running on http://localhost:${config.port}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1); // Exit the application if server fails to start
  }
})();
