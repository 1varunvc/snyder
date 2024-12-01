// utils/cache.js
const redisClient = require('./redisClient');
const logger = require('./logger');
const config = require('../config/config');

/**
 * Get data from Redis cache.
 * @param {string} key - The cache key.
 * @returns {Promise<any>} - The cached data or null if not found.
 */
async function get(key) {
  if (!config.enableCache) {
    logger.debug(`Caching is disabled. Skipping cache get for key: ${key}`);
    return null;
  }

  try {
    const data = await redisClient.get(key);
    if (data) {
      logger.debug(`Cache hit for key: ${key}`);
      return JSON.parse(data);
    } else {
      logger.debug(`Cache miss for key: ${key}`);
      return null;
    }
  } catch (err) {
    logger.error(`Redis GET error for key ${key}: ${err}`);
    return null;
  }
}

/**
 * Set data in Redis cache with a TTL.
 * @param {string} key - The cache key.
 * @param {any} value - The data to cache.
 * @param {number} ttl - Time to live in seconds.
 * @returns {Promise<void>}
 */
async function set(key, value, ttl) {
  if (!config.enableCache) {
    logger.debug(`Caching is disabled. Skipping cache set for key: ${key}`);
    return;
  }

  try {
    await redisClient.setEx(key, ttl, JSON.stringify(value));
    logger.debug(`Data cached for key: ${key} with TTL: ${ttl} seconds`);
  } catch (err) {
    logger.error(`Redis SET error for key ${key}:`, err);
  }
}

module.exports = {
  get,
  set,
};
