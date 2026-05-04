-- FlatMates Pro — D1 Schema
-- Run: npx wrangler d1 execute flatmates-pro-db --local --file=schema.sql
-- Run: npx wrangler d1 execute flatmates-pro-db --remote --file=schema.sql

CREATE TABLE IF NOT EXISTS flats (
  id TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  name TEXT,
  status TEXT DEFAULT 'active',
  plan TEXT DEFAULT 'free',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  flat_id TEXT DEFAULT 'flat_0',
  name TEXT NOT NULL,
  pin TEXT NOT NULL,
  color TEXT DEFAULT '#C9A84C',
  is_admin INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  flat_id TEXT DEFAULT 'flat_0',
  name TEXT UNIQUE NOT NULL,
  spend_limit REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  flat_id TEXT DEFAULT 'flat_0',
  title TEXT NOT NULL,
  amount REAL NOT NULL,
  cat_icon TEXT DEFAULT '📦',
  cat_label TEXT DEFAULT 'Other',
  paid_by TEXT NOT NULL,
  split_among TEXT DEFAULT '[]',
  date TEXT,
  note TEXT DEFAULT '',
  screenshot TEXT DEFAULT '',
  type TEXT DEFAULT 'expense',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS needs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  flat_id TEXT DEFAULT 'flat_0',
  item TEXT NOT NULL,
  urgent INTEGER DEFAULT 0,
  done INTEGER DEFAULT 0,
  added_by TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  flat_id TEXT DEFAULT 'flat_0',
  sender TEXT NOT NULL,
  text TEXT NOT NULL,
  type TEXT DEFAULT 'chat',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
