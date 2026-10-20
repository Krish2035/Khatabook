const db = require('./db');

const transactionModel = {
  create: (transaction) => {
    const stmt = db.prepare(`
      INSERT INTO transactions (id, userId, title, amount, type, category, paymentMode, date, notes, createdAt, updatedAt)
      VALUES (@id, @userId, @title, @amount, @type, @category, @paymentMode, @date, @notes, datetime('now'), datetime('now'))
    `);
    stmt.run({
      ...transaction,
      userId: transaction.userId || null
    });
    return transactionModel.findById(transaction.id);
  },

  findById: (id) => {
    const stmt = db.prepare(`SELECT * FROM transactions WHERE id = ?`);
    return stmt.get(id);
  },

  findAll: ({ userId, month, year, type, category, search, limit = 50, offset = 0, sortBy = 'date', sortOrder = 'DESC' }) => {
    let whereClauses = [];
    let params = {};

    if (userId) {
      whereClauses.push("userId = @userId");
      params.userId = userId;
    }

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

  count: ({ userId, month, year, type, category, search }) => {
    let whereClauses = [];
    let params = {};

    if (userId) {
      whereClauses.push("userId = @userId");
      params.userId = userId;
    }

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

  update: (id, updates, userId = null) => {
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

    let whereSql = 'WHERE id = @id';
    if (userId) {
      whereSql += ' AND (userId = @userId OR userId IS NULL)';
      params.userId = userId;
    }

    const sql = `UPDATE transactions SET ${fields.join(', ')} ${whereSql}`;
    const stmt = db.prepare(sql);
    stmt.run(params);
    return transactionModel.findById(id);
  },

  delete: (id, userId = null) => {
    let sql = 'DELETE FROM transactions WHERE id = ?';
    const params = [id];
    if (userId) {
      sql += ' AND (userId = ? OR userId IS NULL)';
      params.push(userId);
    }
    const stmt = db.prepare(sql);
    const result = stmt.run(...params);
    return result.changes > 0;
  },

  getMonthlyTotals: (year, month, userId = null) => {
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    let sql = `
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END), 0) as totalIncome,
        COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0) as totalExpense,
        COUNT(*) as transactionCount
      FROM transactions
      WHERE strftime('%Y-%m', date) = ?
    `;
    const params = [monthStr];
    if (userId) {
      sql += ' AND userId = ?';
      params.push(userId);
    }
    const stmt = db.prepare(sql);
    return stmt.get(...params);
  },

  getCategoryBreakdown: (year, month, type = 'EXPENSE', userId = null) => {
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    let sql = `
      SELECT 
        category,
        COALESCE(SUM(amount), 0) as totalAmount,
        COUNT(*) as count
      FROM transactions
      WHERE strftime('%Y-%m', date) = ? AND type = ?
    `;
    const params = [monthStr, type];
    if (userId) {
      sql += ' AND userId = ?';
      params.push(userId);
    }
    sql += ' GROUP BY category ORDER BY totalAmount DESC';
    const stmt = db.prepare(sql);
    return stmt.all(...params);
  },

  getDailyCashFlow: (year, month, userId = null) => {
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    let sql = `
      SELECT 
        date,
        COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END), 0) as income,
        COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0) as expense
      FROM transactions
      WHERE strftime('%Y-%m', date) = ?
    `;
    const params = [monthStr];
    if (userId) {
      sql += ' AND userId = ?';
      params.push(userId);
    }
    sql += ' GROUP BY date ORDER BY date ASC';
    const stmt = db.prepare(sql);
    return stmt.all(...params);
  },

  syncBatch: (operations, userId = null) => {
    const insertStmt = db.prepare(`
      INSERT INTO transactions (id, userId, title, amount, type, category, paymentMode, date, notes, createdAt, updatedAt)
      VALUES (@id, @userId, @title, @amount, @type, @category, @paymentMode, @date, @notes, datetime('now'), datetime('now'))
      ON CONFLICT(id) DO UPDATE SET
        userId = COALESCE(excluded.userId, transactions.userId),
        title = excluded.title,
        amount = excluded.amount,
        type = excluded.type,
        category = excluded.category,
        paymentMode = excluded.paymentMode,
        date = excluded.date,
        notes = excluded.notes,
        updatedAt = datetime('now')
    `);

    const deleteStmt = db.prepare(`DELETE FROM transactions WHERE id = ?`);

    const runBatch = db.transaction((ops) => {
      let created = 0;
      let updated = 0;
      let deleted = 0;

      for (const op of ops) {
        if (op.action === 'CREATE' || op.action === 'UPDATE') {
          insertStmt.run({
            id: op.data.id,
            userId: op.data.userId || userId || null,
            title: op.data.title,
            amount: Number(op.data.amount),
            type: op.data.type.toUpperCase(),
            category: op.data.category,
            paymentMode: op.data.paymentMode || 'Cash',
            date: op.data.date,
            notes: op.data.notes || ''
          });
          if (op.action === 'CREATE') created++;
          else updated++;
        } else if (op.action === 'DELETE') {
          deleteStmt.run(op.id);
          deleted++;
        }
      }

      return { created, updated, deleted, total: ops.length };
    });

    return runBatch(operations);
  }
};

module.exports = transactionModel;
