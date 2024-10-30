// utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  transports: [
    new winston.transports.Console(),
    // You can add file transports or other transports here
  ],
});

module.exports = logger;
