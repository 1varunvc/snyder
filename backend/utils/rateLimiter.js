// utils/rateLimiter.js

/**
 * Rate limiter utilities for different services.
 * @module utils/rateLimiter
 */

const rateLimit = require('express-rate-limit');
const logger = require('./logger');

/**
 * Rate limiter middleware for Spotify routes.
 * Limits the number of requests that can be made to Spotify endpoints in a 30-second window.
 * @type {import("express").RequestHandler}
 */
const spotifyLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 100, // limit each IP to 100 requests per windowMs
  handler: (req, res) => {
    logger.warn(`Spotify rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many requests, please try again later.',
    });
  },
});

/**
 * Rate limiter middleware for YouTube routes.
 * Limits the number of requests that can be made to YouTube endpoints in a 30-second window.
 * @type {import("express").RequestHandler}
 */
const youtubeLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 100, // adjust as needed
  handler: (req, res) => {
    logger.warn(`YouTube rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many requests, please try again later.',
    });
  },
});

/**
 * Rate limiter middleware for Search routes.
 * Limits the number of requests that can be made to Search endpoints in a 30-second window.
 * @type {import("express").RequestHandler}
 */
const searchLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 50, // adjust as needed
  handler: (req, res) => {
    logger.warn(`Search rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many requests, please try again later.',
    });
  },
});

/**
 * Global rate limiter middleware.
 * Limits the number of requests that can be made across all endpoints in a 15-minute window.
 * @type {import("express").RequestHandler}
 */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  handler: (req, res) => {
    logger.warn(`Global rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many requests, please try again later.',
    });
  },
});

module.exports = {
  spotifyLimiter,
  youtubeLimiter,
  searchLimiter,
  globalLimiter,
};
