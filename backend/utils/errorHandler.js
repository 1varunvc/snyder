// utils/errorHandler.js
const logger = require('./logger');

/**
 * Error handling middleware for Express applications.
 * Logs the error stack (in development mode) and sends a response with the appropriate status code, message, and error code.
 *
 * @param {Error} err - The error object caught in the application.
 * @param {Request} req - The request object from Express.
 * @param {Response} res - The response object from Express.
 * @param {function} next - The next middleware function in the pipeline.
 */
module.exports = (err, req, res, next) => {
  // If the error is not an instance of AppError, convert it
  if (!(err instanceof require('./AppError'))) {
    const AppError = require('./AppError');
    err = new AppError(err.message || 'An unexpected error occurred', 500, 'ERR-INTERNAL');
  }

  // Log the error stack only if in development mode
  if (process.env.NODE_ENV === 'development') {
    logger.error(`Error Code: ${err.errorCode}\nStatus: ${err.status}\nMessage: ${err.message}\nStack: ${err.stack}`);
  } else {
    logger.error(`Error Code: ${err.errorCode}\nStatus: ${err.status}\nMessage: ${err.message}`);
  }

  // Send appropriate response status and error message
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    errorCode: err.errorCode,
  });
};
