-- Fix uniqueness of members per flat
DROP TABLE IF EXISTS members;
CREATE TABLE IF NOT EXISTS members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  flat_id TEXT DEFAULT 'flat_0',
  name TEXT NOT NULL,
  spend_limit REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(flat_id, name)
);
