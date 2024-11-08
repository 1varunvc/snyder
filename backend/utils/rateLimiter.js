// utils/rateLimiter.js
const rateLimit = require('express-rate-limit');

// Rate limiter middleware for Spotify routes
const spotifyLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests, please try again later.',
  },
});

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: {
    error: 'Too many requests, please try again later.',
  },
});

module.exports = {
  spotifyLimiter,
  globalLimiter,
};
