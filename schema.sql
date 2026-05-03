-- FlatMates Pro — D1 Schema
-- Run: npx wrangler d1 execute flatmates-pro-db --local --file=schema.sql
-- Run: npx wrangler d1 execute flatmates-pro-db --remote --file=schema.sql

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  pin TEXT NOT NULL,
  color TEXT DEFAULT '#C9A84C',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  amount REAL NOT NULL,
  cat_icon TEXT DEFAULT '📦',
  cat_label TEXT DEFAULT 'Other',
  paid_by TEXT NOT NULL,
  split_among TEXT DEFAULT '[]',
  date TEXT,
  note TEXT DEFAULT '',
  screenshot TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS needs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item TEXT NOT NULL,
  urgent INTEGER DEFAULT 0,
  done INTEGER DEFAULT 0,
  added_by TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
