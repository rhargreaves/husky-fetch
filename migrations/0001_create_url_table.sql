-- Migration number: 0001 	 2026-02-21T17:04:18.526Z

CREATE TABLE IF NOT EXISTS url (
  url_id INTEGER PRIMARY KEY,
  url TEXT,
  short_alias TEXT,
  created_at TEXT
);
