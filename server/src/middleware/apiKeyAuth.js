const { AppError } = require('./errorHandler');
const { setupLogging } = require('../utils/logger');

const logger = setupLogging();

/**
 * API Key authentication middleware
 * Verifies the API key from the request header against stored keys
 */
function apiKeyAuth(req, res, next) {
  try {
    // Get API key from header
    const apiKey = req.header('X-API-KEY');
    
    if (!apiKey) {
      throw new AppError('API key is required', 401);
    }
    
    // In a real implementation, we would load API keys from a database or secure storage
    // For this example, we'll use an environment variable or a mock key
    const validApiKey = process.env.API_KEY || 'test-api-key';
    
    if (apiKey !== validApiKey) {
      // Log the attempt with limited info for security
      logger.warn('Invalid API key attempt', {
        ip: req.ip,
        path: req.path,
        method: req.method
      });
      
      throw new AppError('Invalid API key', 401);
    }
    
    // If valid, proceed to the next middleware
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  apiKeyAuth
};
