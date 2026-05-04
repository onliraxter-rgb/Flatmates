CREATE TABLE IF NOT EXISTS flats (
  id TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO flats(id, password, name) VALUES ('flat_0', 'admin123', 'My First Flat');

ALTER TABLE users ADD COLUMN flat_id TEXT DEFAULT 'flat_0';
ALTER TABLE members ADD COLUMN flat_id TEXT DEFAULT 'flat_0';
ALTER TABLE expenses ADD COLUMN flat_id TEXT DEFAULT 'flat_0';
ALTER TABLE messages ADD COLUMN flat_id TEXT DEFAULT 'flat_0';
