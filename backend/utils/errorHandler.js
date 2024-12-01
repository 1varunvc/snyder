// utils/errorHandler.js
const logger = require('./logger');

/**
 * Error handling middleware for Express applications.
 * Logs the error stack (in development mode) and sends a response with the appropriate status code and error message.
 *
 * @param {Error} err - The error object caught in the application.
 * @param {Request} req - The request object from Express.
 * @param {Response} res - The response object from Express.
 * @param {function} next - The next middleware function in the pipeline.
 */
module.exports = (err, req, res, next) => {
  // Set default values if not set
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log the error stack in development mode, message in production
  if (process.env.NODE_ENV === 'development') {
    logger.error(`Error: ${err.message}\nStack: ${err.stack}`);
  } else {
    logger.error(`Error: ${err.message}`);
  }

  // Send appropriate response status and error message
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
