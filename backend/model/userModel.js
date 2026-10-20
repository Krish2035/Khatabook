const db = require('./db');

const userModel = {
  create: async (user) => {
    if (db.isPostgres) {
      const res = await db.pgPool.query(
        `INSERT INTO users (id, name, email, passwordHash, avatar, authProvider, createdAt, updatedAt)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
         RETURNING id, name, email, avatar, authProvider, createdAt`,
        [user.id, user.name, user.email.toLowerCase(), user.passwordHash || null, user.avatar || null, user.authProvider || 'local']
      );
      return res.rows[0];
    }

    const stmt = db.sqliteDb.prepare(`
      INSERT INTO users (id, name, email, passwordHash, avatar, authProvider, createdAt, updatedAt)
      VALUES (@id, @name, @email, @passwordHash, @avatar, @authProvider, datetime('now'), datetime('now'))
    `);
    stmt.run({
      id: user.id,
      name: user.name,
      email: user.email.toLowerCase(),
      passwordHash: user.passwordHash || null,
      avatar: user.avatar || null,
      authProvider: user.authProvider || 'local'
    });
    return userModel.findById(user.id);
  },

  findByEmail: async (email) => {
    if (!email) return null;
    if (db.isPostgres) {
      const res = await db.pgPool.query(`SELECT * FROM users WHERE LOWER(email) = LOWER($1)`, [email.trim()]);
      return res.rows[0] || null;
    }

    const stmt = db.sqliteDb.prepare(`SELECT * FROM users WHERE email = ?`);
    return stmt.get(email.toLowerCase().trim()) || null;
  },

  findById: async (id) => {
    if (!id) return null;
    if (db.isPostgres) {
      const res = await db.pgPool.query(
        `SELECT id, name, email, avatar, authProvider, createdAt FROM users WHERE id = $1`,
        [id]
      );
      return res.rows[0] || null;
    }

    const stmt = db.sqliteDb.prepare(`SELECT id, name, email, avatar, authProvider, createdAt FROM users WHERE id = ?`);
    return stmt.get(id) || null;
  },

  update: async (id, updates) => {
    if (db.isPostgres) {
      const fields = [];
      const values = [];
      let idx = 1;

      ['name', 'avatar', 'passwordHash'].forEach((key) => {
        if (updates[key] !== undefined) {
          fields.push(`${key} = $${idx++}`);
          values.push(updates[key]);
        }
      });

      if (fields.length === 0) return userModel.findById(id);

      fields.push(`updatedAt = NOW()`);
      values.push(id);
      const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id, name, email, avatar, authProvider, createdAt`;
      const res = await db.pgPool.query(sql, values);
      return res.rows[0];
    }

    const fields = [];
    const params = { id };

    ['name', 'avatar', 'passwordHash'].forEach((key) => {
      if (updates[key] !== undefined) {
        fields.push(`${key} = @${key}`);
        params[key] = updates[key];
      }
    });

    if (fields.length === 0) return userModel.findById(id);

    fields.push("updatedAt = datetime('now')");
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = @id`;
    db.sqliteDb.prepare(sql).run(params);
    return userModel.findById(id);
  }
};

module.exports = userModel;
