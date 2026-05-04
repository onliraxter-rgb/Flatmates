-- Fix members table uniqueness constraint for multi-tenancy
CREATE TABLE members_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  flat_id TEXT DEFAULT 'flat_0',
  name TEXT NOT NULL,
  spend_limit REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(flat_id, name)
);

INSERT INTO members_new (id, flat_id, name, spend_limit, created_at)
SELECT id, flat_id, name, spend_limit, created_at FROM members;

DROP TABLE members;
ALTER TABLE members_new RENAME TO members;
