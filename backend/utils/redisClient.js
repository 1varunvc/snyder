// utils/redisClient.js
const { createClient } = require('@redis/client');
const config = require('../config/config');
const logger = require('./logger');

const redisClient = createClient({
  url: config.redis.url,
  socket: {
    tls: true,
    rejectUnauthorized: false,
  },
});

// Handle connection events
redisClient.on('connect', () => {
  logger.info('Connected to Upstash Redis');
});

redisClient.on('error', (err) => {
  logger.error('Redis error:', err);
});

// Export the client without connecting here
module.exports = redisClient;
