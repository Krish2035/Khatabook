const db = require('./db');

const transactionModel = {
  create: async (transaction) => {
    if (db.isPostgres) {
      const res = await db.pgPool.query(
        `INSERT INTO transactions (id, userId, title, amount, type, category, paymentMode, date, notes, createdAt, updatedAt)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
         RETURNING *`,
        [
          transaction.id,
          transaction.userId || null,
          transaction.title,
          Number(transaction.amount),
          transaction.type.toUpperCase(),
          transaction.category,
          transaction.paymentMode || 'Cash',
          transaction.date,
          transaction.notes || ''
        ]
      );
      return res.rows[0];
    }

    const stmt = db.sqliteDb.prepare(`
      INSERT INTO transactions (id, userId, title, amount, type, category, paymentMode, date, notes, createdAt, updatedAt)
      VALUES (@id, @userId, @title, @amount, @type, @category, @paymentMode, @date, @notes, datetime('now'), datetime('now'))
    `);
    stmt.run({
      ...transaction,
      userId: transaction.userId || null
    });
    return transactionModel.findById(transaction.id);
  },

  findById: async (id) => {
    if (db.isPostgres) {
      const res = await db.pgPool.query(`SELECT * FROM transactions WHERE id = $1`, [id]);
      return res.rows[0] || null;
    }

    const stmt = db.sqliteDb.prepare(`SELECT * FROM transactions WHERE id = ?`);
    return stmt.get(id) || null;
  },

  findAll: async ({ userId, month, year, type, category, search, limit = 50, offset = 0, sortBy = 'date', sortOrder = 'DESC' }) => {
    const safeSortBy = ['date', 'amount', 'title', 'createdAt'].includes(sortBy) ? sortBy : 'date';
    const safeOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    if (db.isPostgres) {
      const whereClauses = [];
      const values = [];
      let idx = 1;

      if (userId) {
        whereClauses.push(`"userId" = $${idx++}`);
        values.push(userId);
      }

      if (year && month) {
        const monthStr = `${year}-${String(month).padStart(2, '0')}`;
        whereClauses.push(`substr(date, 1, 7) = $${idx++}`);
        values.push(monthStr);
      } else if (year) {
        whereClauses.push(`substr(date, 1, 4) = $${idx++}`);
        values.push(String(year));
      }

      if (type && ['INCOME', 'EXPENSE'].includes(type.toUpperCase())) {
        whereClauses.push(`type = $${idx++}`);
        values.push(type.toUpperCase());
      }

      if (category) {
        whereClauses.push(`category = $${idx++}`);
        values.push(category);
      }

      if (search) {
        whereClauses.push(`(title ILIKE $${idx} OR notes ILIKE $${idx})`);
        values.push(`%${search}%`);
        idx++;
      }

      const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
      values.push(limit, offset);
      const sql = `
        SELECT * FROM transactions
        ${whereSql}
        ORDER BY ${safeSortBy} ${safeOrder}, "createdAt" DESC
        LIMIT $${idx++} OFFSET $${idx}
      `;

      const res = await db.pgPool.query(sql, values);
      return res.rows;
    }

    // SQLite
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
    const sql = `
      SELECT * FROM transactions
      ${whereSql}
      ORDER BY ${safeSortBy} ${safeOrder}, createdAt DESC
      LIMIT @limit OFFSET @offset
    `;

    params.limit = limit;
    params.offset = offset;

    const stmt = db.sqliteDb.prepare(sql);
    return stmt.all(params);
  },

  count: async ({ userId, month, year, type, category, search }) => {
    if (db.isPostgres) {
      const whereClauses = [];
      const values = [];
      let idx = 1;

      if (userId) {
        whereClauses.push(`"userId" = $${idx++}`);
        values.push(userId);
      }

      if (year && month) {
        const monthStr = `${year}-${String(month).padStart(2, '0')}`;
        whereClauses.push(`substr(date, 1, 7) = $${idx++}`);
        values.push(monthStr);
      } else if (year) {
        whereClauses.push(`substr(date, 1, 4) = $${idx++}`);
        values.push(String(year));
      }

      if (type && ['INCOME', 'EXPENSE'].includes(type.toUpperCase())) {
        whereClauses.push(`type = $${idx++}`);
        values.push(type.toUpperCase());
      }

      if (category) {
        whereClauses.push(`category = $${idx++}`);
        values.push(category);
      }

      if (search) {
        whereClauses.push(`(title ILIKE $${idx} OR notes ILIKE $${idx})`);
        values.push(`%${search}%`);
        idx++;
      }

      const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
      const sql = `SELECT COUNT(*) as total FROM transactions ${whereSql}`;
      const res = await db.pgPool.query(sql, values);
      return parseInt(res.rows[0]?.total || 0, 10);
    }

    // SQLite
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
    const stmt = db.sqliteDb.prepare(sql);
    return stmt.get(params).total;
  },

  update: async (id, updates, userId = null) => {
    if (db.isPostgres) {
      const fields = [];
      const values = [];
      let idx = 1;

      ['title', 'amount', 'type', 'category', 'paymentMode', 'date', 'notes'].forEach((key) => {
        if (updates[key] !== undefined) {
          fields.push(`${key} = $${idx++}`);
          values.push(key === 'amount' ? Number(updates[key]) : updates[key]);
        }
      });

      if (fields.length === 0) return transactionModel.findById(id);

      fields.push(`"updatedAt" = NOW()`);
      values.push(id);
      let whereSql = `WHERE id = $${idx++}`;

      if (userId) {
        whereSql += ` AND ("userId" = $${idx} OR "userId" IS NULL)`;
        values.push(userId);
      }

      const sql = `UPDATE transactions SET ${fields.join(', ')} ${whereSql} RETURNING *`;
      const res = await db.pgPool.query(sql, values);
      return res.rows[0];
    }

    // SQLite
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
    const stmt = db.sqliteDb.prepare(sql);
    stmt.run(params);
    return transactionModel.findById(id);
  },

  delete: async (id, userId = null) => {
    if (db.isPostgres) {
      let sql = 'DELETE FROM transactions WHERE id = $1';
      const values = [id];
      if (userId) {
        sql += ' AND ("userId" = $2 OR "userId" IS NULL)';
        values.push(userId);
      }
      const res = await db.pgPool.query(sql, values);
      return res.rowCount > 0;
    }

    let sql = 'DELETE FROM transactions WHERE id = ?';
    const params = [id];
    if (userId) {
      sql += ' AND (userId = ? OR userId IS NULL)';
      params.push(userId);
    }
    const stmt = db.sqliteDb.prepare(sql);
    const result = stmt.run(...params);
    return result.changes > 0;
  },

  getMonthlyTotals: async (year, month, userId = null) => {
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;

    if (db.isPostgres) {
      let sql = `
        SELECT 
          COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END), 0)::float as "totalIncome",
          COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0)::float as "totalExpense",
          COUNT(*)::int as "transactionCount"
        FROM transactions
        WHERE substr(date, 1, 7) = $1
      `;
      const values = [monthStr];
      if (userId) {
        sql += ' AND "userId" = $2';
        values.push(userId);
      }
      const res = await db.pgPool.query(sql, values);
      return res.rows[0] || { totalIncome: 0, totalExpense: 0, transactionCount: 0 };
    }

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
    const stmt = db.sqliteDb.prepare(sql);
    return stmt.get(...params);
  },

  getCategoryBreakdown: async (year, month, type = 'EXPENSE', userId = null) => {
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;

    if (db.isPostgres) {
      let sql = `
        SELECT 
          category,
          COALESCE(SUM(amount), 0)::float as "totalAmount",
          COUNT(*)::int as count
        FROM transactions
        WHERE substr(date, 1, 7) = $1 AND type = $2
      `;
      const values = [monthStr, type.toUpperCase()];
      if (userId) {
        sql += ' AND "userId" = $3';
        values.push(userId);
      }
      sql += ' GROUP BY category ORDER BY "totalAmount" DESC';
      const res = await db.pgPool.query(sql, values);
      return res.rows;
    }

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
    const stmt = db.sqliteDb.prepare(sql);
    return stmt.all(...params);
  },

  getDailyCashFlow: async (year, month, userId = null) => {
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;

    if (db.isPostgres) {
      let sql = `
        SELECT 
          date,
          COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END), 0)::float as income,
          COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0)::float as expense
        FROM transactions
        WHERE substr(date, 1, 7) = $1
      `;
      const values = [monthStr];
      if (userId) {
        sql += ' AND "userId" = $2';
        values.push(userId);
      }
      sql += ' GROUP BY date ORDER BY date ASC';
      const res = await db.pgPool.query(sql, values);
      return res.rows;
    }

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
    const stmt = db.sqliteDb.prepare(sql);
    return stmt.all(...params);
  },

  syncBatch: async (operations, userId = null) => {
    if (db.isPostgres) {
      let created = 0;
      let updated = 0;
      let deleted = 0;

      for (const op of operations) {
        if (op.action === 'CREATE' || op.action === 'UPDATE') {
          await db.pgPool.query(
            `INSERT INTO transactions (id, userId, title, amount, type, category, paymentMode, date, notes, createdAt, updatedAt)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
             ON CONFLICT (id) DO UPDATE SET
               "userId" = COALESCE(EXCLUDED."userId", transactions."userId"),
               title = EXCLUDED.title,
               amount = EXCLUDED.amount,
               type = EXCLUDED.type,
               category = EXCLUDED.category,
               "paymentMode" = EXCLUDED."paymentMode",
               date = EXCLUDED.date,
               notes = EXCLUDED.notes,
               "updatedAt" = NOW()`,
            [
              op.data.id,
              op.data.userId || userId || null,
              op.data.title,
              Number(op.data.amount),
              op.data.type.toUpperCase(),
              op.data.category,
              op.data.paymentMode || 'Cash',
              op.data.date,
              op.data.notes || ''
            ]
          );
          if (op.action === 'CREATE') created++;
          else updated++;
        } else if (op.action === 'DELETE') {
          await db.pgPool.query('DELETE FROM transactions WHERE id = $1', [op.id]);
          deleted++;
        }
      }

      return { created, updated, deleted, total: operations.length };
    }

    // SQLite
    const insertStmt = db.sqliteDb.prepare(`
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

    const deleteStmt = db.sqliteDb.prepare(`DELETE FROM transactions WHERE id = ?`);

    const runBatch = db.sqliteDb.transaction((ops) => {
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
