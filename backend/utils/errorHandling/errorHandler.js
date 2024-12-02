// utils/errorHandler.js
const logger = require('../logger');
const AppError = require('./AppError');
const { ERRORS } = require('./errors');

// noinspection JSUnusedLocalSymbols
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
  // If the error is not an instance of AppError, convert it to AppError
  if (!(err instanceof AppError)) {
    logger.error(`Non-AppError encountered: ${err.message}`);
    err = new AppError(ERRORS.UNKNOWN);
  }

  // Destructure properties from AppError
  const { statusCode, status, message, errorCode } = err;

  // Log the error stack only if in development mode
  if (process.env.NODE_ENV === 'development') {
    logger.error(`Error Code: ${errorCode}\nStatus: ${status}\nMessage: ${message}\nStack: ${err.stack}`);
  } else {
    logger.error(`Error Code: ${errorCode}\nStatus: ${status}\nMessage: ${message}`);
  }

  // Send appropriate response status and error message
  res.status(statusCode).json({
    status,
    message,
    errorCode,
  });
};
