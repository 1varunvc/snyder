// utils/AppError.js
/**
 * Custom Error class to represent application-specific errors.
 * Includes a status code, message, and an error code for debugging.
 */
class AppError extends Error {
  /**
   * Creates a new AppError instance.
   * @param {string} message - The error message.
   * @param {number} [statusCode=500] - The HTTP status code.
   * @param {string} [errorCode] - A unique error code for reference.
   */
  constructor(message, statusCode = 500, errorCode = 'ERR-UNKNOWN') {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.errorCode = errorCode;
    // Mark the error as operational (trusted)
    this.isOperational = true;

    // Capture the stack trace and exclude constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
