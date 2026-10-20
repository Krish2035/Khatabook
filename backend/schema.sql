-- ========================================================
-- Khatabook Database Schema for Neon.tech (PostgreSQL)
-- Run this in the Neon.tech SQL Editor
-- ========================================================

-- 1. Users Table (Bcrypt & Firebase Google OAuth)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  passwordHash TEXT,
  avatar TEXT,
  authProvider VARCHAR(50) DEFAULT 'local',
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- 2. Transactions Table (User-scoped Ledger)
CREATE TABLE IF NOT EXISTS transactions (
  id VARCHAR(64) PRIMARY KEY,
  userId VARCHAR(64),
  title VARCHAR(255) NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  type VARCHAR(20) NOT NULL CHECK (type IN ('INCOME', 'EXPENSE')),
  category VARCHAR(100) NOT NULL,
  paymentMode VARCHAR(50) DEFAULT 'Cash',
  date VARCHAR(10) NOT NULL,
  notes TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. High Performance Indexes
CREATE INDEX IF NOT EXISTS idx_transactions_userId ON transactions (userId);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions (date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type_date ON transactions (type, date);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions (category);
CREATE INDEX IF NOT EXISTS idx_transactions_month ON transactions (substr(date, 1, 7));
