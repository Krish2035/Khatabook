const transactionService = require('../services/transactionService');

const transactionController = {
  create: async (req, res, next) => {
    try {
      const transaction = await transactionService.createTransaction(req.body, req.userId);
      res.status(201).json({
        success: true,
        message: 'Transaction recorded successfully',
        data: transaction
      });
    } catch (error) {
      next(error);
    }
  },

  getAll: async (req, res, next) => {
    try {
      const { month, year, type, category, search, page, limit, sortBy, sortOrder } = req.query;
      const result = await transactionService.getTransactions({
        userId: req.userId,
        month,
        year,
        type,
        category,
        search,
        page,
        limit,
        sortBy,
        sortOrder
      });
      res.status(200).json({
        success: true,
        data: result.items,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const transaction = await transactionService.getTransactionById(req.params.id, req.userId);
      res.status(200).json({
        success: true,
        data: transaction
      });
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const updated = await transactionService.updateTransaction(req.params.id, req.body, req.userId);
      res.status(200).json({
        success: true,
        message: 'Transaction updated successfully',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      await transactionService.deleteTransaction(req.params.id, req.userId);
      res.status(200).json({
        success: true,
        message: 'Transaction deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  syncBatch: async (req, res, next) => {
    try {
      const { operations } = req.body;
      const result = await transactionService.syncBatch(operations, req.userId);
      res.status(200).json({
        success: true,
        message: `Successfully synchronized ${result.total} transactions`,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = transactionController;
