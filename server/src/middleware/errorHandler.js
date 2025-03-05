const { setupLogging } = require('../utils/logger');

const logger = setupLogging();

/**
 * Global error handler middleware
 */
function errorHandler(err, req, res, next) {
  // Log the error
  logger.error(`Error: ${err.message}`, {
    stack: err.stack,
    method: req.method,
    url: req.url,
    body: req.body,
    params: req.params,
    query: req.query,
  });

  // Determine status code
  const statusCode = err.statusCode || 500;

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      message: process.env.NODE_ENV === 'production' 
        ? statusCode === 500 
          ? 'Internal server error' 
          : err.message
        : err.message,
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    }
  });
}

/**
 * Custom error class with status code
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  errorHandler,
  AppError,
};
