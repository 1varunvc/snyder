// utils/errorHandler.js

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
  // Log the error stack only if in development mode
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // Send appropriate response status and error message
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: {
      message: err.message || 'Something went wrong!',
      status: statusCode,
    },
  });
};
