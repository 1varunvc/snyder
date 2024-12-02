// utils/AppError.js
const { ERROR_DEFINITIONS } = require('./errors');

/**
 * Custom Error class to represent application-specific errors.
 * Includes a status code, message, and an error code for debugging.
 */
class AppError extends Error {
  /**
   * Creates a new AppError instance.
   * @param {string} errorCode - The unique error code.
   */
  constructor(errorCode = 'ERR_UNKNOWN') {
    const errorDefinition = ERROR_DEFINITIONS[errorCode] || ERROR_DEFINITIONS['ERR_UNKNOWN'];
    super(errorDefinition.message);
    this.statusCode = errorDefinition.httpStatus;
    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.errorCode = errorCode;
    // Mark the error as operational (trusted)
    this.isOperational = true;

    // Capture the stack trace and exclude constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
