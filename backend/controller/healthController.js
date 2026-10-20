const db = require('../model/db');

const healthController = {
  check: (req, res) => {
    let dbStatus = 'healthy';
    try {
      db.prepare('SELECT 1').get();
    } catch (e) {
      dbStatus = 'degraded';
    }

    const memoryUsage = process.memoryUsage();

    res.status(dbStatus === 'healthy' ? 200 : 503).json({
      status: dbStatus === 'healthy' ? 'UP' : 'DOWN',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      database: dbStatus,
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`
      }
    });
  }
};

module.exports = healthController;
