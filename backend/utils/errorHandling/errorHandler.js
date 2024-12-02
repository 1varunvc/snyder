// utils/errorHandler.js
const logger = require('../logger');
const AppError = require('./AppError');
const { ERRORS } = require('./errors');

// noinspection JSUnusedLocalSymbols
/**
 * Error handling middleware for Express applications.
 * Logs the error stack (in development mode) and sends a response with the appropriate status code, message, error code, and unique error ID (for 5xx errors).
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
  const { statusCode, status, message, errorCode, uniqueErrorId } = err;

  // Log the error stack only if in development mode
  let errorLogMessage =
    `Error Code: ${errorCode}\n` +
    `Status: ${status}\n` +
    `Message: ${message}`;

  if (uniqueErrorId) {
    errorLogMessage += `\nUnique ID: ${uniqueErrorId}`;
  }

  if (process.env.NODE_ENV === 'development') {
    errorLogMessage += `\nStack: ${err.stack}`;
  }

  logger.error(errorLogMessage);

  // Prepare the response object
  const response = {
    status,
    message: `An unexpected error occurred. Please report this issue at 'https://github.com/1varunvc/snyder/issues' including the error ID provided.`,
  };

  // Include uniqueErrorId in the response only if it exists (i.e., for 5xx errors)
  if (uniqueErrorId) {
    response.errorId = uniqueErrorId;
  }

  // Send appropriate response status and error message
  res.status(statusCode).json(response);
};
