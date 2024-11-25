// utils/logger.js
const winston = require('winston');

// Define color codes for log levels
const customColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  verbose: 'cyan',
  debug: 'blue',
  silly: 'rainbow',
};

// Apply custom colors to Winston
winston.addColors(customColors);

// Determine the logging level based on the loaded environment
const logLevel = process.env.NODE_ENV === 'development' ? 'debug' : 'info';

// Custom timestamp format for Indian local time (IST)
const localTimestamp = winston.format.printf(({ level, message }) => {
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', timeZoneName: 'short' });
  const paddedTimestamp = timestamp.padEnd(23);

  // Pad the log level for consistent indentation.
  const paddedLevel = `[${level}]`.padEnd(18);

  return `${paddedTimestamp} ${paddedLevel} ${message}`;
});

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
    winston.format.colorize(), // Apply color coding to the output
    winston.format.timestamp(), // Ensure timestamp is included
    localTimestamp // Custom timestamp format with Indian local time (IST)
  ),
  transports: [
    new winston.transports.Console(),
    // Add file transports or other transports here
  ],
});

// Log the current level when the application starts
logger.info(`Current logger level: ${logLevel}`);

module.exports = logger;
