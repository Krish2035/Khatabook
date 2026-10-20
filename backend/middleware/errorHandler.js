/**
 * Architecture Pillar 59 & 109: Centralized structured error handling
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  
  if (process.env.NODE_ENV === 'development') {
    console.error(`[Error] ${req.method} ${req.originalUrl} - ${err.message}`, err.stack);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      status: statusCode,
      requestId: req.id || null,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

module.exports = errorHandler;
