// utils/logger.js
const winston = require('winston');
const dotenv = require('dotenv');

// Determine the logging level based on the loaded environment
const logLevel = process.env.NODE_ENV === 'development' ? 'silly' : 'info';

const logger = winston.createLogger({
  level: logLevel,
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  },
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    // Add file transports or other transports here
  ],
});

// Log the current level when the application starts
logger.info(`Current logger level: ${logLevel}`);

module.exports = logger;
