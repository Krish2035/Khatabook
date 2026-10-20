const app = require('./app');
const db = require('./model/db');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Khatabook Backend running on http://localhost:${PORT}`);
  console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

/**
 * Architecture Pillar 85: Graceful Shutdown
 */
const gracefulShutdown = (signal) => {
  console.log(`\nReceived ${signal}. Gracefully shutting down Khatabook server...`);
  
  server.close(() => {
    console.log('HTTP server closed.');
    try {
      db.close();
      console.log('SQLite database connection cleanly closed.');
    } catch (err) {
      console.error('Error closing SQLite database:', err);
    }
    process.exit(0);
  });

  // Force shutdown if taking longer than 5 seconds
  setTimeout(() => {
    console.error('Forced shutdown due to timeout.');
    process.exit(1);
  }, 5000);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

module.exports = server;
