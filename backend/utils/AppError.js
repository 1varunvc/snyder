// utils/AppError.js
/**
 * Custom Error class to represent application-specific errors.
 * Includes a status code and a message.
 */
class AppError extends Error {
  /**
   * Creates a new AppError instance.
   * @param {string} message - The error message.
   * @param {number} [statusCode=500] - The HTTP status code.
   */
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    // Mark the error as operational (trusted)
    this.isOperational = true;

    // Capture the stack trace and exclude constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
