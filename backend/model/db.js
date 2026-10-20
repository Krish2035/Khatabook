const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'khatabook.db');
const dbDir = path.dirname(path.resolve(dbPath));

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(path.resolve(dbPath), {
  // verbose: process.env.NODE_ENV === 'development' ? console.log : null,
});

// Architecture Pillar 28: SQLite optimizations
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('foreign_keys = ON');

// Schema initialization
const initSchema = () => {
  db.exec(`
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

    -- Architecture Pillar 25: Composite & Equality indexes for high performance queries
    CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions (date DESC);
    CREATE INDEX IF NOT EXISTS idx_transactions_type_date ON transactions (type, date);
    CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions (category);
    CREATE INDEX IF NOT EXISTS idx_transactions_month ON transactions (strftime('%Y-%m', date));

    -- Users Table for Local & Firebase Authentication
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

  // Migration: Ensure userId column exists on transactions table
  const columns = db.pragma('table_info(transactions)');
  const hasUserId = columns.some(c => c.name === 'userId');
  if (!hasUserId) {
    db.exec(`ALTER TABLE transactions ADD COLUMN userId TEXT;`);
  }
  db.exec(`CREATE INDEX IF NOT EXISTS idx_transactions_userId ON transactions (userId);`);
};

initSchema();

module.exports = db;
