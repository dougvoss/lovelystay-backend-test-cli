CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  location TEXT,
  followers INTEGER,
  following INTEGER,
  created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS languages (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  language TEXT NOT NULL
);
