// utils/errors.js
/**
 * Centralized Error Definitions for the Application
 * Each error code is mapped to its message and associated HTTP status code.
 */

const ERROR_DEFINITIONS = {
  // General Errors
  ERR_UNKNOWN: {
    message: 'An unexpected error occurred.',
    httpStatus: 500,
  },

  // Search Module
  ERR_NO_INTEGRATIONS: {
    message: 'No integrations are enabled for search.',
    httpStatus: 503,
  },
  ERR_MISSING_QUERY: {
    message: 'Missing required parameter: q.',
    httpStatus: 400,
  },

  // YouTube Module
  ERR_YOUTUBE_DISABLED: {
    message: 'YouTube integration is disabled.',
    httpStatus: 403,
  },
  ERR_YOUTUBE_MISSING_QUERY: {
    message: 'Query parameter is required for YouTube search.',
    httpStatus: 400,
  },
  ERR_YOUTUBE_MISSING_VIDEOID: {
    message: 'videoId parameter is required.',
    httpStatus: 400,
  },
  ERR_YOUTUBE_FETCH: {
    message: 'Failed to fetch YouTube data.',
    httpStatus: 500,
  },
  ERR_YOUTUBE_FETCH_FAILED: {
    message: 'Failed to fetch YouTube data.',
    httpStatus: 500,
  },

  // Spotify Module
  ERR_SPOTIFY_DISABLED: {
    message: 'Spotify integration is disabled.',
    httpStatus: 403,
  },
  ERR_SPOTIFY_MISSING_QUERY: {
    message: 'Missing required parameter: q.',
    httpStatus: 400,
  },
  ERR_SPOTIFY_FETCH: {
    message: 'Failed to fetch Spotify data.',
    httpStatus: 500,
  },
  ERR_SPOTIFY_FETCH_FAILED: {
    message: 'Failed to fetch Spotify data.',
    httpStatus: 500,
  },

  // Authentication Module
  ERR_AUTH_FAILED: {
    message: 'Authentication failed.',
    httpStatus: 401,
  },

  // Rate Limiting
  ERR_RATE_LIMIT_EXCEEDED: {
    message: 'Too many requests, please try again later.',
    httpStatus: 429,
  },

  // Database Errors
  ERR_DB_CONNECTION_FAILED: {
    message: 'Failed to connect to the database.',
    httpStatus: 500,
  },

  // External API Errors
  ERR_EXTERNAL_API_FAILURE: {
    message: 'External service failed to respond properly.',
    httpStatus: 502,
  },

  // Undefined Routes
  ERR_ROUTE_NOT_FOUND: {
    message: 'Cannot find the requested resource on this server.',
    httpStatus: 404,
  },

  // ... Add more as needed
};

// Extract error codes as constants to prevent typos
const ERRORS = {
  UNKNOWN: 'ERR_UNKNOWN',

  // Search Module
  NO_INTEGRATIONS: 'ERR_NO_INTEGRATIONS',
  MISSING_QUERY: 'ERR_MISSING_QUERY',

  // YouTube Module
  YOUTUBE_DISABLED: 'ERR_YOUTUBE_DISABLED',
  YOUTUBE_MISSING_QUERY: 'ERR_YOUTUBE_MISSING_QUERY',
  YOUTUBE_MISSING_VIDEOID: 'ERR_YOUTUBE_MISSING_VIDEOID',
  YOUTUBE_FETCH: 'ERR_YOUTUBE_FETCH',
  YOUTUBE_FETCH_FAILED: 'ERR_YOUTUBE_FETCH_FAILED',

  // Spotify Module
  SPOTIFY_DISABLED: 'ERR_SPOTIFY_DISABLED',
  SPOTIFY_MISSING_QUERY: 'ERR_SPOTIFY_MISSING_QUERY',
  SPOTIFY_FETCH: 'ERR_SPOTIFY_FETCH',
  SPOTIFY_FETCH_FAILED: 'ERR_SPOTIFY_FETCH_FAILED',

  // Authentication Module
  AUTH_FAILED: 'ERR_AUTH_FAILED',

  // Rate Limiting
  RATE_LIMIT_EXCEEDED: 'ERR_RATE_LIMIT_EXCEEDED',

  // Database Errors
  DB_CONNECTION_FAILED: 'ERR_DB_CONNECTION_FAILED',

  // External API Errors
  EXTERNAL_API_FAILURE: 'ERR_EXTERNAL_API_FAILURE',

  // Undefined Routes
  ROUTE_NOT_FOUND: 'ERR_ROUTE_NOT_FOUND',

  // ... Add more as needed
};

module.exports = { ERROR_DEFINITIONS, ERRORS };
