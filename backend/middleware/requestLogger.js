const { v4: uuidv4 } = require('uuid');

/**
 * Architecture Pillar 59 & 60: Structured logging and Request Tracing
 */
const requestLogger = (req, res, next) => {
  const requestId = req.headers['x-request-id'] || uuidv4();
  req.id = requestId;
  res.setHeader('X-Request-Id', requestId);

  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'test') {
      const logLine = `[${new Date().toISOString()}] [${requestId.slice(0, 8)}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;
      console.log(logLine);
    }
  });

  next();
};

module.exports = requestLogger;
