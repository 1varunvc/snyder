// utils/rateLimiter.js
const rateLimit = require('express-rate-limit');
const logger = require('./logger');

// Rate limiter middleware for Spotify routes
const spotifyLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 100, // limit each IP to 100 requests per windowMs
  handler: (req, res) => {
    logger.warn('Spotify rate limit exceeded for IP:', req.ip);
    res.status(429).json({
      error: 'Too many requests, please try again later.',
    });
  },
});

// Rate limiter middleware for YouTube routes
const youtubeLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 100, // adjust as needed
  handler: (req, res) => {
    logger.warn('YouTube rate limit exceeded for IP:', req.ip);
    res.status(429).json({
      error: 'Too many requests, please try again later.',
    });
  },
});

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  handler: (req, res) => {
    logger.warn('Global rate limit exceeded for IP:', req.ip);
    res.status(429).json({
      error: 'Too many requests, please try again later.',
    });
  },
});

module.exports = {
  spotifyLimiter,
  youtubeLimiter,
  globalLimiter,
};
