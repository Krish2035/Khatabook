const transactionService = require('../services/transactionService');

const transactionController = {
  create: async (req, res, next) => {
    try {
      const transaction = transactionService.createTransaction(req.body);
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
      const result = transactionService.getTransactions({
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
      const transaction = transactionService.getTransactionById(req.params.id);
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
      const updated = transactionService.updateTransaction(req.params.id, req.body);
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
      transactionService.deleteTransaction(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Transaction deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = transactionController;
