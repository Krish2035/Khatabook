const { v4: uuidv4 } = require('uuid');
const transactionModel = require('../model/transactionModel');

const transactionService = {
  createTransaction: (data) => {
    const transaction = {
      id: uuidv4(),
      title: data.title,
      amount: Number(data.amount),
      type: data.type.toUpperCase(),
      category: data.category,
      paymentMode: data.paymentMode || 'Cash',
      date: data.date,
      notes: data.notes || ''
    };

    return transactionModel.create(transaction);
  },

  getTransactionById: (id) => {
    const transaction = transactionModel.findById(id);
    if (!transaction) {
      const err = new Error(`Transaction with ID '${id}' not found`);
      err.statusCode = 404;
      throw err;
    }
    return transaction;
  },

  getTransactions: ({ month, year, type, category, search, page = 1, limit = 50, sortBy, sortOrder }) => {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const offset = (pageNum - 1) * limitNum;

    const filterOptions = {
      month,
      year,
      type,
      category,
      search,
      limit: limitNum,
      offset,
      sortBy,
      sortOrder
    };

    const items = transactionModel.findAll(filterOptions);
    const totalCount = transactionModel.count({ month, year, type, category, search });
    const totalPages = Math.ceil(totalCount / limitNum);

    return {
      items,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalItems: totalCount,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    };
  },

  updateTransaction: (id, updates) => {
    // Check if exists
    transactionService.getTransactionById(id);

    const safeUpdates = {};
    if (updates.title !== undefined) safeUpdates.title = updates.title;
    if (updates.amount !== undefined) safeUpdates.amount = Number(updates.amount);
    if (updates.type !== undefined) safeUpdates.type = updates.type.toUpperCase();
    if (updates.category !== undefined) safeUpdates.category = updates.category;
    if (updates.paymentMode !== undefined) safeUpdates.paymentMode = updates.paymentMode;
    if (updates.date !== undefined) safeUpdates.date = updates.date;
    if (updates.notes !== undefined) safeUpdates.notes = updates.notes;

    return transactionModel.update(id, safeUpdates);
  },

  deleteTransaction: (id) => {
    // Check if exists
    transactionService.getTransactionById(id);
    return transactionModel.delete(id);
  },

  syncBatch: (operations) => {
    if (!Array.isArray(operations) || operations.length === 0) {
      return { created: 0, updated: 0, deleted: 0, total: 0 };
    }

    // Validate and sanitize each operation
    const sanitizedOps = operations.map((op) => {
      if (!op.action || !['CREATE', 'UPDATE', 'DELETE'].includes(op.action)) {
        throw new Error(`Invalid sync action '${op.action}'`);
      }
      if (op.action === 'DELETE' && !op.id) {
        throw new Error('Delete operation requires transaction ID');
      }
      if ((op.action === 'CREATE' || op.action === 'UPDATE') && (!op.data || !op.data.id)) {
        throw new Error(`${op.action} operation requires data with transaction ID`);
      }
      return op;
    });

    return transactionModel.syncBatch(sanitizedOps);
  }
};

module.exports = transactionService;
