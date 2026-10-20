const path = require('path');
const fs = require('fs');
require('dotenv').config();

const isPostgres = Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres'));

let pgPool = null;
let sqliteDb = null;

if (isPostgres) {
  const { Pool } = require('pg');
  console.log('⚡ Connecting to Neon.tech PostgreSQL database...');
  pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  // Verify connection
  pgPool.query('SELECT NOW()')
    .then(() => console.log('✅ Connected to Neon PostgreSQL successfully!'))
    .catch((err) => console.error('❌ Failed to connect to Neon PostgreSQL:', err.message));
} else {
  const Database = require('better-sqlite3');
  const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'khatabook.db');
  const dbDir = path.dirname(path.resolve(dbPath));

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  sqliteDb = new Database(path.resolve(dbPath));
  sqliteDb.pragma('journal_mode = WAL');
  sqliteDb.pragma('synchronous = NORMAL');
  sqliteDb.pragma('foreign_keys = ON');

  // SQLite Schema initialization
  const initSchema = () => {
    sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        userId TEXT,
        title TEXT NOT NULL,
        amount REAL NOT NULL CHECK(amount > 0),
        type TEXT NOT NULL CHECK(type IN ('INCOME', 'EXPENSE')),
        category TEXT NOT NULL,
        paymentMode TEXT NOT NULL DEFAULT 'Cash',
        date TEXT NOT NULL,
        notes TEXT,
        createdAt TEXT NOT NULL DEFAULT (datetime('now')),
        updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions (date DESC);
      CREATE INDEX IF NOT EXISTS idx_transactions_type_date ON transactions (type, date);
      CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions (category);
      CREATE INDEX IF NOT EXISTS idx_transactions_month ON transactions (strftime('%Y-%m', date));

      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        passwordHash TEXT,
        avatar TEXT,
        authProvider TEXT NOT NULL DEFAULT 'local',
        createdAt TEXT NOT NULL DEFAULT (datetime('now')),
        updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
    `);

    const columns = sqliteDb.pragma('table_info(transactions)');
    const hasUserId = columns.some((c) => c.name === 'userId');
    if (!hasUserId) {
      sqliteDb.exec(`ALTER TABLE transactions ADD COLUMN userId TEXT;`);
    }
    sqliteDb.exec(`CREATE INDEX IF NOT EXISTS idx_transactions_userId ON transactions (userId);`);
  };

  initSchema();
}

module.exports = {
  isPostgres,
  pgPool,
  sqliteDb,
};
