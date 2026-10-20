const db = require('./db');

const userModel = {
  create: (user) => {
    const stmt = db.prepare(`
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

  findByEmail: (email) => {
    const stmt = db.prepare(`SELECT * FROM users WHERE email = ?`);
    return stmt.get(email.toLowerCase());
  },

  findById: (id) => {
    const stmt = db.prepare(`SELECT id, name, email, avatar, authProvider, createdAt FROM users WHERE id = ?`);
    return stmt.get(id);
  },

  update: (id, updates) => {
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
    db.prepare(sql).run(params);
    return userModel.findById(id);
  }
};

module.exports = userModel;
