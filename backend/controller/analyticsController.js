const analyticsService = require('../services/analyticsService');

const analyticsController = {
  getMonthlySummary: async (req, res, next) => {
    try {
      const { year, month } = req.query;
      const summary = await analyticsService.getMonthlySummary(year, month, req.userId);
      res.status(200).json({
        success: true,
        data: summary
      });
    } catch (error) {
      next(error);
    }
  },

  compareMonths: async (req, res, next) => {
    try {
      const { y1, m1, y2, m2 } = req.query;
      const comparison = await analyticsService.compareMonths(y1, m1, y2, m2, req.userId);
      res.status(200).json({
        success: true,
        data: comparison
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = analyticsController;
