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

// Connect to Redis
(async () => {
  try {
    await redisClient.connect();
    logger.info('Redis client connected successfully');
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    process.exit(1); // Exit the application if Redis connection fails
  }
})();

module.exports = redisClient;
