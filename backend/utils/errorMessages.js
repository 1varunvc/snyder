// utils/errorMessages.js
/**
 * Centralized Error Messages for the Application
 * Ensures uniformity and facilitates easy localization.
 */

const ERROR_MESSAGES = {
  // General Errors
  UNKNOWN: 'An unexpected error occurred.',

  // Search Module
  NO_INTEGRATIONS: 'No integrations are enabled for search.',
  MISSING_QUERY: 'Missing required parameter: q.',

  // YouTube Module
  YOUTUBE_DISABLED: 'YouTube integration is disabled.',
  YOUTUBE_MISSING_QUERY: 'Query parameter is required for YouTube search.',
  YOUTUBE_MISSING_VIDEOID: 'videoId parameter is required.',
  YOUTUBE_FETCH: 'Failed to fetch YouTube data.',
  YOUTUBE_FETCH_FAILED: 'Failed to fetch YouTube data.',

  // Spotify Module
  SPOTIFY_DISABLED: 'Spotify integration is disabled.',
  SPOTIFY_MISSING_QUERY: 'Missing required parameter: q.',
  SPOTIFY_FETCH: 'Failed to fetch Spotify data.',
  SPOTIFY_FETCH_FAILED: 'Failed to fetch Spotify data.',

  // Authentication Module
  AUTHENTICATION_FAILED: 'Authentication failed.',

  // Rate Limiting
  RATE_LIMIT_EXCEEDED: 'Too many requests, please try again later.',

  // Database Errors
  DATABASE_CONNECTION_FAILED: 'Failed to connect to the database.',

  // External API Errors
  EXTERNAL_API_FAILURE: 'External service failed to respond properly.',

  // Undefined Routes
  ROUTE_NOT_FOUND: 'Cannot find the requested resource on this server.',

  // ... Add more as needed
};

module.exports = ERROR_MESSAGES;
