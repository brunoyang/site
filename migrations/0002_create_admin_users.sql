CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO admin_users (id, username, password_hash) VALUES (
  '1',
  'brunoyang',
  'f1d0d7752114f67b69c538c7d233b6309313e66399c89acc4ed5bc61ffed201d'
);
