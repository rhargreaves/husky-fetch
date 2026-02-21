DROP TABLE IF EXISTS url;
CREATE TABLE IF NOT EXISTS url (url_id INTEGER PRIMARY KEY, url TEXT, short_alias TEXT, created_at TEXT);

INSERT INTO url (url_id, url, short_alias, created_at)
VALUES (1, 'https://www.google.com', 'g', '2026-02-19 12:00:00');
