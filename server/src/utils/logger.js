const winston = require('winston');
const path = require('path');

/**
 * Configure and set up the application logger
 * @returns {winston.Logger} Configured logger instance
 */
function setupLogging() {
  const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  );

  const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    defaultMeta: { service: 'evm-mcp-server' },
    transports: [
      // Console transport for all environments
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.printf(
            (info) => `${info.timestamp} ${info.level}: ${info.message}`
          )
        ),
      }),
      // File transport for non-development environments
      ...(process.env.NODE_ENV !== 'development'
        ? [
            new winston.transports.File({
              filename: path.join(__dirname, '../../logs/error.log'),
              level: 'error',
              maxsize: 5242880, // 5MB
              maxFiles: 5,
            }),
            new winston.transports.File({
              filename: path.join(__dirname, '../../logs/combined.log'),
              maxsize: 5242880, // 5MB
              maxFiles: 5,
            }),
          ]
        : []),
    ],
  });

  return logger;
}

module.exports = {
  setupLogging,
};
