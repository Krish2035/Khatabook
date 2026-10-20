const db = require('./db');

const transactionModel = {
  create: (transaction) => {
    const stmt = db.prepare(`
      INSERT INTO transactions (id, title, amount, type, category, paymentMode, date, notes, createdAt, updatedAt)
      VALUES (@id, @title, @amount, @type, @category, @paymentMode, @date, @notes, datetime('now'), datetime('now'))
    `);
    stmt.run(transaction);
    return transactionModel.findById(transaction.id);
  },

  findById: (id) => {
    const stmt = db.prepare(`SELECT * FROM transactions WHERE id = ?`);
    return stmt.get(id);
  },

  findAll: ({ month, year, type, category, search, limit = 50, offset = 0, sortBy = 'date', sortOrder = 'DESC' }) => {
    let whereClauses = [];
    let params = {};

    if (year && month) {
      const monthStr = `${year}-${String(month).padStart(2, '0')}`;
      whereClauses.push("strftime('%Y-%m', date) = @monthStr");
      params.monthStr = monthStr;
    } else if (year) {
      whereClauses.push("strftime('%Y', date) = @yearStr");
      params.yearStr = String(year);
    }

    if (type && ['INCOME', 'EXPENSE'].includes(type.toUpperCase())) {
      whereClauses.push("type = @type");
      params.type = type.toUpperCase();
    }

    if (category) {
      whereClauses.push("category = @category");
      params.category = category;
    }

    if (search) {
      whereClauses.push("(title LIKE @search OR notes LIKE @search)");
      params.search = `%${search}%`;
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const safeSortBy = ['date', 'amount', 'title', 'createdAt'].includes(sortBy) ? sortBy : 'date';
    const safeOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const sql = `
      SELECT * FROM transactions
      ${whereSql}
      ORDER BY ${safeSortBy} ${safeOrder}, createdAt DESC
      LIMIT @limit OFFSET @offset
    `;

    params.limit = limit;
    params.offset = offset;

    const stmt = db.prepare(sql);
    return stmt.all(params);
  },

  count: ({ month, year, type, category, search }) => {
    let whereClauses = [];
    let params = {};

    if (year && month) {
      const monthStr = `${year}-${String(month).padStart(2, '0')}`;
      whereClauses.push("strftime('%Y-%m', date) = @monthStr");
      params.monthStr = monthStr;
    } else if (year) {
      whereClauses.push("strftime('%Y', date) = @yearStr");
      params.yearStr = String(year);
    }

    if (type && ['INCOME', 'EXPENSE'].includes(type.toUpperCase())) {
      whereClauses.push("type = @type");
      params.type = type.toUpperCase();
    }

    if (category) {
      whereClauses.push("category = @category");
      params.category = category;
    }

    if (search) {
      whereClauses.push("(title LIKE @search OR notes LIKE @search)");
      params.search = `%${search}%`;
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const sql = `SELECT COUNT(*) as total FROM transactions ${whereSql}`;
    const stmt = db.prepare(sql);
    return stmt.get(params).total;
  },

  update: (id, updates) => {
    const fields = [];
    const params = { id };

    ['title', 'amount', 'type', 'category', 'paymentMode', 'date', 'notes'].forEach(key => {
      if (updates[key] !== undefined) {
        fields.push(`${key} = @${key}`);
        params[key] = updates[key];
      }
    });

    if (fields.length === 0) return transactionModel.findById(id);

    fields.push("updatedAt = datetime('now')");

    const sql = `UPDATE transactions SET ${fields.join(', ')} WHERE id = @id`;
    const stmt = db.prepare(sql);
    stmt.run(params);
    return transactionModel.findById(id);
  },

  delete: (id) => {
    const stmt = db.prepare(`DELETE FROM transactions WHERE id = ?`);
    const result = stmt.run(id);
    return result.changes > 0;
  },

  getMonthlyTotals: (year, month) => {
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    const stmt = db.prepare(`
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END), 0) as totalIncome,
        COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0) as totalExpense,
        COUNT(*) as transactionCount
      FROM transactions
      WHERE strftime('%Y-%m', date) = ?
    `);
    return stmt.get(monthStr);
  },

  getCategoryBreakdown: (year, month, type = 'EXPENSE') => {
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    const stmt = db.prepare(`
      SELECT 
        category,
        COALESCE(SUM(amount), 0) as totalAmount,
        COUNT(*) as count
      FROM transactions
      WHERE strftime('%Y-%m', date) = ? AND type = ?
      GROUP BY category
      ORDER BY totalAmount DESC
    `);
    return stmt.all(monthStr, type);
  },

  getDailyCashFlow: (year, month) => {
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    const stmt = db.prepare(`
      SELECT 
        date,
        COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END), 0) as income,
        COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0) as expense
      FROM transactions
      WHERE strftime('%Y-%m', date) = ?
      GROUP BY date
      ORDER BY date ASC
    `);
    return stmt.all(monthStr);
  }
};

module.exports = transactionModel;
